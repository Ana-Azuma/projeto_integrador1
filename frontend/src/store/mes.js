// Devido ao tamanho, vou criar em partes
// Primeiro, substitua o arquivo mes.js na store

// frontend/src/store/mes.js
import { defineStore } from 'pinia'
import { mesService } from '@/services/mesService'

export const useMesStore = defineStore('mes', {
  state: () => ({
    ordensProducao: [],
    isLoading: false,
    error: null
  }),

  getters: {
    ordensAguardando: (state) => state.ordensProducao.filter(o => o.status === 'Aguardando'),
    ordensEmProducao: (state) => state.ordensProducao.filter(o => o.status === 'Em Produção'),
    ordensFinalizadas: (state) => state.ordensProducao.filter(o => o.status === 'Finalizada')
  },

  actions: {
    async carregarOrdens() {
      this.isLoading = true
      try {
        this.ordensProducao = await mesService.listarOrdens()
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    async iniciarProducao(ordemId) {
      try {
        await mesService.iniciarProducao(ordemId)
        await this.carregarOrdens()
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    async finalizarProducao(ordemId, pecasBoas, pecasRuins) {
      try {
        await mesService.finalizarProducao(ordemId, pecasBoas, pecasRuins)
        await this.carregarOrdens()
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    }
  }
})