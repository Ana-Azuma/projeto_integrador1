import { defineStore } from 'pinia'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isCliente: (state) => state.user?.tipo === 'cliente',
    isAdmin: (state) => state.user?.tipo === 'admin',
    isMes: (state) => state.user?.tipo === 'mes'
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await authService.login(credentials)
        
        this.user = response.user
        this.token = response.token
        
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        // Limpar estado da store
        this.user = null
        this.token = null
        this.error = null
        
        // Limpar localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('carrinho')
        
        console.log('Logout realizado com sucesso')
        
        return { success: true }
      } catch (error) {
        console.error('Erro durante logout:', error)
        // Mesmo com erro, limpar dados locais
        this.user = null
        this.token = null
        localStorage.clear()
        return { success: false, error: error.message }
      }
    },

    async initializeAuth() {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          this.token = token
          this.user = JSON.parse(userData)
          
          // Verificar se o token ainda é válido
          await authService.validateToken(token)
        } catch (error) {
          console.error('Token inválido, fazendo logout:', error)
          this.logout()
        }
      }
    },

    clearError() {
      this.error = null
    }
  }
})