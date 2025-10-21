<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Solicitação de Produção para Estoque</h1>
            <p class="text-sm text-gray-500 mt-1">Gestão Administrativa - Reposição de Estoque</p>
          </div>
          <button 
            @click="voltarAdmin" 
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna Esquerda - Produtos Disponíveis -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-gray-900">Produtos Disponíveis</h2>
              <div class="flex gap-2">
                <input
                  v-model="busca"
                  type="text"
                  placeholder="Buscar produto..."
                  class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Lista de Produtos -->
            <div class="space-y-3">
              <div
                v-for="produto in produtosFiltrados"
                :key="produto.id"
                class="border rounded-lg p-4 hover:border-blue-500 transition cursor-pointer"
                :class="{
                  'border-blue-500 bg-blue-50': produtosSelecionados.find(p => p.id === produto.id),
                  'border-red-200 bg-red-50': produto.quantidade < produto.minimo
                }"
                @click="toggleProduto(produto)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <input
                        type="checkbox"
                        :checked="produtosSelecionados.find(p => p.id === produto.id)"
                        class="w-5 h-5 text-blue-600 rounded"
                        @click.stop
                      />
                      <div>
                        <h3 class="font-semibold text-gray-900">{{ produto.nome }}</h3>
                        <p class="text-sm text-gray-500">{{ produto.categoria }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-6">
                    <!-- Estoque Atual -->
                    <div class="text-right">
                      <p class="text-xs text-gray-500">Estoque Atual</p>
                      <p 
                        class="text-lg font-bold"
                        :class="{
                          'text-red-600': produto.quantidade < produto.minimo,
                          'text-yellow-600': produto.quantidade >= produto.minimo && produto.quantidade < produto.minimo * 2,
                          'text-green-600': produto.quantidade >= produto.minimo * 2
                        }"
                      >
                        {{ produto.quantidade }} un
                      </p>
                      <p class="text-xs text-gray-500">Mín: {{ produto.minimo }}</p>
                    </div>

                    <!-- Status -->
                    <span
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="{
                        'bg-red-100 text-red-800': produto.quantidade < produto.minimo,
                        'bg-yellow-100 text-yellow-800': produto.quantidade >= produto.minimo && produto.quantidade < produto.minimo * 2,
                        'bg-green-100 text-green-800': produto.quantidade >= produto.minimo * 2
                      }"
                    >
                      {{ produto.quantidade < produto.minimo ? 'CRÍTICO' : produto.quantidade < produto.minimo * 2 ? 'BAIXO' : 'OK' }}
                    </span>

                    <!-- Input de Quantidade -->
                    <div v-if="produtosSelecionados.find(p => p.id === produto.id)" class="flex items-center gap-2" @click.stop>
                      <button
                        @click="diminuirQuantidade(produto.id)"
                        class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        :value="produtosSelecionados.find(p => p.id === produto.id).quantidadeProduzir"
                        @input="atualizarQuantidade(produto.id, $event.target.value)"
                        class="w-20 px-2 py-1 border border-gray-300 rounded text-center font-semibold"
                      />
                      <button
                        @click="aumentarQuantidade(produto.id)"
                        class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna Direita - Resumo da Solicitação -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Resumo da Solicitação</h2>

            <div v-if="produtosSelecionados.length === 0" class="text-center py-8">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="text-sm text-gray-500">Nenhum produto selecionado</p>
            </div>

            <div v-else class="space-y-4">
              <!-- Lista de Produtos Selecionados -->
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="produto in produtosSelecionados"
                  :key="produto.id"
                  class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">{{ produto.nome }}</p>
                    <p class="text-xs text-gray-500">{{ produto.quantidadeProduzir }}x unidades</p>
                  </div>
                  <button
                    @click="removerProduto(produto.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="border-t pt-4">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Total de Produtos:</span>
                  <span class="font-bold text-gray-900">{{ produtosSelecionados.length }}</span>
                </div>
                <div class="flex justify-between text-sm mb-4">
                  <span class="text-gray-600">Total de Unidades:</span>
                  <span class="font-bold text-gray-900">{{ totalUnidades }}</span>
                </div>
              </div>

              <!-- Prioridade -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  v-model="prioridade"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <!-- Observações -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  v-model="observacoes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adicione observações sobre a solicitação..."
                ></textarea>
              </div>

              <!-- Tipo de Solicitação -->
              <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div>
                    <p class="text-xs font-semibold text-blue-900">REPOSIÇÃO DE ESTOQUE</p>
                    <p class="text-xs text-blue-700">Produção será adicionada ao estoque</p>
                  </div>
                </div>
              </div>

              <!-- Botão Enviar -->
              <button
                @click="enviarSolicitacao"
                class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enviar para MES
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Solicitações Pendentes -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Solicitações de Reposição Pendentes</h2>
        
        <div v-if="solicitacoesPendentes.length === 0" class="text-center py-8 text-gray-500">
          Nenhuma solicitação pendente
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="solicitacao in solicitacoesPendentes"
            :key="solicitacao.id"
            class="border border-yellow-300 bg-yellow-50 rounded-lg p-4"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
                    AGUARDANDO MES
                  </span>
                  <span class="text-xs text-gray-600">{{ solicitacao.data }}</span>
                  <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                    {{ solicitacao.prioridade }}
                  </span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div v-for="item in solicitacao.itens" :key="item.id" class="text-sm">
                    <span class="font-semibold text-gray-900">{{ item.nome }}</span>
                    <span class="text-gray-600"> - {{ item.quantidade }}x</span>
                  </div>
                </div>
                <p v-if="solicitacao.observacoes" class="text-xs text-gray-600 mt-2">
                  <strong>Obs:</strong> {{ solicitacao.observacoes }}
                </p>
              </div>
              <button
                @click="cancelarSolicitacao(solicitacao.id)"
                class="text-red-600 hover:text-red-800 ml-4"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminReposicaoView',
  data() {
    return {
      busca: '',
      prioridade: 'Normal',
      observacoes: '',
      produtos: [
        { id: 1, nome: 'Produto A', quantidade: 5, minimo: 20, categoria: 'Eletrônicos' },
        { id: 2, nome: 'Produto B', quantidade: 8, minimo: 15, categoria: 'Eletrônicos' },
        { id: 3, nome: 'Produto C', quantidade: 45, minimo: 30, categoria: 'Acessórios' },
        { id: 4, nome: 'Produto D', quantidade: 2, minimo: 25, categoria: 'Ferramentas' },
        { id: 5, nome: 'Produto E', quantidade: 67, minimo: 20, categoria: 'Ferramentas' }
      ],
      produtosSelecionados: [],
      solicitacoesPendentes: []
    };
  },
  computed: {
    produtosFiltrados() {
      if (!this.busca) return this.produtos;
      return this.produtos.filter(p => 
        p.nome.toLowerCase().includes(this.busca.toLowerCase())
      );
    },
    totalUnidades() {
      return this.produtosSelecionados.reduce((total, p) => total + p.quantidadeProduzir, 0);
    }
  },
  methods: {
    voltarAdmin() {
      this.$router.push('/admin');
    },
    
    toggleProduto(produto) {
      const index = this.produtosSelecionados.findIndex(p => p.id === produto.id);
      if (index !== -1) {
        this.produtosSelecionados.splice(index, 1);
      } else {
        this.produtosSelecionados.push({
          ...produto,
          quantidadeProduzir: Math.max(produto.minimo - produto.quantidade, 10)
        });
      }
    },
    
    removerProduto(produtoId) {
      const index = this.produtosSelecionados.findIndex(p => p.id === produtoId);
      if (index !== -1) {
        this.produtosSelecionados.splice(index, 1);
      }
    },
    
    atualizarQuantidade(produtoId, valor) {
      const produto = this.produtosSelecionados.find(p => p.id === produtoId);
      if (produto) {
        produto.quantidadeProduzir = Math.max(1, parseInt(valor) || 1);
      }
    },
    
    diminuirQuantidade(produtoId) {
      const produto = this.produtosSelecionados.find(p => p.id === produtoId);
      if (produto && produto.quantidadeProduzir > 1) {
        produto.quantidadeProduzir--;
      }
    },
    
    aumentarQuantidade(produtoId) {
      const produto = this.produtosSelecionados.find(p => p.id === produtoId);
      if (produto) {
        produto.quantidadeProduzir++;
      }
    },
    
    enviarSolicitacao() {
      if (this.produtosSelecionados.length === 0) {
        alert('Selecione pelo menos um produto!');
        return;
      }
      
      const solicitacao = {
        id: Date.now(),
        tipo: 'reposicao_estoque', // IMPORTANTE: Identifica que é para ADICIONAR ao estoque
        prioridade: this.prioridade,
        observacoes: this.observacoes,
        data: new Date().toLocaleString('pt-BR'),
        status: 'aguardando',
        itens: this.produtosSelecionados.map(p => ({
          id: p.id,
          produtoId: p.id,
          nome: p.nome,
          quantidade: p.quantidadeProduzir
        }))
      };
      
      // Adicionar às pendentes
      this.solicitacoesPendentes.push(solicitacao);
      
      // Aqui você chamaria a API do backend:
      // await api.post('/mes/solicitacoes/reposicao', solicitacao);
      
      alert(
        `✅ Solicitação enviada para o MES!\n\n` +
        `${this.produtosSelecionados.length} produto(s)\n` +
        `${this.totalUnidades} unidades no total\n\n` +
        `⚠️ Quando o CLP finalizar a produção, o estoque será ADICIONADO automaticamente!`
      );
      
      // Limpar seleção
      this.produtosSelecionados = [];
      this.observacoes = '';
    },
    
    cancelarSolicitacao(id) {
      const index = this.solicitacoesPendentes.findIndex(s => s.id === id);
      if (index !== -1) {
        this.solicitacoesPendentes.splice(index, 1);
        alert('Solicitação cancelada!');
      }
    }
  }
};
</script>