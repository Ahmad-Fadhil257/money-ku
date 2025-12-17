<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <!-- Pricing Content -->
    <div class="pt-32 pb-20 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
            Pilih Paket <span class="text-indigo-600">Terbaik</span> untuk Anda
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Kelola keuangan dengan lebih mudah. Pilih paket yang sesuai dengan kebutuhan Anda.
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-error text-lg">{{ error }}</p>
          <button
            @click="fetchPackages"
            class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700/90 transition"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Packages Grid -->
        <div v-else class="grid md:grid-cols-3 gap-8">
          <PricingCard v-for="pkg in packages" :key="pkg._id" :package-data="pkg" />
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePackages } from '@/composables/usePackages'
import Navbar from '@/views/components/landing/Navbar.vue'
import Footer from '@/views/components/landing/Footer.vue'
import PricingCard from '@/views/components/pricing/PricingCard.vue'

const { packages, loading, error, fetchPackages } = usePackages()

onMounted(() => {
  fetchPackages()
})
</script>
