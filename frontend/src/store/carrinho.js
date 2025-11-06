import { defineStore } from 'pinia'
import { useProdutoStore } from './produto'
import { pedidoService } from '../services/pedidoService'

export const useCarrinhoStore = defineStore('carrinho', {
  state: () => ({
    itens: JSON.parse(localStorage.getItem('carrinho') || '[]'),
    isLoading: false
  }),

  getters: {
    totalItens: (state) =>
      state.itens.reduce((total, item) => total + item.quantidade, 0),

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
      const produtoCompleto = produtoStore.getProdutoById(produto._id || produto.id)

      if (!produtoCompleto) {
        console.error('Produto não encontrado na store:', produto)
        throw new Error('Produto não encontrado')
      }

      // ✅ Garante que o estoque seja um número válido
      const estoqueAtual = Number(produtoCompleto.estoque) || 0
      if (estoqueAtual < quantidade) {
        throw new Error(`Estoque insuficiente. Disponível: ${estoqueAtual}`)
      }

      const itemExistente = this.itens.find(item =>
        item.produto._id === produto._id ||
        item.produto.id === produto.id
      )

      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + quantidade

        if (estoqueAtual < novaQuantidade) {
          throw new Error(`Estoque insuficiente. Disponível: ${estoqueAtual}`)
        }

        itemExistente.quantidade = novaQuantidade
      } else {
        // ✅ Garante que o produto seja armazenado com ID consistente
        this.itens.push({
          produto: { ...produtoCompleto, _id: produtoCompleto._id || produtoCompleto.id },
          quantidade
        })
      }

      this.salvarCarrinho()
    },

    removerItem(produtoId) {
      this.itens = this.itens.filter(item =>
        item.produto._id !== produtoId && item.produto.id !== produtoId
      )
      this.salvarCarrinho()
    },

    atualizarQuantidade(produtoId, quantidade) {
      const produtoStore = useProdutoStore()
      const produto = produtoStore.getProdutoById(produtoId)

      if (!produto) {
        console.error('Produto não encontrado ao atualizar quantidade:', produtoId)
        throw new Error('Produto não encontrado')
      }

      if (quantidade <= 0) {
        this.removerItem(produtoId)
        return
      }

      const estoqueAtual = Number(produto.estoque) || 0
      if (estoqueAtual < quantidade) {
        throw new Error(`Estoque insuficiente. Disponível: ${estoqueAtual}`)
      }

      const item = this.itens.find(
        item =>
          item.produto._id === produtoId || item.produto.id === produtoId
      )

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
        const produto = produtoStore.produtos.find(
          p => p._id === item.produto._id || p.id === item.produto.id
        )

        const estoqueAtual = Number(produto?.estoque) || 0
        if (!produto || estoqueAtual < item.quantidade) {
          itensIndisponiveis.push(item)
        }
      })

      return itensIndisponiveis
    }
  }
})
