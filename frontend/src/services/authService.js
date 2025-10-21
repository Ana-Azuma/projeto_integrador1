import api from './api'

// Mock de usuários para desenvolvimento
const USUARIOS_MOCK = [
  { id: 1, email: 'cliente@test.com', senha: '123', tipo: 'cliente', nome: 'João Cliente' },
  { id: 2, email: 'admin@test.com', senha: '123', tipo: 'admin', nome: 'Admin Sistema' },
  { id: 3, email: 'mes@test.com', senha: '123', tipo: 'mes', nome: 'Sistema MES' }
]

export const authService = {
  async login(credentials) {
    try {
      // Em desenvolvimento, usar mock
      if (import.meta.env.MODE === 'development') {
        return this.mockLogin(credentials)
      }
      
      // Em produção, usar API real
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
      // Logout sempre deve funcionar localmente
      console.warn('Erro ao fazer logout no servidor:', error)
    }
  },

  // Mock para desenvolvimento
  mockLogin(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usuario = USUARIOS_MOCK.find(
          u => u.email === credentials.email && u.senha === credentials.senha
        )
        
        if (usuario) {
          const { senha, ...dadosUsuario } = usuario
          resolve({
            user: dadosUsuario,
            token: `mock-token-${usuario.id}-${Date.now()}`
          })
        } else {
          reject(new Error('Email ou senha inválidos'))
        }
      }, 500) // Simular delay da rede
    })
  }
}