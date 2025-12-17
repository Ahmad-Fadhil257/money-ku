<template>
  <nav class="w-full fixed top-0 left-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo (Always Visible) -->
        <div class="shrink-0">
          <RouterLink to="/" class="text-2xl font-bold text-indigo-600 tracking-tight">
            Ku<span class="text-gray-800">-SukaDuit</span>
          </RouterLink>
        </div>

        <!-- Desktop Menu (Hidden on Mobile) -->
        <div class="hidden md:flex items-center space-x-8">
          <!-- Left Links -->
          <RouterLink
            to="/pricing"
            class="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Pricing
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            About
          </RouterLink>

          <!-- Right Links -->
          <RouterLink
            to="/auth/login"
            class="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            Register
          </RouterLink>
        </div>

        <!-- Mobile Menu Button (Visible on Mobile Only) -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition"
          aria-label="Toggle menu"
        >
          <svg
            v-if="!isMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu (Dropdown) -->
      <transition name="slide-fade">
        <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
          <RouterLink
            to="/pricing"
            class="block text-gray-700 hover:text-indigo-600 font-medium transition py-2"
            @click="isMenuOpen = false"
          >
            Pricing
          </RouterLink>
          <RouterLink
            to="/about"
            class="block text-gray-700 hover:text-indigo-600 font-medium transition py-2"
            @click="isMenuOpen = false"
          >
            About
          </RouterLink>
          <RouterLink
            to="/auth/login"
            class="block text-gray-700 hover:text-indigo-600 font-medium transition py-2"
            @click="isMenuOpen = false"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
            @click="isMenuOpen = false"
          >
            Register
          </RouterLink>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

<style scoped>
nav {
  transition: all 0.3s ease;
}

/* Slide fade transition for mobile menu */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
