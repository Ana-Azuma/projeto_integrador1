<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b shadow-sm">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-bold text-gray-900">
            <img src="/Imagens/logo.png" alt="Logo" class="inline w-10 h-10 mr-2">
            Painel Administrativo
          </h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ user?.nome }}</span>
            <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">Sair</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <nav class="flex space-x-8 border-b">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.id
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.nome }}
        </button>
      </nav>
    </div>

    <!-- Content -->
    <main class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      
      <!-- Dashboard -->
      <div v-if="activeTab === 'dashboard'" class="space-y-8">
        <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>

        <!-- Estatísticas -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="card" v-for="stat in estatCards" :key="stat.label">
            <div class="flex items-center">
              <div class="flex-shrink-0" v-html="stat.icon"></div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.label }}</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stat.value }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Pedidos Pendentes -->
        <div v-if="pedidosPendentes.length > 0" class="card">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">
            Pedidos Aguardando Aprovação ({{ pedidosPendentes.length }})
          </h3>
          <div class="space-y-3">
            <div
              v-for="pedido in pedidosPendentes.slice(0, 5)"
              :key="pedido._id"
              class="flex items-center justify-between p-3 border border-yellow-200 rounded-lg bg-yellow-50"
            >
              <div>
                <p class="font-medium text-gray-900">Pedido #{{ pedido._id }}</p>
                <p class="text-sm text-gray-600">{{ pedido.clienteNome }} - R$ {{ pedido.valorTotal.toFixed(2) }}</p>
              </div>
              <button
                @click="activeTab = 'pedidos'"
                class="text-sm btn-primary"
              >
                Revisar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gerenciar Pedidos -->
      <div v-if="activeTab === 'pedidos'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h2>
          <button @click="carregarPedidos" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Atualizar
          </button>
        </div>

        <div class="card">
          <select v-model="filtroStatus" class="form-input w-full md:w-1/3">
            <option value="">Todos os Status</option>
            <option value="Pendente de Aprovação">Pendentes</option>
            <option value="Aprovado">Aprovados</option>
            <option value="Rejeitado">Rejeitados</option>
            <option value="Em Produção">Em Produção</option>
            <option value="Enviado">Enviados</option>
          </select>
        </div>

        <!-- Lista de Pedidos -->
        <div class="space-y-4">
          <div
            v-for="pedido in pedidosFiltrados"
            :key="pedido._id"
            class="transition-shadow card hover:shadow-md"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-900">Pedido #{{ pedido._id }}</h3>
                <p class="text-sm text-gray-500">Cliente: {{ pedido.clienteNome }}</p>
                <p class="text-sm text-gray-500">{{ formatarData(pedido.createdAt) }}</p>
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

            <!-- Itens -->
            <div class="pt-4 mb-4 border-t">
              <p class="mb-2 text-sm text-gray-600">Itens:</p>
              <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div
                  v-for="item in pedido.itens"
                  :key="item.produto?._id || item.produtoId"
                  class="text-sm text-gray-800"
                >
                  {{ item.produto?.nome || 'Produto' }} - {{ item.quantidade }}x 
                  (R$ {{ (item.produto?.preco * item.quantidade).toFixed(2) }})
                </div>
              </div>
            </div>

            <!-- Botões -->
            <div v-if="pedido.status === 'Pendente de Aprovação'" class="flex pt-4 space-x-3 border-t">
              <button @click="aprovarPedido(pedido)" class="flex-1 btn-success">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Aprovar
              </button>
              <button @click="rejeitarPedido(pedido)" class="flex-1 btn-danger">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Rejeitar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Aprovação -->
    <div v-if="showAprovacaoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-white rounded-lg">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">
          Aprovar Pedido #{{ pedidoParaAprovar?._id }}
        </h3>
        <form @submit.prevent="confirmarAprovacao" class="space-y-4">
          <textarea
            v-model="observacoesAprovacao"
            class="form-input"
            rows="3"
            placeholder="Observações sobre a aprovação..."
          ></textarea>
          <div class="flex space-x-3">
            <button type="button" @click="fecharAprovacaoModal" class="flex-1 btn-secondary">Cancelar</button>
            <button type="submit" class="flex-1 btn-success">Confirmar Aprovação</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Rejeição -->
    <div v-if="showRejeicaoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-white rounded-lg">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">
          Rejeitar Pedido #{{ pedidoParaRejeitar?._id }}
        </h3>
        <form @submit.prevent="confirmarRejeicao" class="space-y-4">
          <textarea
            v-model="motivoRejeicao"
            required
            class="form-input"
            rows="3"
            placeholder="Motivo da rejeição..."
          ></textarea>
          <div class="flex space-x-3">
            <button type="button" @click="fecharRejeicaoModal" class="flex-1 btn-secondary">Cancelar</button>
            <button type="submit" class="flex-1 btn-danger">Confirmar Rejeição</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useProdutoStore } from '@/store/produto'
