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
          {{ isEdit ? 'Edit Dompet' : 'Tambah Dompet Baru' }}
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
        <!-- Title -->
        <FormInput
          id="title"
          v-model="form.title"
          label="Nama Dompet"
          placeholder="Contoh: BCA Savings, E-Wallet"
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
                <i :class="[form.icon || 'mdi mdi-wallet', 'text-2xl text-indigo-600']"></i>
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

        <!-- Balance -->
        <div>
          <label for="balance" class="block text-sm font-semibold text-slate-800 mb-2">
            Saldo Awal
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
              Rp.
            </span>
            <input
              id="balance"
              :value="formattedBalance"
              @input="handleBalanceInput"
              @keypress="handleKeyPress"
              @paste="handlePaste"
              type="text"
              placeholder="0"
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-semibold text-slate-800 mb-2">
            Deskripsi (Opsional)
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            placeholder="Deskripsi dompet..."
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition resize-none"
          ></textarea>
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
            {{ isEdit ? 'Simpan' : 'Buat Dompet' }}
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
  walletData: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  title: '',
  icon: 'mdi mdi-wallet',
  balance: 0,
  description: '',
})

const showIconPicker = ref(false)
const iconSearch = ref('')

// Format balance for display (with thousand separators)
const formattedBalance = computed(() => {
  const balance = form.value.balance
  if (!balance) {
    return ''
  }
  // Format number with Indonesian locale (dot as thousand separator)
  return Number(balance).toLocaleString('id-ID')
})

// Handle keypress - only allow numbers and special keys
const handleKeyPress = (event) => {
  // Allow special keys: backspace, delete, tab, escape, enter, arrow keys
  const specialKeys = [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40]

  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
  if ((event.ctrlKey || event.metaKey) && [65, 67, 86, 88, 90].includes(event.keyCode)) {
    return true
  }

  // Allow special keys
  if (specialKeys.includes(event.keyCode)) {
    return true
  }

  // Only allow numbers (0-9)
  const char = String.fromCharCode(event.which || event.keyCode)
  if (!/[0-9]/.test(char)) {
    event.preventDefault()
    return false
  }

  return true
}

// Handle paste - only allow numbers
const handlePaste = (event) => {
  event.preventDefault()
  const pastedText = (event.clipboardData || window.clipboardData).getData('text')
  // Extract only numbers from pasted text
  const numericValue = pastedText.replace(/[^\d]/g, '')

  if (numericValue) {
    form.value.balance = parseInt(numericValue, 10)
  }
}

// Handle balance input - format display but store as number
const handleBalanceInput = (event) => {
  const input = event.target.value
  // Remove all non-digit characters (including dots and commas from formatting)
  const numericValue = input.replace(/[^\d]/g, '')

  // Update form balance as number (raw number, not formatted)
  if (numericValue === '') {
    form.value.balance = 0
  } else {
    form.value.balance = parseInt(numericValue, 10)
  }

  // Force cursor to end after formatting
  setTimeout(() => {
    const inputElement = event.target
    const length = inputElement.value.length
    inputElement.setSelectionRange(length, length)
  }, 0)
}

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

// Watch for walletData changes (for edit mode)
watch(
  () => props.walletData,
  (newData) => {
    if (newData && props.isEdit) {
      form.value = {
        title: newData.title || '',
        icon: newData.icon || 'mdi mdi-wallet',
        balance: newData.balance || 0,
        description: newData.description || '',
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
        icon: 'mdi mdi-wallet',
        balance: 0,
        description: '',
      }
      showIconPicker.value = false
      iconSearch.value = ''
    } else if (props.walletData && props.isEdit) {
      form.value = {
        title: props.walletData.title || '',
        icon: props.walletData.icon || 'mdi mdi-wallet',
        balance: props.walletData.balance || 0,
        description: props.walletData.description || '',
      }
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
