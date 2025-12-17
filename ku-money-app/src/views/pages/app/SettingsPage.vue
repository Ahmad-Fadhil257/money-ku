<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Pengaturan</h2>
      <p class="text-gray-600 mt-1">Kelola pengaturan akun Anda</p>
    </div>

    <!-- Update Password Card -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Ubahhhhh Password</h3>
        <p class="text-sm text-gray-600">Gunakan password yang kuat untuk keamanan akun Anda</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleUpdatePassword" class="space-y-5">
        <!-- Old Password -->
        <div>
          <label for="oldPassword" class="block text-sm font-semibold text-slate-800 mb-2">
            Password Lama
          </label>
          <input
            id="oldPassword"
            v-model="form.oldPassword"
            :type="showOldPassword ? 'text' : 'password'"
            placeholder="Masukkan password lama"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
            :class="{ 'border-red-500': errors.oldPassword }"
            required
          />
          <p v-if="errors.oldPassword" class="text-red-600 text-xs mt-1">
            {{ errors.oldPassword }}
          </p>
        </div>

        <!-- New Password -->
        <div>
          <label for="newPassword" class="block text-sm font-semibold text-slate-800 mb-2">
            Password Baru
          </label>
          <div class="relative">
            <input
              id="newPassword"
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Minimal 6 karakter"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              :class="{ 'border-red-500': errors.newPassword }"
              required
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i :class="showNewPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            </button>
          </div>
          <p v-if="errors.newPassword" class="text-red-600 text-xs mt-1">
            {{ errors.newPassword }}
          </p>
        </div>

        <!-- Confirm New Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-semibold text-slate-800 mb-2">
            Konfirmasi Password Baru
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Ulangi password baru"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              :class="{ 'border-red-500': errors.confirmPassword }"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i :class="showConfirmPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="text-red-600 text-xs mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <PrimaryButton
            type="submit"
            :is-loading="isLoading"
            loading-text="Menyimpan..."
            variant="rounded-xl"
            class="w-full"
          >
            Simpan Perubahan
          </PrimaryButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useSettings } from '@/composables/useSettings'
import PrimaryButton from '@/views/components/ui/PrimaryButton.vue'

const {
  isLoading,
  showOldPassword,
  showNewPassword,
  showConfirmPassword,
  form,
  errors,
  handleUpdatePassword,
} = useSettings()
</script>
