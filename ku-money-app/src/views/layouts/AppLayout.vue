<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
      style="width: 250px"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-gray-200">
        <LogoBrand to="/app/dashboard" size="md" />
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-indigo-50"
          active-class="bg-indigo-600 text-white hover:bg-indigo-700"
          inactive-class="text-gray-700"
        >
          <i :class="item.icon" class="text-xl"></i>
          <span class="font-medium">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- User Info & Logout -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div class="mb-3 px-4 py-3 bg-indigo-50 rounded-lg">
          <p class="text-xs text-gray-600">Status Akun</p>
          <p class="text-sm font-bold text-indigo-600 uppercase">{{ userStatus }}</p>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <i class="mdi mdi-logout text-xl"></i>
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="md:ml-[250px]">
      <!-- Top Navbar -->
      <header
        class="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-6"
      >
        <!-- Mobile Menu Button -->
        <button
          @click="toggleSidebar"
          class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-4"
        >
          <i class="mdi mdi-menu text-2xl"></i>
        </button>

        <h1 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h1>

        <div class="ml-auto flex items-center gap-4">
          <!-- User Profile -->
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-800">{{ userName }}</p>
              <p class="text-xs text-gray-500">{{ userEmail }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <span class="text-white font-semibold">{{ userInitials }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <RouterView />
      </main>
    </div>

    <!-- Sidebar Overlay (Mobile) -->
    <div
      v-if="isSidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black/50 z-30 md:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import LogoBrand from '@/views/components/ui/LogoBrand.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Sidebar state
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// Menu items
const menuItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: 'mdi mdi-view-dashboard' },
  { path: '/app/wallets', label: 'Dompet', icon: 'mdi mdi-wallet' },
  { path: '/app/transactions', label: 'Transaksi', icon: 'mdi mdi-swap-horizontal' },
  { path: '/app/categories', label: 'Kategori', icon: 'mdi mdi-tag-multiple' },
  { path: '/app/orders', label: 'Pembayaran', icon: 'mdi mdi-cash-multiple' },
  { path: '/app/catatan', label: 'Catatan', icon: 'mdi mdi-note' },
  { path: '/app/subscription', label: 'Langganan', icon: 'mdi mdi-crown' },
  { path: '/app/tickets', label: 'Ticket', icon: 'mdi mdi-note' },
  { path: '/app/settings', label: 'Pengaturan', icon: 'mdi mdi-cog' },
]

// User info
const userName = computed(() => authStore.user?.name || 'User')
const userEmail = computed(() => authStore.user?.email || '')
const userStatus = computed(() => authStore.userStatus)
const userInitials = computed(() => {
  const name = userName.value
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Page title from route meta
const pageTitle = computed(() => route.meta.title || 'Dashboard')

// Logout handler
const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Keluar dari akun?',
    text: 'Anda akan keluar dari aplikasi',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4F46E5',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    await authStore.logout()
    router.push('/auth/login')
  }
}
</script>
