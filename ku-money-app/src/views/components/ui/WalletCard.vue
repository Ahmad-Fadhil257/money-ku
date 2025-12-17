<template>
  <div
    class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer relative group"
    @click="$emit('click')"
  >
    <!-- Icon & Actions -->
    <div class="flex items-start justify-between mb-4">
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
        :style="{ backgroundColor: iconBgColor || '#EEF2FF' }"
      >
        <i :class="[icon, 'text-3xl']" :style="{ color: iconColor || '#4F46E5' }"></i>
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

    <!-- Balance -->
    <p class="text-2xl font-bold text-gray-800 mb-3">{{ formattedBalance }}</p>

    <!-- Description -->
    <div v-if="description" class="mt-3">
      <p v-if="description.length <= 50" class="text-sm text-gray-600 line-clamp-2">
        {{ description }}
      </p>
      <div v-else class="relative group/desc" @click.stop>
        <p class="text-sm text-gray-600 line-clamp-2">{{ description.substring(0, 50) }}...</p>
        <!-- Tooltip -->
        <div
          class="absolute z-10 hidden group-hover/desc:block bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg"
        >
          {{ description }}
          <div
            class="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
          ></div>
        </div>
      </div>
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
  balance: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  iconBgColor: {
    type: String,
    default: '',
  },
  iconColor: {
    type: String,
    default: '',
  },
})

defineEmits(['click', 'edit', 'delete'])

const formattedBalance = computed(() => {
  return formatRupiah(props.balance)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
