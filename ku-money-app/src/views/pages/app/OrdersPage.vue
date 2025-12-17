<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Pembayaran</h2>
        <p class="text-gray-600 mt-1">Riwayat pembayaran subscription Anda</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="mdi mdi-loading mdi-spin text-4xl text-indigo-600 mb-2"></i>
        <p class="text-gray-600">Memuat data pembayaran...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="orders.length === 0"
      class="bg-white rounded-xl p-12 text-center border border-gray-200"
    >
      <i class="mdi mdi-receipt text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum ada pembayaran</h3>
      <p class="text-gray-600">Riwayat pembayaran akan muncul di sini</p>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.transactionId"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        @click="openDetailModal(order)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ getPackageName(order.package) }}
              </h3>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  getStatusClass(order.status),
                ]"
              >
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span class="flex items-center gap-2">
                <i class="mdi mdi-cash text-indigo-600"></i>
                {{ formatRupiah(order.amount) }}
              </span>
              <span class="flex items-center gap-2">
                <i class="mdi mdi-calendar text-indigo-600"></i>
                {{ order.period }} {{ order.period === 1 ? 'bulan' : 'bulan' }}
              </span>
              <span class="flex items-center gap-2">
                <i class="mdi mdi-clock-outline text-indigo-600"></i>
                {{ formatDate(order.createdAt) }}
              </span>
            </div>
          </div>
          <button
            @click.stop="openDetailModal(order)"
            class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            title="Lihat Detail"
          >
            <i class="mdi mdi-eye text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          <i class="mdi mdi-chevron-left"></i>
        </button>
        <span class="px-4 py-2 text-sm text-gray-600">
          Halaman {{ pagination.page }} dari {{ pagination.totalPages }}
        </span>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          <i class="mdi mdi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <OrderDetailModal :show="showDetailModal" :order="selectedOrder" @close="closeDetailModal" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { formatRupiah } from '@/helpers/formatCurrency'
import { useOrders } from '@/composables/useOrders'
import OrderDetailModal from '@/views/components/ui/OrderDetailModal.vue'

const {
  isLoading,
  showDetailModal,
  selectedOrder,
  orders,
  pagination,
  getPackageName,
  getStatusClass,
  getStatusText,
  formatDate,
  fetchOrders,
  openDetailModal,
  closeDetailModal,
  changePage,
} = useOrders()

onMounted(() => {
  fetchOrders()
})
</script>
