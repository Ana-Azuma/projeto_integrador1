import { defineStore } from 'pinia'
import { produtoService } from '../services/produtoService'

export const useProdutoStore = defineStore('produto', {
  state: () => ({
    produtos: [],
    isLoading: false,
    error: null
  }),

  getters: {
    produtosDisponiveis: (state) => state.produtos.filter(p => p.estoque >= 0),
    getProdutoById: (state) => (id) => state.produtos.find(p => p.id === id)
  },

  actions: {
    async carregarProdutos() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('Carregando produtos...')
        this.produtos = await produtoService.listar()
        console.log('Produtos carregados na store:', this.produtos)
      } catch (error) {
        this.error = error.message
        console.error('Erro ao carregar produtos:', error)
      } finally {
        this.isLoading = false
      }
    },

    async criarProduto(produto) {
      this.isLoading = true
      
      try {
        console.log('Criando produto:', produto)
        const novoProduto = await produtoService.criar(produto)
        console.log('Produto criado com sucesso:', novoProduto)
        
        // Adicionar à lista local
        this.produtos.push(novoProduto)
        console.log('Lista de produtos atualizada:', this.produtos)
        
        return { success: true, produto: novoProduto }
      } catch (error) {
        this.error = error.message
        console.error('Erro ao criar produto:', error)
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async atualizarProduto(id, dadosAtualizados) {
      this.isLoading = true
      
      try {
        console.log('Atualizando produto ID:', id, 'com dados:', dadosAtualizados)
        const produtoAtualizado = await produtoService.atualizar(id, dadosAtualizados)
        console.log('Produto atualizado no service:', produtoAtualizado)
        
        // Encontrar e atualizar na lista local
        const index = this.produtos.findIndex(p => p.id === parseInt(id))
        console.log('Índice do produto na lista:', index)
        
        if (index !== -1) {
          // Substituir completamente o produto
          this.produtos[index] = { ...produtoAtualizado }
          console.log('Produto atualizado na store:', this.produtos[index])
          console.log('Lista completa após atualização:', this.produtos)
        } else {
          console.warn('Produto não encontrado na lista local para atualização')
          // Recarregar todos os produtos se não encontrou
          await this.carregarProdutos()
        }
        
        return { success: true, produto: produtoAtualizado }
      } catch (error) {
        this.error = error.message
        console.error('Erro ao atualizar produto:', error)
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async excluirProduto(id) {
      this.isLoading = true
      
      try {
        console.log('Excluindo produto ID:', id)
        await produtoService.excluir(id)
        
        // Remover da lista local
        const index = this.produtos.findIndex(p => p.id === parseInt(id))
        if (index !== -1) {
          this.produtos.splice(index, 1)
          console.log('Produto removido da lista. Lista atualizada:', this.produtos)
        }
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        console.error('Erro ao excluir produto:', error)
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async atualizarEstoque(id, novaQuantidade) {
      try {
        console.log('Atualizando estoque do produto ID:', id, 'para:', novaQuantidade)
        const produto = this.getProdutoById(parseInt(id))
        
        if (produto) {
          const novoEstoque = Math.max(0, produto.estoque + novaQuantidade) // Evitar estoque negativo
          const produtoAtualizado = await produtoService.atualizarEstoque(id, novoEstoque)
          
          // Atualizar na store
          const index = this.produtos.findIndex(p => p.id === parseInt(id))
          if (index !== -1) {
            this.produtos[index] = { ...this.produtos[index], estoque: novoEstoque }
            console.log('Estoque atualizado na store:', this.produtos[index])
          }
          
          return produtoAtualizado
        } else {
          throw new Error('Produto não encontrado')
        }
      } catch (error) {
        console.error('Erro ao atualizar estoque:', error)
        throw error
      }
    },

    // Método para forçar atualização dos dados
    async recarregarProdutos() {
      console.log('Forçando recarregamento dos produtos...')
      await this.carregarProdutos()
    },

    clearError() {
      this.error = null
    }
  }
})