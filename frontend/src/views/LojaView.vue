<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b shadow-sm">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            
            <h1 class=" flex items-center mb-2 text-3xl font-bold">
              <img src="/Imagens/logo.png" alt="Logo" class="inline w-10 h-10 mr-2">
                Dionísio Sucos
            </h1>
          </div>

          <!-- Navigation -->
          <nav class="hidden space-x-8 md:flex">
            <router-link to="/loja" class="font-medium text-orange-600">Produtos</router-link>
            <router-link to="/meus-pedidos" class="text-gray-500 hover:text-gray-800">Meus Pedidos</router-link>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Carrinho -->
            <router-link to="/carrinho" class="relative p-2 text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M7 13h10m-10 0L7 13m10 0v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6"/>
              </svg>
              <span v-if="totalItensCarrinho > 0" class="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                {{ totalItensCarrinho }}
              </span>
            </router-link>

            <!-- User -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700">{{ user?.nome }}</span>
              <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">Sair</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="p-8 mb-8 rounded-lg bg-gradient-to-r from-orange-600 to-orange-200">
        <div class="text-white">
          <h2 class="mb-2 text-3xl font-bold">Dionísio Sucos</h2>
          <p class="text-blue-100">Produtos frescos direto da nossa planta automatizada</p>
        </div>
      </div>

      <!-- Produtos -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Nossos Produtos</h3>
          <button @click="carregarProdutos" class="btn-secondary ">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Atualizar
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
          <p class="text-red-600">{{ error }}</p>
        </div>

        <!-- Grid de Produtos -->
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="produto in produtosDisponiveis"
            :key="produto.id"
            class="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
          >
            <!-- Imagem do Produto -->
            <div class="flex items-center justify-center h-48 bg-gradient-to-br from-orange-100 to-orange-200">
              <svg class="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 13h6"/>
              </svg>
            </div>

            <!-- Informações do Produto -->
            <div class="p-4">
              <h4 class="mb-1 font-semibold text-gray-900">{{ produto.nome }}</h4>
              <p class="mb-3 text-sm text-gray-600">{{ produto.descricao }}</p>
              
              <div class="flex items-center justify-between mb-3">
                <span class="text-lg font-bold text-green-600">
                  R$ {{ produto.preco.toFixed(2) }}
                </span>
                <span class="text-sm text-gray-500">
                  Estoque: {{ produto.estoque }}
                </span>
              </div>

              <!-- Quantidade e Adicionar - LIMITE MÁXIMO 3 UNIDADES -->
              <div class="flex items-center space-x-2">
                <select v-model="quantidades[produto.id]" class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md">
                  <option v-for="n in Math.min(produto.estoque, 3)" :key="n" :value="n">{{ n }}</option>
                </select>
                <button
                  @click="adicionarAoCarrinho(produto)"
                  :disabled="produto.estoque === 0"
                  class="text-sm btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Adicionar
                </button>
              </div>
              
              <!-- Aviso de limite -->
              <p class="mt-2 text-xs text-gray-500 text-center">
                Limite: 3 unidades por produto
              </p>
            </div>
          </div>
        </div>

        <!-- Nenhum produto disponível -->
        <div v-if="!isLoading && !error && produtosDisponiveis.length === 0" class="py-12 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m-4 0h4"/>
          </svg>
          <h3 class="mb-2 text-lg font-medium text-gray-900">Nenhum produto disponível</h3>
          <p class="text-gray-500">Todos os produtos estão temporariamente fora de estoque.</p>
        </div>
      </div>
    </main>

    <!-- Toast para feedback -->
    <div
      v-if="showToast"
      class="fixed px-6 py-3 text-white transition-transform duration-300 transform bg-green-500 rounded-lg shadow-lg bottom-4 right-4"
      :class="{ 'translate-y-0': showToast, 'translate-y-full': !showToast }"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useProdutoStore } from '@/store/produto'
import { useCarrinhoStore } from '@/store/carrinho'

export default defineComponent({
  name: 'LojaView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const produtoStore = useProdutoStore()
    const carrinhoStore = useCarrinhoStore()

    const quantidades = ref({})
    const showToast = ref(false)
    const toastMessage = ref('')

    // Computed
    const user = computed(() => authStore.user)
    const produtos = computed(() => produtoStore.produtos)
    const produtosDisponiveis = computed(() => produtoStore.produtosDisponiveis)
    const isLoading = computed(() => produtoStore.isLoading)
    const error = computed(() => produtoStore.error)
    const totalItensCarrinho = computed(() => carrinhoStore.totalItens)

    // Methods
    const carregarProdutos = async () => {
      await produtoStore.carregarProdutos()
      // Inicializar quantidades
      produtos.value.forEach(produto => {
        quantidades.value[produto.id] = 1
      })
    }

    const adicionarAoCarrinho = (produto) => {
      try {
        const quantidade = quantidades.value[produto.id] || 1
        
        // VALIDAÇÃO: Máximo 3 unidades
        if (quantidade > 3) {
          showToastMessage('Você pode adicionar no máximo 3 unidades por produto!', 'error')
          return
        }
        
        carrinhoStore.adicionarItem(produto, quantidade)
        showToastMessage(`${produto.nome} adicionado ao carrinho!`)
      } catch (error) {
        showToastMessage(error.message, 'error')
      }
    }

    const showToastMessage = (message, type = 'success') => {
      toastMessage.value = message
      showToast.value = true
      
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    }

    const logout = async () => {
      await authStore.logout()
      router.push('/')
    }

    // Lifecycle
    onMounted(() => {
      carregarProdutos()
    })

    return {
      user,
      produtos,
      produtosDisponiveis,
      isLoading,
      error,
      quantidades,
      totalItensCarrinho,
      showToast,
      toastMessage,
      carregarProdutos,
      adicionarAoCarrinho,
      logout
    }
  }
})
</script>