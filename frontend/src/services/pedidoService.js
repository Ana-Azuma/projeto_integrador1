import api from './api'

export const pedidoService = {
  async listar() {
    try {
      const response = await api.get('/pedidos')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar pedidos')
    }
  },

  async buscarPorId(id) {
    try {
      const response = await api.get(`/pedidos/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar pedido')
    }
  },

  async criar(pedido) {
    try {
      const response = await api.post('/pedidos', pedido)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar pedido')
    }
  },

  async atualizar(id, dadosAtualizados) {
    try {
      const response = await api.put(`/pedidos/${id}`, dadosAtualizados)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar pedido')
    }
  },

  async listarPendentes() {
    try {
      const response = await api.get('/pedidos?status=Pendente de Aprovação')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar pedidos pendentes')
    }
  }
}