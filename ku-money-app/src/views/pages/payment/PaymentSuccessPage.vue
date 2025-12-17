<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <!-- Success Icon -->
        <div class="mb-6">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <i class="mdi mdi-check-circle text-5xl text-green-600"></i>
          </div>
        </div>

        <!-- Success Message -->
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h1>
        <p class="text-gray-600 mb-6">Terima kasih, pembayaran Anda telah berhasil diproses.</p>

        <!-- Order Details -->
        <div v-if="orderData" class="bg-gray-50 rounded-xl p-6 mb-6 text-left space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Transaction ID</span>
            <span class="font-semibold text-gray-800 text-sm">{{ orderData.transactionId }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Paket</span>
            <span class="font-semibold text-gray-800">{{ getPackageName(orderData.package) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Periode</span>
            <span class="font-semibold text-gray-800">{{ orderData.period }} bulan</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Jumlah</span>
            <span class="font-semibold text-gray-800">{{ formatRupiah(orderData.amount) }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="mb-6">
          <p class="text-sm text-gray-600">Memproses pembayaran...</p>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <RouterLink
            to="/app/subscription"
            class="block w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Lihat Langganan
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
import { useAuthStore } from '@/stores/auth'
import { getOrderStatus } from '@/services/order.service'
import { formatRupiah } from '@/helpers/formatCurrency'
import Swal from 'sweetalert2'

const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(true)
const orderData = ref(null)

const getPackageName = (packageType) => {
  const names = {
    free: 'Free',
    pro: 'Pro',
    unlimited: 'Unlimited',
  }
  return names[packageType] || packageType
}

const fetchOrderStatus = async () => {
  const transactionId = route.query.transactionId

  if (!transactionId) {
    Swal.fire({
      icon: 'error',
      title: 'Transaction ID Tidak Ditemukan',
      text: 'Parameter transactionId tidak ditemukan di URL',
      confirmButtonColor: '#4F46E5',
    })
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    const response = await getOrderStatus(transactionId)
    orderData.value = response

    // Update user status if payment is successful
    if (response.status === 'paid' && response.package) {
      authStore.updateUser({ status: response.package })
    }
  } catch (error) {
    console.error('Error fetching order status:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Data',
      text: error.message || 'Terjadi kesalahan saat memuat status pembayaran',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrderStatus()
})
</script>
