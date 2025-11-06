import api from './api'

export const mesService = {
  async listarOrdens() {
    const response = await api.get('/mes/ordens')
    return response.data
  },

  async receberPedidoAprovado(pedido) {
    console.log('➡️ Enviando pedido aprovado para MES:', pedido)

    try {
      const response = await api.post('/mes/receber-pedido', pedido)
      console.log('✅ Pedido recebido no MES:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao enviar pedido para MES:', error)
      throw error
    }
  },

  async atualizarOrdem(id, dados) {
    const response = await api.put(`/mes/ordens/${id}`, dados)
    return response.data
  },

  async deletarOrdem(id) {
    const response = await api.delete(`/mes/ordens/${id}`)
    return response.data
  }
}
