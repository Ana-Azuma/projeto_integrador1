// backend/services/opcuaService.js
import pkg from 'node-opcua';
const { OPCUAClient, AttributeIds, TimestampsToReturn, DataType } = pkg;

class OPCUAService {
  constructor() {
    this.client = null;
    this.session = null;
    this.isConnected = false;
    this.endpointUrl = process.env.OPCUA_ENDPOINT || "opc.tcp://192.168.0.1:4840";
    
    // Mapa de variáveis OPC UA
    this.vars = {
      // PLC → Backend (Status)
      status: {
        geral: "ns=3;s=Status.Geral",
        falhaAtiva: "ns=3;s=Status.FalhaAtiva",
        falhaAtivaCod: "ns=3;s=Status.FalhaAtivaCod",
        accSinc: "ns=3;s=Status.AccSinc",
        opAtual: "ns=3;s=Status.OpAtual",
        estoqueProd: "ns=3;s=Status.EstoqueProd",
        mesProd: "ns=3;s=Status.MesProd",
        mesFalt: "ns=3;s=Status.MesFalt",
        mesTempInicio: "ns=3;s=Status.MesTempInicio",
        mesTempFim: "ns=3;s=Status.MesTempFim",
        mesPcsBoas: "ns=3;s=Status.MesPcsBoas",
        mesPcsRuins: "ns=3;s=Status.MesPcsRuins",
      },
      // PLC → Backend (Acknowledgments)
      ack: {
        pedidoACK: "ns=3;s=Ack.PedidoACK",
        aplicaACK: "ns=3;s=Ack.AplicaACK",
        inicioACK: "ns=3;s=Ack.InicioACK",
        execACK: "ns=3;s=Ack.ExecACK",
        fimACK: "ns=3;s=Ack.FimACK",
        falhaACK: "ns=3;s=Ack.FalhaACK",
      },
      // Backend → PLC (Pedido)
      pedido: {
        op: "ns=3;s=Pedido.Op",
        produto: "ns=3;s=Pedido.Produto",
        quant: "ns=3;s=Pedido.Quant",
      },
      // Backend → PLC (Comandos)
      cmd: {
        novoPed: "ns=3;s=Cmd.NovoPed",
        inicio: "ns=3;s=Cmd.Inicio",
        abortar: "ns=3;s=Cmd.Abortar",
        reset: "ns=3;s=Cmd.Reset",
      },
    };
  }

  // Conectar ao servidor OPC UA
  async connect() {
    try {
      if (this.isConnected) {
        console.log("⚠️ Já conectado ao OPC UA");
        return;
      }

      this.client = OPCUAClient.create({
        applicationName: "MES_OPCUA_Client",
        connectionStrategy: { 
          initialDelay: 1000, 
          maxRetry: 10 
        },
        endpointMustExist: false,
      });

      console.log(`🔌 Conectando ao servidor OPC UA em ${this.endpointUrl}...`);
      await this.client.connect(this.endpointUrl);
      console.log("✅ Conectado ao servidor OPC UA");

      this.session = await this.client.createSession();
      console.log("📡 Sessão OPC UA criada");
      
      this.isConnected = true;
    } catch (error) {
      console.error("❌ Erro ao conectar OPC UA:", error.message);
      this.isConnected = false;
      throw error;
    }
  }

  // Desconectar
  async disconnect() {
    try {
      if (this.session) {
        await this.session.close();
        console.log("📡 Sessão OPC UA fechada");
      }
      if (this.client) {
        await this.client.disconnect();
        console.log("🔌 Desconectado do servidor OPC UA");
      }
      this.isConnected = false;
    } catch (error) {
      console.error("❌ Erro ao desconectar OPC UA:", error.message);
    }
  }

  // =============================
  // FUNÇÕES DE LEITURA
  // =============================

  // Ler status completo do CLP
  async readStatus() {
    if (!this.isConnected) {
      throw new Error("OPC UA não conectado");
    }

    try {
      const nodeIds = Object.values(this.vars.status).map(s => ({ 
        nodeId: s, 
        attributeId: AttributeIds.Value 
      }));
      
      const dataValues = await this.session.read(nodeIds, 0, TimestampsToReturn.Neither);
      
      const result = {};
      Object.keys(this.vars.status).forEach((key, index) => {
        result[key] = dataValues[index].value.value;
      });
      
      return result;
    } catch (error) {
      console.error("❌ Erro ao ler status:", error.message);
      throw error;
    }
  }

