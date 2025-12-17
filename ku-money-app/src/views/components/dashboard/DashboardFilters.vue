<template>
  <div class="flex items-center gap-3 flex-wrap">
    <!-- Account Filter Dropdown -->
    <div class="relative">
      <button
        @click="showAccountFilter = !showAccountFilter"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <i class="mdi mdi-wallet"></i>
        <span>{{ selectedAccountLabel }}</span>
        <i class="mdi mdi-chevron-down"></i>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showAccountFilter"
        class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto"
        @click.stop
      >
        <div class="py-2">
          <button
            @click="handleSelectAccount(null)"
            :class="[
              'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between',
              selectedAccountId === null ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700',
            ]"
          >
            <span>Semua Dompet</span>
            <i v-if="selectedAccountId === null" class="mdi mdi-check text-indigo-600"></i>
          </button>
          <button
            v-for="account in accounts"
            :key="account._id"
            @click="handleSelectAccount(account._id)"
            :class="[
              'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between',
              selectedAccountId === account._id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700',
            ]"
          >
            <div class="flex items-center gap-2">
              <i
                v-if="account.icon && account.icon.startsWith('mdi')"
                :class="[account.icon, 'text-lg']"
              ></i>
              <span v-else class="text-lg">{{ account.icon || '💵' }}</span>
              <span>{{ account.title }}</span>
            </div>
            <i v-if="selectedAccountId === account._id" class="mdi mdi-check text-indigo-600"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Date Filter Dropdown -->
    <div class="relative">
      <button
        @click="showDateFilter = !showDateFilter"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <i class="mdi mdi-calendar-range"></i>
        <span>{{ selectedDateFilterLabel }}</span>
        <i class="mdi mdi-chevron-down"></i>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showDateFilter"
        class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
        @click.stop
      >
        <div class="py-2">
          <button
            v-for="option in dateFilterOptions"
            :key="option.value"
            @click="handleSelectDateFilter(option.value)"
            :class="[
              'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between',
              selectedDateFilter === option.value
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700',
            ]"
          >
            <span>{{ option.label }}</span>
            <i v-if="selectedDateFilter === option.value" class="mdi mdi-check text-indigo-600"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Date Range Input -->
    <div v-if="selectedDateFilter === 'custom'" class="flex items-center gap-2">
      <input
        :model-value="customStartDate"
        @update:model-value="updateCustomStartDate"
        type="date"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        @change="handleApplyCustomDate"
      />
      <span class="text-gray-500">s/d</span>
      <input
        :model-value="customEndDate"
        @update:model-value="updateCustomEndDate"
        type="date"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        @change="handleApplyCustomDate"
      />
    </div>
  </div>

  <!-- Click outside to close dropdown -->
  <div
    v-if="showDateFilter || showAccountFilter"
    class="fixed inset-0 z-10"
    @click="closeDropdown"
  ></div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDateID, getMonthRange } from '@/helpers/dateFormat'

const props = defineProps({
  accounts: {
    type: Array,
    default: () => [],
  },
  selectedAccountId: {
    type: String,
    default: null,
  },
  selectedDateFilter: {
    type: String,
    default: 'today',
  },
  customStartDate: {
    type: String,
    default: '',
  },
  customEndDate: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'update:selectedAccountId',
  'update:selectedDateFilter',
  'update:customStartDate',
  'update:customEndDate',
  'filter-change',
])

const showAccountFilter = ref(false)
const showDateFilter = ref(false)

// Date filter options
const dateFilterOptions = [
  { label: 'Hari Ini', value: 'today' },
  { label: 'Kemarin', value: 'yesterday' },
  { label: '7 Hari Terakhir', value: 'last7days' },
  { label: '30 Hari Terakhir', value: 'last30days' },
  { label: 'Bulan Ini', value: 'month' },
  { label: 'Custom', value: 'custom' },
]

// Selected account label
const selectedAccountLabel = computed(() => {
  if (!props.selectedAccountId) {
    return 'Semua Dompet'
  }
  const account = props.accounts.find((acc) => acc._id === props.selectedAccountId)
  return account ? account.title : 'Semua Dompet'
})

// Selected date filter label
const selectedDateFilterLabel = computed(() => {
  const option = dateFilterOptions.find((opt) => opt.value === props.selectedDateFilter)
  if (props.selectedDateFilter === 'custom') {
    if (props.customStartDate && props.customEndDate) {
      return `${formatDateID(props.customStartDate)} - ${formatDateID(props.customEndDate)}`
    }
    return 'Pilih Tanggal'
  }
  return option?.label || 'Hari Ini'
})

const handleSelectAccount = (accountId) => {
  emit('update:selectedAccountId', accountId)
  showAccountFilter.value = false
  emit('filter-change')
}

const handleSelectDateFilter = (value) => {
  emit('update:selectedDateFilter', value)
  showDateFilter.value = false

  // Set default custom dates if custom is selected
  if (value === 'custom') {
    const monthRange = getMonthRange()
    emit('update:customStartDate', monthRange.startDate)
    emit('update:customEndDate', monthRange.endDate)
  }

  emit('filter-change')
}

const updateCustomStartDate = (value) => {
  emit('update:customStartDate', value)
}

const updateCustomEndDate = (value) => {
  emit('update:customEndDate', value)
}

const handleApplyCustomDate = () => {
  if (props.customStartDate && props.customEndDate) {
    emit('filter-change')
  }
}

const closeDropdown = () => {
  showDateFilter.value = false
  showAccountFilter.value = false
}
</script>
