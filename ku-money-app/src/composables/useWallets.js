import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '@/services/account.service'
import { formatRupiah } from '@/helpers/formatCurrency'

export function useWallets() {
  const accounts = ref([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const showModal = ref(false)
  const isEditMode = ref(false)
  const selectedWallet = ref(null)

  // Computed properties
  const formattedTotalBalance = computed(() => {
    const total = accounts.value.reduce((sum, acc) => sum + (acc.balance || 0), 0)
    return formatRupiah(total)
  })

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      isLoading.value = true
      const response = await getAccounts()
      accounts.value = response.data || []
    } catch (error) {
      console.error('Error fetching accounts:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Dompet',
        text: error.message || 'Terjadi kesalahan saat memuat data dompet',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isLoading.value = false
    }
  }

  // Modal functions
  const openCreateModal = () => {
    isEditMode.value = false
    selectedWallet.value = null
    showModal.value = true
  }

  const openEditModal = (wallet) => {
    isEditMode.value = true
    selectedWallet.value = { ...wallet }
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    selectedWallet.value = null
    isEditMode.value = false
  }

  // Submit function
  const handleSubmit = async (formData) => {
    try {
      isSubmitting.value = true

      // Convert balance to number
      const submitData = {
        title: formData.title,
        icon: formData.icon,
        description: formData.description || '',
        balance: Number(formData.balance) || 0,
      }

      if (isEditMode.value) {
        await updateAccount(selectedWallet.value._id, submitData)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Dompet berhasil diperbarui',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        await createAccount(submitData)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Dompet berhasil dibuat',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
      }

      closeModal()
      await fetchAccounts()
    } catch (error) {
      console.error('Error saving account:', error)
      Swal.fire({
        icon: 'error',
        title: isEditMode.value ? 'Gagal Memperbarui' : 'Gagal Membuat Dompet',
        text: error.message || 'Terjadi kesalahan saat menyimpan data',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isSubmitting.value = false
    }
  }

  // Delete function
  const confirmDelete = (wallet) => {
    Swal.fire({
      title: 'Hapus Dompet?',
      html: `Apakah Anda yakin ingin menghapus <strong>${wallet.title}</strong>?<br><small class="text-gray-500">Tindakan ini tidak dapat dibatalkan</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAccount(wallet._id)
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Dompet berhasil dihapus',
            confirmButtonColor: '#4F46E5',
            timer: 2000,
            showConfirmButton: false,
          })
          await fetchAccounts()
        } catch (error) {
          console.error('Error deleting account:', error)
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus',
            text: error.message || 'Terjadi kesalahan saat menghapus dompet',
            confirmButtonColor: '#4F46E5',
          })
        }
      }
    })
  }

  return {
    // State
    accounts,
    isLoading,
    isSubmitting,
    showModal,
    isEditMode,
    selectedWallet,
    // Computed
    formattedTotalBalance,
    // Functions
    fetchAccounts,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    confirmDelete,
  }
}
