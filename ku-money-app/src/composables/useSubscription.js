import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getPackages } from '@/services/package.service'
import { getSubscription, getExpiredStatus } from '@/services/subscription.service'
import { getOrderStatus, getLastOrder } from '@/services/order.service'
import { formatDateID } from '@/helpers/dateFormat'
import { formatRupiah } from '@/helpers/formatCurrency'
import Swal from 'sweetalert2'

export function useSubscription() {
  const route = useRoute()
  const authStore = useAuthStore()

  const isLoading = ref(false)
  const packages = ref([])
  const subscription = ref(null)
  const expiredStatus = ref(null)
  const showOrderModal = ref(false)
  const selectedOrderType = ref(null)
  const selectedPackage = ref(null)

  // Check if expired warning should be shown
  const showExpiredWarning = computed(() => {
    return route.query.expired === 'true' || expiredStatus.value?.isExpired
  })

  const formattedExpiredDate = computed(() => {
    if (expiredStatus.value?.expiredAt) {
      return formatDateID(expiredStatus.value.expiredAt)
    }
    if (subscription.value?.expiredAt) {
      return formatDateID(subscription.value.expiredAt)
    }
    return '-'
  })

  // Computed properties
  const currentStatus = computed(() => authStore.userStatus)

  const currentPackage = computed(() => {
    if (!currentStatus.value) return null
    return packages.value.find((pkg) => pkg.package === currentStatus.value)
  })

  const proPackage = computed(() => {
    return packages.value.find((pkg) => pkg.package === 'pro')
  })

  const unlimitedPackage = computed(() => {
    return packages.value.find((pkg) => pkg.package === 'unlimited')
  })

  const expiredAt = computed(() => {
    return subscription.value?.expiredAt || null
  })

  const formattedExpiredAt = computed(() => {
    if (!expiredAt.value) return '-'
    return formatDateID(expiredAt.value)
  })

  const isExpired = computed(() => {
    if (!expiredAt.value) return false
    const expiryDate = new Date(expiredAt.value)
    const now = new Date()
    return expiryDate < now
  })

  const isExpiredSoon = computed(() => {
    if (!expiredAt.value || isExpired.value) return false
    const expiryDate = new Date(expiredAt.value)
    const now = new Date()
    const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  })

  const daysUntilExpiry = computed(() => {
    if (!expiredAt.value) return null
    const expiryDate = new Date(expiredAt.value)
    const now = new Date()
    const days = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24))
    return days
  })

  const daysUntilExpiryText = computed(() => {
    if (daysUntilExpiry.value === null) return ''
    if (daysUntilExpiry.value < 0) return 'Langganan telah kedaluwarsa'
    if (daysUntilExpiry.value === 0) return 'Langganan akan kedaluwarsa hari ini'
    if (daysUntilExpiry.value === 1) return 'Tersisa 1 hari lagi'
    return `Tersisa ${daysUntilExpiry.value} hari lagi`
  })

  // Helper functions
  const getPackageName = (packageType) => {
    const names = {
      free: 'Free',
      pro: 'Pro',
      unlimited: 'Unlimited',
    }
    return names[packageType] || packageType
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      free: 'bg-gray-100 text-gray-700',
      pro: 'bg-indigo-100 text-indigo-700',
      unlimited: 'bg-amber-100 text-amber-700',
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
  }

  const formatLimit = (value) => {
    if (value === 0 || value === null || value === undefined) return 'Unlimited'
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}Jt`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  // Fetch functions
  const fetchPackages = async () => {
    try {
      isLoading.value = true
      const response = await getPackages()
      packages.value = response.data || []
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSubscription = async () => {
    try {
      const response = await getSubscription()
      subscription.value = response.subscription || null
    } catch (error) {
      console.error('Error fetching subscription:', error)
      if (error.code === 'NO_SUBSCRIPTION') {
        subscription.value = null
      }
    }
  }

  const fetchExpiredStatus = async () => {
    try {
      const response = await getExpiredStatus()
      expiredStatus.value = response
    } catch (error) {
      console.error('Error fetching expired status:', error)
      expiredStatus.value = null
    }
  }

  // Check for order status in URL params (after payment redirect)
  const checkPaymentStatus = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const transactionId = urlParams.get('transaction_id')
    const status = urlParams.get('status')

    if (transactionId && status) {
      try {
        // Check order status
        const orderStatus = await getOrderStatus(transactionId)

        if (orderStatus.status === 'paid') {
          // Update user status in store
          authStore.updateUser({ status: orderStatus.package })

          Swal.fire({
            icon: 'success',
            title: 'Pembayaran Berhasil!',
            text: `Paket ${getPackageName(orderStatus.package)} berhasil diaktifkan`,
            confirmButtonColor: '#4F46E5',
          })

          // Remove query params from URL
          window.history.replaceState({}, '', window.location.pathname)

          // Refresh subscription data
          await fetchSubscription()
        } else if (status === 'failed' || status === 'expired') {
          Swal.fire({
            icon: 'error',
            title: 'Pembayaran Gagal',
            text: 'Pembayaran Anda gagal atau telah kedaluwarsa',
            confirmButtonColor: '#4F46E5',
          })

          // Remove query params
          window.history.replaceState({}, '', window.location.pathname)
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
      }
    }
  }

  const openOrderModal = async (orderType, packageData) => {
    try {
      // Check if user has unpaid order
      const lastOrder = await getLastOrder()

      if (lastOrder && lastOrder.status === 'unpaid') {
        Swal.fire({
          icon: 'warning',
          title: 'Masih Ada Order Belum Dibayar',
          html: `
            <p class="mb-3">Anda masih memiliki order yang belum dibayar.</p>
            <p class="text-sm text-gray-600 mb-4">
              Paket: <strong>${getPackageName(lastOrder.package)}</strong><br>
              Jumlah: <strong>${formatRupiah(lastOrder.amount)}</strong><br>
              Periode: <strong>${lastOrder.period} bulan</strong>
            </p>
            <p class="text-sm">Silakan selesaikan pembayaran terlebih dahulu sebelum membuat order baru.</p>
          `,
          confirmButtonColor: '#4F46E5',
          confirmButtonText: 'Lihat Order',
          showCancelButton: true,
          cancelButtonText: 'Batal',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/app/orders'
          }
        })
        return
      }

      // If order is expired or failed, allow creating new order
      if (lastOrder && (lastOrder.status === 'expired' || lastOrder.status === 'failed')) {
        // Allow creating new order
      }

      selectedOrderType.value = orderType
      selectedPackage.value = packageData
      showOrderModal.value = true
    } catch (error) {
      console.error('Error checking last order:', error)
      // If error checking, still allow opening modal
      selectedOrderType.value = orderType
      selectedPackage.value = packageData
      showOrderModal.value = true
    }
  }

  const closeOrderModal = () => {
    showOrderModal.value = false
    selectedOrderType.value = null
    selectedPackage.value = null
  }

  return {
    // State
    isLoading,
    packages,
    subscription,
    expiredStatus,
    showOrderModal,
    selectedOrderType,
    selectedPackage,
    // Computed
    showExpiredWarning,
    formattedExpiredDate,
    currentStatus,
    currentPackage,
    proPackage,
    unlimitedPackage,
    expiredAt,
    formattedExpiredAt,
    isExpired,
    isExpiredSoon,
    daysUntilExpiry,
    daysUntilExpiryText,
    // Functions
    getPackageName,
    getStatusBadgeClass,
    formatLimit,
    fetchPackages,
    fetchSubscription,
    fetchExpiredStatus,
    checkPaymentStatus,
    openOrderModal,
    closeOrderModal,
  }
}
