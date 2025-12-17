import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

export function useGoogleAuth() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const isLoading = ref(false)
  const isGoogleLoaded = ref(false)

  // Handle Google OAuth response
  const handleGoogleResponse = async (response) => {
    if (isLoading.value) return

    try {
      isLoading.value = true

      // Call backend API with idToken
      await authStore.googleLogin(response.credential)

      // Google OAuth users are automatically verified
      // Redirect to intended page or dashboard
      const redirectPath = route.query.redirect || '/app/dashboard'
      router.push(redirectPath)
    } catch (error) {
      console.error('Google Auth error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.message || 'Terjadi kesalahan saat login dengan Google. Silakan coba lagi.',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isLoading.value = false
    }
  }

  // Initialize Google Identity Services
  const initializeGoogleAuth = () => {
    if (typeof window === 'undefined' || !window.google) {
      return
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.warn('Google Client ID not found in environment variables')
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      isGoogleLoaded.value = true
    } catch (error) {
      console.error('Error initializing Google Auth:', error)
    }
  }

  // Trigger Google One Tap prompt (optional - can be called after initialization)
  const promptOneTap = () => {
    if (!isGoogleLoaded.value || typeof window === 'undefined' || !window.google) {
      return
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // One Tap not displayed (user dismissed or not eligible)
          // This is normal behavior, user can still use the button
        }
      })
    } catch (error) {
      console.error('Error prompting One Tap:', error)
    }
  }

  return {
    isLoading,
    isGoogleLoaded,
    promptOneTap,
    initializeGoogleAuth,
    handleGoogleResponse,
  }
}
