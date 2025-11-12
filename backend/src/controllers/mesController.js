// backend/controllers/mesController.js
import OrdemProducao from '../models/OrdemProducao.js'
import Pedido from '../models/Pedido.js'
import Produto from '../models/Produto.js'
import opcuaService from '../services/opcuaService.js'

// =============================
// 📦 RECEBER PEDIDOS APROVADOS
// =============================
export const receberPedidoAprovado = async (req, res) => {
  try {
    const { pedidoId } = req.body

    // Buscar pedido aprovado
    const pedido = await Pedido.findById(pedidoId).populate('itens.produto')
    
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' })
    }

    if (pedido.status !== 'Aprovado') {
      return res.status(400).json({ message: 'Apenas pedidos aprovados podem ser enviados para produção' })
    }

    // Verificar se já existe ordem para este pedido
    const ordemExistente = await OrdemProducao.findOne({ pedidoId })
    if (ordemExistente) {
      return res.status(400).json({ message: 'Já existe uma ordem de produção para este pedido' })
    }

    // Criar ordem de produção
    const ordemProducao = await OrdemProducao.create({
      pedidoId: pedido._id,
      clienteId: pedido.clienteId,
      clienteNome: pedido.clienteNome,
      itens: pedido.itens.map(item => ({
        produtoId: item.produto._id,
        produtoNome: item.produto.nome,
        quantidade: item.quantidade,
        quantidadeProduzida: 0,
        pecasBoas: 0,
        pecasRuins: 0
      })),
      status: 'Aguardando',
      prioridade: pedido.prioridade || 'Normal',
      tipoOrdem: 'Pedido Cliente'
    })

    // Atualizar status do pedido
    pedido.status = 'Em Produção'
    await pedido.save()

    // Log
    await ordemProducao.adicionarLog(
      'Ordem Criada',
      `Ordem criada a partir do pedido ${pedidoId}`,
      req.user?.nome || 'Admin'
    )

    res.status(201).json(ordemProducao)
  } catch (error) {
    console.error('❌ Erro ao receber pedido:', error)
    res.status(500).json({ message: 'Erro ao criar ordem de produção', error: error.message })
  }
}

// =============================
// 📋 LISTAR ORDENS DE PRODUÇÃO
// =============================
export const listarOrdensProducao = async (req, res) => {
  try {
    const { status, prioridade } = req.query
    
    const query = {}
    if (status) query.status = status
    if (prioridade) query.prioridade = prioridade

    const ordens = await OrdemProducao.find(query)
      .populate('clienteId', 'nome email')
      .populate('itens.produtoId', 'nome foto preco')
      .sort({ prioridade: -1, createdAt: 1 })

    res.json(ordens)
  } catch (error) {
    console.error('❌ Erro ao listar ordens:', error)
    res.status(500).json({ message: 'Erro ao listar ordens de produção' })
  }
}

// =============================
// 📊 BUSCAR ORDEM POR ID
// =============================
export const buscarOrdemPorId = async (req, res) => {
  try {
    const ordem = await OrdemProducao.findById(req.params.id)
      .populate('clienteId', 'nome email')
      .populate('itens.produtoId', 'nome foto preco')

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    res.json(ordem)
  } catch (error) {
    console.error('❌ Erro ao buscar ordem:', error)
    res.status(500).json({ message: 'Erro ao buscar ordem' })
  }
}

// =============================
// 🚀 INICIAR PRODUÇÃO (ENVIAR PARA CLP)
// =============================
export const iniciarProducao = async (req, res) => {
  try {
    const { ordemId } = req.body

    const ordem = await OrdemProducao.findById(ordemId).populate('itens.produtoId')

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    if (ordem.status !== 'Aguardando') {
      return res.status(400).json({ message: 'Ordem não está aguardando produção' })
    }

    // Verificar conexão OPC UA
    if (!opcuaService.checkConnection()) {
      await opcuaService.connect()
    }

    // Enviar pedido para o CLP via OPC UA
    await opcuaService.enviarPedido(ordem)

    // Aguardar ACK do CLP (pode implementar polling)
    // Por enquanto, assumimos que enviou com sucesso

    // Enviar comando de início
    await opcuaService.iniciarProducao()

    // Atualizar status da ordem
    ordem.status = 'Em Produção'
    ordem.tempos.inicio = new Date()
    await ordem.save()

    await ordem.adicionarLog(
      'Produção Iniciada',
      'Ordem enviada ao CLP e produção iniciada',
      req.user?.nome || 'Sistema MES'
    )

    res.json({
      success: true,
      message: 'Produção iniciada com sucesso',
      ordem
    })
  } catch (error) {
    console.error('❌ Erro ao iniciar produção:', error)
    res.status(500).json({ 
      message: 'Erro ao iniciar produção', 
      error: error.message 
    })
  }
}

// =============================
// ⏸️ PAUSAR PRODUÇÃO
// =============================
export const pausarProducao = async (req, res) => {
  try {
    const { ordemId, motivo } = req.body

    const ordem = await OrdemProducao.findById(ordemId)

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    if (ordem.status !== 'Em Produção') {
      return res.status(400).json({ message: 'Ordem não está em produção' })
    }

    // Enviar comando de abortar ao CLP
    await opcuaService.abortarProducao()

    ordem.status = 'Pausada'
    ordem.observacoes = motivo
    await ordem.save()

    await ordem.adicionarLog(
      'Produção Pausada',
      motivo || 'Produção pausada manualmente',
      req.user?.nome || 'Sistema MES'
    )

    res.json({
      success: true,
      message: 'Produção pausada',
      ordem
    })
  } catch (error) {
    console.error('❌ Erro ao pausar produção:', error)
    res.status(500).json({ message: 'Erro ao pausar produção' })
  }
}

