<template>
  <div class="flex items-center justify-center h-64 text-gray-400">
    <div class="text-center">
      <i :class="[icon, 'text-6xl mb-2']"></i>
      <p>{{ message }}</p>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'mdi mdi-file-document-outline'
  },
  message: {
    type: String,
    default: 'Belum ada data'
  }
})
</script>

