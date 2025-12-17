import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

export function useAuth() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const isLoading = ref(false)
  const isGoogleLoading = ref(false)

  const handleLogin = async (form) => {
    if (isLoading.value) return

    try {
      isLoading.value = true

      // Call login API
      await authStore.login({
        email: form.email,
        password: form.password,
      })

      // Check if user is verified
      if (!authStore.isVerified) {
        // Not verified, save pending email and redirect to verify email page
        localStorage.setItem('pendingEmail', form.email)
        router.push({
          path: '/auth/verify-email',
          query: route.query.redirect ? { redirect: route.query.redirect } : {},
        })
      } else {
        // Verified, redirect to intended page or dashboard
        const redirectPath = route.query.redirect || '/app/dashboard'
        router.push(redirectPath)
      }
    } catch (error) {
      console.error('Login error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.message || 'Email atau password salah. Silakan coba lagi.',
        confirmButtonColor: '#4F46E5',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const handleRegister = async (form) => {
    if (isLoading.value) return

    try {
      isLoading.value = true

      // Call register API
      await authStore.register({
        name: form.name,
        email: form.email,
        password: form.password,
      })

      // Save email to localStorage for verification page
      localStorage.setItem('pendingEmail', form.email)

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Silakan cek email Anda untuk verifikasi akun',
        confirmButtonColor: '#4F46E5',
      })

      // Redirect to verify email page
      router.push('/auth/verify-email')
    } catch (error) {
      console.error('Register error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
        confirmButtonColor: '#4F46E5',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const handleGoogleLogin = async (idToken) => {
    if (isGoogleLoading.value) return

    try {
      isGoogleLoading.value = true

      // Call Google login API
      await authStore.googleLogin(idToken)

      // Google OAuth users are automatically verified
      // Redirect to intended page or dashboard
      const redirectPath = route.query.redirect || '/app/dashboard'
      router.push(redirectPath)
    } catch (error) {
      console.error('Google login error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.message || 'Terjadi kesalahan saat login dengan Google. Silakan coba lagi.',
        confirmButtonColor: '#4F46E5',
      })
      throw error
    } finally {
      isGoogleLoading.value = false
    }
  }

  return {
    isLoading,
    isGoogleLoading,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
  }
}