// =============================
// ✅ FINALIZAR PRODUÇÃO
// =============================
export const finalizarProducao = async (req, res) => {
  try {
    const { ordemId, pecasBoas, pecasRuins } = req.body

    const ordem = await OrdemProducao.findById(ordemId).populate('itens.produtoId')

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    // Finalizar ordem
    await ordem.finalizarProducao(pecasBoas, pecasRuins)

    // Atualizar estoque dos produtos
    for (const item of ordem.itens) {
      await Produto.findByIdAndUpdate(
        item.produtoId._id,
        { $inc: { estoque: pecasBoas } }
      )
    }

    // Atualizar pedido original
    const pedido = await Pedido.findById(ordem.pedidoId)
    if (pedido) {
      pedido.status = 'Enviado'
      await pedido.save()
    }

    await ordem.adicionarLog(
      'Produção Finalizada',
      `Finalizado com ${pecasBoas} peças boas e ${pecasRuins} peças ruins`,
      req.user?.nome || 'Sistema MES'
    )

    res.json({
      success: true,
      message: 'Produção finalizada com sucesso',
      ordem
    })
  } catch (error) {
    console.error('❌ Erro ao finalizar produção:', error)
    res.status(500).json({ message: 'Erro ao finalizar produção' })
  }
}

// =============================
// 🔄 CANCELAR ORDEM
// =============================
export const cancelarOrdem = async (req, res) => {
  try {
    const { ordemId, motivo } = req.body

    const ordem = await OrdemProducao.findById(ordemId)

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    if (ordem.status === 'Finalizada') {
      return res.status(400).json({ message: 'Não é possível cancelar ordem finalizada' })
    }

    // Se estiver em produção, abortar no CLP
    if (ordem.status === 'Em Produção') {
      await opcuaService.abortarProducao()
    }

    ordem.status = 'Cancelada'
    ordem.observacoes = motivo
    await ordem.save()

    await ordem.adicionarLog(
      'Ordem Cancelada',
      motivo || 'Ordem cancelada manualmente',
      req.user?.nome || 'Sistema MES'
    )

    res.json({
      success: true,
      message: 'Ordem cancelada',
      ordem
    })
  } catch (error) {
    console.error('❌ Erro ao cancelar ordem:', error)
    res.status(500).json({ message: 'Erro ao cancelar ordem' })
  }
}

// =============================
// 📡 LER STATUS DO CLP
// =============================
export const lerStatusCLP = async (req, res) => {
  try {
    // Verificar conexão
    if (!opcuaService.checkConnection()) {
      await opcuaService.connect()
    }

    // Ler status e ACK do CLP
    const status = await opcuaService.readStatus()
    const ack = await opcuaService.readAck()

    res.json({
      status,
      ack,
      timestamp: new Date().toISOString(),
      connected: opcuaService.checkConnection()
    })
  } catch (error) {
    console.error('❌ Erro ao ler status do CLP:', error)
    res.status(500).json({ 
      message: 'Erro ao ler status do CLP', 
      error: error.message,
      connected: false
    })
  }
}

// =============================
// 🔄 ATUALIZAR STATUS DO CLP NA ORDEM
// =============================
export const atualizarStatusCLPNaOrdem = async (req, res) => {
  try {
    const { ordemId } = req.body

    const ordem = await OrdemProducao.findById(ordemId)

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    // Ler status do CLP
    const statusCLP = await opcuaService.readStatus()

    // Atualizar na ordem
    await ordem.atualizarStatusCLP(statusCLP)

    res.json({
      success: true,
      ordem,
      statusCLP
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error)
    res.status(500).json({ message: 'Erro ao atualizar status' })
  }
}

// =============================
// 🔄 RESET DE FALHAS
// =============================
export const resetFalhasCLP = async (req, res) => {
  try {
    await opcuaService.resetFalhas()

    res.json({
      success: true,
      message: 'Reset de falhas enviado ao CLP'
    })
  } catch (error) {
    console.error('❌ Erro ao resetar falhas:', error)
    res.status(500).json({ message: 'Erro ao resetar falhas' })
  }
}

// =============================
// 🔌 CONECTAR/DESCONECTAR OPC UA
// =============================
export const conectarOPCUA = async (req, res) => {
  try {
    await opcuaService.connect()
    
    res.json({
      success: true,
      message: 'Conectado ao servidor OPC UA',
      endpoint: opcuaService.endpointUrl
    })
  } catch (error) {
    console.error('❌ Erro ao conectar OPC UA:', error)
    res.status(500).json({ 
      message: 'Erro ao conectar OPC UA', 
      error: error.message 
    })
  }
}

export const desconectarOPCUA = async (req, res) => {
  try {
    await opcuaService.disconnect()
    
    res.json({
      success: true,
      message: 'Desconectado do servidor OPC UA'
    })
  } catch (error) {
    console.error('❌ Erro ao desconectar OPC UA:', error)
    res.status(500).json({ message: 'Erro ao desconectar OPC UA' })
  }
}

// =============================
// 📊 ESTATÍSTICAS DO MES
// =============================
export const obterEstatisticas = async (req, res) => {
  try {
    const aguardando = await OrdemProducao.countDocuments({ status: 'Aguardando' })
    const emProducao = await OrdemProducao.countDocuments({ status: 'Em Produção' })
    const finalizadas = await OrdemProducao.countDocuments({ status: 'Finalizada' })
    const canceladas = await OrdemProducao.countDocuments({ status: 'Cancelada' })

    res.json({
      aguardando,
      emProducao,
      finalizadas,
      canceladas,
      total: aguardando + emProducao + finalizadas + canceladas
    })
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error)
    res.status(500).json({ message: 'Erro ao obter estatísticas' })
  }
}