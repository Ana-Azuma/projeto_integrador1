import api from './api'

// Mock de pedidos para desenvolvimento
let PEDIDOS_MOCK = []
let proximoId = 1

export const pedidoService = {
  async listar() {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockListar()
      }
      
      const response = await api.get('/pedidos')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar pedidos')
    }
  },

  async buscarPorId(id) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockBuscarPorId(id)
      }
      
      const response = await api.get(`/pedidos/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar pedido')
    }
  },

  async criar(pedido) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockCriar(pedido)
      }
      
      const response = await api.post('/pedidos', pedido)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar pedido')
    }
  },

  async atualizar(id, dadosAtualizados) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockAtualizar(id, dadosAtualizados)
      }
      
      const response = await api.put(`/pedidos/${id}`, dadosAtualizados)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar pedido')
    }
  },

  async listarPendentes() {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockListarPendentes()
      }
      
      const response = await api.get('/pedidos?status=pendente')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar pedidos pendentes')
    }
  },

  // Métodos mock para desenvolvimento
  mockListar() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...PEDIDOS_MOCK]), 300)
    })
  },

  mockBuscarPorId(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const pedido = PEDIDOS_MOCK.find(p => p.id === parseInt(id))
        if (pedido) {
          resolve({ ...pedido })
        } else {
          reject(new Error('Pedido não encontrado'))
        }
      }, 200)
    })
  },

  mockCriar(pedido) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novoPedido = {
          ...pedido,
          id: proximoId++,
          dataCreated: new Date().toISOString(),
          valorTotal: pedido.itens.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0)
        }
        PEDIDOS_MOCK.unshift(novoPedido)
        resolve(novoPedido)
      }, 400)
    })
  },

  mockAtualizar(id, dadosAtualizados) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = PEDIDOS_MOCK.findIndex(p => p.id === parseInt(id))
        if (index !== -1) {
          PEDIDOS_MOCK[index] = {
            ...PEDIDOS_MOCK[index],
            ...dadosAtualizados
          }
          resolve(PEDIDOS_MOCK[index])
        } else {
          reject(new Error('Pedido não encontrado'))
        }
      }, 300)
    })
  },

  mockListarPendentes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pendentes = PEDIDOS_MOCK.filter(p => p.status === 'Pendente de Aprovação')
        resolve(pendentes)
      }, 200)
    })
  }
}