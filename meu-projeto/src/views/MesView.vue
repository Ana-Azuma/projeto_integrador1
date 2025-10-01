<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Sistema MES - Smart Factory 4.0</h1>
            <p class="text-sm text-gray-500 mt-1">Manufacturing Execution System</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-sm font-medium text-gray-700">{{ metricas.status }}</span>
            </div>
            <button 
              @click="atualizarDados" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Atualizar
            </button>
            <button 
              @click="sair" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="abaAtiva = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              abaAtiva === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.nome }}
            <span 
              v-if="tab.id === 'producao' && filaPedidos.length > 0"
              class="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {{ filaPedidos.length }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Fila de Produção Tab -->
      <div v-if="abaAtiva === 'producao'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Fila de Produção</h2>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">
              <span class="font-semibold">{{ filaPedidos.length }}</span> pedidos na fila
            </span>
          </div>
        </div>

        <!-- Fila Visual de Pedidos -->
        <div v-if="filaPedidos.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="pedido in filaPedidos"
            :key="pedido.id"
            class="bg-white rounded-lg shadow-md border-l-4 p-6 hover:shadow-lg transition"
            :class="{
              'border-yellow-500': pedido.status === 'aguardando' && pedido.tipo === 'pedido_cliente',
              'border-blue-500': pedido.status === 'em_producao' && pedido.tipo === 'pedido_cliente',
              'border-green-500': pedido.tipo === 'reposicao_estoque' && pedido.status === 'aguardando',
              'border-purple-500': pedido.tipo === 'reposicao_estoque' && pedido.status === 'em_producao'
            }"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-bold text-gray-900">#{{ pedido.numero }}</h3>
                  <span
                    v-if="pedido.tipo === 'reposicao_estoque'"
                    class="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded"
                  >
                    📦 REPOSIÇÃO
                  </span>
                </div>
                <p class="text-sm text-gray-500">{{ pedido.cliente }}</p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="{
                  'bg-yellow-100 text-yellow-800': pedido.status === 'aguardando',
                  'bg-blue-100 text-blue-800': pedido.status === 'em_producao',
                }"
              >
                {{ pedido.status === 'aguardando' ? 'Aguardando' : 'Em Produção' }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <div v-for="item in pedido.itens" :key="item.id" class="flex justify-between text-sm">
                <span class="text-gray-700">{{ item.nome }}</span>
                <span class="font-semibold text-gray-900">{{ item.quantidade }}x</span>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{{ pedido.dataHora }}</span>
              <span class="font-semibold">Prioridade: {{ pedido.prioridade }}</span>
            </div>

            <div class="flex gap-2">
              <button
                v-if="pedido.status === 'aguardando'"
                @click="iniciarProducao(pedido.id)"
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
              >
                Iniciar Produção
              </button>
              <div
                v-if="pedido.status === 'em_producao'"
                class="flex-1 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Aguardando CLP Finalizar
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-12 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido na fila</h3>
          <p class="text-gray-500">Aguardando aprovação de novos pedidos</p>
        </div>
      </div>

      <!-- Histórico Tab -->
      <div v-if="abaAtiva === 'historico'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Histórico de Produção</h2>
          <div class="flex gap-2">
            <select v-model="filtroHistorico" class="px-4 py-2 border rounded-lg text-sm">
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="todos">Todos</option>
            </select>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finalizado em</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="pedido in historicoFiltrado" :key="pedido.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ pedido.numero }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-800': pedido.tipo === 'pedido_cliente',
                      'bg-green-100 text-green-800': pedido.tipo === 'reposicao_estoque'
                    }"
                  >
                    {{ pedido.tipo === 'reposicao_estoque' ? 'Reposição' : 'Cliente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ pedido.cliente }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <div class="max-w-xs">
                    {{ pedido.itens.map(i => `${i.nome} (${i.quantidade}x)`).join(', ') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ pedido.finalizadoEm }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ pedido.tempoProducao }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Concluído
                  </span>
                </td>
              </tr>
              <tr v-if="historicoPedidos.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-500">
                  Nenhum pedido finalizado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Analytics Tab -->
      <div v-if="abaAtiva === 'analytics'" class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Análise de Produção</h2>

        <!-- Cards de Resumo -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-sm font-medium text-gray-500 mb-1">Produção Hoje</p>
            <p class="text-3xl font-bold text-gray-900">{{ analytics.producaoHoje }}</p>
            <p class="text-xs text-green-600 mt-2">↑ +12% vs ontem</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-sm font-medium text-gray-500 mb-1">Tempo Médio</p>
            <p class="text-3xl font-bold text-gray-900">{{ analytics.tempoMedio }}</p>
            <p class="text-xs text-green-600 mt-2">↓ -5 min vs ontem</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-sm font-medium text-gray-500 mb-1">Taxa de Sucesso</p>
            <p class="text-3xl font-bold text-gray-900">{{ analytics.taxaSucesso }}%</p>
            <p class="text-xs text-gray-500 mt-2">Meta: 98%</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-sm font-medium text-gray-500 mb-1">Eficiência</p>
            <p class="text-3xl font-bold text-gray-900">{{ analytics.eficiencia }}%</p>
            <p class="text-xs text-green-600 mt-2">↑ +3% vs ontem</p>
          </div>
        </div>

        <!-- Produtos Mais Demandados -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Top 10 Produtos Mais Demandados</h3>
          <div class="space-y-3">
            <div
              v-for="(produto, index) in analytics.produtosMaisDemandados"
              :key="produto.id"
              class="flex items-center gap-4"
            >
              <span class="text-lg font-bold text-gray-400 w-6">{{ index + 1 }}</span>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium text-gray-900">{{ produto.nome }}</span>
                  <span class="text-sm font-bold text-gray-900">{{ produto.quantidade }} unidades</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all"
                    :style="{ width: `${(produto.quantidade / analytics.produtosMaisDemandados[0].quantidade) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Produção por Período -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Produção dos Últimos 7 Dias</h3>
          <div class="h-64 flex items-end justify-between gap-2">
            <div
              v-for="dia in analytics.producaoPorDia"
              :key="dia.dia"
              class="flex-1 flex flex-col items-center"
            >
              <div class="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition cursor-pointer relative group"
                   :style="{ height: `${(dia.quantidade / Math.max(...analytics.producaoPorDia.map(d => d.quantidade))) * 100}%` }">
                <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
                  {{ dia.quantidade }}
                </span>
              </div>
              <span class="text-xs text-gray-600 mt-2">{{ dia.dia }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Reposição de Estoque -->
    <div v-if="modalReposicaoAberto" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">Adicionar Estoque</h3>
              <p class="text-sm text-gray-500 mt-1">{{ produtoSelecionado?.nome }}</p>
            </div>
            <button @click="fecharModalReposicao" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm text-blue-700">
                  <strong>Estoque Atual:</strong> {{ produtoSelecionado?.quantidade }} unidades
                </p>
                <p class="text-sm text-blue-700">
                  <strong>Estoque Mínimo:</strong> {{ produtoSelecionado?.minimo }} unidades
                </p>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Quantidade a Adicionar *
            </label>
            <input
              v-model.number="quantidadeReposicao"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite a quantidade"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Motivo da Reposição
            </label>
            <select
              v-model="motivoReposicao"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um motivo</option>
              <option value="compra">Compra de Fornecedor</option>
              <option value="producao_interna">Produção Interna</option>
              <option value="devolucao">Devolução de Cliente</option>
              <option value="ajuste">Ajuste de Inventário</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-green-800">
              <strong>Novo Estoque:</strong> {{ produtoSelecionado?.quantidade + (quantidadeReposicao || 0) }} unidades
            </p>
          </div>

          <div class="flex gap-3">
            <button
              @click="fecharModalReposicao"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold"
            >
              Cancelar
            </button>
            <button
              @click="confirmarReposicao"
              :disabled="!quantidadeReposicao || quantidadeReposicao <= 0"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MesView',
  data() {
    return {
      abaAtiva: 'producao',
      filtroHistorico: 'hoje',
      tabs: [
        { id: 'producao', nome: 'Fila de Produção' },
        { id: 'historico', nome: 'Histórico' },
        { id: 'analytics', nome: 'Analytics' }
      ],
      metricas: {
        temperatura: '26.8',
        pressao: '1.2',
        velocidade: '72',
        status: 'Operacional',
        ultimaAtualizacao: '30/09/2025, 19:40'
      },
      estoqueProdutos: [],
      modalReposicaoAberto: false,
      produtoSelecionado: null,
      quantidadeReposicao: 0,
      motivoReposicao: '',
      filaPedidos: [
        {
          id: 1,
          numero: '001',
          tipo: 'pedido_cliente',
          cliente: 'João Silva',
          status: 'aguardando',
          prioridade: 'Alta',
          dataHora: '30/09/2025 14:30',
          itens: [
            { id: 1, nome: 'Suco de Laranja', quantidade: 2 },
            { id: 2, nome: 'Suco de Maçã', quantidade: 1 }
          ]
        },
        {
          id: 2,
          numero: '002',
          tipo: 'pedido_cliente',
          cliente: 'Maria Santos',
          status: 'em_producao',
          prioridade: 'Normal',
          dataHora: '30/09/2025 15:00',
          itens: [
            { id: 3, nome: 'Suco de Uva', quantidade: 3 }
          ]
        },
        {
          id: 3,
          numero: 'REP-001',
          tipo: 'reposicao_estoque',
          cliente: 'Sistema Admin',
          status: 'aguardando',
          prioridade: 'Alta',
          dataHora: '30/09/2025 16:00',
          itens: [
            { id: 1, nome: 'Suco de Laranja', quantidade: 50 },
            { id: 2, nome: 'Suco de Maçã', quantidade: 30 }
          ]
        }
      ],
      historicoPedidos: [],
      analytics: {
        producaoHoje: 47,
        tempoMedio: '23 min',
        taxaSucesso: 98.5,
        eficiencia: 95,
        produtosMaisDemandados: [
          { id: 1, nome: 'Suco de Laranja', quantidade: 125 },
          { id: 2, nome: 'Suco de Maçã', quantidade: 98 },
          { id: 3, nome: 'Suco de Uva', quantidade: 87 }
        ],
        producaoPorDia: [
          { dia: 'Seg', quantidade: 42 },
          { dia: 'Ter', quantidade: 38 },
          { dia: 'Qua', quantidade: 51 },
          { dia: 'Qui', quantidade: 45 },
          { dia: 'Sex', quantidade: 49 },
          { dia: 'Sáb', quantidade: 35 },
          { dia: 'Dom', quantidade: 28 }
        ]
      }
    };
  },
  computed: {
    historicoFiltrado() {
      return this.historicoPedidos;
    }
  },
  methods: {
    sair() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      window.location.href = '/';
    },
    
    iniciarProducao(pedidoId) {
      const pedido = this.filaPedidos.find(p => p.id === pedidoId);
      if (pedido) {
        pedido.status = 'em_producao';
        pedido.iniciadoEm = new Date().toISOString();
        alert('Produção iniciada! O CLP irá notificar quando finalizar.');
      }
    },
    
    finalizarProducaoPorCLP(pedidoId) {
      const index = this.filaPedidos.findIndex(p => p.id === pedidoId);
      if (index !== -1) {
        const pedido = this.filaPedidos[index];
        
        const iniciadoEm = new Date(pedido.iniciadoEm);
        const finalizadoEm = new Date();
        const tempoMinutos = Math.round((finalizadoEm - iniciadoEm) / 1000 / 60);
        
        let mensagemEstoque = '';
        
        if (pedido.tipo === 'pedido_cliente') {
          mensagemEstoque = 'Estoque SUBTRAÍDO (produto enviado ao cliente)';
        } else if (pedido.tipo === 'reposicao_estoque') {
          mensagemEstoque = 'Estoque ADICIONADO (reposição concluída)';
        }
        
        this.historicoPedidos.unshift({
          ...pedido,
          finalizadoEm: finalizadoEm.toLocaleString('pt-BR'),
          tempoProducao: `${tempoMinutos} min`,
          status: 'concluido'
        });
        
        this.filaPedidos.splice(index, 1);
        this.analytics.producaoHoje++;
        
        alert(
          `✅ Pedido #${pedido.numero} finalizado pelo CLP!\n\n` +
          `Tipo: ${pedido.tipo === 'pedido_cliente' ? 'PEDIDO DE CLIENTE' : 'REPOSIÇÃO DE ESTOQUE'}\n` +
          `${mensagemEstoque}`
        );
      }
    },
    
    atualizarDados() {
      this.metricas.ultimaAtualizacao = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      alert('Dados atualizados!');
    },
    
    abrirModalReposicao(produto) {
      this.produtoSelecionado = produto;
      this.quantidadeReposicao = 0;
      this.motivoReposicao = '';
      this.modalReposicaoAberto = true;
    },
    
    fecharModalReposicao() {
      this.modalReposicaoAberto = false;
      this.produtoSelecionado = null;
      this.quantidadeReposicao = 0;
      this.motivoReposicao = '';
    },
    
    confirmarReposicao() {
      if (!this.produtoSelecionado || !this.quantidadeReposicao || this.quantidadeReposicao <= 0) {
        alert('Digite uma quantidade válida!');
        return;
      }
      
      const produto = this.estoqueProdutos.find(p => p.id === this.produtoSelecionado.id);
      if (produto) {
        const quantidadeAnterior = produto.quantidade;
        produto.quantidade += this.quantidadeReposicao;
        
        alert(
          `✅ Estoque atualizado com sucesso!\n\n` +
          `Produto: ${produto.nome}\n` +
          `Quantidade Anterior: ${quantidadeAnterior} un\n` +
          `Quantidade Adicionada: ${this.quantidadeReposicao} un\n` +
          `Novo Estoque: ${produto.quantidade} un`
        );
      }
      
      this.fecharModalReposicao();
    }
  }
};
</script>