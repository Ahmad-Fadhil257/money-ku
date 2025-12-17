import { ref } from 'vue'
import Swal from 'sweetalert2'
import { getUserOrders, getOrderStatus } from '@/services/order.service'
import { formatDateID } from '@/helpers/dateFormat'

export function useOrders() {
  const isLoading = ref(false)
  const showDetailModal = ref(false)
  const selectedOrder = ref(null)
  const orders = ref([])
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  // Helper functions
  const getPackageName = (packageType) => {
    const packageNames = {
      free: 'Free',
      pro: 'Pro',
      unlimited: 'Unlimited',
    }
    return packageNames[packageType] || packageType
  }

  const getStatusClass = (status) => {
    const statusClasses = {
      paid: 'bg-green-100 text-green-700',
      unpaid: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-red-100 text-red-700',
      failed: 'bg-red-100 text-red-700',
    }
    return statusClasses[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusText = (status) => {
    const statusTexts = {
      paid: 'Lunas',
      unpaid: 'Belum Bayar',
      expired: 'Kedaluwarsa',
      failed: 'Gagal',
    }
    return statusTexts[status] || status
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return formatDateID(dateString)
  }

  // Fetch orders
  const fetchOrders = async () => {
    try {
      isLoading.value = true
      const response = await getUserOrders({
        page: pagination.value.page,
        limit: pagination.value.limit,
      })

      orders.value = response.orders || []
      pagination.value = {
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 1,
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: error.message || 'Terjadi kesalahan saat memuat riwayat pembayaran',
        confirmButtonColor: '#4F46E5',
      })
    } finally {
      isLoading.value = false
    }
  }

  const openDetailModal = async (order) => {
    try {
      selectedOrder.value = order
      showDetailModal.value = true

      // Fetch order status
      const statusResponse = await getOrderStatus(order.transactionId)
      selectedOrder.value = { ...order, ...statusResponse }
    } catch (error) {
      console.error('Error fetching order details:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Detail',
        text: error.message || 'Terjadi kesalahan saat memuat detail pembayaran',
        confirmButtonColor: '#4F46E5',
      })
    }
  }

  const closeDetailModal = () => {
    showDetailModal.value = false
    selectedOrder.value = null
  }

  const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.page = page
      fetchOrders()
    }
  }

  return {
    // State
    isLoading,
    showDetailModal,
    selectedOrder,
    orders,
    pagination,
    // Functions
    getPackageName,
    getStatusClass,
    getStatusText,
    formatDate,
    fetchOrders,
    openDetailModal,
    closeDetailModal,
    changePage,
  }
}
