<template>
  <div
    class="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md text-center">
      <!-- Logo -->
      <div class="mb-8">
        <LogoBrand />
      </div>

      <!-- 404 Content -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Icon -->
        <div
          class="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <i class="mdi mdi-alert-circle-outline text-5xl text-indigo-600"></i>
        </div>

        <!-- Title -->
        <h1 class="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
        <p class="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goHome"
            class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            <i class="mdi mdi-home mr-2"></i>
            Kembali ke Beranda
          </button>
          <button
            @click="goBack"
            class="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition"
          >
            <i class="mdi mdi-arrow-left mr-2"></i>
            Kembali
          </button>
        </div>
      </div>

      <!-- Help Text -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Jika masalah tetap berlanjut,
          <a
            href="mailto:support@kumoney.com"
            class="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            hubungi support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LogoBrand from '@/views/components/ui/LogoBrand.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
