import api from './api'

// Mock de dados MES para desenvolvimento
let ORDENS_PRODUCAO_MOCK = []
let VARIAVEIS_PLANTA_MOCK = {
  temperatura: 25.5,
  pressao: 1.2,
  velocidade: 80,
  status: 'Operacional',
  producaoAtual: 0,
  ultimaAtualizacao: new Date().toISOString()
}

export const mesService = {
  // Receber pedidos aprovados automaticamente
  async receberPedidoAprovado(pedido) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockReceberPedido(pedido)
      }
      
      const response = await api.post('/mes/receber-pedido', pedido)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao receber pedido no MES')
    }
  },

  // Gerenciamento de Ordens de Produção
  async criarOrdemProducao(dadosOrdem) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockCriarOrdem(dadosOrdem)
      }
      
      const response = await api.post('/mes/ordens-producao', dadosOrdem)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar ordem de produção')
    }
  },

  async listarOrdensProducao() {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockListarOrdens()
      }
      
      const response = await api.get('/mes/ordens-producao')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao listar ordens de produção')
    }
  },

  async atualizarStatusOrdem(ordemId, novoStatus, dados = {}) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockAtualizarOrdem(ordemId, novoStatus, dados)
      }
      
      const response = await api.patch(`/mes/ordens-producao/${ordemId}`, {
        status: novoStatus,
        ...dados
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar ordem de produção')
    }
  },

  // Atualizar estoque após produção
  async atualizarEstoqueAposProducao(ordemId, itensFinalizados) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockAtualizarEstoque(ordemId, itensFinalizados)
      }
      
      const response = await api.post('/mes/atualizar-estoque', {
        ordemId,
        itensFinalizados
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar estoque')
    }
  },

  // Comunicação OPC UA com Planta Smart 4.0
  async lerVariaveisPlanta() {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockLerVariaveis()
      }
      
      const response = await api.get('/mes/planta/variaveis')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao ler variáveis da planta')
    }
  },

  async iniciarProducao(ordemId, parametros = {}) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockIniciarProducao(ordemId, parametros)
      }
      
      const response = await api.post(`/mes/planta/iniciar-producao`, {
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
      if (import.meta.env.MODE === 'development') {
        return this.mockPararProducao(ordemId, motivo)
      }
      
      const response = await api.post(`/mes/planta/parar-producao`, {
        ordemId,
        motivo
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao parar produção')
    }
  },

  // Controle de Estoque
  async consultarEstoque() {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockConsultarEstoque()
      }
      
      const response = await api.get('/mes/estoque')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao consultar estoque')
    }
  },

  async bloquearEstoque(produtoId, quantidade) {
    try {
      if (import.meta.env.MODE === 'development') {
        return this.mockBloquearEstoque(produtoId, quantidade)
      }
      
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
      if (import.meta.env.MODE === 'development') {
        return this.mockLiberarEstoque(produtoId, quantidade)
      }
      
      const response = await api.post('/mes/estoque/liberar', {
        produtoId,
        quantidade
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao liberar estoque')
    }
  },

  // Métodos mock para desenvolvimento
  mockReceberPedido(pedido) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Criar ordem de produção automaticamente
        const novaOrdem = {
          id: Date.now(),
          pedidoId: pedido.id,
          clienteNome: pedido.clienteNome,
          itens: pedido.itens,
          status: 'Pendente',
          dataCreated: new Date().toISOString(),
          progresso: 0,
          valorTotal: pedido.valorTotal
        }
        
        ORDENS_PRODUCAO_MOCK.unshift(novaOrdem)
        
        // Bloquear estoque para cada item
        pedido.itens.forEach(item => {
          this.mockBloquearEstoque(item.produtoId, item.quantidade)
        })
        
        resolve(novaOrdem)
      }, 300)
    })
  },

  mockCriarOrdem(dadosOrdem) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novaOrdem = {
          ...dadosOrdem,
          id: Date.now(),
          status: 'Pendente',
          dataCreated: new Date().toISOString(),
          progresso: 0
        }
        ORDENS_PRODUCAO_MOCK.unshift(novaOrdem)
        resolve(novaOrdem)
      }, 500)
    })
  },

  mockListarOrdens() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...ORDENS_PRODUCAO_MOCK]), 300)
    })
  },

  mockAtualizarOrdem(ordemId, novoStatus, dados) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = ORDENS_PRODUCAO_MOCK.findIndex(o => o.id === ordemId)
        if (index !== -1) {
          ORDENS_PRODUCAO_MOCK[index] = {
            ...ORDENS_PRODUCAO_MOCK[index],
            status: novoStatus,
            ...dados,
            ultimaAtualizacao: new Date().toISOString()
          }
          resolve(ORDENS_PRODUCAO_MOCK[index])
        } else {
          reject(new Error('Ordem de produção não encontrada'))
        }
      }, 400)
    })
  },

  mockAtualizarEstoque(ordemId, itensFinalizados) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular atualização do estoque após produção concluída
        resolve({
          ordemId,
          itensAtualizados: itensFinalizados,
          timestamp: new Date().toISOString()
        })
      }, 300)
    })
  },

  mockLerVariaveis() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular variação nas variáveis
        VARIAVEIS_PLANTA_MOCK = {
          ...VARIAVEIS_PLANTA_MOCK,
          temperatura: 22 + Math.random() * 8,
          pressao: 1.0 + Math.random() * 0.5,
          velocidade: 70 + Math.random() * 20,
          ultimaAtualizacao: new Date().toISOString()
        }
        resolve(VARIAVEIS_PLANTA_MOCK)
      }, 200)
    })
  },

  mockIniciarProducao(ordemId, parametros) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ordem = ORDENS_PRODUCAO_MOCK.find(o => o.id === ordemId)
        if (ordem) {
          ordem.status = 'Em Produção'
          ordem.dataInicio = new Date().toISOString()
          ordem.parametros = parametros
        }
        
        VARIAVEIS_PLANTA_MOCK.status = 'Produzindo'
        VARIAVEIS_PLANTA_MOCK.producaoAtual = ordemId
        
        resolve({
          success: true,
          ordem,
          variaveis: VARIAVEIS_PLANTA_MOCK
        })
      }, 800)
    })
  },

  mockPararProducao(ordemId, motivo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ordem = ORDENS_PRODUCAO_MOCK.find(o => o.id === ordemId)
        if (ordem) {
          ordem.status = motivo === 'Concluída' ? 'Concluída' : 'Parada'
          ordem.dataFim = new Date().toISOString()
          ordem.motivoParada = motivo
          
          if (motivo === 'Concluída') {
            ordem.progresso = 100
            // Atualizar estoque dos produtos finalizados
            this.mockAtualizarEstoque(ordemId, ordem.itens)
          }
        }
        
        VARIAVEIS_PLANTA_MOCK.status = 'Parada'
        VARIAVEIS_PLANTA_MOCK.producaoAtual = 0
        
        resolve({
          success: true,
          ordem,
          variaveis: VARIAVEIS_PLANTA_MOCK
        })
      }, 600)
    })
  },

  mockConsultarEstoque() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { produtoId: 1, disponivel: 25, bloqueado: 0 },
          { produtoId: 2, disponivel: 18, bloqueado: 2 },
          { produtoId: 3, disponivel: 12, bloqueado: 0 },
          { produtoId: 4, disponivel: 8, bloqueado: 1 }
        ])
      }, 300)
    })
  },

  mockBloquearEstoque(produtoId, quantidade) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          produtoId,
          quantidadeBloqueada: quantidade,
          timestamp: new Date().toISOString()
        })
      }, 200)
    })
  },

  mockLiberarEstoque(produtoId, quantidade) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          produtoId,
          quantidadeLiberada: quantidade,
          timestamp: new Date().toISOString()
        })
      }, 200)
    })
  }
}