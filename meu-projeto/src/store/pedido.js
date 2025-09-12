import { defineStore } from 'pinia'
import { pedidoService } from '../services/pedidoService'
import { mesService } from '../services/mesService'
import { useAuthStore } from './auth'

export const usePedidoStore = defineStore('pedido', {
  state: () => ({
    pedidos: [],
    pedidosPendentes: [],
    isLoading: false,
    error: null
  }),

  getters: {
    meusPedidos: (state) => {
      const authStore = useAuthStore()
      return state.pedidos.filter(p => p.clienteId === authStore.user?.id)
    },

    pedidosPorStatus: (state) => (status) => {
      return state.pedidos.filter(p => p.status === status)
    },

    totalPedidos: (state) => state.pedidos.length,
    
    estatisticasPedidos: (state) => {
      const stats = {
        pendentes: 0,
        aprovados: 0,
        rejeitados: 0,
        emProducao: 0,
        enviados: 0
      }
      
      state.pedidos.forEach(pedido => {
        switch (pedido.status) {
          case 'Pendente de Aprovação':
            stats.pendentes++
            break
          case 'Aprovado':
            stats.aprovados++
            break
          case 'Rejeitado':
            stats.rejeitados++
            break
          case 'Em Produção':
            stats.emProducao++
            break
          case 'Enviado':
            stats.enviados++
            break
        }
      })
      
      return stats
    }
  },

  actions: {
    async carregarPedidos() {
      this.isLoading = true
      this.error = null
      
      try {
        this.pedidos = await pedidoService.listar()
        this.pedidosPendentes = this.pedidos.filter(p => p.status === 'Pendente de Aprovação')
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    async criarPedido(dadosPedido) {
      this.isLoading = true
      
      try {
        const authStore = useAuthStore()
        const novoPedido = await pedidoService.criar({
          ...dadosPedido,
          clienteId: authStore.user.id,
          clienteNome: authStore.user.nome,
          status: 'Pendente de Aprovação',
          dataCreated: new Date().toISOString()
        })
        
        this.pedidos.unshift(novoPedido)
        this.pedidosPendentes.unshift(novoPedido)
        
        return { success: true, pedido: novoPedido }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async aprovarPedido(pedidoId, observacoes = '') {
      this.isLoading = true
      
      try {
        // 1. Atualizar status do pedido
        const pedidoAtualizado = await pedidoService.atualizar(pedidoId, {
          status: 'Aprovado',
          observacoes,
          dataAprovacao: new Date().toISOString()
        })
        
        // 2. Atualizar localmente
        await this.atualizarPedidoLocal(pedidoId, pedidoAtualizado)
        
        // 3. Enviar para MES automaticamente
        console.log('Enviando pedido para MES...', pedidoAtualizado)
        await this.enviarParaMES(pedidoAtualizado)
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('Erro ao aprovar pedido:', error)
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async rejeitarPedido(pedidoId, motivo) {
      this.isLoading = true
      
      try {
        const pedidoAtualizado = await pedidoService.atualizar(pedidoId, {
          status: 'Rejeitado',
          motivoRejeicao: motivo,
          dataRejeicao: new Date().toISOString()
        })
        
        await this.atualizarPedidoLocal(pedidoId, pedidoAtualizado)
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async atualizarStatusPedido(pedidoId, novoStatus, dados = {}) {
      try {
        const pedidoAtualizado = await pedidoService.atualizar(pedidoId, {
          status: novoStatus,
          ...dados,
          dataUltimaAtualizacao: new Date().toISOString()
        })
        
        await this.atualizarPedidoLocal(pedidoId, pedidoAtualizado)
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    async atualizarPedidoLocal(pedidoId, dadosAtualizados) {
      const index = this.pedidos.findIndex(p => p.id === pedidoId)
      if (index !== -1) {
        this.pedidos[index] = { ...this.pedidos[index], ...dadosAtualizados }
      }
      
      // Atualizar lista de pendentes
      this.pedidosPendentes = this.pedidos.filter(p => p.status === 'Pendente de Aprovação')
    },

    async enviarParaMES(pedido) {
      try {
        console.log('Criando ordem de produção no MES para pedido:', pedido.id)
        
        // Enviar pedido aprovado para o MES criar ordem de produção
        const ordemCriada = await mesService.receberPedidoAprovado({
          id: pedido.id,
          clienteNome: pedido.clienteNome,
          itens: pedido.itens,
          valorTotal: pedido.valorTotal,
          prioridade: pedido.prioridade || 'normal'
        })
        
        console.log('Ordem de produção criada no MES:', ordemCriada)
        
        return ordemCriada
      } catch (error) {
        console.error('Erro ao enviar pedido para MES:', error)
        throw new Error('Falha ao criar ordem de produção no MES: ' + error.message)
      }
    },

    clearError() {
      this.error = null
    }
  }
})