<template>
  <svg
    :class="['w-5 h-5 mt-0.5 mr-3 shrink-0', isPopular ? 'text-white' : 'text-primary']"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  </svg>
</template>

<script setup>
defineProps({
  isPopular: {
    type: Boolean,
    default: false,
  },
})
</script>