import { usePedidoStore } from '@/store/pedido'

const authStore = useAuthStore()
const produtoStore = useProdutoStore()
const pedidoStore = usePedidoStore()

const user = computed(() => authStore.user)
const produtos = computed(() => produtoStore.produtos)
const pedidos = computed(() => pedidoStore.pedidos)
const pedidosPendentes = computed(() => pedidoStore.pedidosPorStatus('Pendente de Aprovação'))
const estatisticas = computed(() => pedidoStore.estatisticasPedidos)

const activeTab = ref('dashboard')
const filtroStatus = ref('')
const showAprovacaoModal = ref(false)
const showRejeicaoModal = ref(false)
const observacoesAprovacao = ref('')
const motivoRejeicao = ref('')
const pedidoParaAprovar = ref(null)
const pedidoParaRejeitar = ref(null)

const estatCards = computed(() => [
  { label: 'Pendentes', value: estatisticas.value.pendentes, icon: '<svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { label: 'Aprovados', value: estatisticas.value.aprovados, icon: '<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { label: 'Em Produção', value: estatisticas.value.emProducao, icon: '<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
  { label: 'Produtos', value: produtos.value.length, icon: '<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 13h6"/></svg>' }
])

const pedidosFiltrados = computed(() =>
  !filtroStatus.value
    ? pedidos.value
    : pedidos.value.filter(p => p.status === filtroStatus.value)
)

const carregarPedidos = () => pedidoStore.carregarPedidos()

const aprovarPedido = (pedido) => {
  pedidoParaAprovar.value = pedido
  showAprovacaoModal.value = true
}

const rejeitarPedido = (pedido) => {
  pedidoParaRejeitar.value = pedido
  showRejeicaoModal.value = true
}

const confirmarAprovacao = async () => {
  await pedidoStore.aprovarPedido(pedidoParaAprovar.value._id, observacoesAprovacao.value)
  showAprovacaoModal.value = false
}

const confirmarRejeicao = async () => {
  await pedidoStore.rejeitarPedido(pedidoParaRejeitar.value._id, motivoRejeicao.value)
  showRejeicaoModal.value = false
}

const fecharAprovacaoModal = () => showAprovacaoModal.value = false
const fecharRejeicaoModal = () => showRejeicaoModal.value = false

const formatarData = (data) => new Date(data).toLocaleString('pt-BR')
const getStatusClass = (status) => ({
  'Pendente de Aprovação': 'bg-yellow-100 text-yellow-800',
  'Aprovado': 'bg-green-100 text-green-800',
  'Rejeitado': 'bg-red-100 text-red-800',
  'Em Produção': 'bg-blue-100 text-blue-800',
  'Enviado': 'bg-purple-100 text-purple-800'
}[status] || 'bg-gray-100 text-gray-800')

const logout = () => {
  localStorage.clear()
  window.location.href = '/'
}

onMounted(() => pedidoStore.carregarPedidos())
</script>
