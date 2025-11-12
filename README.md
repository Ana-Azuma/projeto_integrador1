# DIONISIO SUCOS - Loja Virtual + MES

Sistema integrado de **Loja Virtual** e **MES (Manufacturing Execution System)** para a Planta Smart 4.0 do SENAI Roberto Mange.


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

-----------------
Guia de instalação
cd backend -> npm run dev
cd frontend -> npm run dev
ir no mongodb e comunicar

Thunder Client:
http://localhost:3001/api/auth/register
Método Post para cadastrar perfis de usuários:
{ 
  "nome": "Ana Cliente", 
  "email": "cliente@test.com", 
  "senha": "123456", 
  "tipo": "cliente"
  
}

{ 
"nome": "Moises ADM", 
"email": "admin@test.com", 
"senha": "123456", 
"tipo": "admin" 
}

{ 
  "nome": "Willian MES", 
"email": "mes@test.com", 
"senha": "123456", 
"tipo": "admin" 
}

http://localhost:3001/api/produtos

http://localhost:3001/api/produtos/690bd47e1b710f0e0d723a24