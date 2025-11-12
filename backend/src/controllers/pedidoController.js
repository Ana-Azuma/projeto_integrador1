// backend/controllers/pedidoController.js
import Pedido from '../models/Pedido.js'
import OrdemProducao from '../models/OrdemProducao.js'
import Produto from '../models/Produto.js'
import axios from 'axios'

const MES_URL = process.env.MES_URL || 'http://localhost:3001/api/mes'

// 📋 Listar todos os pedidos (admin ou MES)
export const listar = async (req, res) => {
  try {
    const { status } = req.query
    const query = status ? { status } : {}
    
    const pedidos = await Pedido.find(query)
      .populate('clienteId', 'nome email')
      .sort({ createdAt: -1 })
    
    res.json(pedidos)
  } catch (error) {
    console.error('Erro ao listar pedidos:', error)
    res.status(500).json({ message: 'Erro ao carregar pedidos' })
  }
}

// 📋 Buscar pedido por ID
export const buscarPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('clienteId', 'nome email')
    
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' })
    }
    
    res.json(pedido)
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    res.status(500).json({ message: 'Erro ao buscar pedido' })
  }
}

// ➕ Criar novo pedido (CLIENTE)
export const criar = async (req, res) => {
  try {
    const { itens, clienteId, clienteNome } = req.body

    if (!itens || itens.length === 0) {
      return res.status(400).json({ message: 'O pedido deve conter ao menos um item.' })
    }

    if (!clienteId || !clienteNome) {
      return res.status(400).json({ message: 'Dados do cliente são obrigatórios.' })
    }

    let valorTotal = 0
    const itensComDetalhes = []

    for (const item of itens) {
      const produtoId = item.produtoId || item.produto?._id || item.produto?.id

      if (!produtoId) {
        return res.status(400).json({ message: 'Produto inválido no pedido.' })
      }

      const produto = await Produto.findById(produtoId)
      if (!produto) {
        return res.status(404).json({ message: `Produto não encontrado: ${produtoId}` })
      }

      if (produto.estoque < item.quantidade) {
        return res.status(400).json({
          message: `Estoque insuficiente para o produto ${produto.nome}`
        })
      }

      // Reduz estoque
      produto.estoque -= item.quantidade
      await produto.save()

      const subtotal = produto.preco * item.quantidade
      valorTotal += subtotal

      itensComDetalhes.push({
        produto: produto._id,
        quantidade: item.quantidade
      })
    }

    // Cria o pedido
    const pedido = await Pedido.create({
      clienteId,
      clienteNome,
      itens: itensComDetalhes,
      valorTotal,
      status: 'Pendente de Aprovação'
    })

    res.status(201).json(pedido)
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    res.status(500).json({ message: 'Erro ao criar pedido' })
  }
}

// ✅ APROVAR PEDIDO E ENVIAR PARA MES
export const aprovar = async (req, res) => {
  try {
    const { observacoes } = req.body

    const pedido = await Pedido.findById(req.params.id)
      .populate('itens.produto')

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' })
    }

    if (pedido.status !== 'Pendente de Aprovação') {
      return res.status(400).json({ message: 'Pedido já foi processado' })
    }

    // Atualizar pedido
    pedido.status = 'Aprovado'
    pedido.dataAprovacao = new Date()
    pedido.observacoes = observacoes
    await pedido.save()

    // 🚀 ENVIAR AUTOMATICAMENTE PARA O MES
    try {
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

      console.log(`✅ Ordem de produção ${ordemProducao.numeroOP} criada automaticamente`)

      // Atualizar status do pedido
      pedido.status = 'Em Produção'
      await pedido.save()

      res.json({
        success: true,
        message: 'Pedido aprovado e enviado para produção',
        pedido,
        ordemProducao
      })
    } catch (mesError) {
      console.error('❌ Erro ao enviar para MES:', mesError)
      // Pedido continua aprovado, mas não foi para produção
      res.json({
        success: true,
        warning: 'Pedido aprovado mas não foi enviado para produção',
        pedido,
        error: mesError.message
      })
    }
  } catch (error) {
    console.error('❌ Erro ao aprovar pedido:', error)
    res.status(500).json({ message: 'Erro ao aprovar pedido' })
  }
}

// ❌ REJEITAR PEDIDO
export const rejeitar = async (req, res) => {
  try {
    const { motivoRejeicao } = req.body

    if (!motivoRejeicao) {
      return res.status(400).json({ message: 'Motivo da rejeição é obrigatório' })
    }

    const pedido = await Pedido.findById(req.params.id)
      .populate('itens.produto')

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' })
    }

    if (pedido.status !== 'Pendente de Aprovação') {
      return res.status(400).json({ message: 'Pedido já foi processado' })
    }

    // Devolver estoque
    for (const item of pedido.itens) {
      await Produto.findByIdAndUpdate(
        item.produto._id,
        { $inc: { estoque: item.quantidade } }
      )
    }

    // Atualizar pedido
    pedido.status = 'Rejeitado'
    pedido.dataRejeicao = new Date()
    pedido.motivoRejeicao = motivoRejeicao
    await pedido.save()

    res.json({
      success: true,
      message: 'Pedido rejeitado',
      pedido
    })
  } catch (error) {
    console.error('❌ Erro ao rejeitar pedido:', error)
    res.status(500).json({ message: 'Erro ao rejeitar pedido' })
  }
}

// 📝 Atualizar pedido (MES/Admin)
export const atualizar = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        dataUltimaAtualizacao: new Date()
      },
      { new: true, runValidators: true }
    )

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' })
    }

    res.json(pedido)
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    res.status(500).json({ message: 'Erro ao atualizar pedido' })
  }
}

// 📋 Listar pedidos pendentes (MES/Admin)
export const listarPendentes = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ status: 'Pendente de Aprovação' })
      .populate('clienteId', 'nome email')
      .sort({ createdAt: -1 })
    
    res.json(pedidos)
  } catch (error) {
    console.error('Erro ao listar pedidos pendentes:', error)
    res.status(500).json({ message: 'Erro ao carregar pedidos pendentes' })
  }
}

// 📊 Estatísticas de pedidos
export const obterEstatisticas = async (req, res) => {
  try {
    const pendentes = await Pedido.countDocuments({ status: 'Pendente de Aprovação' })
    const aprovados = await Pedido.countDocuments({ status: 'Aprovado' })
    const rejeitados = await Pedido.countDocuments({ status: 'Rejeitado' })
    const emProducao = await Pedido.countDocuments({ status: 'Em Produção' })
    const enviados = await Pedido.countDocuments({ status: 'Enviado' })

    res.json({
      pendentes,
      aprovados,
      rejeitados,
      emProducao,
      enviados,
      total: pendentes + aprovados + rejeitados + emProducao + enviados
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    res.status(500).json({ message: 'Erro ao obter estatísticas' })
  }
}