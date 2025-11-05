import api from './api'

export const mesService = {
  async receberPedidoAprovado(pedido) {
    try {
      const response = await api.post('/mes/receber-pedido', pedido)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao receber pedido no MES')
    }
  },

  async criarOrdemProducao(dadosOrdem) {
    try {
      const response = await api.post('/mes/ordens-producao', dadosOrdem)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar ordem de produção')
    }
  },

  async listarOrdensProducao() {
    try {
      const response = await api.get('/mes/ordens-producao')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao listar ordens de produção')
    }
  },

  async atualizarStatusOrdem(ordemId, novoStatus, dados = {}) {
    try {
      const response = await api.patch(`/mes/ordens-producao/${ordemId}`, {
        status: novoStatus,
        ...dados
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar ordem de produção')
    }
  },

  async atualizarEstoqueAposProducao(ordemId, itensFinalizados) {
    try {
      const response = await api.post('/mes/atualizar-estoque', {
        ordemId,
        itensFinalizados
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar estoque')
    }
  },

  async lerVariaveisPlanta() {
    try {
      const response = await api.get('/mes/planta/variaveis')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao ler variáveis da planta')
    }
  },

  async iniciarProducao(ordemId, parametros = {}) {
    try {
      const response = await api.post('/mes/planta/iniciar-producao', {
        ordemId,
        parametros
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao iniciar produção')
    }
  },

  async pararProducao(ordemId, motivo = '') {
    try {
      const response = await api.post('/mes/planta/parar-producao', {
        ordemId,
        motivo
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao parar produção')
    }
  },

  async consultarEstoque() {
    try {
      const response = await api.get('/mes/estoque')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao consultar estoque')
    }
  },

  async bloquearEstoque(produtoId, quantidade) {
    try {
      const response = await api.post('/mes/estoque/bloquear', {
        produtoId,
        quantidade
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao bloquear estoque')
    }
  },

  async liberarEstoque(produtoId, quantidade) {
    try {
      const response = await api.post('/mes/estoque/liberar', {
        produtoId,
        quantidade
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao liberar estoque')
    }
  }
}