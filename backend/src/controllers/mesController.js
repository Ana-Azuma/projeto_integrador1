import OrdemProducao from '../models/OrdemProducao.js'
import Produto from '../models/Produto.js'

// Variáveis simuladas da planta
let variaveisPlanta = {
  temperatura: 25.5,
  pressao: 1.2,
  velocidade: 80,
  status: 'Operacional',
  producaoAtual: 0,
  ultimaAtualizacao: new Date().toISOString()
}

export const receberPedidoAprovado = async (req, res) => {
  try {
    const { id, clienteNome, itens, valorTotal, prioridade } = req.body

    const ordemProducao = await OrdemProducao.create({
      pedidoId: id,
      clienteNome,
      itens,
      valorTotal,
      prioridade: prioridade || 'normal',
      status: 'Pendente',
      progresso: 0
    })

    res.status(201).json(ordemProducao)
  } catch (error) {
    console.error('Erro ao receber pedido:', error)
    res.status(500).json({ message: 'Erro ao criar ordem de produção' })
  }
}

export const listarOrdensProducao = async (req, res) => {
  try {
    const ordens = await OrdemProducao.find().sort({ createdAt: -1 })
    res.json(ordens)
  } catch (error) {
    console.error('Erro ao listar ordens:', error)
    res.status(500).json({ message: 'Erro ao listar ordens de produção' })
  }
}

export const atualizarStatusOrdem = async (req, res) => {
  try {
    const { status, ...dados } = req.body

    const ordem = await OrdemProducao.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...dados,
        ultimaAtualizacao: new Date()
      },
      { new: true }
    )

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    res.json(ordem)
  } catch (error) {
    console.error('Erro ao atualizar ordem:', error)
    res.status(500).json({ message: 'Erro ao atualizar ordem' })
  }
}

export const atualizarEstoqueAposProducao = async (req, res) => {
  try {
    const { ordemId, itensFinalizados } = req.body

    // Atualizar estoque de cada produto
    for (const item of itensFinalizados) {
      await Produto.findByIdAndUpdate(
        item.produtoId,
        { $inc: { estoque: item.quantidade } }
      )
    }

    res.json({
      ordemId,
      itensAtualizados: itensFinalizados,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error)
    res.status(500).json({ message: 'Erro ao atualizar estoque' })
  }
}

export const lerVariaveisPlanta = async (req, res) => {
  try {
    // Simular variação
    variaveisPlanta = {
      ...variaveisPlanta,
      temperatura: 22 + Math.random() * 8,
      pressao: 1.0 + Math.random() * 0.5,
      velocidade: 70 + Math.random() * 20,
      ultimaAtualizacao: new Date().toISOString()
    }

    res.json(variaveisPlanta)
  } catch (error) {
    console.error('Erro ao ler variáveis:', error)
    res.status(500).json({ message: 'Erro ao ler variáveis da planta' })
  }
}

export const iniciarProducao = async (req, res) => {
  try {
    const { ordemId, parametros } = req.body

    const ordem = await OrdemProducao.findByIdAndUpdate(
      ordemId,
      {
        status: 'Em Produção',
        dataInicio: new Date(),
        parametros
      },
      { new: true }
    )

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    variaveisPlanta.status = 'Produzindo'
    variaveisPlanta.producaoAtual = ordemId

    res.json({
      success: true,
      ordem,
      variaveis: variaveisPlanta
    })
  } catch (error) {
    console.error('Erro ao iniciar produção:', error)
    res.status(500).json({ message: 'Erro ao iniciar produção' })
  }
}

export const pararProducao = async (req, res) => {
  try {
    const { ordemId, motivo } = req.body

    const updateData = {
      status: motivo === 'Concluída' ? 'Concluída' : 'Parada',
      dataFim: new Date(),
      motivoParada: motivo
    }

    if (motivo === 'Concluída') {
      updateData.progresso = 100
    }

    const ordem = await OrdemProducao.findByIdAndUpdate(
      ordemId,
      updateData,
      { new: true }
    )

    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' })
    }

    // Atualizar estoque se concluída
    if (motivo === 'Concluída') {
      for (const item of ordem.itens) {
        await Produto.findByIdAndUpdate(
          item.produto.id,
          { $inc: { estoque: item.quantidade } }
        )
      }
    }

    variaveisPlanta.status = 'Parada'
    variaveisPlanta.producaoAtual = 0

    res.json({
      success: true,
      ordem,
      variaveis: variaveisPlanta
    })
  } catch (error) {
    console.error('Erro ao parar produção:', error)
    res.status(500).json({ message: 'Erro ao parar produção' })
  }
}

export const consultarEstoque = async (req, res) => {
  try {
    const produtos = await Produto.find().select('_id estoque')
    
    const estoque = produtos.map(p => ({
      produtoId: p._id,
      disponivel: p.estoque,
      bloqueado: 0
    }))

    res.json(estoque)
  } catch (error) {
    console.error('Erro ao consultar estoque:', error)
    res.status(500).json({ message: 'Erro ao consultar estoque' })
  }
}

export const bloquearEstoque = async (req, res) => {
  try {
    const { produtoId, quantidade } = req.body

    res.json({
      produtoId,
      quantidadeBloqueada: quantidade,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao bloquear estoque:', error)
    res.status(500).json({ message: 'Erro ao bloquear estoque' })
  }
}

export const liberarEstoque = async (req, res) => {
  try {
    const { produtoId, quantidade } = req.body

    res.json({
      produtoId,
      quantidadeLiberada: quantidade,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao liberar estoque:', error)
    res.status(500).json({ message: 'Erro ao liberar estoque' })
  }
}