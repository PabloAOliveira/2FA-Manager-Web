<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="glow-card mx-auto pa-8" max-width="520" width="100%">
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <div class="text-h5 font-weight-bold neon-text">Dashboard</div>
          <div v-if="user" class="text-body-2 text-medium-emphasis mt-1">
            {{ user.email }}
          </div>
        </div>
        <v-btn
          variant="outlined"
          color="secondary"
          size="small"
          prepend-icon="mdi-logout"
          @click="handleLogout"
        >
          Sair
        </v-btn>
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

      <v-skeleton-loader v-if="loading" type="card" />

      <template v-else-if="user">
        <v-card variant="outlined" class="pa-5 mb-6" style="border-color: rgba(0,229,255,0.2);">
          <div class="text-overline text-medium-emphasis mb-2">Status 2FA</div>
          <div class="d-flex align-center ga-3">
            <v-chip :color="statusColor" variant="flat" size="large">
              <v-icon start :icon="statusIcon" />
              {{ statusLabel }}
            </v-chip>
            <span class="text-body-2 text-medium-emphasis">
              totp_enrolled: {{ user.totp_enrolled ? 'true' : 'false' }}
            </span>
          </div>
        </v-card>

        <v-btn
          v-if="user.totp_status === 'none' || user.totp_status === 'pending'"
          color="primary"
          size="large"
          block
          prepend-icon="mdi-shield-key-outline"
          @click="router.push('/totp/setup')"
        >
          {{ user.totp_status === 'pending' ? 'Continuar setup 2FA' : 'Habilitar 2FA' }}
        </v-btn>

        <v-alert
          v-else
          type="success"
          variant="tonal"
          class="mt-2 mb-4"
        >
          Autenticação de dois fatores está ativa.
        </v-alert>

        <v-btn
          v-if="user.totp_status === 'active'"
          color="error"
          variant="outlined"
          size="large"
          block
          prepend-icon="mdi-shield-off-outline"
          @click="showDisableDialog = true"
        >
          Desabilitar 2FA
        </v-btn>
      </template>
    </v-card>

    <v-dialog v-model="showDisableDialog" max-width="440" persistent>
      <v-card class="glow-card pa-6">
        <div class="text-h6 font-weight-bold neon-text mb-2">Desabilitar 2FA</div>
        <div class="text-body-2 text-medium-emphasis mb-6">
          Digite o código de 6 dígitos do app para confirmar.
        </div>

        <v-alert
          v-if="disableError"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="disableError = ''"
        >
          {{ disableError }}
        </v-alert>

        <v-otp-input
          v-model="disableCode"
          length="6"
          type="number"
          class="mb-6"
          :disabled="disableLoading"
        />

        <v-btn
          color="error"
          size="large"
          block
          class="mb-3"
          :loading="disableLoading"
          :disabled="disableCode.length !== 6"
          @click="handleDisable"
        >
          Confirmar desabilitação
        </v-btn>

        <v-btn
          variant="text"
          block
          :disabled="disableLoading"
          @click="closeDisableDialog"
        >
          Cancelar
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as authController from '@/controllers/authController'
import * as totpController from '@/controllers/totpController'
import { clearTotpVerified } from '@/controllers/tokenStore'

const router = useRouter()

const user = ref(null)
const loading = ref(true)
const error = ref('')
const showDisableDialog = ref(false)
const disableCode = ref('')
const disableLoading = ref(false)
const disableError = ref('')

const statusMap = {
  none: { label: 'Não configurado', color: 'warning', icon: 'mdi-shield-off-outline' },
  pending: { label: 'Aguardando confirmação', color: 'info', icon: 'mdi-shield-sync-outline' },
  active: { label: 'Ativo', color: 'success', icon: 'mdi-shield-check-outline' },
}

const statusLabel = computed(() => statusMap[user.value?.totp_status]?.label ?? '—')
const statusColor = computed(() => statusMap[user.value?.totp_status]?.color ?? 'default')
const statusIcon = computed(() => statusMap[user.value?.totp_status]?.icon ?? 'mdi-shield-outline')

async function loadUser() {
  loading.value = true
  error.value = ''
  try {
    user.value = await authController.getMe()
  } catch (e) {
    error.value = e.message || 'Falha ao carregar perfil.'
  } finally {
    loading.value = false
  }
}

function closeDisableDialog() {
  showDisableDialog.value = false
  disableCode.value = ''
  disableError.value = ''
}

async function handleDisable() {
  if (disableCode.value.length !== 6) return

  disableLoading.value = true
  disableError.value = ''
  try {
    await totpController.disable(disableCode.value)
    clearTotpVerified()
    closeDisableDialog()
    await loadUser()
  } catch (e) {
    disableError.value = e.message || 'Falha ao desabilitar 2FA.'
  } finally {
    disableLoading.value = false
  }
}

function handleLogout() {
  authController.logout()
  router.push('/login')
}

onMounted(loadUser)
</script>
