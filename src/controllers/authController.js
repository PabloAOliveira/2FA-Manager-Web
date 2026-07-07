import { apiRequest } from './apiClient'
import { setTokens, clearTokens, clearTotpVerified } from './tokenStore'

export async function register({ email, password, name }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: { email, password, name },
    auth: false,
  })
}

export async function login({ email, password }) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
  setTokens(data)
  return data
}

export async function getMe() {
  return apiRequest('/users/me')
}

export function requiresTotpStepUp(me) {
  return me.totp_enrolled && me.totp_status === 'active'
}

export async function resolvePostLoginRoute() {
  const me = await getMe()

  if (requiresTotpStepUp(me)) {
    return '/totp/verify'
  }

  clearTotpVerified()
  return '/dashboard'
}

export function logout() {
  clearTokens()
}
