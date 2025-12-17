<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Langganan</h2>
      <p class="text-gray-600 mt-1">Kelola paket subscription Anda</p>
    </div>

    <!-- Expired Warning Banner -->
    <div
      v-if="showExpiredWarning"
      class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg"
    >
      <div class="flex items-start">
        <div class="shrink-0">
          <i class="mdi mdi-alert-circle text-red-600 text-2xl"></i>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-lg font-semibold text-red-800 mb-2">Langganan Anda Telah Kedaluwarsa</h3>
          <p class="text-red-700 mb-3">
            <span class="font-semibold">{{ formattedExpiredDate }}</span
            >. Untuk melanjutkan menggunakan aplikasi, silakan perpanjang langganan Anda.
          </p>
          <div v-if="expiredStatus" class="text-sm text-red-600">
            <p>
              <i class="mdi mdi-calendar-clock mr-1"></i>
              Kedaluwarsa:
              <span class="font-semibold">{{ formattedExpiredDate }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Subscription Card -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Paket Saat Ini</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ getPackageName(currentStatus) }}
          </p>
        </div>
        <span
          :class="[
            'px-4 py-2 rounded-full text-sm font-semibold',
            getStatusBadgeClass(currentStatus),
          ]"
        >
          {{ getPackageName(currentStatus) }}
        </span>
      </div>

      <!-- Subscription Details -->
      <div v-if="subscription" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div>
          <p class="text-xs text-gray-600 mb-1">Kategori</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ formatLimit(subscription.limitCategory) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-1">Dompet</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ formatLimit(subscription.limitAccount) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-1">Pemasukan</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ formatLimit(subscription.limitIncomes) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-1">Pengeluaran</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ formatLimit(subscription.limitExpenses) }}
          </p>
        </div>
      </div>

      <!-- Expired Date -->
      <div v-if="expiredAt && currentStatus !== 'free'" class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-600 mb-1">Berlaku Hingga</p>
            <p class="text-lg font-semibold text-gray-800">{{ formattedExpiredAt }}</p>
          </div>
          <div
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              isExpired
                ? 'bg-red-100 text-red-700'
                : isExpiredSoon
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-green-100 text-green-700',
            ]"
          >
            <span v-if="isExpired">Kedaluwarsa</span>
            <span v-else-if="isExpiredSoon">Akan Kedaluwarsa</span>
            <span v-else>Aktif</span>
          </div>
        </div>
        <p v-if="daysUntilExpiry !== null" class="text-xs text-gray-500 mt-2">
          {{ daysUntilExpiryText }}
        </p>
      </div>
    </div>

    <!-- Available Packages / Extend Options -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Upgrade to Pro (if free) -->
      <div
        v-if="currentStatus === 'free' && proPackage"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
      >
        <div class="text-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Pro</h3>
          <div class="text-3xl font-extrabold text-indigo-600 mb-1">
            {{ formatRupiah(proPackage.price) }}
          </div>
          <p class="text-sm text-gray-600">per bulan</p>
        </div>

        <ul class="space-y-2 mb-6 text-sm text-gray-600">
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(proPackage.category) }} Kategori</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(proPackage.account) }} Dompet</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(proPackage.incomes) }} Pemasukan</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(proPackage.expenses) }} Pengeluaran</span>
          </li>
        </ul>

        <button
          @click="openOrderModal('upgrade', proPackage)"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Upgrade ke Pro
        </button>
      </div>

      <!-- Upgrade to Unlimited (if free or pro) -->
      <div
        v-if="(currentStatus === 'free' || currentStatus === 'pro') && unlimitedPackage"
        class="bg-white rounded-xl border-2 border-indigo-600 p-6 hover:shadow-lg transition relative"
      >
        <div
          class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
        >
          Paling Populer
        </div>

        <div class="text-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Unlimited</h3>
          <div class="text-3xl font-extrabold text-indigo-600 mb-1">
            {{ formatRupiah(unlimitedPackage.price) }}
          </div>
          <p class="text-sm text-gray-600">per bulan</p>
        </div>

        <ul class="space-y-2 mb-6 text-sm text-gray-600">
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>Unlimited Kategori</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>Unlimited Dompet</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>Unlimited Pemasukan</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>Unlimited Pengeluaran</span>
          </li>
        </ul>

        <button
          @click="openOrderModal('upgrade', unlimitedPackage)"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          {{ currentStatus === 'free' ? 'Upgrade ke Unlimited' : 'Upgrade ke Unlimited' }}
        </button>
      </div>

      <!-- Extend Subscription (if pro or unlimited) -->
      <div
        v-if="(currentStatus === 'pro' || currentStatus === 'unlimited') && currentPackage"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
      >
        <div class="text-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Perpanjang</h3>
          <div class="text-3xl font-extrabold text-indigo-600 mb-1">
            {{ formatRupiah(currentPackage.price) }}
          </div>
          <p class="text-sm text-gray-600">per bulan</p>
        </div>

        <ul class="space-y-2 mb-6 text-sm text-gray-600">
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(currentPackage.category) }} Kategori</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(currentPackage.account) }} Dompet</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(currentPackage.incomes) }} Pemasukan</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(currentPackage.expenses) }} Pengeluaran</span>
          </li>
        </ul>

        <button
          @click="openOrderModal('extends', currentPackage)"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Perpanjang Langganan
        </button>
      </div>
    </div>

    <!-- Order Modal -->
    <OrderModal
      v-if="selectedOrderType && selectedPackage"
      :show="showOrderModal"
      :order-type="selectedOrderType"
      :package-data="selectedPackage"
      :is-loading="false"
      @close="closeOrderModal"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { formatRupiah } from '@/helpers/formatCurrency'
import { useSubscription } from '@/composables/useSubscription'
import OrderModal from '@/views/components/ui/OrderModal.vue'

const route = useRoute()

const {
  subscription,
  expiredStatus,
  showOrderModal,
  selectedOrderType,
  selectedPackage,
  showExpiredWarning,
  formattedExpiredDate,
  currentStatus,
  currentPackage,
  proPackage,
  unlimitedPackage,
  expiredAt,
  formattedExpiredAt,
  isExpired,
  isExpiredSoon,
  daysUntilExpiry,
  daysUntilExpiryText,
  getPackageName,
  getStatusBadgeClass,
  formatLimit,
  fetchPackages,
  fetchSubscription,
  fetchExpiredStatus,
  checkPaymentStatus,
  openOrderModal,
  closeOrderModal,
} = useSubscription()

onMounted(async () => {
  // Check if redirected due to expired
  if (route.query.expired === 'true') {
    await fetchExpiredStatus()
    Swal.fire({
      icon: 'warning',
      title: 'Langganan Telah Kedaluwarsa',
      html: `
        <p class="text-sm text-gray-600">
          Untuk melanjutkan menggunakan aplikasi, silakan perpanjang langganan Anda.
        </p>
      `,
      confirmButtonColor: '#4F46E5',
      confirmButtonText: 'Perpanjang Langganan',
    })
  }

  await Promise.all([fetchPackages(), fetchSubscription()])
  // Fetch expired status if not already fetched
  if (!expiredStatus.value) {
    await fetchExpiredStatus()
  }
  checkPaymentStatus()
})
</script>
