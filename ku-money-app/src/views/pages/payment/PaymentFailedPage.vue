<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <!-- Failed Icon -->
        <div class="mb-6">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <i class="mdi mdi-close-circle text-5xl text-red-600"></i>
          </div>
        </div>

        <!-- Failed Message -->
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Pembayaran Gagal</h1>
        <p class="text-gray-600 mb-6">
          Maaf, pembayaran Anda gagal diproses. Silakan coba lagi atau hubungi support jika masalah
          berlanjut.
        </p>

        <!-- Order Details -->
        <div v-if="orderData" class="bg-gray-50 rounded-xl p-6 mb-6 text-left space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Transaction ID</span>
            <span class="font-semibold text-gray-800 text-sm">{{ orderData.transactionId }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Status</span>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                getStatusClass(orderData.status),
              ]"
            >
              {{ getStatusText(orderData.status) }}
            </span>
          </div>
          <div v-if="orderData.package" class="flex justify-between items-center">
            <span class="text-gray-600">Paket</span>
            <span class="font-semibold text-gray-800">{{ getPackageName(orderData.package) }}</span>
          </div>
          <div v-if="orderData.amount" class="flex justify-between items-center">
            <span class="text-gray-600">Jumlah</span>
            <span class="font-semibold text-gray-800">{{ formatRupiah(orderData.amount) }}</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="mb-6">
          <p class="text-sm text-gray-600">Memuat informasi...</p>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <RouterLink
            to="/app/subscription"
            class="block w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Coba Lagi
          </RouterLink>
          <RouterLink
            to="/app/dashboard"
            class="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Kembali ke Dashboard
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderStatus } from '@/services/order.service'
import { formatRupiah } from '@/helpers/formatCurrency'

const route = useRoute()

const isLoading = ref(true)
const orderData = ref(null)
const errorMessage = ref('')

const getPackageName = (packageType) => {
  const names = {
    free: 'Free',
    pro: 'Pro',
    unlimited: 'Unlimited',
  }
  return names[packageType] || packageType
}

const getStatusClass = (status) => {
  const classes = {
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700',
    failed: 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusText = (status) => {
  const texts = {
    paid: 'Lunas',
    unpaid: 'Belum Bayar',
    expired: 'Kedaluwarsa',
    failed: 'Gagal',
  }
  return texts[status] || status
}

const getErrorMessage = (status) => {
  const messages = {
    expired: 'Pembayaran Anda telah kedaluwarsa. Silakan buat order baru untuk melanjutkan.',
    failed: 'Pembayaran gagal diproses. Pastikan saldo atau metode pembayaran Anda mencukupi.',
    unpaid: 'Pembayaran belum selesai. Silakan selesaikan pembayaran melalui halaman pembayaran.',
  }
  return messages[status] || 'Terjadi kesalahan saat memproses pembayaran.'
}

const fetchOrderStatus = async () => {
  const transactionId = route.query.transactionId

  if (!transactionId) {
    errorMessage.value = 'Parameter transactionId tidak ditemukan di URL'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    const response = await getOrderStatus(transactionId)
    orderData.value = response

    // Set error message based on status
    if (response.status !== 'paid') {
      errorMessage.value = getErrorMessage(response.status)
    }
  } catch (error) {
    console.error('Error fetching order status:', error)
    errorMessage.value = error.message || 'Terjadi kesalahan saat memuat status pembayaran'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrderStatus()
})
</script>
