<template>
  <section
    class="relative flex flex-col items-center justify-center text-center bg-linear-to-b from-indigo-50 via-white to-white overflow-hidden top-16"
  >
    <!-- Background blur circles -->
    <div
      class="absolute top-[-200px] left-[-100px] w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl opacity-40"
    ></div>
    <div
      class="absolute bottom-[-50px] right-[-100px] w-[400px] h-[400px] bg-info/20 rounded-full blur-3xl opacity-40"
    ></div>

    <div class="relative z-10 max-w-5xl px-6 py-24 md:py-32">
      <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
        Kelola Keuangan Lebih <span class="text-indigo-600">Mudah & Efisien</span> Bersama
        <span class="text-indigo-600">Duit-Ku</span>
      </h1>

      <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        <!-- Semua kebutuhan finansialmu dalam satu tempat. Catat pengeluaran, pantau pemasukan, dan -->
        <!--capai kebebasan finansial dengan kemudahan di tanganmu.-->
        Kata Pa Yayat aku harus buat fitur baru , tapi aku ga tau mau nambahin apa jadi aku cuma
        ngedit judulnya iseng iseng aja sama buat fitur catatan, tapi kalau ga salah catatannya
        disimpan di localStorage bukan server
      </p>

      <div class="flex justify-center gap-4">
        <RouterLink
          to="/auth/register"
          class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700/90 transition-all shadow-lg"
        >
          Mulai Sekarang
        </RouterLink>
        <RouterLink
          to="/pricing"
          class="px-6 py-3 bg-white border border-indigo-600/20 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-700/5 transition-all"
        >
          Lihat Paket
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// No logic needed for static hero
</script>

<style scoped>
section {
  min-height: 90vh;
}
</style>
