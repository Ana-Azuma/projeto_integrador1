// frontend/src/services/mesService.js
import api from './api'

export const mesService = {
  // =============================
  // ORDENS DE PRODUÇÃO
  // =============================
  async listarOrdens() {
    try {
      console.log('📦 Buscando ordens de produção...')
      const response = await api.get('/mes/ordens-producao')
      console.log('✅ Ordens recebidas:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao listar ordens:', error)
      throw error
    }
  },

  async buscarOrdemPorId(id) {
    try {
      const response = await api.get(`/mes/ordens-producao/${id}`)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar ordem:', error)
      throw error
    }
  },

  // =============================
  // CONTROLE DE PRODUÇÃO
  // =============================
  async iniciarProducao(ordemId) {
    try {
      console.log('🚀 Iniciando produção da ordem:', ordemId)
      const response = await api.post('/mes/producao/iniciar', { ordemId })
      console.log('✅ Produção iniciada:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao iniciar produção:', error)
      throw error
    }
  },

  async pausarProducao(ordemId, motivo) {
    try {
      const response = await api.post('/mes/producao/pausar', { ordemId, motivo })
      return response.data
    } catch (error) {
      console.error('❌ Erro ao pausar produção:', error)
      throw error
    }
  },

  async finalizarProducao(ordemId, pecasBoas, pecasRuins) {
    try {
      console.log('✅ Finalizando produção:', { ordemId, pecasBoas, pecasRuins })
      const response = await api.post('/mes/producao/finalizar', {
        ordemId,
        pecasBoas,
        pecasRuins
      })
      console.log('✅ Produção finalizada:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao finalizar produção:', error)
      throw error
    }
  },

  async cancelarOrdem(ordemId, motivo) {
    try {
      const response = await api.post('/mes/producao/cancelar', { ordemId, motivo })
      return response.data
    } catch (error) {
      console.error('❌ Erro ao cancelar ordem:', error)
      throw error
    }
  },

  // =============================
  // CLP / OPC UA
  // =============================
  async lerStatusCLP() {
    try {
      const response = await api.get('/mes/clp/status')
      return response.data
    } catch (error) {
      console.error('❌ Erro ao ler status CLP:', error)
      throw error
    }
  },

  async conectarCLP() {
    try {
      console.log('🔌 Conectando ao CLP...')
      const response = await api.post('/mes/clp/conectar')
      console.log('✅ Conectado ao CLP')
      return response.data
    } catch (error) {
      console.error('❌ Erro ao conectar CLP:', error)
      throw error
    }
  },

  async desconectarCLP() {
    try {
      const response = await api.post('/mes/clp/desconectar')
      return response.data
    } catch (error) {
      console.error('❌ Erro ao desconectar CLP:', error)
      throw error
    }
  },

  async resetFalhas() {
    try {
      console.log('🔄 Resetando falhas do CLP...')
      const response = await api.post('/mes/clp/reset-falhas')
      return response.data
    } catch (error) {
      console.error('❌ Erro ao resetar falhas:', error)
      throw error
    }
  },

  // =============================
  // ESTATÍSTICAS
  // =============================
  async obterEstatisticas() {
    try {
      const response = await api.get('/mes/estatisticas')
      return response.data
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error)
      throw error
    }
  },

  // =============================
  // LEGACY (manter compatibilidade)
  // =============================
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
  }
}