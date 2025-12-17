<template>
  <div class="min-h-screen bg-gray-100">
    <AuthNavbar />

    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Masuk</h1>
            <p class="text-gray-600">Selamat datang kembali di Duit-Ku</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
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
              placeholder="Masukkan password"
              required
            />

            <!-- Forgot Password -->
            <div class="text-right">
              <a href="#" class="text-sm text-indigo-600 hover:underline">Lupa password?</a>
            </div>

            <!-- Submit Button -->
            <PrimaryButton
              type="submit"
              :is-loading="isLoading"
              loading-text="Masuk..."
              variant="rounded-xl"
            >
              Masuk
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

          <!-- Register Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Belum punya akun?
              <RouterLink to="/auth/register" class="text-indigo-600 font-semibold hover:underline">
                Daftar sekarang
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
  email: '',
  password: '',
})

const { isLoading, handleLogin: handleLoginAuth } = useAuth()
const { isGoogleLoaded, initializeGoogleAuth } = useGoogleAuth()

const handleLogin = async () => {
  await handleLoginAuth(form.value)
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
      text: 'signin_with',
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
        // Prompt One Tap after button is rendered
        setTimeout(() => {
          if (isGoogleLoaded.value) {
            // Prompt One Tap will be called from useGoogleAuth if needed
          }
        }, 500)
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
