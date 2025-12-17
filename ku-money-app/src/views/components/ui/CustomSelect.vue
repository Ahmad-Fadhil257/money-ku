<template>
  <div class="relative custom-select-container">
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      :class="[
        'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition flex items-center justify-between',
        disabled
          ? 'bg-gray-100 cursor-not-allowed'
          : 'bg-white cursor-pointer hover:border-gray-400',
        isOpen ? 'ring-2 ring-indigo-600 border-indigo-600' : '',
      ]"
    >
      <span :class="[selectedOption ? 'text-gray-900' : 'text-gray-500']">
        {{ selectedOptionLabel || placeholder }}
      </span>
      <i
        :class="[
          'mdi transition-transform duration-200 text-gray-400',
          isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down',
        ]"
      ></i>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
      @click.stop
    >
      <div v-if="searchable" class="p-3 border-b border-gray-200">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          @click.stop
        />
      </div>
      <div class="py-2">
        <button
          v-if="showEmptyOption"
          type="button"
          @click="selectOption(null)"
          :class="[
            'w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center justify-between',
            modelValue === null || modelValue === ''
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-700',
          ]"
        >
          <span>{{ emptyOptionLabel }}</span>
          <i
            v-if="modelValue === null || modelValue === ''"
            class="mdi mdi-check text-indigo-600"
          ></i>
        </button>
        <button
          v-for="option in filteredOptions"
          :key="getOptionValue(option)"
          type="button"
          @click="selectOption(option)"
          :class="[
            'w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center justify-between',
            isSelected(option) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700',
          ]"
        >
          <span>{{ getOptionLabel(option) }}</span>
          <i v-if="isSelected(option)" class="mdi mdi-check text-indigo-600"></i>
        </button>
        <div v-if="filteredOptions.length === 0" class="px-4 py-3 text-gray-500 text-center">
          Tidak ada data
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Pilih opsi',
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  optionValue: {
    type: String,
    default: 'value',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  searchPlaceholder: {
    type: String,
    default: 'Cari...',
  },
  showEmptyOption: {
    type: Boolean,
    default: false,
  },
  emptyOptionLabel: {
    type: String,
    default: 'Pilih opsi',
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')

const selectedOption = computed(() => {
  if (props.modelValue === null || props.modelValue === '') return null
  return props.options.find((opt) => getOptionValue(opt) === props.modelValue)
})

const selectedOptionLabel = computed(() => {
  if (!selectedOption.value) return null
  return getOptionLabel(selectedOption.value)
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options

  const query = searchQuery.value.toLowerCase()
  return props.options.filter((option) => {
    const label = getOptionLabel(option).toLowerCase()
    return label.includes(query)
  })
})

const getOptionLabel = (option) => {
  if (typeof option === 'string' || typeof option === 'number') return String(option)
  return option[props.optionLabel] || option.title || option.name || String(option)
}

const getOptionValue = (option) => {
  if (typeof option === 'string' || typeof option === 'number') return option
  return option[props.optionValue] || option._id || option.id || option
}

const isSelected = (option) => {
  const value = getOptionValue(option)
  return value === props.modelValue
}

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    searchQuery.value = ''
  }
}

const selectOption = (option) => {
  const value = option === null ? null : getOptionValue(option)
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
  searchQuery.value = ''
}

const handleClickOutside = (event) => {
  if (isOpen.value) {
    const target = event.target
    const container = document.querySelector('.custom-select-container')
    if (container && !container.contains(target)) {
      isOpen.value = false
      searchQuery.value = ''
    }
  }
}

watch(
  () => props.modelValue,
  () => {
    // Close dropdown when value changes externally
    if (!isOpen.value) {
      searchQuery.value = ''
    }
  },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom scrollbar for dropdown */
:deep(.overflow-y-auto)::-webkit-scrollbar {
  width: 6px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
