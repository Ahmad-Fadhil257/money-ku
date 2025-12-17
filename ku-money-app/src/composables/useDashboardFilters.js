import { ref, computed } from 'vue'
import { formatDateID, getMonthRange, formatDateAPI } from '@/helpers/dateFormat'

export function useDashboardFilters() {
  const selectedDateFilter = ref('today')
  const selectedAccountId = ref(null)
  const customStartDate = ref('')
  const customEndDate = ref('')

  // Date filter options
  const dateFilterOptions = [
    { label: 'Hari Ini', value: 'today' },
    { label: 'Kemarin', value: 'yesterday' },
    { label: '7 Hari Terakhir', value: 'last7days' },
    { label: '30 Hari Terakhir', value: 'last30days' },
    { label: 'Bulan Ini', value: 'month' },
    { label: 'Custom', value: 'custom' },
  ]

  // Computed date range
  const dateRange = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (selectedDateFilter.value) {
      case 'today': {
        const startDate = new Date(today)
        const endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        return {
          fromDate: formatDateAPI(startDate),
          toDate: formatDateAPI(endDate),
        }
      }
      case 'yesterday': {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const startDate = new Date(yesterday)
        const endDate = new Date(yesterday)
        endDate.setHours(23, 59, 59, 999)
        return {
          fromDate: formatDateAPI(startDate),
          toDate: formatDateAPI(endDate),
        }
      }
      case 'last7days': {
        const startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 6) // 7 days including today
        return {
          fromDate: formatDateAPI(startDate),
          toDate: formatDateAPI(today),
        }
      }
      case 'last30days': {
        const startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 29) // 30 days including today
        return {
          fromDate: formatDateAPI(startDate),
          toDate: formatDateAPI(today),
        }
      }
      case 'month': {
        return getMonthRange(today)
      }
      case 'custom': {
        return {
          fromDate: customStartDate.value || formatDateAPI(today),
          toDate: customEndDate.value || formatDateAPI(today),
        }
      }
      default: {
        const startDate = new Date(today)
        const endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        return {
          fromDate: formatDateAPI(startDate),
          toDate: formatDateAPI(endDate),
        }
      }
    }
  })

  // Selected date filter label
  const selectedDateFilterLabel = computed(() => {
    const option = dateFilterOptions.find((opt) => opt.value === selectedDateFilter.value)
    if (selectedDateFilter.value === 'custom') {
      if (customStartDate.value && customEndDate.value) {
        return `${formatDateID(customStartDate.value)} - ${formatDateID(customEndDate.value)}`
      }
      return 'Pilih Tanggal'
    }
    return option?.label || 'Hari Ini'
  })

  // Reset filters
  const resetFilters = () => {
    selectedDateFilter.value = 'today'
    selectedAccountId.value = null
    customStartDate.value = ''
    customEndDate.value = ''
  }

  return {
    selectedDateFilter,
    selectedAccountId,
    customStartDate,
    customEndDate,
    dateFilterOptions,
    dateRange,
    selectedDateFilterLabel,
    resetFilters,
  }
}
