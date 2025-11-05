import api from './api'

export const produtoService = {
  async listar() {
    try {
      const response = await api.get('/produtos')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar produtos')
    }
  },

  async buscarPorId(id) {
    try {
      const response = await api.get(`/produtos/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar produto')
    }
  },

  async criar(produto) {
    try {
      const response = await api.post('/produtos', produto)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar produto')
    }
  },

  async atualizar(id, dadosAtualizados) {
    try {
      const response = await api.put(`/produtos/${id}`, dadosAtualizados)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar produto')
    }
  },

  async excluir(id) {
    try {
      await api.delete(`/produtos/${id}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir produto')
    }
  },

  async atualizarEstoque(id, quantidade) {
    try {
      const response = await api.patch(`/produtos/${id}/estoque`, { estoque: quantidade })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar estoque')
    }
  }
}