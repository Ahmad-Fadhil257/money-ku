import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category.service'

export function useCategories() {
  const activeTab = ref('expenses')
  const categories = ref([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const showModal = ref(false)
  const isEditMode = ref(false)
  const selectedCategory = ref(null)

  // Computed properties
  const expensesCount = computed(() => {
    return categories.value.filter((cat) => cat.type === 'expenses').length
  })

  const incomesCount = computed(() => {
    return categories.value.filter((cat) => cat.type === 'incomes').length
  })

  const currentCategories = computed(() => {
    return categories.value.filter((cat) => cat.type === activeTab.value)
  })

  // Fetch categories
  const fetchCategories = async () => {
    try {
      isLoading.value = true
      const response = await getCategories()
      categories.value = response.data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Kategori',
        text: error.message || 'Terjadi kesalahan saat memuat data kategori',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isLoading.value = false
    }
  }

  // Modal functions
  const openCreateModal = () => {
    isEditMode.value = false
    selectedCategory.value = null
    showModal.value = true
  }

  const openEditModal = (category) => {
    isEditMode.value = true
    selectedCategory.value = { ...category }
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    selectedCategory.value = null
    isEditMode.value = false
  }

  // Submit function
  const handleSubmit = async (formData) => {
    try {
      isSubmitting.value = true

      const submitData = {
        title: formData.title,
        icon: formData.icon,
        type: formData.type,
      }

      if (isEditMode.value) {
        // For edit, don't send type (can't be changed)
        await updateCategory(selectedCategory.value._id, {
          title: submitData.title,
          icon: submitData.icon,
        })
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kategori berhasil diperbarui',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        await createCategory(submitData)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kategori berhasil dibuat',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
      }

      closeModal()
      await fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      Swal.fire({
        icon: 'error',
        title: isEditMode.value ? 'Gagal Memperbarui' : 'Gagal Membuat Kategori',
        text: error.message || 'Terjadi kesalahan saat menyimpan data',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isSubmitting.value = false
    }
  }

  // Delete function
  const confirmDelete = (category) => {
    Swal.fire({
      title: 'Hapus Kategori?',
      html: `Apakah Anda yakin ingin menghapus <strong>${category.title}</strong>?<br><small class="text-gray-500">Tindakan ini tidak dapat dibatalkan</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(category._id)
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Kategori berhasil dihapus',
            confirmButtonColor: '#4F46E5',
            timer: 2000,
            showConfirmButton: false,
          })
          await fetchCategories()
        } catch (error) {
          console.error('Error deleting category:', error)
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus',
            text: error.message || 'Terjadi kesalahan saat menghapus kategori',
            confirmButtonColor: '#4F46E5',
          })
        }
      }
    })
  }

  return {
    // State
    activeTab,
    categories,
    isLoading,
    isSubmitting,
    showModal,
    isEditMode,
    selectedCategory,
    // Computed
    expensesCount,
    incomesCount,
    currentCategories,
    // Functions
    fetchCategories,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    confirmDelete,
  }
}
