<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl"
      >
        <h2 class="text-xl font-bold text-gray-800">
          {{ isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
        <!-- Type Selector (only for create, disabled for edit) -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2"> Tipe Kategori </label>
          <CustomSelect
            v-model="form.type"
            :options="categoryTypeOptions"
            :disabled="isEdit"
            placeholder="Pilih Tipe Kategori"
          />
          <p v-if="isEdit" class="text-xs text-gray-500 mt-1">
            Tipe kategori tidak dapat diubah setelah dibuat
          </p>
        </div>

        <!-- Title -->
        <FormInput
          id="title"
          v-model="form.title"
          label="Nama Kategori"
          placeholder="Contoh: Gaji, Makanan, Transportasi"
          required
        />

        <!-- Icon Picker -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2"> Icon </label>
          <div class="relative icon-picker-container">
            <button
              type="button"
              @click="showIconPicker = !showIconPicker"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <i :class="[form.icon || 'mdi mdi-tag', 'text-2xl text-indigo-600']"></i>
                <span class="text-gray-700">{{ form.icon || 'Pilih Icon' }}</span>
              </div>
              <i class="mdi mdi-chevron-down text-gray-400"></i>
            </button>

            <!-- Icon Picker Dropdown -->
            <div
              v-if="showIconPicker"
              class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
              @click.stop
            >
              <div class="p-3">
                <input
                  v-model="iconSearch"
                  type="text"
                  placeholder="Cari icon..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <div class="grid grid-cols-6 gap-2">
                  <button
                    v-for="icon in filteredIcons"
                    :key="icon"
                    type="button"
                    @click="selectIcon(icon)"
                    class="p-3 hover:bg-indigo-50 rounded-lg transition flex items-center justify-center"
                    :class="{ 'bg-indigo-100 border-2 border-indigo-600': form.icon === icon }"
                  >
                    <i :class="[icon, 'text-xl text-indigo-600']"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <PrimaryButton
            type="submit"
            :is-loading="isLoading"
            :loading-text="isEdit ? 'Menyimpan...' : 'Membuat...'"
            variant="rounded-xl"
          >
            {{ isEdit ? 'Simpan' : 'Buat Kategori' }}
          </PrimaryButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import FormInput from './FormInput.vue'
import PrimaryButton from './PrimaryButton.vue'
import CustomSelect from './CustomSelect.vue'
import { walletIcons } from '@/helpers/walletIcons'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  categoryData: {
    type: Object,
    default: null,
  },
  categoryType: {
    type: String,
    default: 'expenses',
    validator: (value) => ['incomes', 'expenses'].includes(value),
  },
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  title: '',
  icon: 'mdi mdi-tag',
  type: 'expenses',
})

const showIconPicker = ref(false)
const iconSearch = ref('')

const categoryTypeOptions = [
  { label: 'Pemasukan', value: 'incomes' },
  { label: 'Pengeluaran', value: 'expenses' },
]

// Filter icons based on search query
const filteredIcons = computed(() => {
  if (!iconSearch.value) return walletIcons
  const search = iconSearch.value.toLowerCase()
  return walletIcons.filter((icon) => icon.toLowerCase().includes(search))
})

const selectIcon = (icon) => {
  form.value.icon = icon
  showIconPicker.value = false
  iconSearch.value = ''
}

// Watch for categoryData changes (for edit mode)
watch(
  () => props.categoryData,
  (newData) => {
    if (newData && props.isEdit) {
      form.value = {
        title: newData.title || '',
        icon: newData.icon || 'mdi mdi-tag',
        type: newData.type || props.categoryType,
      }
    }
  },
  { immediate: true },
)

// Reset form when modal closes
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      form.value = {
        title: '',
        icon: 'mdi mdi-tag',
        type: props.categoryType,
      }
      showIconPicker.value = false
      iconSearch.value = ''
    } else if (props.categoryData && props.isEdit) {
      form.value = {
        title: props.categoryData.title || '',
        icon: props.categoryData.icon || 'mdi mdi-tag',
        type: props.categoryData.type || props.categoryType,
      }
    } else {
      // Set default type based on current tab
      form.value.type = props.categoryType
    }
  },
)

const handleSubmit = () => {
  emit('submit', { ...form.value })
}

// Close icon picker when clicking outside
const handleClickOutside = (event) => {
  if (showIconPicker.value) {
    const target = event.target
    const iconPickerContainer = document.querySelector('.icon-picker-container')
    if (iconPickerContainer && !iconPickerContainer.contains(target)) {
      showIconPicker.value = false
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

<style scoped>
/* Close icon picker when clicking outside */
</style>
