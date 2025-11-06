import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Views
import LoginView from '@/views/LoginView.vue'
import LojaView from '@/views/LojaView.vue'
import AdminView from '@/views/AdminView.vue'
import MesView from '@/views/MesView.vue'
import PedidosView from '@/views/PedidosView.vue'
import CarrinhoView from '@/views/CarrinhoView.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/loja',
    name: 'Loja',
    component: LojaView,
    meta: { requiresAuth: true, roles: ['cliente', 'admin'] }
  },
  {
    path: '/carrinho',
    name: 'Carrinho',
    component: CarrinhoView,
    meta: { requiresAuth: true, roles: ['cliente'] }
  },
  {
    path: '/meus-pedidos',
    name: 'MeusPedidos',
    component: PedidosView,
    meta: { requiresAuth: true, roles: ['cliente'] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/pedidos',
    name: 'AdminPedidos',
    component: PedidosView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/pedidos',
    name: 'AdminPedidos',
    component: PedidosView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
    
  {
    path: '/mes',
    name: 'MES',
    component: MesView,
    meta: { requiresAuth: true, roles: ['mes', 'admin'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/')
      return
    }
    
    if (to.meta.roles && !to.meta.roles.includes(authStore.user?.tipo)) {
      // Redireciona para a página apropriada baseada no tipo de usuário
      switch (authStore.user?.tipo) {
        case 'cliente':
          next('/loja')
          break
        case 'admin':
          next('/admin')
          break
        case 'mes':
          next('/mes')
          break
        default:
          next('/')
      }
      return
    }
  }
  
  next()
})

export default router