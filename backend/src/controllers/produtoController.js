import Produto from '../models/Produto.js'

// 🔹 Listar todos os produtos
export const listar = async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ createdAt: -1 })
    res.json(produtos)
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    res.status(500).json({ message: 'Erro ao carregar produtos' })
  }
}

// 🔹 Buscar produto por ID
export const buscarPorId = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id)
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })
    res.json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    res.status(500).json({ message: 'Erro ao buscar produto' })
  }
}

// 🔹 Criar novo produto
export const criar = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, foto } = req.body

    const precoConvertido = parseFloat(preco)
    const estoqueConvertido =
      estoque === '' || estoque === undefined || estoque === null
        ? 0
        : parseInt(estoque)

    if (!nome || isNaN(precoConvertido)) {
      return res.status(400).json({ message: 'Nome e preço são obrigatórios.' })
    }

    const produto = await Produto.create({
      nome: nome.trim(),
      descricao: descricao?.trim() || '',
      preco: precoConvertido,
      estoque: estoqueConvertido,
      foto: foto?.trim() || null
    })

    res.status(201).json(produto)
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    res.status(500).json({ message: 'Erro ao criar produto' })
  }
}

// 🔹 Atualizar produto existente
export const atualizar = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, foto } = req.body
    const precoConvertido = preco !== undefined ? parseFloat(preco) : undefined
    const estoqueConvertido =
      estoque !== undefined && estoque !== ''
        ? parseInt(estoque)
        : undefined

    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      {
        ...(nome && { nome: nome.trim() }),
        ...(descricao && { descricao: descricao.trim() }),
        ...(precoConvertido !== undefined && !isNaN(precoConvertido) && { preco: precoConvertido }),
        ...(estoqueConvertido !== undefined && !isNaN(estoqueConvertido) && { estoque: estoqueConvertido }),
        ...(foto !== undefined && { foto: foto?.trim() || null })
      },
      { new: true, runValidators: true }
    )

    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })
    res.json(produto)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    res.status(500).json({ message: 'Erro ao atualizar produto' })
  }
}

// 🔹 Excluir produto
export const excluir = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id)
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })
    res.json({ message: 'Produto excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    res.status(500).json({ message: 'Erro ao excluir produto' })
  }
}

// 🔹 Atualizar estoque isoladamente
export const atualizarEstoque = async (req, res) => {
  try {
    const { estoque } = req.body
    const estoqueConvertido = parseInt(estoque)

    if (isNaN(estoqueConvertido)) {
      return res.status(400).json({ message: 'Valor de estoque inválido.' })
    }

    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      { estoque: estoqueConvertido },
      { new: true }
    )

    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' })
    res.json(produto)
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error)
    res.status(500).json({ message: 'Erro ao atualizar estoque' })
  }
}
