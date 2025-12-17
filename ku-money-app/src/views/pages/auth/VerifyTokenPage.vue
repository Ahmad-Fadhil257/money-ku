<template>
  <div
    class="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <LogoBrand />
      </div>

      <!-- Loading State -->
      <StatusCard
        v-if="isVerifying"
        title="Memverifikasi Email..."
        icon="mdi mdi-loading mdi-spin"
        icon-bg-color="bg-indigo-100"
        icon-color="text-indigo-600"
      >
        Mohon tunggu sebentar
      </StatusCard>

      <!-- Success State -->
      <StatusCard
        v-else-if="verificationSuccess"
        title="Email Terverifikasi!"
        icon="mdi mdi-check-circle"
        icon-bg-color="bg-green-100"
        icon-color="text-green-600"
      >
        Akun Anda telah berhasil diaktifkan dengan status
        <span class="font-bold text-indigo-600">FREE</span>
        <template #actions>
          <RouterLink
            to="/app/dashboard"
            class="inline-block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Masuk ke Dashboard
          </RouterLink>
        </template>
      </StatusCard>

      <!-- Error State -->
      <StatusCard
        v-else
        title="Verifikasi Gagal"
        icon="mdi mdi-close-circle"
        icon-bg-color="bg-red-100"
        icon-color="text-red-600"
      >
        {{ errorMessage }}
        <template #actions>
          <RouterLink
            to="/auth/verify-email"
            class="inline-block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition mb-3"
          >
            Kirim Ulang Email Verifikasi
          </RouterLink>

          <RouterLink
            to="/auth/login"
            class="inline-block text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Kembali ke Login
          </RouterLink>
        </template>
      </StatusCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import LogoBrand from '@/views/components/ui/LogoBrand.vue'
import StatusCard from '@/views/components/ui/StatusCard.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isVerifying = ref(true)
const verificationSuccess = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const token = route.params.token

  if (!token) {
    isVerifying.value = false
    errorMessage.value = 'Token verifikasi tidak ditemukan'
    return
  }

  try {
    // Verify email
    await authStore.verifyEmail(token)

    isVerifying.value = false
    verificationSuccess.value = true

    // Get redirect path from query or default to dashboard
    const redirectPath = route.query.redirect || '/app/dashboard'

    // Show success alert
    await Swal.fire({
      icon: 'success',
      title: 'Email Terverifikasi!',
      html: `
        <p>Selamat! Akun Anda telah berhasil diaktifkan.</p>
        <p class="mt-2">Status akun: <strong class="text-indigo-600">FREE</strong></p>
      `,
      confirmButtonColor: '#4F46E5',
      confirmButtonText: 'Lanjut ke Dashboard',
    })

    // Redirect to intended page or dashboard
    router.push(redirectPath)
  } catch (error) {
    isVerifying.value = false
    verificationSuccess.value = false
    errorMessage.value = error.message || 'Token tidak valid atau sudah kadaluarsa'
  }
})
</script>
