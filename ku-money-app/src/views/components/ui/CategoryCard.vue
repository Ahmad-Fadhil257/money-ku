<template>
  <div
    class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer relative group"
    @click="$emit('click')"
  >
    <!-- Icon & Actions -->
    <div class="flex items-start justify-between mb-4">
      <div class="w-16 h-16 rounded-xl flex items-center justify-center bg-indigo-100">
        <i :class="[icon, 'text-3xl text-indigo-600']"></i>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click.stop="$emit('edit')"
          class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          title="Edit"
        >
          <i class="mdi mdi-pencil text-lg"></i>
        </button>
        <button
          @click.stop="$emit('delete')"
          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Hapus"
        >
          <i class="mdi mdi-delete text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-bold text-gray-800 mb-2">{{ title }}</h3>

    <!-- Amount -->
    <p v-if="amount !== null && amount !== undefined" class="text-2xl font-bold text-gray-800 mb-3">
      {{ formattedAmount }}
    </p>

    <!-- Type Badge -->
    <div class="mt-3">
      <span
        :class="[
          'inline-block px-3 py-1 rounded-full text-xs font-semibold',
          type === 'incomes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
        ]"
      >
        {{ type === 'incomes' ? 'Pemasukan' : 'Pengeluaran' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRupiah } from '@/helpers/formatCurrency'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['incomes', 'expenses'].includes(value),
  },
  amount: {
    type: Number,
    default: null,
  },
})

defineEmits(['click', 'edit', 'delete'])

const formattedAmount = computed(() => {
  return formatRupiah(props.amount || 0)
})
</script>
