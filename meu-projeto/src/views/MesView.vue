<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b shadow-sm">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-bold text-gray-900">Sistema MES - Smart Factory 4.0</h1>
          
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div 
                class="w-3 h-3 rounded-full"
                :class="statusPlanta === 'Operacional' ? 'bg-green-500' : 'bg-red-500'"
              ></div>
              <span class="text-sm text-gray-700">{{ statusPlanta }}</span>
            </div>
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
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.nome }}
        </button>
      </nav>
    </div>

    <!-- Content -->
    <main class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      
      <!-- Dashboard da Planta -->
      <div v-if="activeTab === 'dashboard'" class="space-y-8">
        <h2 class="text-2xl font-bold text-gray-900">Dashboard da Planta</h2>
        
        <!-- Indicadores em Tempo Real -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Temperatura</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ variaveisPlanta.temperatura?.toFixed(1) }}°C</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pressão</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ variaveisPlanta.pressao?.toFixed(1) }} bar</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Velocidade</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ variaveisPlanta.velocidade?.toFixed(0) }} RPM</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div 
                  class="flex items-center justify-center w-8 h-8 rounded-full"
                  :class="statusPlanta === 'Operacional' ? 'bg-green-100' : 'bg-red-100'"
                >
                  <div 
                    class="w-3 h-3 rounded-full"
                    :class="statusPlanta === 'Operacional' ? 'bg-green-600' : 'bg-red-600'"
                  ></div>
                </div>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Status</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ statusPlanta }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Produção Atual -->
        <div v-if="variaveisPlanta.producaoAtual" class="card">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Produção em Andamento</h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ordem de Produção Ativa:</p>
              <p class="text-lg font-medium text-gray-900">#{{ variaveisPlanta.producaoAtual }}</p>
            </div>
            <button 
              @click="pararProducao"
              class="btn-danger"
            >
              Parar Produção
            </button>
          </div>
        </div>

        <!-- Última Atualização -->
        <div class="text-sm text-center text-gray-500">
          Última atualização: {{ formatarData(variaveisPlanta.ultimaAtualizacao) }}
          <button @click="atualizarVariaveis" class="ml-2 text-blue-600 hover:text-blue-800">
            Atualizar
          </button>
        </div>
      </div>

      <!-- Ordens de Produção -->
      <div v-if="activeTab === 'ordens'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Ordens de Produção</h2>
          <button @click="carregarOrdens" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Atualizar
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoadingOrdens" class="flex justify-center py-12">
          <div class="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>

        <!-- Lista de Ordens -->
        <div v-else class="space-y-4">
          <div
            v-for="ordem in ordensProducao"
            :key="ordem.id"
            class="transition-shadow card hover:shadow-md"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-900">Ordem #{{ ordem.id }}</h3>
                <p class="text-sm text-gray-500">Pedido #{{ ordem.pedidoId }}</p>
                <p class="text-sm text-gray-500">{{ formatarData(ordem.dataCreated) }}</p>
              </div>
              <div class="text-right">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusOrdemClass(ordem.status)"
                >
                  {{ ordem.status }}
                </span>
                <div v-if="ordem.progresso !== undefined" class="mt-2">
                  <div class="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      class="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                      :style="{ width: ordem.progresso + '%' }"
                    ></div>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">{{ ordem.progresso }}%</p>
                </div>
              </div>
            </div>

            <!-- Itens da Ordem -->
            <div class="pt-4 mb-4 border-t">
              <p class="mb-2 text-sm text-gray-600">Itens para produzir:</p>
              <div class="space-y-2">
                <div
                  v-for="item in ordem.itens"
                  :key="item.produtoId"
                  class="flex justify-between text-sm"
                >
                  <span class="text-gray-800">{{ item.produto.nome }}</span>
                  <span class="text-gray-600">{{ item.quantidade }}x</span>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex pt-4 space-x-3 border-t">
              <button
                v-if="ordem.status === 'Pendente'"
                @click="iniciarOrdem(ordem)"
                class="flex-1 btn-primary"
              >
                Iniciar Produção
              </button>
              <button
                v-if="ordem.status === 'Em Produção'"
                @click="concluirOrdem(ordem)"
                class="flex-1 btn-success"
              >
                Concluir
              </button>
              <button
                v-if="ordem.status === 'Em Produção'"
                @click="pararOrdem(ordem)"
                class="flex-1 btn-secondary"
              >
                Pausar
              </button>
            </div>
          </div>

          <!-- Nenhuma ordem -->
          <div v-if="ordensProducao.length === 0" class="py-12 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h3 class="mb-2 text-lg font-medium text-gray-900">Nenhuma ordem de produção</h3>
            <p class="text-gray-500">Aguardando pedidos aprovados pelo sistema.</p>
          </div>
        </div>
      </div>

      <!-- Controle de Estoque -->
      <div v-if="activeTab === 'estoque'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Controle de Estoque</h2>
          <button @click="carregarEstoque" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Atualizar
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoadingEstoque" class="flex justify-center py-12">
          <div class="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>

        <!-- Estoque -->
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="item in estoqueItens"
            :key="item.produtoId"
            class="card"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900">{{ getProdutoNome(item.produtoId) }}</h3>
              <div 
                class="w-3 h-3 rounded-full"
                :class="item.disponivel > 10 ? 'bg-green-500' : item.disponivel > 0 ? 'bg-yellow-500' : 'bg-red-500'"
              ></div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Disponível:</span>
                <span class="text-sm font-medium text-gray-900">{{ item.disponivel }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Bloqueado:</span>
                <span class="text-sm font-medium text-orange-600">{{ item.bloqueado }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t">
                <span class="text-sm font-medium text-gray-700">Total:</span>
                <span class="text-sm font-bold text-gray-900">{{ item.disponivel + item.bloqueado }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useProdutoStore } from '@/store/produto'
import { mesService } from '@/services/mesService'

export default defineComponent({
  name: 'MesView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const produtoStore = useProdutoStore()

    // Estados
    const activeTab = ref('dashboard')
    const variaveisPlanta = ref({
      temperatura: 0,
      pressao: 0,
      velocidade: 0,
      status: 'Parada',
      producaoAtual: 0,
      ultimaAtualizacao: new Date().toISOString()
    })
    const ordensProducao = ref([])
    const estoqueItens = ref([])
    const isLoadingOrdens = ref(false)
    const isLoadingEstoque = ref(false)
    const intervalId = ref(null)

    // Tabs
    const tabs = ref([
      { id: 'dashboard', nome: 'Dashboard' },
      { id: 'ordens', nome: 'Ordens de Produção' },
      { id: 'estoque', nome: 'Estoque' }
    ])

    // Computed
    const user = computed(() => authStore.user)
    const produtos = computed(() => produtoStore.produtos)
    const statusPlanta = computed(() => variaveisPlanta.value.status)

    // Methods
    const atualizarVariaveis = async () => {
      try {
        const dados = await mesService.lerVariaveisPlanta()
        variaveisPlanta.value = dados
      } catch (error) {
        console.error('Erro ao atualizar variáveis da planta:', error)
      }
    }

    const carregarOrdens = async () => {
      isLoadingOrdens.value = true
      try {
        ordensProducao.value = await mesService.listarOrdensProducao()
      } catch (error) {
        console.error('Erro ao carregar ordens:', error)
      } finally {
        isLoadingOrdens.value = false
      }
    }

    const carregarEstoque = async () => {
      isLoadingEstoque.value = true
      try {
        estoqueItens.value = await mesService.consultarEstoque()
      } catch (error) {
        console.error('Erro ao carregar estoque:', error)
      } finally {
        isLoadingEstoque.value = false
      }
    }

    const iniciarOrdem = async (ordem) => {
      try {
        await mesService.iniciarProducao(ordem.id, {
          temperatura: 25,
          velocidade: 85,
          pressao: 1.2
        })
        
        // Simular progresso da produção
        simularProgressoProducao(ordem.id)
        
        await carregarOrdens()
        await atualizarVariaveis()
      } catch (error) {
        alert('Erro ao iniciar produção: ' + error.message)
      }
    }

    const concluirOrdem = async (ordem) => {
      try {
        await mesService.pararProducao(ordem.id, 'Concluída')
        await carregarOrdens()
        await atualizarVariaveis()
      } catch (error) {
        alert('Erro ao concluir ordem: ' + error.message)
      }
    }

    const pararOrdem = async (ordem) => {
      try {
        await mesService.pararProducao(ordem.id, 'Pausada pelo operador')
        await carregarOrdens()
        await atualizarVariaveis()
      } catch (error) {
        alert('Erro ao parar ordem: ' + error.message)
      }
    }

    const pararProducao = async () => {
      if (confirm('Tem certeza que deseja parar a produção atual?')) {
        try {
          await mesService.pararProducao(variaveisPlanta.value.producaoAtual, 'Parada manual')
          await atualizarVariaveis()
          await carregarOrdens()
        } catch (error) {
          alert('Erro ao parar produção: ' + error.message)
        }
      }
    }

    const simularProgressoProducao = (ordemId) => {
      let progresso = 0
      const intervalo = setInterval(async () => {
        progresso += Math.random() * 10
        
        if (progresso >= 100) {
          progresso = 100
          clearInterval(intervalo)
          
          // Concluir automaticamente
          setTimeout(async () => {
            await mesService.atualizarStatusOrdem(ordemId, 'Concluída', { progresso: 100 })
            await carregarOrdens()
            await atualizarVariaveis()
          }, 2000)
        }
        
        await mesService.atualizarStatusOrdem(ordemId, 'Em Produção', { progresso: Math.floor(progresso) })
        await carregarOrdens()
      }, 3000) // Atualizar a cada 3 segundos
    }

    const getProdutoNome = (produtoId) => {
      const produto = produtos.value.find(p => p.id === produtoId)
      return produto ? produto.nome : `Produto ${produtoId}`
    }

    const getStatusOrdemClass = (status) => {
      const classes = {
        'Pendente': 'bg-yellow-100 text-yellow-800',
        'Em Produção': 'bg-blue-100 text-blue-800',
        'Concluída': 'bg-green-100 text-green-800',
        'Parada': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
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

    const iniciarAtualizacaoAutomatica = () => {
      // Atualizar variáveis da planta a cada 5 segundos
      intervalId.value = setInterval(atualizarVariaveis, 5000)
    }

    const pararAtualizacaoAutomatica = () => {
      if (intervalId.value) {
        clearInterval(intervalId.value)
        intervalId.value = null
      }
    }

    const logout = async () => {
      await authStore.logout()
      router.push('/')
    }

    // Lifecycle
    onMounted(async () => {
      await produtoStore.carregarProdutos()
      await atualizarVariaveis()
      await carregarOrdens()
      await carregarEstoque()
      iniciarAtualizacaoAutomatica()
    })

    onUnmounted(() => {
      pararAtualizacaoAutomatica()
    })

    return {
      user,
      activeTab,
      tabs,
      variaveisPlanta,
      statusPlanta,
      ordensProducao,
      estoqueItens,
      isLoadingOrdens,
      isLoadingEstoque,
      produtos,
      atualizarVariaveis,
      carregarOrdens,
      carregarEstoque,
      iniciarOrdem,
      concluirOrdem,
      pararOrdem,
      pararProducao,
      getProdutoNome,
      getStatusOrdemClass,
      formatarData,
      logout
    }
  }
})
</script>