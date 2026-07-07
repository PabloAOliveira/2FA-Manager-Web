import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, isTotpVerified } from '@/controllers/tokenStore'
import * as authController from '@/controllers/authController'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/Register.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/components/Dashboard.vue'),
    meta: { requiresAuth: true, requiresTotpCheck: true },
  },
  {
    path: '/totp/setup',
    name: 'totp-setup',
    component: () => import('@/components/TotpSetup.vue'),
    meta: { requiresAuth: true, requiresTotpCheck: true },
  },
  {
    path: '/totp/verify',
    name: 'totp-verify',
    component: () => import('@/components/TotpVerify.vue'),
    meta: { requiresAuth: true, requiresTotpStep: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authed = isAuthenticated()

  if (to.meta.requiresAuth && !authed) {
    return { name: 'login' }
  }

  if (authed) {
    const needsMeCheck =
      to.meta.requiresTotpCheck ||
      to.meta.requiresTotpStep ||
      to.meta.guest

    let me = null
    if (needsMeCheck) {
      try {
        me = await authController.getMe()
      } catch {
        authController.logout()
        return { name: 'login' }
      }
    }

    const totpActive = me && authController.requiresTotpStepUp(me)
    const totpVerified = isTotpVerified()

    if (to.name === 'totp-verify') {
      if (!totpActive || totpVerified) {
        return { name: 'dashboard' }
      }
    }

    if (to.meta.requiresTotpCheck && totpActive && !totpVerified) {
      return { name: 'totp-verify' }
    }

    if (to.meta.guest) {
      if (totpActive && !totpVerified) {
        return { name: 'totp-verify' }
      }
      return { name: 'dashboard' }
    }
  }

  return true
})

export default router
