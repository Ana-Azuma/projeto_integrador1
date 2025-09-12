import api from './api'

// Mock de produtos para desenvolvimento - IMPORTANTE: incluir foto
let PRODUTOS_MOCK = [
  { 
    id: 1, 
    nome: 'Suco de Laranja', 
    descricao: 'Suco natural de laranja 500ml', 
    preco: 8.50, 
    estoque: 25,
    foto: null
  },
  { 
    id: 2, 
    nome: 'Suco de Maçã', 
    descricao: 'Suco natural de maçã 500ml', 
    preco: 9.00, 
    estoque: 18,
    foto: null
  },
  { 
    id: 3, 
    nome: 'Suco de Uva', 
    descricao: 'Suco natural de uva 500ml', 
    preco: 10.50, 
    estoque: 12,
    foto: null
  },
  { 
    id: 4, 
    nome: 'Suco Misto', 
    descricao: 'Blend de frutas tropicais 500ml', 
    preco: 11.00, 
    estoque: 8,
    foto: null
  }
]

export const produtoService = {
  async listar() {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockListar()
      }
      
      const response = await api.get('/produtos')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar produtos')
    }
  },

  async buscarPorId(id) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockBuscarPorId(id)
      }
      
      const response = await api.get(`/produtos/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar produto')
    }
  },

  async criar(produto) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockCriar(produto)
      }
      
      const response = await api.post('/produtos', produto)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar produto')
    }
  },

  async atualizar(id, dadosAtualizados) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockAtualizar(id, dadosAtualizados)
      }
      
      const response = await api.put(`/produtos/${id}`, dadosAtualizados)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar produto')
    }
  },

  async excluir(id) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockExcluir(id)
      }
      
      await api.delete(`/produtos/${id}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir produto')
    }
  },

  async atualizarEstoque(id, quantidade) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockAtualizarEstoque(id, quantidade)
      }
      
      const response = await api.patch(`/produtos/${id}/estoque`, { estoque: quantidade })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar estoque')
    }
  },

  // Métodos mock para desenvolvimento
  mockListar() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Listando produtos mock:', PRODUTOS_MOCK)
        resolve([...PRODUTOS_MOCK])
      }, 300)
    })
  },

  mockBuscarPorId(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const produto = PRODUTOS_MOCK.find(p => p.id === parseInt(id))
        if (produto) {
          resolve({ ...produto })
        } else {
          reject(new Error('Produto não encontrado'))
        }
      }, 200)
    })
  },

  mockCriar(produto) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novoProduto = {
          ...produto,
          id: Math.max(...PRODUTOS_MOCK.map(p => p.id), 0) + 1,
          preco: parseFloat(produto.preco),
          estoque: parseInt(produto.estoque),
          foto: produto.foto || null
        }
        
        PRODUTOS_MOCK.push(novoProduto)
        console.log('Produto criado:', novoProduto)
        console.log('Lista atualizada:', PRODUTOS_MOCK)
        
        resolve(novoProduto)
      }, 300)
    })
  },

  mockAtualizar(id, dadosAtualizados) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = PRODUTOS_MOCK.findIndex(p => p.id === parseInt(id))
        if (index !== -1) {
          PRODUTOS_MOCK[index] = {
            ...PRODUTOS_MOCK[index],
            ...dadosAtualizados,
            preco: dadosAtualizados.preco ? parseFloat(dadosAtualizados.preco) : PRODUTOS_MOCK[index].preco,
            estoque: dadosAtualizados.estoque !== undefined ? parseInt(dadosAtualizados.estoque) : PRODUTOS_MOCK[index].estoque,
            foto: dadosAtualizados.foto !== undefined ? dadosAtualizados.foto : PRODUTOS_MOCK[index].foto
          }
          
          console.log('Produto atualizado:', PRODUTOS_MOCK[index])
          resolve(PRODUTOS_MOCK[index])
        } else {
          reject(new Error('Produto não encontrado'))
        }
      }, 300)
    })
  },

  mockExcluir(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = PRODUTOS_MOCK.findIndex(p => p.id === parseInt(id))
        if (index !== -1) {
          PRODUTOS_MOCK.splice(index, 1)
          console.log('Produto excluído, lista atualizada:', PRODUTOS_MOCK)
          resolve(true)
        } else {
          reject(new Error('Produto não encontrado'))
        }
      }, 200)
    })
  },

  mockAtualizarEstoque(id, novoEstoque) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const produto = PRODUTOS_MOCK.find(p => p.id === parseInt(id))
        if (produto) {
          produto.estoque = parseInt(novoEstoque)
          console.log('Estoque atualizado:', produto)
          resolve(produto)
        } else {
          reject(new Error('Produto não encontrado'))
        }
      }, 200)
    })
  }
}