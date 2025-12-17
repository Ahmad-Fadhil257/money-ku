import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import { getTransactions, createTransaction, updateTransaction } from '@/services/transaction.service'
import { getAccounts } from '@/services/account.service'
import { formatRupiah } from '@/helpers/formatCurrency'
import { getDayNameID, formatDateID, getMonthNameID, getMonthRange } from '@/helpers/dateFormat'

export function useTransactions() {
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const showModal = ref(false)
  const isEditMode = ref(false)
  const selectedTransaction = ref(null)
  const showMonthPicker = ref(false)
  const monthPickerValue = ref('')

  const currentDate = ref(new Date())
  const transactionGroups = ref([])
  const totalBalance = ref(0)

  // Computed properties
  const formattedTotalBalance = computed(() => {
    return formatRupiah(totalBalance.value)
  })

  const formattedCurrentMonth = computed(() => {
    const month = getMonthNameID(currentDate.value)
    const year = currentDate.value.getFullYear()
    return `${month} ${year}`
  })

  const isCurrentMonth = computed(() => {
    const now = new Date()
    return (
      currentDate.value.getMonth() === now.getMonth() &&
      currentDate.value.getFullYear() === now.getFullYear()
    )
  })

  // Helper functions
  const getDayNumber = (dateString) => {
    const date = new Date(dateString)
    return date.getDate()
  }

  const getDayName = (dateString) => {
    return getDayNameID(dateString)
  }

  const getFullDate = (dateString) => {
    return formatDateID(dateString)
  }

  const getCategoryName = (transaction) => {
    return transaction.categoryId?.title || transaction.categorySnapshot || 'Kategori Dihapus'
  }

  const getCategoryIcon = (transaction) => {
    return transaction.categoryId?.icon || '💰'
  }

  const getCategoryIconBg = (transaction) => {
    const type = transaction.categoryId?.type
    if (type === 'incomes') return '#D1FAE5' // green-100
    if (type === 'expenses') return '#FEE2E2' // red-100
    return '#EEF2FF' // indigo-100
  }

  const getCategoryIconColor = (transaction) => {
    const type = transaction.categoryId?.type
    if (type === 'incomes') return '#059669' // green-600
    if (type === 'expenses') return '#DC2626' // red-600
    return '#4F46E5' // indigo-600
  }

  const getAccountName = (transaction) => {
    return transaction.accountId?.title || transaction.accountSnapshot || 'Dompet Dihapus'
  }

  const getAccountIcon = (transaction) => {
    return transaction.accountId?.icon || '💵'
  }

  const getIsIncome = (transaction) => {
    return transaction.categoryId?.type === 'incomes'
  }

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      isLoading.value = true
      const { startDate, endDate } = getMonthRange(currentDate.value)

      const response = await getTransactions({
        grouped: true,
        startDate,
        endDate,
      })

      transactionGroups.value = response.data || []

      // Fetch accounts to get total balance
      try {
        const accountsResponse = await getAccounts()
        const accounts = accountsResponse.data || []
        totalBalance.value = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
      } catch (error) {
        console.error('Error fetching accounts for balance:', error)
        // Fallback: calculate from transactions
        const incomes = transactionGroups.value.reduce(
          (sum, group) => sum + (group.totalIncomes || 0),
          0,
        )
        const expenses = transactionGroups.value.reduce(
          (sum, group) => sum + (group.totalExpenses || 0),
          0,
        )
        totalBalance.value = incomes - expenses
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Transaksi',
        text: error.message || 'Terjadi kesalahan saat memuat data transaksi',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isLoading.value = false
    }
  }

  // Navigation functions
  const previousMonth = () => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    currentDate.value = new Date(year, month - 1, 1)
    fetchTransactions()
  }

  const nextMonth = () => {
    if (isCurrentMonth.value) return

    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    currentDate.value = new Date(year, month + 1, 1)
    fetchTransactions()
  }

  const selectMonthFromPicker = (event) => {
    const selectedValue = event.target.value
    if (selectedValue) {
      const [year, month] = selectedValue.split('-')
      currentDate.value = new Date(parseInt(year), parseInt(month) - 1, 1)
      showMonthPicker.value = false
      monthPickerValue.value = selectedValue
      fetchTransactions()
    }
  }

  // Modal functions
  const openCreateModal = () => {
    isEditMode.value = false
    selectedTransaction.value = null
    showModal.value = true
  }

  const openEditModal = (transaction) => {
    isEditMode.value = true
    selectedTransaction.value = { ...transaction }
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    selectedTransaction.value = null
    isEditMode.value = false
  }

  // Submit function
  const handleSubmit = async (formData) => {
    try {
      isSubmitting.value = true

      const submitData = {
        accountId: formData.accountId,
        categoryId: formData.categoryId,
        amount: Number(formData.amount) || 0,
        note: formData.note || '',
        paymentDate: formData.paymentDate,
      }

      if (isEditMode.value) {
        await updateTransaction(selectedTransaction.value._id, submitData)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Transaksi berhasil diperbarui',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        await createTransaction(submitData)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Transaksi berhasil dibuat',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
      }

      closeModal()
      await fetchTransactions()
    } catch (error) {
      console.error('Error saving transaction:', error)
      Swal.fire({
        icon: 'error',
        title: isEditMode.value ? 'Gagal Memperbarui' : 'Gagal Membuat Transaksi',
        text: error.message || 'Terjadi kesalahan saat menyimpan data',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    // State
    isLoading,
    isSubmitting,
    showModal,
    isEditMode,
    selectedTransaction,
    showMonthPicker,
    monthPickerValue,
    currentDate,
    transactionGroups,
    totalBalance,
    // Computed
    formattedTotalBalance,
    formattedCurrentMonth,
    isCurrentMonth,
    // Helper functions
    getDayNumber,
    getDayName,
    getFullDate,
    getCategoryName,
    getCategoryIcon,
    getCategoryIconBg,
    getCategoryIconColor,
    getAccountName,
    getAccountIcon,
    getIsIncome,
    // Functions
    fetchTransactions,
    previousMonth,
    nextMonth,
    selectMonthFromPicker,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
  }
}

