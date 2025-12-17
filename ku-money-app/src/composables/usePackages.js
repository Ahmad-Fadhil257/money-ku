import { ref } from 'vue'
import { getPackages } from '@/services/package.service'

export function usePackages() {
  const packages = ref([])
  const loading = ref(true)
  const error = ref(null)

  // Fetch packages from API
  const fetchPackages = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await getPackages()
      packages.value = response.data || []
    } catch (err) {
      error.value = 'Gagal memuat data paket. Silakan coba lagi.'
      console.error('Error fetching packages:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    packages,
    loading,
    error,
    fetchPackages,
  }
}
