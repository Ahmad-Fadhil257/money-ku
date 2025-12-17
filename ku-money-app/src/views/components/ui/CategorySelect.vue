<template>
  <div class="relative category-select-container">
    <button
      type="button"
      @click.stop="showDropdown = !showDropdown"
      :disabled="disabled"
      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <span v-if="selectedCategory" class="text-2xl shrink-0">
          <i
            v-if="selectedCategory.icon && selectedCategory.icon.startsWith('mdi')"
            :class="[selectedCategory.icon, 'text-indigo-600']"
          ></i>
          <span v-else>{{ selectedCategory.icon || '💰' }}</span>
        </span>
        <span v-else class="text-2xl shrink-0 text-gray-400">
          <i class="mdi mdi-tag"></i>
        </span>
        <span class="text-gray-700 truncate">
          {{ selectedCategory ? selectedCategory.title : placeholder }}
        </span>
      </div>
      <i class="mdi mdi-chevron-down text-gray-400 shrink-0"></i>
    </button>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
      @click.stop
    >
      <div class="p-2">
        <input
          v-if="searchable"
          v-model="searchQuery"
          type="text"
          placeholder="Cari kategori..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <div class="space-y-1">
          <button
            v-for="category in filteredCategories"
            :key="category._id"
            type="button"
            @click="selectCategory(category)"
            class="w-full px-3 py-2 hover:bg-indigo-50 rounded-lg transition flex items-center gap-3 text-left"
            :class="{
              'bg-indigo-100 border-2 border-indigo-600': selectedCategory?._id === category._id,
            }"
          >
            <span class="text-xl shrink-0">
              <i
                v-if="category.icon && category.icon.startsWith('mdi')"
                :class="[category.icon, 'text-indigo-600']"
              ></i>
              <span v-else>{{ category.icon || '💰' }}</span>
            </span>
            <span class="text-gray-700 flex-1">{{ category.title }}</span>
          </button>
          <div
            v-if="filteredCategories.length === 0"
            class="px-3 py-4 text-center text-gray-500 text-sm"
          >
            Tidak ada kategori ditemukan
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Pilih Kategori',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const showDropdown = ref(false)
const searchQuery = ref('')

const selectedCategory = computed(() => {
  if (!props.modelValue) return null
  return props.categories.find((cat) => cat._id === props.modelValue) || null
})

const filteredCategories = computed(() => {
  let filtered = props.categories

  if (props.searchable && searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (cat) =>
        cat.title.toLowerCase().includes(query) ||
        (cat.icon && cat.icon.toLowerCase().includes(query)),
    )
  }

  return filtered
})

const selectCategory = (category) => {
  emit('update:modelValue', category._id)
  showDropdown.value = false
  searchQuery.value = ''
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (showDropdown.value) {
    const target = event.target
    const container = document.querySelector('.category-select-container')
    if (container && !container.contains(target)) {
      showDropdown.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
