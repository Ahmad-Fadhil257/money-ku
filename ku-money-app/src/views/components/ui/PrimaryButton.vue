<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    :class="[
      'w-full py-3 px-4 font-semibold transition shadow-md hover:shadow-lg disabled:cursor-not-allowed',
      variant === 'default'
        ? 'bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300'
        : variant === 'rounded-xl'
          ? 'bg-indigo-600 text-white rounded-xl hover:bg-indigo-700/90 disabled:bg-gray-400'
          : 'bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300',
    ]"
    @click="$emit('click')"
  >
    <span v-if="isLoading">
      <i class="mdi mdi-loading mdi-spin mr-2"></i>
      {{ loadingText }}
    </span>
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Memproses...',
  },
  variant: {
    type: String,
    default: 'default', // default, rounded-xl
    validator: (value) => ['default', 'rounded-xl'].includes(value),
  },
})

defineEmits(['click'])
</script>
