<template>
  <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
    <div 
      :class="[
        'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
        iconBgColor
      ]"
    >
      <i :class="[icon, 'text-4xl', iconColor]"></i>
    </div>
    <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ title }}</h2>
    <p class="text-gray-600 mb-6">
      <slot />
    </p>
    <slot name="actions" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconBgColor: {
    type: String,
    default: 'bg-indigo-100'
  },
  iconColor: {
    type: String,
    default: 'text-indigo-600'
  }
})
</script>

