// backend/models/OrdemProducao.js
import mongoose from 'mongoose';

const ordemProducaoSchema = new mongoose.Schema({
  // Referência ao pedido original
  pedidoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido',
    required: true
  },

  // Número da OP (gerado automaticamente)
  numeroOP: {
    type: String,
    unique: true,
    required: true
  },

  // Cliente
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clienteNome: {
    type: String,
    required: true
  },

  // Itens da produção
  itens: [{
    produtoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produto',
      required: true
    },
    produtoNome: String,
    quantidade: {
      type: Number,
      required: true,
      min: 1
    },
    quantidadeProduzida: {
      type: Number,
      default: 0
    },
    pecasBoas: {
      type: Number,
      default: 0
    },
    pecasRuins: {
      type: Number,
      default: 0
    }
  }],

  // Status da ordem
  status: {
    type: String,
    enum: [
      'Aguardando',        // Na fila esperando para produzir
      'Em Produção',       // Sendo produzida no CLP
      'Pausada',          // Produção pausada
      'Finalizada',       // Produção completa com sucesso
      'Cancelada',        // Cancelada manualmente
      'Erro'              // Erro durante produção
    ],
    default: 'Aguardando'
  },

  // Prioridade
  prioridade: {
    type: String,
    enum: ['Baixa', 'Normal', 'Alta', 'Urgente'],
    default: 'Normal'
  },

  // Dados do CLP
  clpStatus: {
    statusGeral: Number,
    falhaAtiva: Boolean,
    falhaAtivaCod: Number,
    opAtual: Number,
    estoqueProd: Number,
    mesProd: Number,
    mesFalt: Number,
    ultimaAtualizacao: Date
  },

  // Tempos de produção
  tempos: {
    inicio: Date,
    fim: Date,
    previstoInicio: Date,
    previstoFim: Date,
    tempoTotal: Number, // em minutos
    tempoProducao: Number // tempo real de produção
  },

  // Observações e logs
  observacoes: String,
  logs: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    evento: String,
    detalhes: String,
    usuario: String
  }],

  // Tipo de ordem
  tipoOrdem: {
    type: String,
    enum: ['Pedido Cliente', 'Reposição Estoque', 'Teste', 'Manutenção'],
    default: 'Pedido Cliente'
  },

  // Flag para reposição automática
  isReposicao: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para performance
ordemProducaoSchema.index({ status: 1, prioridade: -1, createdAt: 1 });
ordemProducaoSchema.index({ pedidoId: 1 });
ordemProducaoSchema.index({ numeroOP: 1 });

// Gerar número da OP automaticamente
ordemProducaoSchema.pre('save', async function(next) {
  if (this.isNew && !this.numeroOP) {
    // Formato: #001, #002, etc ou REP-001 para reposição
    const count = await mongoose.model('OrdemProducao').countDocuments();
    const prefix = this.isReposicao ? 'REP' : '';
    this.numeroOP = `${prefix ? prefix + '-' : '#'}${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Adicionar log automaticamente
ordemProducaoSchema.methods.adicionarLog = function(evento, detalhes, usuario = 'Sistema') {
  this.logs.push({
    evento,
    detalhes,
    usuario,
    timestamp: new Date()
  });
  return this.save();
};

// Atualizar status do CLP
ordemProducaoSchema.methods.atualizarStatusCLP = function(statusData) {
  this.clpStatus = {
    ...statusData,
    ultimaAtualizacao: new Date()
  };
  return this.save();
};

// Finalizar produção
ordemProducaoSchema.methods.finalizarProducao = function(pecasBoas, pecasRuins) {
  this.status = 'Finalizada';
  this.tempos.fim = new Date();
  
  if (this.tempos.inicio) {
    const diffMs = this.tempos.fim - this.tempos.inicio;
    this.tempos.tempoProducao = Math.round(diffMs / 60000); // converter para minutos
  }

  // Atualizar quantidade produzida
  this.itens.forEach(item => {
    item.quantidadeProduzida = pecasBoas;
    item.pecasBoas = pecasBoas;
    item.pecasRuins = pecasRuins;
  });

  this.adicionarLog('Produção Finalizada', `${pecasBoas} peças boas, ${pecasRuins} peças ruins`);
  
  return this.save();
};

const OrdemProducao = mongoose.model('OrdemProducao', ordemProducaoSchema);

export default OrdemProducao;