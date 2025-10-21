<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-full">
          <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white">Smart Factory</h1>
        <p class="mt-2 text-blue-200">Loja Virtual + MES Planta 4.0</p>
      </div>

      <!-- Card de Login -->
      <div class="p-8 bg-white shadow-2xl rounded-xl">
        <h2 class="mb-6 text-2xl font-bold text-center text-gray-900">Entrar no Sistema</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="Digite seu email"
            />
          </div>

          <!-- Senha -->
          <div>
            <label for="senha" class="form-label">Senha</label>
            <input
              id="senha"
              v-model="form.senha"
              type="password"
              required
              class="form-input"
              placeholder="Digite sua senha"
            />
          </div>

          <!-- Erro -->
          <div v-if="error" class="p-3 border border-red-200 rounded-md bg-red-50">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Botão Login -->
          <button
            type="submit"
            :disabled="isLoading"
            class="flex items-center justify-center w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <!-- Usuários de teste -->
        <div class="p-4 mt-8 rounded-lg bg-gray-50">
          <h3 class="mb-3 text-sm font-medium text-gray-700">Usuários de Teste:</h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">Cliente:</span>
              <span class="text-gray-800">cliente@test.com / 123</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Admin:</span>
              <span class="text-gray-800">admin@test.com / 123</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">MES:</span>
              <span class="text-gray-800">mes@test.com / 123</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-sm text-blue-200">
          SENAI Roberto Mange - Tecnologia em ADS
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      email: '',
      senha: ''
    })

    const isLoading = computed(() => authStore.isLoading)
    const error = computed(() => authStore.error)

    const handleLogin = async () => {
      authStore.clearError()
      
      const result = await authStore.login(form.value)
      
      if (result.success) {
        // Redirecionar baseado no tipo de usuário
        switch (authStore.user.tipo) {
          case 'cliente':
            router.push('/loja')
            break
          case 'admin':
            router.push('/admin')
            break
          case 'mes':
            router.push('/mes')
            break
          default:
            router.push('/loja')
        }
      }
    }

    return {
      form,
      isLoading,
      error,
      handleLogin
    }
  }
})
</script>