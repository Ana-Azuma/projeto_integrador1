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
              'border-yellow-500': pedido.status === 'aguardando',
              'border-blue-500': pedido.status === 'em_producao',
            }"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900">#{{ pedido.numero }}</h3>
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
      filaPedidos: [
        {
          id: 1,
          numero: '001',
          cliente: 'João Silva',
          status: 'aguardando',
          prioridade: 'Alta',
          dataHora: '30/09/2025 14:30',
          itens: [
            { id: 1, nome: 'Produto A', quantidade: 2 },
            { id: 2, nome: 'Produto B', quantidade: 1 }
          ]
        },
        {
          id: 2,
          numero: '002',
          cliente: 'Maria Santos',
          status: 'em_producao',
          prioridade: 'Normal',
          dataHora: '30/09/2025 15:00',
          itens: [
            { id: 3, nome: 'Produto C', quantidade: 3 }
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
          { id: 1, nome: 'Produto A', quantidade: 125 },
          { id: 2, nome: 'Produto B', quantidade: 98 },
          { id: 3, nome: 'Produto C', quantidade: 87 },
          { id: 4, nome: 'Produto D', quantidade: 76 },
          { id: 5, nome: 'Produto E', quantidade: 65 },
          { id: 6, nome: 'Produto F', quantidade: 54 },
          { id: 7, nome: 'Produto G', quantidade: 43 },
          { id: 8, nome: 'Produto H', quantidade: 32 },
          { id: 9, nome: 'Produto I', quantidade: 28 },
          { id: 10, nome: 'Produto J', quantidade: 21 }
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
      // Aqui você pode implementar a lógica de filtro
      return this.historicoPedidos;
    }
  },
  methods: {
    sair() {
      // Limpar dados de sessão/autenticação se houver
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Redirecionar para a raiz (home/login)
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
    
    // Esta função será chamada automaticamente quando o CLP enviar sinal de conclusão
    finalizarProducaoPorCLP(pedidoId) {
      const index = this.filaPedidos.findIndex(p => p.id === pedidoId);
      if (index !== -1) {
        const pedido = this.filaPedidos[index];
        
        // Calcular tempo de produção
        const iniciadoEm = new Date(pedido.iniciadoEm);
        const finalizadoEm = new Date();
        const tempoMinutos = Math.round((finalizadoEm - iniciadoEm) / 1000 / 60);
        
        // Adicionar ao histórico
        this.historicoPedidos.unshift({
          ...pedido,
          finalizadoEm: finalizadoEm.toLocaleString('pt-BR'),
          tempoProducao: `${tempoMinutos} min`,
          status: 'concluido'
        });
        
        // Remover da fila
        this.filaPedidos.splice(index, 1);
        
        // Atualizar analytics
        this.analytics.producaoHoje++;
        
        alert(`Pedido #${pedido.numero} finalizado pelo CLP! Estoque atualizado.`);
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
    }
  }
};
</script>