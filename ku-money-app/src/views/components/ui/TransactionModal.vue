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
          {{ isEdit ? 'Edit Transaksi' : 'Tambah Transaksi Baru' }}
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
        <!-- Type Selector -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2"> Tipe Transaksi </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="transactionType = 'expenses'"
              :class="[
                'px-4 py-3 rounded-xl font-semibold transition border-2',
                transactionType === 'expenses'
                  ? 'bg-red-50 border-red-500 text-red-600'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
              ]"
            >
              <i class="mdi mdi-trending-down mr-2"></i>
              Pengeluaran
            </button>
            <button
              type="button"
              @click="transactionType = 'incomes'"
              :class="[
                'px-4 py-3 rounded-xl font-semibold transition border-2',
                transactionType === 'incomes'
                  ? 'bg-green-50 border-green-500 text-green-600'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
              ]"
            >
              <i class="mdi mdi-trending-up mr-2"></i>
              Pemasukan
            </button>
          </div>
        </div>

        <!-- Account Selector -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2"> Dompet </label>
          <CustomSelect
            v-model="form.accountId"
            :options="accounts"
            option-label="title"
            option-value="_id"
            placeholder="Pilih Dompet"
            show-empty-option
            empty-option-label="Pilih Dompet"
            required
          />
        </div>

        <!-- Category Selector -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2"> Kategori </label>
          <CategorySelect
            v-model="form.categoryId"
            :categories="filteredCategories"
            placeholder="Pilih Kategori"
          />
        </div>

        <!-- Amount -->
        <div>
          <label for="amount" class="block text-sm font-semibold text-slate-800 mb-2">
            Jumlah
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
              Rp.
            </span>
            <input
              id="amount"
              :value="formattedAmount"
              @input="handleAmountInput"
              @keypress="handleKeyPress"
              @paste="handlePaste"
              type="text"
              placeholder="0"
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <!-- Payment Date -->
        <div>
          <label for="paymentDate" class="block text-sm font-semibold text-slate-800 mb-2">
            Tanggal Transaksi
          </label>
          <input
            id="paymentDate"
            v-model="form.paymentDate"
            type="date"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
            required
          />
        </div>

        <!-- Note -->
        <div>
          <label for="note" class="block text-sm font-semibold text-slate-800 mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            id="note"
            v-model="form.note"
            rows="3"
            placeholder="Catatan transaksi..."
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
            {{ isEdit ? 'Simpan' : 'Buat Transaksi' }}
          </PrimaryButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PrimaryButton from './PrimaryButton.vue'
import CategorySelect from './CategorySelect.vue'
import CustomSelect from './CustomSelect.vue'
import { getAccounts } from '@/services/account.service'
import { getCategories } from '@/services/category.service'
import { formatDateAPI } from '@/helpers/dateFormat'

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
  transactionData: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const transactionType = ref('expenses')
const accounts = ref([])
const categories = ref([])

const form = ref({
  accountId: '',
  categoryId: '',
  amount: 0,
  note: '',
  paymentDate: formatDateAPI(new Date()),
})

// Format amount for display
const formattedAmount = computed(() => {
  const amount = form.value.amount
  if (!amount) return ''
  return Number(amount).toLocaleString('id-ID')
})

// Filter categories based on transaction type
const filteredCategories = computed(() => {
  return categories.value.filter((cat) => cat.type === transactionType.value)
})

// Handle keypress - only allow numbers
const handleKeyPress = (event) => {
  const specialKeys = [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40]

  if ((event.ctrlKey || event.metaKey) && [65, 67, 86, 88, 90].includes(event.keyCode)) {
    return true
  }

  if (specialKeys.includes(event.keyCode)) {
    return true
  }

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
  const numericValue = pastedText.replace(/[^\d]/g, '')

  if (numericValue) {
    form.value.amount = parseInt(numericValue, 10)
  }
}

// Handle amount input
const handleAmountInput = (event) => {
  const input = event.target.value
  const numericValue = input.replace(/[^\d]/g, '')

  if (numericValue === '') {
    form.value.amount = 0
  } else {
    form.value.amount = parseInt(numericValue, 10)
  }

  setTimeout(() => {
    const inputElement = event.target
    const length = inputElement.value.length
    inputElement.setSelectionRange(length, length)
  }, 0)
}

// Watch transaction type change - reset category only if not in edit mode
watch(transactionType, () => {
  // Only reset category if we're not in edit mode to prevent clearing selected category when editing
  if (!props.isEdit || !props.transactionData) {
    form.value.categoryId = ''
  }
})

// Watch for transactionData changes (for edit mode)
watch(
  () => props.transactionData,
  (newData) => {
    if (newData && props.isEdit) {
      // Determine category type from transaction data
      // Priority: categoryId?.type > default to 'expenses'
      let categoryType = 'expenses'
      if (newData.categoryId?.type) {
        categoryType = newData.categoryId.type
      }

      // Set transaction type first
      transactionType.value = categoryType

      // Then set form data after a microtask to ensure transactionType is set
      // This prevents the watch on transactionType from clearing categoryId
      Promise.resolve().then(() => {
        form.value = {
          accountId: newData.accountId?._id || '',
          categoryId: newData.categoryId?._id || '',
          amount: newData.amount || 0,
          note: newData.note || '',
          paymentDate: newData.paymentDate
            ? formatDateAPI(new Date(newData.paymentDate))
            : formatDateAPI(new Date()),
        }
      })
    }
  },
  { immediate: true },
)

// Reset form when modal closes
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      transactionType.value = 'expenses'
      form.value = {
        accountId: '',
        categoryId: '',
        amount: 0,
        note: '',
        paymentDate: formatDateAPI(new Date()),
      }
    } else if (props.transactionData && props.isEdit) {
      // Edit mode: set transaction type and form data
      let categoryType = 'expenses'
      if (props.transactionData.categoryId?.type) {
        categoryType = props.transactionData.categoryId.type
      }

      // Set transaction type first
      transactionType.value = categoryType

      // Then set form data after transaction type is set
      // Use nextTick to ensure transactionType watcher doesn't interfere
      Promise.resolve().then(() => {
        form.value = {
          accountId: props.transactionData.accountId?._id || '',
          categoryId: props.transactionData.categoryId?._id || '',
          amount: props.transactionData.amount || 0,
          note: props.transactionData.note || '',
          paymentDate: props.transactionData.paymentDate
            ? formatDateAPI(new Date(props.transactionData.paymentDate))
            : formatDateAPI(new Date()),
        }
      })
    }

    // Fetch accounts and categories when modal opens
    if (newVal) {
      fetchAccounts()
      fetchCategories()
    }
  },
)

const fetchAccounts = async () => {
  try {
    const response = await getAccounts()
    accounts.value = response.data || []
  } catch (error) {
    console.error('Error fetching accounts:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>
