<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="glow-card mx-auto pa-8" max-width="440" width="100%">
      <div class="text-h5 font-weight-bold neon-text mb-1">Meu 2FA</div>
      <div class="text-body-2 text-medium-emphasis mb-8">Crie sua conta</div>

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

      <v-alert
        v-if="success"
        type="success"
        variant="tonal"
        class="mb-4"
      >
        Conta criada! Redirecionando...
      </v-alert>

      <v-text-field
        v-model="name"
        label="Nome"
        prepend-inner-icon="mdi-account-outline"
        autocomplete="name"
        :disabled="loading"
      />

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
        autocomplete="new-password"
        :disabled="loading"
        @click:append-inner="visible = !visible"
      />

      <v-btn
        color="primary"
        size="large"
        block
        class="mt-2 mb-6"
        :loading="loading"
        @click="handleRegister"
      >
        Cadastrar
      </v-btn>

      <div class="text-center text-body-2">
        Já tem conta?
        <router-link to="/login" class="text-primary text-decoration-none">
          Entrar
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

const name = ref('')
const email = ref('')
const password = ref('')
const visible = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = false

  if (!name.value || !email.value || !password.value) {
    error.value = 'Preencha todos os campos.'
    return
  }

  loading.value = true
  try {
    await authController.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    await authController.login({
      email: email.value,
      password: password.value,
    })
    success.value = true
    const route = await authController.resolvePostLoginRoute()
    setTimeout(() => router.push(route), 800)
  } catch (e) {
    error.value = e.message || 'Falha no cadastro.'
  } finally {
    loading.value = false
  }
}
</script>
