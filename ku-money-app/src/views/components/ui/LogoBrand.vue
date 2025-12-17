<template>
  <RouterLink
    :to="to"
    :class="[
      'inline-block font-bold text-indigo-600 transition',
      size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl',
    ]"
  >
    Duit<span class="text-slate-800">‑Ku</span>
  </RouterLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    default: '/',
  },
  size: {
    type: String,
    default: 'lg', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})
</script>
