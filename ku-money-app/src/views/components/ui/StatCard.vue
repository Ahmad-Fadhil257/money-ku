<template>
  <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
    <div class="flex items-center justify-between mb-4">
      <div 
        :class="[
          'w-12 h-12 rounded-lg flex items-center justify-center',
          iconBgColor || 'bg-indigo-100'
        ]"
      >
        <i :class="[icon, 'text-2xl', iconColor || 'text-indigo-600']"></i>
      </div>
    </div>
    <p class="text-sm text-gray-600 mb-1">{{ label }}</p>
    <p 
      :class="[
        'text-2xl font-bold',
        valueColor || 'text-gray-800'
      ]"
    >
      {{ value }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
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
  },
  valueColor: {
    type: String,
    default: 'text-gray-800'
  }
})
</script>

