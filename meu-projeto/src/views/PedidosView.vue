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
            <h1 class="text-xl font-bold text-gray-900">Meus Pedidos</h1>
          </div>

          <div class="flex items-center space-x-4">
            <router-link to="/carrinho" class="relative p-2 text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M7 13h10m-10 0L7 13m10 0v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6"/>
              </svg>
            </router-link>
            <span class="text-sm text-gray-700">{{ user?.nome }}</span>
            <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">Sair</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
        <p class="text-red-600">{{ error }}</p>
        <button @click="carregarPedidos" class="mt-2 text-sm text-red-800 underline">
          Tentar novamente
        </button>
      </div>

      <!-- Sem Pedidos -->
      <div v-else-if="meusPedidos.length === 0" class="py-16 text-center">
        <svg class="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3 class="mb-2 text-xl font-medium text-gray-900">Nenhum pedido encontrado</h3>
        <p class="mb-6 text-gray-500">Você ainda não fez nenhum pedido na nossa loja.</p>
        <router-link to="/loja" class="btn-primary">
          Fazer Primeiro Pedido
        </router-link>
      </div>

      <!-- Lista de Pedidos -->
      <div v-else class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            Histórico de Pedidos ({{ meusPedidos.length }})
          </h2>
          <button @click="carregarPedidos" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Atualizar
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="pedido in meusPedidos"
            :key="pedido.id"
            class="transition-shadow cursor-pointer card hover:shadow-md"
            @click="selecionarPedido(pedido)"
          >
            <!-- Header do Pedido -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-900">Pedido #{{ pedido.id }}</h3>
                <p class="text-sm text-gray-500">
                  {{ formatarData(pedido.dataCreated) }}
                </p>
              </div>
              <div class="text-right">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(pedido.status)"
                >
                  {{ pedido.status }}
                </span>
                <p class="mt-1 text-lg font-semibold text-gray-900">
                  R$ {{ pedido.valorTotal.toFixed(2) }}
                </p>
              </div>
            </div>

            <!-- Itens do Pedido (resumo) -->
            <div class="pt-4 border-t">
              <p class="mb-2 text-sm text-gray-600">
                {{ pedido.itens.length }} {{ pedido.itens.length === 1 ? 'item' : 'itens' }}:
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="item in pedido.itens.slice(0, 3)"
                  :key="item.produtoId"
                  class="inline-flex items-center px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-md"
                >
                  {{ item.produto.nome }} ({{ item.quantidade }}x)
                </span>
                <span
                  v-if="pedido.itens.length > 3"
                  class="inline-flex items-center px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md"
                >
                  +{{ pedido.itens.length - 3 }} mais
                </span>
              </div>
            </div>

            <!-- Observações/Motivos -->
            <div v-if="pedido.observacoes || pedido.motivoRejeicao" class="pt-4 mt-4 border-t">
              <p class="text-sm font-medium text-gray-700">
                {{ pedido.status === 'Rejeitado' ? 'Motivo da rejeição:' : 'Observações:' }}
              </p>
              <p class="mt-1 text-sm text-gray-600">
                {{ pedido.motivoRejeicao || pedido.observacoes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Detalhes do Pedido -->
    <div v-if="pedidoSelecionado" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            Detalhes do Pedido #{{ pedidoSelecionado.id }}
          </h3>
          <button @click="fecharModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="p-6 space-y-6">
          <!-- Status e Data -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <p class="mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(pedidoSelecionado.status)"
                >
                  {{ pedidoSelecionado.status }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Data do Pedido</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ formatarData(pedidoSelecionado.dataCreated) }}
              </p>
            </div>
          </div>

          <!-- Itens -->
          <div>
            <label class="block mb-3 text-sm font-medium text-gray-700">Itens do Pedido</label>
            <div class="space-y-3">
              <div
                v-for="item in pedidoSelecionado.itens"
                :key="item.produtoId"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 13h6"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ item.produto.nome }}</p>
                    <p class="text-sm text-gray-500">Qtd: {{ item.quantidade }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">R$ {{ item.subtotal.toFixed(2) }}</p>
                  <p class="text-sm text-gray-500">R$ {{ item.precoUnitario.toFixed(2) }} cada</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="pt-4 border-t">
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-gray-900">Total do Pedido:</span>
              <span class="text-xl font-bold text-green-600">
                R$ {{ pedidoSelecionado.valorTotal.toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Observações/Motivos -->
          <div v-if="pedidoSelecionado.observacoes || pedidoSelecionado.motivoRejeicao" class="pt-4 border-t">
            <label class="block mb-2 text-sm font-medium text-gray-700">
              {{ pedidoSelecionado.status === 'Rejeitado' ? 'Motivo da Rejeição:' : 'Observações:' }}
            </label>
            <p class="p-3 text-sm text-gray-600 rounded-lg bg-gray-50">
              {{ pedidoSelecionado.motivoRejeicao || pedidoSelecionado.observacoes }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end p-6 space-x-3 border-t bg-gray-50">
          <button @click="fecharModal" class="btn-secondary">Fechar</button>
          <router-link
            v-if="pedidoSelecionado.status === 'Rejeitado'"
            to="/loja"
            class="btn-primary"
          >
            Fazer Novo Pedido
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
import { usePedidoStore } from '@/store/pedido'

export default defineComponent({
  name: 'PedidosView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const pedidoStore = usePedidoStore()

    const pedidoSelecionado = ref(null)

    // Computed
    const user = computed(() => authStore.user)
    const meusPedidos = computed(() => pedidoStore.meusPedidos)
    const isLoading = computed(() => pedidoStore.isLoading)
    const error = computed(() => pedidoStore.error)

    // Methods
    const carregarPedidos = async () => {
      await pedidoStore.carregarPedidos()
    }

    const selecionarPedido = (pedido) => {
      pedidoSelecionado.value = pedido
    }

    const fecharModal = () => {
      pedidoSelecionado.value = null
    }

    const formatarData = (dataISO) => {
      const data = new Date(dataISO)
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusClass = (status) => {
      const classes = {
        'Pendente de Aprovação': 'bg-yellow-100 text-yellow-800',
        'Aprovado': 'bg-green-100 text-green-800',
        'Rejeitado': 'bg-red-100 text-red-800',
        'Em Produção': 'bg-blue-100 text-blue-800',
        'Enviado': 'bg-purple-100 text-purple-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const logout = async () => {
      await authStore.logout()
      router.push('/')
    }

    // Lifecycle
    onMounted(() => {
      carregarPedidos()
    })

    return {
      user,
      meusPedidos,
      isLoading,
      error,
      pedidoSelecionado,
      carregarPedidos,
      selecionarPedido,
      fecharModal,
      formatarData,
      getStatusClass,
      logout
    }
  }
})
</script>