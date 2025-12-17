<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl"
      >
        <h2 class="text-xl font-bold text-gray-800">
          {{ orderType === 'upgrade' ? 'Upgrade Paket' : 'Perpanjang Langganan' }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Package Info -->
        <div v-if="packageData" class="bg-indigo-50 rounded-xl p-4">
          <h3 class="font-semibold text-gray-800 mb-2 capitalize">{{ packageData.package }}</h3>
          <div class="text-2xl font-bold text-indigo-600 mb-1">
            {{ formatRupiah(packageData.price) }}
          </div>
          <p class="text-sm text-gray-600">per bulan</p>
        </div>

        <!-- Period Selection -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-3">
            Pilih Periode Langganan
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="period in periods"
              :key="period.value"
              type="button"
              @click="selectedPeriod = period.value"
              :class="[
                'px-4 py-3 rounded-xl font-semibold transition border-2',
                selectedPeriod === period.value
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
              ]"
            >
              <div class="text-lg">{{ period.value }}</div>
              <div class="text-xs mt-1">{{ period.label }}</div>
              <div v-if="packageData && packageData.price > 0" class="text-xs mt-1 opacity-75">
                {{ formatRupiah(packageData.price * period.value) }}
              </div>
            </button>
          </div>
        </div>

        <!-- Summary -->
        <div v-if="packageData && packageData.price > 0" class="bg-gray-50 rounded-xl p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">Total Pembayaran</span>
            <span class="text-xl font-bold text-gray-800">
              {{ formatRupiah(totalAmount) }}
            </span>
          </div>
          <p class="text-xs text-gray-500">
            {{ selectedPeriod }} bulan × {{ formatRupiah(packageData.price) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="!selectedPeriod || isCreatingOrder"
            class="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isCreatingOrder">Memproses...</span>
            <span v-else>Lanjutkan</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatRupiah } from '@/helpers/formatCurrency'
import { createOrder, getLastOrder } from '@/services/order.service'
import Swal from 'sweetalert2'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  orderType: {
    type: [String, null],
    default: null,
    validator: (value) => !value || ['upgrade', 'extends'].includes(value),
  },
  packageData: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close', 'submit'])

const selectedPeriod = ref(null)
const isCreatingOrder = ref(false)

const periods = [
  { value: 1, label: '1 Bulan' },
  { value: 3, label: '3 Bulan' },
  { value: 6, label: '6 Bulan' },
  { value: 12, label: '12 Bulan' },
]

const totalAmount = computed(() => {
  if (!props.packageData || !selectedPeriod.value) return 0
  return props.packageData.price * selectedPeriod.value
})

const handleSubmit = async () => {
  if (!selectedPeriod.value || !props.packageData) return

  try {
    isCreatingOrder.value = true

    // Double check: verify no unpaid order exists
    const lastOrder = await getLastOrder()
    if (lastOrder && lastOrder.status === 'unpaid') {
      Swal.fire({
        icon: 'warning',
        title: 'Masih Ada Order Belum Dibayar',
        html: `
          <p class="mb-3">Anda masih memiliki order yang belum dibayar.</p>
          <p class="text-sm text-gray-600 mb-4">
            Paket: <strong>${formatPackageName(lastOrder.package)}</strong><br>
            Jumlah: <strong>${formatRupiah(lastOrder.amount)}</strong><br>
            Periode: <strong>${lastOrder.period} bulan</strong>
          </p>
          <p class="text-sm">Silakan selesaikan pembayaran terlebih dahulu sebelum membuat order baru.</p>
        `,
        confirmButtonColor: '#4F46E5',
        confirmButtonText: 'Lihat Order',
        showCancelButton: true,
        cancelButtonText: 'Tutup',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/app/orders'
        }
      })
      isCreatingOrder.value = false
      return
    }

    const orderData = {
      orderType: props.orderType,
      packageId: props.packageData._id,
      period: {
        type: 'month',
        value: selectedPeriod.value,
      },
    }

    const response = await createOrder(orderData)

    // Redirect to checkout URL
    if (response.checkoutUrl) {
      window.location.href = response.checkoutUrl
    } else {
      throw new Error('Checkout URL tidak ditemukan')
    }
  } catch (error) {
    console.error('Error creating order:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Membuat Order',
      text: error.message || 'Terjadi kesalahan saat membuat order',
      confirmButtonColor: '#4F46E5',
    })
    isCreatingOrder.value = false
  }
}

const formatPackageName = (packageType) => {
  const names = {
    free: 'Free',
    pro: 'Pro',
    unlimited: 'Unlimited',
  }
  return names[packageType] || packageType
}
</script>