  // Ler acknowledgments
  async readAck() {
    if (!this.isConnected) {
      throw new Error("OPC UA não conectado");
    }

    try {
      const nodeIds = Object.values(this.vars.ack).map(s => ({ 
        nodeId: s, 
        attributeId: AttributeIds.Value 
      }));
      
      const dataValues = await this.session.read(nodeIds, 0, TimestampsToReturn.Neither);
      
      const result = {};
      Object.keys(this.vars.ack).forEach((key, index) => {
        result[key] = dataValues[index].value.value;
      });
      
      return result;
    } catch (error) {
      console.error("❌ Erro ao ler ACK:", error.message);
      throw error;
    }
  }

  // =============================
  // FUNÇÕES DE ESCRITA
  // =============================

  // Enviar pedido para o CLP
  async enviarPedido(ordemProducao) {
    if (!this.isConnected) {
      throw new Error("OPC UA não conectado");
    }

    try {
      const { _id, itens } = ordemProducao;
      
      // Assumindo primeiro item (pode ser adaptado para múltiplos)
      const primeiroItem = itens[0];
      const produtoId = primeiroItem.produtoId;
      const quantidade = itens.reduce((sum, item) => sum + item.quantidade, 0);

      await this.session.writeMany([
        { 
          nodeId: this.vars.pedido.op, 
          attributeId: AttributeIds.Value, 
          value: { value: { dataType: DataType.Int32, value: parseInt(_id.toString().slice(-6), 16) } } 
        },
        { 
          nodeId: this.vars.pedido.produto, 
          attributeId: AttributeIds.Value, 
          value: { value: { dataType: DataType.Int16, value: parseInt(produtoId) } } 
        },
        { 
          nodeId: this.vars.pedido.quant, 
          attributeId: AttributeIds.Value, 
          value: { value: { dataType: DataType.Int16, value: quantidade } } 
        },
        { 
          nodeId: this.vars.cmd.novoPed, 
          attributeId: AttributeIds.Value, 
          value: { value: { dataType: DataType.Boolean, value: true } } 
        },
      ]);

      console.log(`📦 Pedido ${_id} enviado ao CLP (Produto: ${produtoId}, Qtd: ${quantidade})`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar pedido:", error.message);
      throw error;
    }
  }

  // Iniciar produção
  async iniciarProducao() {
    if (!this.isConnected) {
      throw new Error("OPC UA não conectado");
    }

    try {
      await this.session.write({
        nodeId: this.vars.cmd.inicio,
        attributeId: AttributeIds.Value,
        value: { value: { dataType: DataType.Boolean, value: true } },
      });
      
      console.log("🚀 Comando de início enviado ao CLP");
      return true;
    } catch (error) {
      console.error("❌ Erro ao iniciar produção:", error.message);
      throw error;
    }
  }

  // Abortar produção
  async abortarProducao() {
    if (!this.isConnected) {
      throw new Error("OPC UA não conectado");
    }

    try {
      await this.session.write({
        nodeId: this.vars.cmd.abortar,
        attributeId: AttributeIds.Value,
        value: { value: { dataType: DataType.Boolean, value: true } },
      });
      
      console.log("⛔ Comando de abortar enviado ao CLP");
      return true;
    } catch (error) {
      console.error("❌ Erro ao abortar produção:", error.message);
      throw error;
    }
  }

  // Reset de falhas
  async resetFalhas() {
    if (!this.isConnected) {
      throw new Error("OPC UA não conectado");
    }

    try {
      await this.session.write({
        nodeId: this.vars.cmd.reset,
        attributeId: AttributeIds.Value,
        value: { value: { dataType: DataType.Boolean, value: true } },
      });
      
      console.log("🔄 Reset de falhas enviado ao CLP");
      return true;
    } catch (error) {
      console.error("❌ Erro ao resetar falhas:", error.message);
      throw error;
    }
  }

  // Verificar conexão
  checkConnection() {
    return this.isConnected;
  }
}

// Instância única (Singleton)
const opcuaService = new OPCUAService();

export default opcuaService;