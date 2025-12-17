import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(null)
  const refreshToken = ref(null)
  const isAuthenticated = ref(false)

  // Computed
  const userStatus = computed(() => user.value?.status || 'free')
  const isVerified = computed(() => user.value?.verified || false)

  // Actions
  const setAuth = (data) => {
    user.value = data.user
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    isAuthenticated.value = true

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
  }

  const clearAuth = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    isAuthenticated.value = false

    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const loadFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedUser && storedAccessToken && storedRefreshToken) {
      user.value = JSON.parse(storedUser)
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken
      isAuthenticated.value = true
    }
  }

  const register = async (data) => {
    const response = await authService.register(data)
    setAuth(response)
    return response
  }

  const login = async (data) => {
    const response = await authService.login(data)
    setAuth(response)
    return response
  }

  const logout = async () => {
    if (refreshToken.value) {
      await authService.logout(refreshToken.value)
    }
    clearAuth()
  }

  const verifyEmail = async (token) => {
    const response = await authService.verifyEmail(token)
    // Update user verified status
    if (user.value) {
      user.value.verified = true
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    return response
  }

  const resendVerification = async (email) => {
    return await authService.resendVerification(email)
  }

  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }
    const response = await authService.refreshToken(refreshToken.value)
    setAuth(response)
    return response
  }

  const updateUser = (userData) => {
    if (userData) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const getMe = async () => {
    const response = await authService.getMe()
    if (response.user) {
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    return response
  }

  const googleLogin = async (idToken) => {
    const response = await authService.googleAuth(idToken)
    setAuth(response)
    return response
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    userStatus,
    isVerified,
    setAuth,
    clearAuth,
    loadFromStorage,
    register,
    login,
    logout,
    verifyEmail,
    resendVerification,
    refreshAccessToken,
    updateUser,
    getMe,
    googleLogin,
  }
})
