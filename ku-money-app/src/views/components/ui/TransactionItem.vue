<template>
  <div
    class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Category Icon -->
    <div
      class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
      :style="{
        backgroundColor: categoryIconBg || '#EEF2FF',
      }"
    >
      <i
        v-if="categoryIcon && categoryIcon.startsWith('mdi')"
        :class="[categoryIcon, 'text-xl']"
        :style="{ color: categoryIconColor || '#4F46E5' }"
      ></i>
      <span v-else class="text-xl">{{ categoryIcon || '💰' }}</span>
    </div>

    <!-- Transaction Details -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <h4 class="font-semibold text-gray-800 truncate">{{ categoryName }}</h4>
        <span class="text-xs text-gray-500 flex items-center gap-1">
          <i
            v-if="accountIcon && accountIcon.startsWith('mdi')"
            :class="[accountIcon, 'text-xs']"
          ></i>
          <span v-else class="text-xs">{{ accountIcon || '💵' }}</span>
          <span class="truncate">{{ accountName }}</span>
        </span>
      </div>
      <p v-if="note" class="text-xs text-gray-500 truncate">{{ note }}</p>
    </div>

    <!-- Amount -->
    <div class="text-right shrink-0">
      <p :class="['font-semibold', isIncome ? 'text-green-600' : 'text-red-600']">
        {{ formattedAmount }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRupiah } from '@/helpers/formatCurrency'

const props = defineProps({
  categoryName: {
    type: String,
    required: true,
  },
  categoryIcon: {
    type: String,
    default: '💰',
  },
  categoryIconBg: {
    type: String,
    default: '',
  },
  categoryIconColor: {
    type: String,
    default: '',
  },
  accountName: {
    type: String,
    required: true,
  },
  accountIcon: {
    type: String,
    default: '💵',
  },
  amount: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: '',
  },
  isIncome: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])

const formattedAmount = computed(() => {
  return formatRupiah(props.amount)
})
</script>
