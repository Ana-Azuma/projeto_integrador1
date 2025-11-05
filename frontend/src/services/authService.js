import api from './api'

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login')
    }
  },

  async validateToken(token) {
    try {
      const response = await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      throw new Error('Token inválido')
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.warn('Erro ao fazer logout no servidor:', error)
    }
  }
}