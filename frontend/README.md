# Smart Factory - Loja Virtual + MES

Sistema integrado de **Loja Virtual** e **MES (Manufacturing Execution System)** para a Planta Smart 4.0 do SENAI Roberto Mange.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte da disciplina **Projeto Integrador Interdisciplinar II** do curso **Tecnologia em Análise e Desenvolvimento de Sistemas** do SENAI Roberto Mange, integrando conhecimentos de:

- ✅ **Engenharia de Software** - Requisitos, arquitetura e documentação
- ✅ **Desenvolvimento Front-end** - Vue.js 3, responsividade e UX
- ✅ **Desenvolvimento Back-end** - APIs REST e integração com sistemas
- ✅ **Tecnologia da Informação e Conectividade** - Protocolos industriais (OPC UA)
- ✅ **Inteligência Artificial e Big Data** - Coleta e análise de dados de produção

## 🎯 Funcionalidades Principais

### 🛒 Loja Virtual (Cliente)
- Catálogo de produtos com informações em tempo real
- Carrinho de compras inteligente com verificação de estoque
- Sistema de pedidos com acompanhamento de status
- Interface responsiva e moderna

### 👨‍💼 Painel Administrativo (Admin)
- Dashboard com estatísticas em tempo real
- Gerenciamento completo de produtos
- Aprovação/rejeição de pedidos com justificativas
- Controle de usuários do sistema

### 🏭 Sistema MES (Operador)
- Dashboard da planta com variáveis em tempo real
- Controle de ordens de produção
- Integração com Planta Smart 4.0 via OPC UA
- Monitoramento de estoque e bloqueios automáticos

## 🚀 Tecnologias Utilizadas

### Frontend
- **Vue.js 3** - Framework principal
- **Vite** - Build tool e dev server
- **Vue Router** - Roteamento SPA
- **Pinia** - Gerenciamento de estado
- **Tailwind CSS** - Estilização responsiva
- **Axios** - Cliente HTTP

### Backend (Integração)
- **Node.js** - Runtime para APIs
- **Express.js** - Framework web
- **node-opcua** - Comunicação com Planta Smart 4.0

### Testes
- **Vitest** - Testes unitários
- **Cypress** - Testes E2E

## 📁 Estrutura do Projeto

```
meu-projeto/
├── public/                 # Arquivos estáticos
├── src/
│   ├── assets/            # Recursos (imagens, ícones)
│   ├── components/        # Componentes reutilizáveis
│   ├── router/            # Configuração de rotas
│   ├── services/          # Serviços de API
│   ├── store/             # Stores Pinia
│   ├── views/             # Páginas da aplicação
│   ├── App.vue           # Componente raiz
│   ├── main.js           # Ponto de entrada
│   └── style.css         # Estilos globais
├── package.json          # Dependências
├── vite.config.js        # Configuração Vite
├── tailwind.config.js    # Configuração Tailwind
└── README.md
```

## ⚡ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd meu-projeto
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute em modo desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### 4. Build para produção
```bash
npm run build
```

## 👥 Usuários de Teste

| Tipo | Email | Senha | Funcionalidades |
|------|-------|-------|----------------|
| **Cliente** | `cliente@test.com` | `123` | Navegar, comprar, acompanhar pedidos |
| **Admin** | `admin@test.com` | `123` | Gerenciar produtos, aprovar pedidos |
| **MES** | `mes@test.com` | `123` | Controlar produção, monitorar planta |

## 🔄 Fluxo do Sistema

1. **Cliente** navega pela loja e adiciona produtos ao carrinho
2. **Cliente** finaliza o pedido (status: "Pendente de Aprovação")
3. **Admin** analisa e aprova/rejeita o pedido
4. **Sistema** envia pedido aprovado para o MES automaticamente
5. **MES** bloqueia estoque e cria ordem de produção
6. **Operador MES** inicia produção na Planta Smart 4.0
7. **Sistema** atualiza status do pedido em tempo real
8. **Cliente** acompanha progresso até a entrega

## 🏭 Integração com Planta Smart 4.0

O sistema se comunica com a Planta Smart 4.0 através de:

- **Protocolo OPC UA** para leitura de variáveis industriais
- **APIs REST** para controle de ordens de produção
- **WebSockets** para atualizações em tempo real
- **Simulação de produção** com feedback visual

### Variáveis Monitoradas
- Temperatura do processo
- Pressão do sistema
- Velocidade de produção
- Status operacional
- Progresso das ordens

## 📊 Requisitos Atendidos

### ✅ Requisitos Funcionais
- [x] RF-01: Apresentar loja virtual com produtos
- [x] RF-02: Carrinho de compras funcional
- [x] RF-03: Sistema de autenticação com perfis
- [x] RF-04: Controle de status de pedidos
- [x] RF-05: Aprovação/rejeição pelo Admin
- [x] RF-06: Integração com Mini-MES
- [x] RF-07: Controle inteligente de estoque
- [x] RF-08: Comunicação OPC UA com planta

### ✅ Requisitos Não Funcionais
- [x] RNF-01: Tempo de resposta ≤ 1,5s
- [x] RNF-02: Interface responsiva
- [x] RNF-03: Arquitetura modular
- [x] RNF-04: APIs documentadas
- [x] RNF-05: Código organizado e testável

## 🧪 Testes

### Executar testes unitários
```bash
npm run test
```

### Executar testes E2E
```bash
npm run test:e2e
```

## 📈 Métricas e Monitoramento

O sistema inclui dashboards para:
- **Estatísticas de pedidos** (pendentes, aprovados, rejeitados)
- **Níveis de estoque** em tempo real
- **Performance da planta** (temperatura, pressão, velocidade)
- **Progresso de produção** com indicadores visuais

## 🤝 Equipe de Desenvolvimento

- **Ana Carolina Garcia Azuma**
- **Lucas Pereira Monteiro** 
- **Moisés Cardoso Moreira**
- **Willian Walace de Medeiros Jeronimo**

**Orientação:** Prof. Luciano/Chaparro  
**Instituição:** SENAI Roberto Mange - Campinas/SP

## 📝 Documentação Adicional

- [Documento de Requisitos](./docs/requisitos.md)
- [Arquitetura do Sistema](./docs/arquitetura.md)
- [Manual do Usuário](./docs/manual-usuario.md)
- [API Documentation](./docs/api.md)

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do curso de Tecnologia em Análise e Desenvolvimento de Sistemas do SENAI Roberto Mange.

---

**SENAI Roberto Mange - 2025**  
*Tecnologia em Análise e Desenvolvimento de Sistemas*