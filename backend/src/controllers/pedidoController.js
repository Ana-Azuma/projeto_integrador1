import Pedido from '../models/Pedido.js'

export const listar = async (req, res) => {
  try {
    const { status } = req.query
    const query = status ? { status } : {}
    
    const pedidos = await Pedido.find(query).sort({ createdAt: -1 })
    res.json(pedidos)
  } catch (error) {
    console.error('Erro ao listar pedidos:', error)
    res.status(500).json({ message: 'Erro ao carregar pedidos' })
  }
}

export const buscarPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
    
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' })
    }
    
    res.json(pedido)
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    res.status(500).json({ message: 'Erro ao buscar pedido' })
  }
}

export const criar = async (req, res) => {
  try {
    const pedido = await Pedido.create(req.body)
    res.status(201).json(pedido)
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    res.status(500).json({ message: 'Erro ao criar pedido' })
  }
}

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

export const listarPendentes = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ status: 'Pendente de Aprovação' })
      .sort({ createdAt: -1 })
    res.json(pedidos)
  } catch (error) {
    console.error('Erro ao listar pedidos pendentes:', error)
    res.status(500).json({ message: 'Erro ao carregar pedidos pendentes' })
  }
}