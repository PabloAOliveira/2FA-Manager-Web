<template>
  <v-container class="d-flex justify-center align-center fill-height py-8">
    <v-card class="glow-card mx-auto pa-8" max-width="560" width="100%">
      <div class="text-h5 font-weight-bold neon-text mb-1">Configurar 2FA</div>
      <div class="text-body-2 text-medium-emphasis mb-6">
        Escaneie o QR no app Meu 2FA e confirme o código
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

      <v-stepper
        v-model="step"
        alt-labels
        flat
        bg-color="transparent"
        color="primary"
      >
        <v-stepper-header>
          <v-stepper-item :value="1" title="QR Code" />
          <v-divider />
          <v-stepper-item :value="2" title="Confirmar" />
          <v-divider />
          <v-stepper-item :value="3" title="Recovery" />
        </v-stepper-header>

        <v-stepper-window>
          <!-- Step 1: QR Code -->
          <v-stepper-window-item :value="1">
            <div class="text-center py-4">
              <v-progress-circular
                v-if="setupLoading"
                indeterminate
                color="primary"
                size="64"
                class="my-8"
              />

              <template v-else-if="otpauthUri">
                <div class="qr-wrapper mx-auto mb-6">
                  <QrcodeVue
                    :value="otpauthUri"
                    :size="220"
                    level="M"
                    render-as="svg"
                    foreground="#00e5ff"
                    background="#111827"
                  />
                </div>

                <v-alert type="info" variant="tonal" class="text-left mb-4">
                  Abra o app <strong>Meu 2FA</strong>, escaneie este QR code e use o código de 6 dígitos na próxima etapa.
                </v-alert>

                <v-text-field
                  :model-value="otpauthUri"
                  label="otpauth_uri"
                  readonly
                  class="mono"
                  density="compact"
                >
                  <template #append-inner>
                    <v-btn
                      icon="mdi-content-copy"
                      variant="text"
                      size="small"
                      @click="copyUri"
                    />
                  </template>
                </v-text-field>

                <v-btn color="primary" size="large" block class="mt-4" @click="step = 2">
                  Já escaneei — continuar
                </v-btn>
              </template>
            </div>
          </v-stepper-window-item>

          <!-- Step 2: Confirm code -->
          <v-stepper-window-item :value="2">
            <div class="py-4">
              <div class="text-h6 mb-2">Confirme seu autenticador</div>
              <div class="text-body-2 text-medium-emphasis mb-6">
                Digite o código de 6 dígitos exibido no app Meu 2FA.
              </div>

              <v-otp-input
                v-model="code"
                length="6"
                type="number"
                class="mb-4"
                :disabled="verifyLoading"
              />

              <v-btn
                color="primary"
                size="large"
                block
                :loading="verifyLoading"
                :disabled="code.length !== 6"
                @click="handleVerify"
              >
                Verificar código
              </v-btn>

              <v-btn variant="text" block class="mt-2" @click="step = 1">
                Voltar ao QR
              </v-btn>
            </div>
          </v-stepper-window-item>

          <!-- Step 3: Recovery codes -->
          <v-stepper-window-item :value="3">
            <div class="py-4">
              <v-alert type="warning" variant="tonal" prominent class="mb-6">
                <strong>Guarde estes códigos agora!</strong> Eles só serão exibidos uma vez. Use-os se perder acesso ao autenticador.
              </v-alert>

              <v-card variant="outlined" class="pa-4 mb-6" style="border-color: rgba(0,229,255,0.2);">
                <div
                  v-for="(rc, i) in recoveryCodes"
                  :key="i"
                  class="mono text-body-1 py-1"
                  style="color: #00e5ff;"
                >
                  {{ rc }}
                </div>
              </v-card>

              <v-btn
                color="primary"
                size="large"
                block
                prepend-icon="mdi-content-copy"
                class="mb-3"
                @click="copyRecoveryCodes"
              >
                Copiar códigos
              </v-btn>

              <v-btn
                color="success"
                size="large"
                block
                @click="router.push('/dashboard')"
              >
                Concluir
              </v-btn>
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>

      <v-btn variant="text" block class="mt-4" @click="router.push('/dashboard')">
        Cancelar
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import * as totpController from '@/controllers/totpController'

const router = useRouter()

const step = ref(1)
const otpauthUri = ref('')
const code = ref('')
const recoveryCodes = ref([])
const setupLoading = ref(false)
const verifyLoading = ref(false)
const error = ref('')

async function loadSetup() {
  setupLoading.value = true
  error.value = ''
  try {
    const data = await totpController.setup()
    otpauthUri.value = data.otpauth_uri
  } catch (e) {
    error.value = e.message || 'Falha ao iniciar setup 2FA.'
  } finally {
    setupLoading.value = false
  }
}

async function handleVerify() {
  if (code.value.length !== 6) return

  verifyLoading.value = true
  error.value = ''
  try {
    const data = await totpController.verifySetup(code.value)
    recoveryCodes.value = data.recovery_codes || []
    step.value = 3
  } catch (e) {
    error.value = e.message || 'Código inválido. Tente novamente.'
  } finally {
    verifyLoading.value = false
  }
}

async function copyUri() {
  try {
    await navigator.clipboard.writeText(otpauthUri.value)
  } catch {
    /* clipboard may be unavailable */
  }
}

async function copyRecoveryCodes() {
  try {
    await navigator.clipboard.writeText(recoveryCodes.value.join('\n'))
  } catch {
    /* clipboard may be unavailable */
  }
}

onMounted(loadSetup)
</script>

<style scoped>
.qr-wrapper {
  display: inline-flex;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(0, 229, 255, 0.25);
  background: #111827;
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.1);
}
</style>
