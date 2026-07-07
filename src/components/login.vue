<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="glow-card mx-auto pa-8" max-width="440" width="100%">
      <div class="text-h5 font-weight-bold neon-text mb-1">Meu 2FA</div>
      <div class="text-body-2 text-medium-emphasis mb-8">Acesse sua conta</div>

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

      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        prepend-inner-icon="mdi-email-outline"
        autocomplete="email"
        :disabled="loading"
      />

      <v-text-field
        v-model="password"
        label="Senha"
        :type="visible ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        autocomplete="current-password"
        :disabled="loading"
        @click:append-inner="visible = !visible"
      />

      <v-btn
        color="primary"
        size="large"
        block
        class="mt-2 mb-6"
        :loading="loading"
        @click="handleLogin"
      >
        Entrar
      </v-btn>

      <div class="text-center text-body-2">
        Não tem conta?
        <router-link to="/register" class="text-primary text-decoration-none">
          Cadastre-se
        </router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as authController from '@/controllers/authController'

const router = useRouter()

const email = ref('')
const password = ref('')
const visible = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Preencha email e senha.'
    return
  }

  loading.value = true
  try {
    await authController.login({
      email: email.value,
      password: password.value,
    })
    const route = await authController.resolvePostLoginRoute()
    await router.push(route)
  } catch (e) {
    error.value = e.message || 'Falha no login.'
  } finally {
    loading.value = false
  }
}
</script>
