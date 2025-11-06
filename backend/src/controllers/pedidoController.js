import Pedido from '../models/Pedido.js'
import Produto from '../models/Produto.js'

// 🔹 Listar todos os pedidos (admin ou MES)
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

// 🔹 Buscar pedido por ID
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

// 🔹 Criar novo pedido (CLIENTE)
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
      // ✅ Aceita qualquer forma de referência de produto
      const produtoId = item.produtoId || item.produto?._id || item.produto?.id

      if (!produtoId) {
        return res.status(400).json({ message: 'Produto inválido no pedido.' })
      }

      const produto = await Produto.findById(produtoId)
      if (!produto) {
        return res.status(404).json({ message: `Produto não encontrado: ${produtoId}` })
      }

      // ✅ Verifica o estoque corretamente
      if (produto.estoque < item.quantidade) {
        return res.status(400).json({
          message: `Estoque insuficiente para o produto ${produto.nome}`
        })
      }

      // 🔽 Atualiza o estoque no banco
      produto.estoque -= item.quantidade
      await produto.save()

      // Calcula subtotal e acumula o valor total
      const subtotal = produto.preco * item.quantidade
      valorTotal += subtotal

      // Monta estrutura do item salvo no pedido
      itensComDetalhes.push({
        produto: produto._id,
        quantidade: item.quantidade
      })
    }

    // ✅ Cria o pedido no banco
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

// 🔹 Atualizar pedido (MES/Admin)
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

// 🔹 Listar pedidos pendentes (MES/Admin)
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
