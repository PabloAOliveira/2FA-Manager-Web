<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="glow-card mx-auto pa-8" max-width="440" width="100%">
      <div class="text-h5 font-weight-bold neon-text mb-1">Verificação 2FA</div>
      <div class="text-body-2 text-medium-emphasis mb-8">
        Digite o código de 6 dígitos do app Meu 2FA
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
        closable
        @click:close="error = ''"
      >
        {{ error }}
      </v-alert>

      <v-otp-input
        v-model="code"
        length="6"
        type="number"
        class="mb-6"
        :disabled="loading"
      />

      <v-btn
        color="primary"
        size="large"
        block
        class="mb-3"
        :loading="loading"
        :disabled="code.length !== 6"
        @click="handleVerify"
      >
        Verificar
      </v-btn>

      <v-btn
        variant="outlined"
        color="secondary"
        size="large"
        block
        prepend-icon="mdi-logout"
        @click="handleLogout"
      >
        Sair
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as authController from '@/controllers/authController'
import * as totpController from '@/controllers/totpController'
import { setTotpVerified } from '@/controllers/tokenStore'

const router = useRouter()

const code = ref('')
const loading = ref(false)
const error = ref('')

async function handleVerify() {
  if (code.value.length !== 6) return

  loading.value = true
  error.value = ''
  try {
    await totpController.verify(code.value)
    setTotpVerified()
    await router.push('/dashboard')
  } catch (e) {
    error.value = e.message || 'Código inválido. Tente novamente.'
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  authController.logout()
  router.push('/login')
}
</script>
