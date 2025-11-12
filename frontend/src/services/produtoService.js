// frontend/src/services/produtoService.js
import api from './api'

export const produtoService = {
  // Listar todos os produtos
  async listar() {
    try {
      console.log('📦 Service: Buscando produtos...')
      const response = await api.get('/produtos')
      console.log('✅ Service: Produtos recebidos:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Service: Erro ao listar produtos:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Erro ao carregar produtos')
    }
  },

  // Buscar produto por ID
  async buscarPorId(id) {
    try {
      console.log('📦 Service: Buscando produto ID:', id)
      const response = await api.get(`/produtos/${id}`)
      console.log('✅ Service: Produto recebido:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Service: Erro ao buscar produto:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Erro ao buscar produto')
    }
  },

  // Criar novo produto
  async criar(produto) {
    try {
      console.log('📦 Service: Criando produto:', produto)
      
      // Verificar se o token existe
      const token = localStorage.getItem('token')
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não')
      
      if (!token) {
        throw new Error('Usuário não autenticado. Faça login novamente.')
      }
      
      const response = await api.post('/produtos', produto)
      console.log('✅ Service: Produto criado com sucesso:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Service: Erro ao criar produto:', error)
      console.error('❌ Detalhes do erro:', error.response?.data)
      console.error('❌ Status:', error.response?.status)
      
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.')
      } else if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para criar produtos.')
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao criar produto')
    }
  },

  // Atualizar produto
  async atualizar(id, dadosAtualizados) {
    try {
      console.log('📦 Service: Atualizando produto ID:', id, 'com dados:', dadosAtualizados)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Usuário não autenticado. Faça login novamente.')
      }
      
      const response = await api.put(`/produtos/${id}`, dadosAtualizados)
      console.log('✅ Service: Produto atualizado:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Service: Erro ao atualizar produto:', error.response?.data || error.message)
      
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.')
      } else if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para atualizar produtos.')
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao atualizar produto')
    }
  },

  // Excluir produto
  async excluir(id) {
    try {
      console.log('📦 Service: Excluindo produto ID:', id)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Usuário não autenticado. Faça login novamente.')
      }
      
      const response = await api.delete(`/produtos/${id}`)
      console.log('✅ Service: Produto excluído:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Service: Erro ao excluir produto:', error.response?.data || error.message)
      
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.')
      } else if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para excluir produtos.')
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao excluir produto')
    }
  },

  // Atualizar estoque
  async atualizarEstoque(id, novoEstoque) {
    try {
      console.log('📦 Service: Atualizando estoque do produto ID:', id, 'para:', novoEstoque)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Usuário não autenticado. Faça login novamente.')
      }
      
      const response = await api.patch(`/produtos/${id}/estoque`, { estoque: novoEstoque })
      console.log('✅ Service: Estoque atualizado:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Service: Erro ao atualizar estoque:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Erro ao atualizar estoque')
    }
  }
}