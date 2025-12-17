<template>
  <div class="bg-white rounded-xl p-6 border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Pengeluaran per Kategori</h3>
    <div v-if="isLoading">
      <div class="flex justify-center items-center py-8">
        <i class="mdi mdi-loading mdi-spin text-2xl text-indigo-600"></i>
      </div>
    </div>
    <div v-else-if="data && data.length > 0" class="space-y-3">
      <div
        v-for="item in data"
        :key="item.categoryId"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100">
            <i
              v-if="item.categoryIcon && item.categoryIcon.startsWith('mdi')"
              :class="[item.categoryIcon, 'text-xl text-gray-700']"
            ></i>
            <span v-else class="text-xl">{{ item.categoryIcon || '💰' }}</span>
          </div>
          <div>
            <p class="font-medium text-gray-800">{{ item.categoryName }}</p>
            <p v-if="totalAmount > 0" class="text-xs text-gray-500">
              {{ ((item.totalAmount / totalAmount) * 100).toFixed(1) }}%
            </p>
          </div>
        </div>
        <p class="font-semibold text-red-600">{{ formatRupiah(item.totalAmount) }}</p>
      </div>
    </div>
    <EmptyState v-else icon="mdi mdi-chart-pie" message="Belum ada data pengeluaran" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRupiah } from '@/helpers/formatCurrency'
import EmptyState from '@/views/components/ui/EmptyState.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const totalAmount = computed(() => {
  if (!props.data || props.data.length === 0) {
    return 0
  }
  return props.data.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
})
</script>
