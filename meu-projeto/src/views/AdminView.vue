<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b shadow-sm">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-bold text-gray-900">Painel Administrativo</h1>
          
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
      
      <!-- Dashboard -->
      <div v-if="activeTab === 'dashboard'" class="space-y-8">
        <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
        
        <!-- Estatísticas -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pedidos Pendentes</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ estatisticas.pendentes }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pedidos Aprovados</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ estatisticas.aprovados }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Em Produção</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ estatisticas.emProducao }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 13h6"/>
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total de Produtos</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ produtos.length }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Pedidos Pendentes Urgentes -->
        <div v-if="pedidosPendentes.length > 0" class="card">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">
            Pedidos Aguardando Aprovação ({{ pedidosPendentes.length }})
          </h3>
          <div class="space-y-3">
            <div
              v-for="pedido in pedidosPendentes.slice(0, 5)"
              :key="pedido.id"
              class="flex items-center justify-between p-3 border border-yellow-200 rounded-lg bg-yellow-50"
            >
              <div>
                <p class="font-medium text-gray-900">Pedido #{{ pedido.id }}</p>
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

        <!-- Filtros -->
        <div class="card">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <select v-model="filtroStatus" class="form-input">
              <option value="">Todos os Status</option>
              <option value="Pendente de Aprovação">Pendentes</option>
              <option value="Aprovado">Aprovados</option>
              <option value="Rejeitado">Rejeitados</option>
              <option value="Em Produção">Em Produção</option>
              <option value="Enviado">Enviados</option>
            </select>
          </div>
        </div>

        <!-- Lista de Pedidos -->
        <div class="space-y-4">
          <div
            v-for="pedido in pedidosFiltrados"
            :key="pedido.id"
            class="transition-shadow card hover:shadow-md"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-900">Pedido #{{ pedido.id }}</h3>
                <p class="text-sm text-gray-500">Cliente: {{ pedido.clienteNome }}</p>
                <p class="text-sm text-gray-500">{{ formatarData(pedido.dataCreated) }}</p>
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

            <!-- Itens do Pedido -->
            <div class="pt-4 mb-4 border-t">
              <p class="mb-2 text-sm text-gray-600">Itens:</p>
              <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div
                  v-for="item in pedido.itens"
                  :key="item.produtoId"
                  class="text-sm text-gray-800"
                >
                  {{ item.produto.nome }} - {{ item.quantidade }}x (R$ {{ item.subtotal.toFixed(2) }})
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div v-if="pedido.status === 'Pendente de Aprovação'" class="flex pt-4 space-x-3 border-t">
              <button
                @click="aprovarPedido(pedido)"
                class="flex-1 btn-success"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Aprovar
              </button>
              <button
                @click="rejeitarPedido(pedido)"
                class="flex-1 btn-danger"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Rejeitar
              </button>
            </div>

            <!-- Observações existentes -->
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

      <!-- Gerenciar Produtos -->
      <div v-if="activeTab === 'produtos'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
          <button @click="novoProduto" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Novo Produto
          </button>
        </div>

        <!-- Lista de Produtos -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="produto in produtos"
            :key="produto.id"
            class="card"
          >
            <!-- Foto do produto -->
            <div class="flex items-center justify-center w-full h-32 mb-4 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
              <img 
                v-if="produto.foto" 
                :src="produto.foto" 
                :alt="produto.nome"
                class="object-cover w-full h-full rounded-lg"
              />
              <svg v-else class="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 13h6"/>
              </svg>
            </div>

            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ produto.nome }}</h3>
                <p class="mt-1 text-sm text-gray-600">{{ produto.descricao }}</p>
              </div>
              <div class="flex ml-4 space-x-2">
                <button
                  @click="editarProduto(produto)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button
                  @click="excluirProduto(produto)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Preço:</span>
                <span class="text-sm font-medium text-green-600">R$ {{ produto.preco.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Estoque:</span>
                <span 
                  class="text-sm font-medium"
                  :class="produto.estoque > 10 ? 'text-green-600' : produto.estoque > 0 ? 'text-yellow-600' : 'text-red-600'"
                >
                  {{ produto.estoque }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Produto -->
    <div v-if="showProdutoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">
          {{ editandoProduto ? 'Editar Produto' : 'Novo Produto' }}
        </h3>
        
        <form @submit.prevent="salvarProduto" class="space-y-4">
          <!-- Upload de Foto -->
          <div>
            <label class="form-label">Foto do Produto</label>
            
            <!-- Preview da foto -->
            <div v-if="produtoForm.foto" class="mb-3">
              <img 
                :src="produtoForm.foto" 
                alt="Preview" 
                class="object-cover w-32 h-32 border border-gray-300 rounded-lg"
              />
              <button 
                type="button" 
                @click="removerFoto"
                class="mt-1 text-sm text-red-600 hover:text-red-800"
              >
                Remover foto
              </button>
            </div>
            
            <!-- Input de arquivo -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="mt-1 text-xs text-gray-500">Formatos aceitos: JPG, PNG, GIF (máx. 2MB)</p>
          </div>

          <div>
            <label class="form-label">Nome</label>
            <input
              v-model="produtoForm.nome"
              type="text"
              required
              class="form-input"
              placeholder="Nome do produto"
            />
          </div>

          <div>
            <label class="form-label">Descrição</label>
            <textarea
              v-model="produtoForm.descricao"
              required
              class="form-input"
              rows="3"
              placeholder="Descrição do produto"
            ></textarea>
          </div>

          <div>
            <label class="form-label">Preço (R$)</label>
            <input
              v-model="produtoForm.preco"
              type="number"
              step="0.01"
              min="0"
              required
              class="form-input"
              placeholder="0,00"
            />
          </div>

          <!-- CAMPO DE ESTOQUE REMOVIDO -->

          <div class="flex pt-4 space-x-3">
            <button type="button" @click="fecharProdutoModal" class="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="flex-1 btn-primary">
              {{ editandoProduto ? 'Atualizar' : 'Criar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Aprovação -->
    <div v-if="showAprovacaoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-white rounded-lg">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">
          Aprovar Pedido #{{ pedidoParaAprovar?.id }}
        </h3>
        
        <form @submit.prevent="confirmarAprovacao" class="space-y-4">
          <div>
            <label class="form-label">Observações (opcional)</label>
            <textarea
              v-model="observacoesAprovacao"
              class="form-input"
              rows="3"
              placeholder="Observações sobre a aprovação..."
            ></textarea>
          </div>

          <div class="flex space-x-3">
            <button type="button" @click="fecharAprovacaoModal" class="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="flex-1 btn-success">
              Confirmar Aprovação
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Rejeição -->
    <div v-if="showRejeicaoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-white rounded-lg">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">
          Rejeitar Pedido #{{ pedidoParaRejeitar?.id }}
        </h3>
        
        <form @submit.prevent="confirmarRejeicao" class="space-y-4">
          <div>
            <label class="form-label">Motivo da rejeição *</label>
            <textarea
              v-model="motivoRejeicao"
              required
              class="form-input"
              rows="3"
              placeholder="Explique o motivo da rejeição..."
            ></textarea>
          </div>

          <div class="flex space-x-3">
            <button type="button" @click="fecharRejeicaoModal" class="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="flex-1 btn-danger">
              Confirmar Rejeição
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useProdutoStore } from '@/store/produto'
import { usePedidoStore } from '@/store/pedido'

export default defineComponent({
  name: 'AdminView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const produtoStore = useProdutoStore()
    const pedidoStore = usePedidoStore()

    const activeTab = ref('dashboard')
    const filtroStatus = ref('')
    
    const showProdutoModal = ref(false)
    const showAprovacaoModal = ref(false)
    const showRejeicaoModal = ref(false)
    
    const produtoForm = ref({ nome: '', descricao: '', preco: '', foto: null })
    const editandoProduto = ref(null)
    const observacoesAprovacao = ref('')
    const motivoRejeicao = ref('')
    const pedidoParaAprovar = ref(null)
    const pedidoParaRejeitar = ref(null)

    const fileInput = ref(null)

    const tabs = ref([
      { id: 'dashboard', nome: 'Dashboard' },
      { id: 'pedidos', nome: 'Pedidos' },
      { id: 'produtos', nome: 'Produtos' }
    ])

    const user = computed(() => authStore.user)
    const produtos = computed(() => produtoStore.produtos)
    const pedidos = computed(() => pedidoStore.pedidos)
    const pedidosPendentes = computed(() => pedidoStore.pedidosPorStatus('Pendente de Aprovação'))
    const estatisticas = computed(() => pedidoStore.estatisticasPedidos)
    
    const pedidosFiltrados = computed(() => {
      if (!filtroStatus.value) return pedidos.value
      return pedidos.value.filter(p => p.status === filtroStatus.value)
    })

    const carregarDados = async () => {
      await Promise.all([
        produtoStore.carregarProdutos(),
        pedidoStore.carregarPedidos()
      ])
    }

    const carregarPedidos = () => pedidoStore.carregarPedidos()

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return

      if (file.size > 2 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 2MB.')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Apenas imagens são aceitas.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        produtoForm.value.foto = e.target.result
      }
      reader.readAsDataURL(file)
    }

    const removerFoto = () => {
      produtoForm.value.foto = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const novoProduto = () => {
      editandoProduto.value = null
      produtoForm.value = { nome: '', descricao: '', preco: '', foto: null }
      showProdutoModal.value = true
    }

    const editarProduto = (produto) => {
      editandoProduto.value = produto
      produtoForm.value = { 
        ...produto, 
        preco: produto.preco.toString(),
        foto: produto.foto || null
      }
      showProdutoModal.value = true
    }

    const salvarProduto = async () => {
      try {
        const dados = {
          ...produtoForm.value,
          preco: parseFloat(produtoForm.value.preco)
        }

        if (editandoProduto.value) {
          await produtoStore.atualizarProduto(editandoProduto.value.id, dados)
        } else {
          await produtoStore.criarProduto(dados)
        }

        fecharProdutoModal()
      } catch (error) {
        alert('Erro ao salvar produto: ' + error.message)
      }
    }

    const excluirProduto = async (produto) => {
      if (confirm(`Tem certeza que deseja excluir "${produto.nome}"?`)) {
        try {
          await produtoStore.excluirProduto(produto.id)
        } catch (error) {
          alert('Erro ao excluir produto: ' + error.message)
        }
      }
    }

    const fecharProdutoModal = () => {
      showProdutoModal.value = false
      editandoProduto.value = null
      produtoForm.value = { nome: '', descricao: '', preco: '', foto: null }
    }

    const aprovarPedido = (pedido) => {
      pedidoParaAprovar.value = pedido
      observacoesAprovacao.value = ''
      showAprovacaoModal.value = true
    }

    const rejeitarPedido = (pedido) => {
      pedidoParaRejeitar.value = pedido
      motivoRejeicao.value = ''
      showRejeicaoModal.value = true
    }

    const confirmarAprovacao = async () => {
      try {
        await pedidoStore.aprovarPedido(pedidoParaAprovar.value.id, observacoesAprovacao.value)
        fecharAprovacaoModal()
      } catch (error) {
        alert('Erro ao aprovar pedido: ' + error.message)
      }
    }

    const confirmarRejeicao = async () => {
      try {
        await pedidoStore.rejeitarPedido(pedidoParaRejeitar.value.id, motivoRejeicao.value)
        fecharRejeicaoModal()
      } catch (error) {
        alert('Erro ao rejeitar pedido: ' + error.message)
      }
    }

    const fecharAprovacaoModal = () => {
      showAprovacaoModal.value = false
      pedidoParaAprovar.value = null
      observacoesAprovacao.value = ''
    }

    const fecharRejeicaoModal = () => {
      showRejeicaoModal.value = false
      pedidoParaRejeitar.value = null
      motivoRejeicao.value = ''
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

    const logout = () => {
      localStorage.clear()
      window.location.href = '/'
    }

    onMounted(() => {
      carregarDados()
    })

    return {
      user,
      activeTab,
      tabs,
      filtroStatus,
      produtos,
      pedidos,
      pedidosPendentes,
      pedidosFiltrados,
      estatisticas,
      showProdutoModal,
      showAprovacaoModal,
      showRejeicaoModal,
      produtoForm,
      editandoProduto,
      observacoesAprovacao,
      motivoRejeicao,
      pedidoParaAprovar,
      pedidoParaRejeitar,
      fileInput,
      handleFileUpload,
      removerFoto,
      carregarPedidos,
      novoProduto,
      editarProduto,
      salvarProduto,
      excluirProduto,
      fecharProdutoModal,
      aprovarPedido,
      rejeitarPedido,
      confirmarAprovacao,
      confirmarRejeicao,
      fecharAprovacaoModal,
      fecharRejeicaoModal,
      formatarData,
      getStatusClass,
      logout
    }
  }
})
</script>