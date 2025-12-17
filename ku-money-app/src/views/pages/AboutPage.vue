<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <!-- About Content -->
    <div class="pt-32 pb-20 px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
            Tentang <span class="text-indigo-600">Ku‑Money</span>
          </h1>
          <div class="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <p class="text-gray-700 leading-relaxed mb-6">
              <span class="font-semibold text-indigo-600">Ku‑Money</span> adalah aplikasi SaaS
              (Software as a Service) modern yang dirancang khusus untuk membantu Anda mengelola
              keuangan pribadi dengan lebih mudah, efisien, dan terstruktur.
            </p>

            <p class="text-gray-700 leading-relaxed mb-6">
              Kami memahami bahwa mengelola keuangan pribadi bisa menjadi tantangan tersendiri. Oleh
              karena itu, Ku‑Money hadir dengan antarmuka yang intuitif dan fitur-fitur lengkap yang
              memudahkan Anda untuk mencatat setiap transaksi, membuat anggaran, melacak
              pengeluaran, dan mencapai tujuan finansial Anda.
            </p>

            <p class="text-gray-700 leading-relaxed mb-6">
              Dengan Ku‑Money, Anda dapat melihat gambaran lengkap kondisi keuangan Anda dalam satu
              dashboard yang mudah dipahami. Semua data Anda tersimpan dengan aman dan dapat diakses
              kapan saja, di mana saja, dari perangkat apa pun.
            </p>

            <p class="text-gray-700 leading-relaxed">
              Misi kami adalah memberdayakan setiap orang untuk memiliki kontrol penuh atas keuangan
              mereka, membuat keputusan finansial yang lebih baik, dan mencapai kebebasan finansial
              yang mereka impikan.
            </p>
          </div>

          <!-- Vision & Mission -->
          <div class="grid md:grid-cols-2 gap-6 mt-8">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-xl font-bold text-slate-800 mb-3">Visi Kami</h3>
              <p class="text-gray-600">
                Menjadi platform pengelolaan keuangan pribadi terdepan yang memberdayakan jutaan
                pengguna untuk mencapai kesejahteraan finansial.
              </p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-xl font-bold text-slate-800 mb-3">Misi Kami</h3>
              <p class="text-gray-600">
                Menyediakan solusi pengelolaan keuangan yang mudah, aman, dan accessible untuk semua
                kalangan dengan teknologi terkini.
              </p>
            </div>
          </div>

          <!-- CTA -->
          <div class="text-center mt-12">
            <RouterLink
              to="/auth/register"
              class="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700/90 transition shadow-lg"
            >
              Mulai Sekarang Gratis
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/views/components/landing/Navbar.vue'
import Footer from '@/views/components/landing/Footer.vue'
</script>
