import { defineStore } from 'pinia'
import { useProdutoStore } from './produto'
import { pedidoService } from '../services/pedidoService'

export const useCarrinhoStore = defineStore('carrinho', {
  state: () => ({
    itens: JSON.parse(localStorage.getItem('carrinho') || '[]'),
    isLoading: false
  }),

  getters: {
    totalItens: (state) => state.itens.reduce((total, item) => total + item.quantidade, 0),
    
    valorTotal: (state) => {
      return state.itens.reduce((total, item) => {
        return total + (item.produto.preco * item.quantidade)
      }, 0)
    },

    temItens: (state) => state.itens.length > 0
  },

  actions: {
    adicionarItem(produto, quantidade = 1) {
      const produtoStore = useProdutoStore()
      const produtoCompleto = produtoStore.getProdutoById(produto.id)
      
      if (!produtoCompleto) {
        throw new Error('Produto não encontrado')
      }

      if (produtoCompleto.estoque < quantidade) {
        throw new Error('Estoque insuficiente')
      }

      const itemExistente = this.itens.find(item => item.produto.id === produto.id)
      
      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + quantidade
        
        if (produtoCompleto.estoque < novaQuantidade) {
          throw new Error('Estoque insuficiente para a quantidade solicitada')
        }
        
        itemExistente.quantidade = novaQuantidade
      } else {
        this.itens.push({
          produto: produtoCompleto,
          quantidade
        })
      }
      
      this.salvarCarrinho()
    },

    removerItem(produtoId) {
      this.itens = this.itens.filter(item => item.produto.id !== produtoId)
      this.salvarCarrinho()
    },

    atualizarQuantidade(produtoId, quantidade) {
      const produtoStore = useProdutoStore()
      const produto = produtoStore.getProdutoById(produtoId)
      
      if (!produto) {
        throw new Error('Produto não encontrado')
      }

      if (quantidade <= 0) {
        this.removerItem(produtoId)
        return
      }

      if (produto.estoque < quantidade) {
        throw new Error('Estoque insuficiente')
      }

      const item = this.itens.find(item => item.produto.id === produtoId)
      if (item) {
        item.quantidade = quantidade
        this.salvarCarrinho()
      }
    },

    limparCarrinho() {
      this.itens = []
      this.salvarCarrinho()
    },

    salvarCarrinho() {
      localStorage.setItem('carrinho', JSON.stringify(this.itens))
    },

    verificarDisponibilidade() {
      const produtoStore = useProdutoStore()
      const itensIndisponiveis = []
      
      this.itens.forEach(item => {
        const produto = produtoStore.produtos.find(p => p.id === item.produto.id)
        if (!produto || produto.estoque < item.quantidade) {
          itensIndisponiveis.push(item)
        }
      })
      
      return itensIndisponiveis
    }
  }
})