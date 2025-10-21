<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b shadow-sm">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/loja" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </router-link>
            <h1 class="text-xl font-bold text-gray-900">Carrinho de Compras</h1>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ user?.nome }}</span>
            <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">Sair</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      
      <!-- Carrinho Vazio -->
      <div v-if="!temItens" class="py-16 text-center">
        <svg class="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M7 13h10m-10 0L7 13m10 0v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6"/>
        </svg>
        <h3 class="mb-2 text-xl font-medium text-gray-900">Seu carrinho está vazio</h3>
        <p class="mb-6 text-gray-500">Adicione alguns produtos incríveis da nossa loja!</p>
        <router-link to="/loja" class="btn-primary">
          Continuar Comprando
        </router-link>
      </div>

      <!-- Carrinho com Itens -->
      <div v-else class="space-y-8">
        
        <!-- Lista de Itens -->
        <div class="card">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">
            Itens no Carrinho ({{ totalItens }})
          </h2>

          <div class="space-y-4">
            <div
              v-for="item in itens"
              :key="item.produto.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <!-- Produto Info -->
              <div class="flex items-center flex-1 space-x-4">
                <div class="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
                  <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 13h6"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.produto.nome }}</h3>
                  <p class="text-sm text-gray-500">{{ item.produto.descricao }}</p>
                  <p class="text-sm font-medium text-green-600">R$ {{ item.produto.preco.toFixed(2) }}</p>
                </div>
              </div>

              <!-- Quantidade -->
              <div class="flex items-center space-x-3">
                <label class="text-sm text-gray-700">Qtd:</label>
                <select
                  :value="item.quantidade"
                  @change="atualizarQuantidade(item.produto.id, parseInt($event.target.value))"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md"
                >
                  <option v-for="n in Math.min(item.produto.estoque + item.quantidade, 10)" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>

              <!-- Subtotal -->
              <div class="text-right min-w-[100px]">
                <p class="font-semibold text-gray-900">
                  R$ {{ (item.produto.preco * item.quantidade).toFixed(2) }}
                </p>
              </div>

              <!-- Remover -->
              <button
                @click="removerItem(item.produto.id)"
                class="ml-4 text-red-500 hover:text-red-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumo do Pedido -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          <!-- Ações -->
          <div class="space-y-4 lg:col-span-2">
            <button @click="limparCarrinho" class="btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Limpar Carrinho
            </button>
            
            <router-link to="/loja" class="inline-flex items-center btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Continuar Comprando
            </router-link>
          </div>

          <!-- Total e Finalizar -->
          <div class="card">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">Resumo do Pedido</h3>
            
            <div class="mb-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="text-gray-900">R$ {{ valorTotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Entrega:</span>
                <span class="text-gray-900">Grátis</span>
              </div>
              <hr class="my-2">
              <div class="flex justify-between font-semibold">
                <span>Total:</span>
                <span class="text-lg">R$ {{ valorTotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Validações -->
            <div v-if="itensIndisponiveis.length > 0" class="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
              <p class="text-sm font-medium text-red-600">Atenção:</p>
              <ul class="mt-1 space-y-1 text-sm text-red-600">
                <li v-for="item in itensIndisponiveis" :key="item.produto.id">
                  • {{ item.produto.nome }}: estoque insuficiente
                </li>
              </ul>
            </div>

            <button
              @click="finalizarPedido"
              :disabled="isProcessando || itensIndisponiveis.length > 0"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessando">Processando...</span>
              <span v-else>Finalizar Pedido</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Confirmação -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-white rounded-lg">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">Pedido Finalizado!</h3>
        <p class="mb-6 text-gray-600">
          Seu pedido foi enviado para aprovação. Você pode acompanhar o status na página "Meus Pedidos".
        </p>
        <div class="flex space-x-3">
          <router-link to="/meus-pedidos" class="flex-1 text-center btn-primary">
            Ver Meus Pedidos
          </router-link>
          <router-link to="/loja" class="flex-1 text-center btn-secondary">
            Nova Compra
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useCarrinhoStore } from '@/store/carrinho'
import { usePedidoStore } from '@/store/pedido'
import { useProdutoStore } from '@/store/produto'

export default defineComponent({
  name: 'CarrinhoView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const carrinhoStore = useCarrinhoStore()
    const pedidoStore = usePedidoStore()
    const produtoStore = useProdutoStore()

    const isProcessando = ref(false)
    const showModal = ref(false)

    // Computed
    const user = computed(() => authStore.user)
    const itens = computed(() => carrinhoStore.itens)
    const temItens = computed(() => carrinhoStore.temItens)
    const totalItens = computed(() => carrinhoStore.totalItens)
    const valorTotal = computed(() => carrinhoStore.valorTotal)
    
    const itensIndisponiveis = computed(() => carrinhoStore.verificarDisponibilidade())

    // Methods
    const atualizarQuantidade = (produtoId, quantidade) => {
      try {
        carrinhoStore.atualizarQuantidade(produtoId, quantidade)
      } catch (error) {
        alert(error.message)
      }
    }

    const removerItem = (produtoId) => {
      carrinhoStore.removerItem(produtoId)
    }

    const limparCarrinho = () => {
      if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        carrinhoStore.limparCarrinho()
      }
    }

    const finalizarPedido = async () => {
      if (itensIndisponiveis.value.length > 0) {
        return
      }

      isProcessando.value = true

      try {
        const dadosPedido = {
          itens: itens.value.map(item => ({
            produtoId: item.produto.id,
            produto: item.produto,
            quantidade: item.quantidade,
            precoUnitario: item.produto.preco,
            subtotal: item.produto.preco * item.quantidade
          })),
          valorTotal: valorTotal.value
        }

        const result = await pedidoStore.criarPedido(dadosPedido)

        if (result.success) {
          carrinhoStore.limparCarrinho()
          showModal.value = true
        } else {
          alert(result.error || 'Erro ao criar pedido')
        }
      } catch (error) {
        alert('Erro ao finalizar pedido: ' + error.message)
      } finally {
        isProcessando.value = false
      }
    }

    const logout = async () => {
      try {
        await authStore.logout()
        router.push('/')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        router.push('/')
      }
    }

    // Lifecycle
    onMounted(async () => {
      await produtoStore.carregarProdutos()
    })

    return {
      user,
      itens,
      temItens,
      totalItens,
      valorTotal,
      itensIndisponiveis,
      isProcessando,
      showModal,
      atualizarQuantidade,
      removerItem,
      limparCarrinho,
      finalizarPedido,
      logout
    }
  }
})
</script>