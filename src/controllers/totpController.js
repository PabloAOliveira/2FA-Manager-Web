import { apiRequest, ApiError } from './apiClient'

export async function setup() {
  return apiRequest('/totp/setup', { method: 'POST' })
}

export async function verifySetup(code) {
  return apiRequest('/totp/verify-setup', {
    method: 'POST',
    body: { code },
  })
}

export async function verify(code) {
  const data = await apiRequest('/totp/verify', {
    method: 'POST',
    body: { code },
  })

  if (!data?.valid) {
    throw new ApiError('Código inválido. Tente novamente.', 200, data)
  }

  return data
}

export async function disable(code) {
  return apiRequest('/totp/disable', {
    method: 'POST',
    body: { code },
  })
}
