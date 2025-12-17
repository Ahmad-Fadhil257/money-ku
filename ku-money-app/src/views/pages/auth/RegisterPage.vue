<template>
  <div class="min-h-screen bg-gray-100">
    <AuthNavbar />

    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Daftar Akun</h1>
            <p class="text-gray-600">Mulai kelola keuangan dengan Duit-Ku</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- Nama -->
            <FormInput
              id="name"
              v-model="form.name"
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              required
            />

            <!-- Email -->
            <FormInput
              id="email"
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="email@example.com"
              required
            />

            <!-- Password -->
            <FormInput
              id="password"
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="Minimal 8 karakter"
              required
            />

            <!-- Submit Button -->
            <PrimaryButton
              type="submit"
              :is-loading="isLoading"
              loading-text="Mendaftar..."
              variant="rounded-xl"
            >
              Daftar Sekarang
            </PrimaryButton>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <!-- Google Sign In Button -->
          <div class="w-full flex justify-center">
            <div id="google-signin-button" class="w-full max-w-[350px]"></div>
          </div>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Sudah punya akun?
              <RouterLink to="/auth/login" class="text-indigo-600 font-semibold hover:underline">
                Masuk di sini
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import AuthNavbar from '@/views/components/auth/AuthNavbar.vue'
import FormInput from '@/views/components/ui/FormInput.vue'
import PrimaryButton from '@/views/components/ui/PrimaryButton.vue'

const form = ref({
  name: '',
  email: '',
  password: '',
})

const { isLoading, handleRegister: handleRegisterAuth } = useAuth()
const { isGoogleLoaded, initializeGoogleAuth } = useGoogleAuth()

const handleRegister = async () => {
  await handleRegisterAuth(form.value)
}

// Render Google Sign In button
const renderGoogleButton = () => {
  if (typeof window === 'undefined' || !window.google || !isGoogleLoaded.value) {
    return
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    console.warn('Google Client ID not found')
    return
  }

  try {
    window.google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signup_with',
      width: 350, // Google requires pixel value, not percentage
      locale: 'id',
    })
  } catch (error) {
    console.error('Error rendering Google button:', error)
  }
}

onMounted(() => {
  // Wait for Google Identity Services to load
  const checkGoogleAndInit = () => {
    if (typeof window !== 'undefined' && window.google) {
      // Initialize Google Auth first
      initializeGoogleAuth()

      // Then render button after a short delay
      setTimeout(() => {
        renderGoogleButton()
      }, 300)
      return true
    }
    return false
  }

  if (!checkGoogleAndInit()) {
    // Wait for script to load
    const checkInterval = setInterval(() => {
      if (checkGoogleAndInit()) {
        clearInterval(checkInterval)
      }
    }, 100)

    setTimeout(() => {
      clearInterval(checkInterval)
    }, 5000)
  }
})
</script>
