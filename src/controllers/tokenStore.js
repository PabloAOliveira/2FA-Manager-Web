const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'
const TOTP_VERIFIED_KEY = 'totp_verified'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem(ACCESS_KEY, access_token)
  if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token)
}

export function setTotpVerified() {
  sessionStorage.setItem(TOTP_VERIFIED_KEY, 'true')
}

export function isTotpVerified() {
  return sessionStorage.getItem(TOTP_VERIFIED_KEY) === 'true'
}

export function clearTotpVerified() {
  sessionStorage.removeItem(TOTP_VERIFIED_KEY)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  clearTotpVerified()
}

export function isAuthenticated() {
  return !!getAccessToken()
}
