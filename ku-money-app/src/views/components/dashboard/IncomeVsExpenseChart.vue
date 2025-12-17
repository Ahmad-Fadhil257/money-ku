<template>
  <div class="bg-white rounded-xl p-6 border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Pemasukan vs Pengeluaran</h3>
    <div v-if="isLoading">
      <div class="flex justify-center items-center py-8">
        <i class="mdi mdi-loading mdi-spin text-2xl text-indigo-600"></i>
      </div>
    </div>
    <div v-else-if="data && data.length > 0" class="space-y-3">
      <div v-for="item in data.slice(0, 7)" :key="item.period" class="p-3 bg-gray-50 rounded-lg">
        <p class="text-xs font-medium text-gray-600 mb-2">
          {{ formatPeriod(item.period) }}
        </p>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Pemasukan:</span>
            <span class="text-sm font-semibold text-green-600">
              {{ formatRupiah(item.income) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Pengeluaran:</span>
            <span class="text-sm font-semibold text-red-600">
              {{ formatRupiah(item.expenses) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <EmptyState v-else icon="mdi mdi-chart-bar" message="Belum ada data" />
  </div>
</template>

<script setup>
import { formatRupiah } from '@/helpers/formatCurrency'
import { formatDateID } from '@/helpers/dateFormat'
import EmptyState from '@/views/components/ui/EmptyState.vue'

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const formatPeriod = (period) => {
  // Format YYYY-MM-DD or YYYY-MM to readable format
  if (period.includes('-') && period.length === 10) {
    // Daily format: YYYY-MM-DD
    return formatDateID(period)
  } else if (period.includes('-') && period.length === 7) {
    // Monthly format: YYYY-MM
    const [year, month] = period.split('-')
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]
    return `${months[parseInt(month) - 1]} ${year}`
  }
  return period
}
</script>
