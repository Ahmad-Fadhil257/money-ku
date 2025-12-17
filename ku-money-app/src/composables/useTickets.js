import { ref } from 'vue'
import Swal from 'sweetalert2'
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from '@/services/ticket.service'

export function useTickets() {
  const tickets = ref([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const showModal = ref(false)
  const isEditMode = ref(false)
  const selectedTicket = ref(null)

  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      isLoading.value = true
      const response = await getTickets()
      tickets.value = response.data.data || []
    } catch (error) {
      console.error('Error fetching tickets:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Ticket',
        text: error.message || 'Terjadi kesalahan saat memuat data ticket',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isLoading.value = false
    }
  }

  // Modal functions
  const openCreateModal = () => {
    isEditMode.value = false
    selectedTicket.value = null
    showModal.value = true
  }

  const openEditModal = (ticket) => {
    isEditMode.value = true
    selectedTicket.value = { ...ticket }
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    selectedTicket.value = null
    isEditMode.value = false
  }

  // Submit function
  const handleSubmit = async (formData) => {
    try {
      isSubmitting.value = true

      const submitData = {
        subject: formData.subject,
        message: formData.message,
        file: formData.file || "",
      }

      if (isEditMode.value) {
        await updateTicket(selectedTicket.value._id, submitData)

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Ticket berhasil diperbarui',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        await createTicket(submitData)

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Ticket berhasil dibuat',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
      }

      closeModal()
      await fetchTickets()
    } catch (error) {
      console.error('Error saving ticket:', error)
      Swal.fire({
        icon: 'error',
        title: isEditMode.value ? 'Gagal Memperbarui' : 'Gagal Membuat Ticket',
        text: error.message || 'Terjadi kesalahan saat menyimpan ticket',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isSubmitting.value = false
    }
  }

  // Delete Ticket
  const confirmDelete = (ticket) => {
    Swal.fire({
      title: 'Hapus Ticket?',
      html: `Apakah Anda yakin ingin menghapus <strong>${ticket.subject}</strong>?<br><small class="text-gray-500">Tindakan ini tidak dapat dibatalkan</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTicket(ticket._id)

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Ticket berhasil dihapus',
            confirmButtonColor: '#4F46E5',
            timer: 2000,
            showConfirmButton: false,
          })

          await fetchTickets()
        } catch (error) {
          console.error('Error deleting ticket:', error)
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus',
            text: error.message || 'Terjadi kesalahan saat menghapus ticket',
            confirmButtonColor: '#4F46E5',
          })
        }
      }
    })
  }

  return {
    // State
    tickets,
    isLoading,
    isSubmitting,
    showModal,
    isEditMode,
    selectedTicket,

    // Functions
    fetchTickets,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    confirmDelete,
  }
}
