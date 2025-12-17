<template>
  <div
    class="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <LogoBrand />
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-6">
          <div
            class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="mdi mdi-email-check text-4xl text-indigo-600"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Verifikasi Email</h2>
          <p class="text-gray-600">
            Kami telah mengirim email verifikasi ke
            <span class="font-semibold">{{ userEmail }}</span>
          </p>
        </div>

        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-indigo-800">
            <i class="mdi mdi-information mr-1"></i>
            Silakan cek inbox atau folder spam Anda dan klik link verifikasi yang kami kirim.
          </p>
        </div>

        <!-- Resend Button -->
        <button
          @click="handleResend"
          :disabled="isLoading || countdown > 0"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition mb-4"
        >
          <span v-if="isLoading">
            <i class="mdi mdi-loading mdi-spin mr-2"></i>
            Mengirim ulang...
          </span>
          <span v-else-if="countdown > 0"> Kirim ulang dalam {{ countdown }}s </span>
          <span v-else>
            <i class="mdi mdi-email-sync mr-2"></i>
            Kirim Ulang Email
          </span>
        </button>

        <!-- Back to Login -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Sudah verifikasi?
            <RouterLink
              to="/auth/login"
              class="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Login Sekarang
            </RouterLink>
          </p>
        </div>
      </div>

      <!-- Help Text -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-600">
          Tidak menerima email?
          <a
            href="mailto:support@kumoney.com"
            class="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Hubungi Support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import LogoBrand from '@/views/components/ui/LogoBrand.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(false)
const countdown = ref(0)
let countdownInterval = null

const userEmail = computed(
  () => authStore.user?.email || localStorage.getItem('pendingEmail') || '',
)

const handleResend = async () => {
  if (countdown.value > 0 || isLoading.value) return

  try {
    isLoading.value = true
    await authStore.resendVerification(userEmail.value)

    Swal.fire({
      icon: 'success',
      title: 'Email Terkirim!',
      text: 'Kami telah mengirim ulang email verifikasi. Silakan cek inbox Anda.',
      confirmButtonColor: '#4F46E5',
    })

    // Start countdown
    countdown.value = 60
    startCountdown()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mengirim Email',
      text: error.message || 'Terjadi kesalahan saat mengirim email verifikasi',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isLoading.value = false
  }
}

const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)

  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
}

const checkUserVerificationStatus = async () => {
  // Load auth from storage first
  authStore.loadFromStorage()

  // If user is authenticated, check verification status
  if (authStore.isAuthenticated) {
    try {
      // Fetch latest user data from API
      await authStore.getMe()

      // Check if user is now verified
      if (authStore.isVerified) {
        // Redirect to dashboard
        const redirectPath = route.query.redirect || '/app/dashboard'
        router.push(redirectPath)
      }
    } catch (error) {
      // If error (e.g., token expired), ignore and continue
      console.error('Error checking user status:', error)
    }
  }
}

onMounted(async () => {
  // Check user verification status on mount/refresh
  await checkUserVerificationStatus()

  // Check if email exists
  if (!userEmail.value) {
    Swal.fire({
      icon: 'error',
      title: 'Email Tidak Ditemukan',
      text: 'Silakan register terlebih dahulu',
      confirmButtonColor: '#4F46E5',
    }).then(() => {
      window.location.href = '/register'
    })
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>
