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
        <h2 class="text-xl font-bold text-gray-800">Detail Pembayaran</h2>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div v-if="order" class="p-6 space-y-6">
        <!-- Status Badge -->
        <div class="text-center">
          <span
            :class="[
              'inline-block px-4 py-2 rounded-full text-sm font-semibold',
              getStatusClass(order.status),
            ]"
          >
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <!-- Transaction Info -->
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-600">Transaction ID</span>
            <span class="font-semibold text-gray-800 text-sm">{{ order.transactionId }}</span>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-600">Paket</span>
            <span class="font-semibold text-gray-800">{{ getPackageName(order.package) }}</span>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-600">Periode</span>
            <span class="font-semibold text-gray-800">{{ order.period }} bulan</span>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-600">Jumlah</span>
            <span class="font-semibold text-gray-800">{{ formatRupiah(order.amount) }}</span>
          </div>

          <div
            v-if="order.paymentMethod"
            class="flex items-center justify-between py-3 border-b border-gray-100"
          >
            <span class="text-gray-600">Metode Pembayaran</span>
            <span class="font-semibold text-gray-800">{{
              formatPaymentMethod(order.paymentMethod)
            }}</span>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <span class="text-gray-600">Tanggal Pembayaran</span>
            <span class="font-semibold text-gray-800">{{ formatDate(order.createdAt) }}</span>
          </div>

          <div
            v-if="order.expiresAt"
            class="flex items-center justify-between py-3 border-b border-gray-100"
          >
            <span class="text-gray-600">Kedaluwarsa</span>
            <span class="font-semibold text-gray-800">{{ formatDate(order.expiresAt) }}</span>
          </div>
        </div>

        <!-- Package Details -->
        <div v-if="packageInfo" class="bg-indigo-50 rounded-xl p-4 space-y-3">
          <h3 class="font-semibold text-gray-800 mb-3">Detail Paket</h3>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Kategori</span>
              <span class="font-medium text-gray-800">
                {{ formatLimit(packageInfo.category) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Dompet</span>
              <span class="font-medium text-gray-800">
                {{ formatLimit(packageInfo.account) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Pemasukan</span>
              <span class="font-medium text-gray-800">
                {{ formatLimit(packageInfo.incomes) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Pengeluaran</span>
              <span class="font-medium text-gray-800">
                {{ formatLimit(packageInfo.expenses) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Checkout URL Button -->
        <div v-if="order.status === 'unpaid' && order.checkoutUrl" class="pt-4">
          <a
            :href="order.checkoutUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full block text-center py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            <i class="mdi mdi-external-link mr-2"></i>
            Bayar Sekarang
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { formatRupiah } from '@/helpers/formatCurrency'
import { formatDateID } from '@/helpers/dateFormat'
import { getPackages } from '@/services/package.service'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Object,
    default: null,
  },
})

defineEmits(['close'])

const getPackageName = (packageType) => {
  const packageNames = {
    free: 'Free',
    pro: 'Pro',
    unlimited: 'Unlimited',
  }
  return packageNames[packageType] || packageType
}

const getStatusClass = (status) => {
  const statusClasses = {
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700',
    failed: 'bg-red-100 text-red-700',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-700'
}

const getStatusText = (status) => {
  const statusTexts = {
    paid: 'Lunas',
    unpaid: 'Belum Bayar',
    expired: 'Kedaluwarsa',
    failed: 'Gagal',
  }
  return statusTexts[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return formatDateID(dateString)
}

const formatPaymentMethod = (method) => {
  const methods = {
    VIRTUAL_ACCOUNT: 'Virtual Account',
    E_WALLET: 'E-Wallet',
    CREDIT_CARD: 'Kartu Kredit',
    RETAIL_OUTLET: 'Retail Outlet',
  }
  return methods[method] || method
}

const formatLimit = (value) => {
  if (value === 0 || value === null || value === undefined) return 'Unlimited'
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}Jt`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toString()
}

const packageInfo = ref(null)

// Fetch package details when order changes
watch(
  () => props.order,
  async (newOrder) => {
    if (newOrder?.package) {
      try {
        const response = await getPackages()
        const packages = response.data || []
        const packageDetail = packages.find((pkg) => pkg.package === newOrder.package)

        if (packageDetail) {
          packageInfo.value = {
            category: packageDetail.category,
            account: packageDetail.account,
            incomes: packageDetail.incomes,
            expenses: packageDetail.expenses,
          }
        }
      } catch (error) {
        console.error('Error fetching package details:', error)
        packageInfo.value = null
      }
    } else {
      packageInfo.value = null
    }
  },
  { immediate: true },
)
</script>
