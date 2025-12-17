<template>
  <transition name="fade">
    <ui-full-loading v-if="loading.full" />
  </transition>

  <div>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLoadingStore } from '@/stores/loading.js'

import AOS from 'aos'

import uiFullLoading from '@/views/components/ui/ui-full-loading.vue'

const loading = useLoadingStore()

onMounted(() => {
  AOS.init()
})
</script>

<style scoped>
.fade-enter-active {
  animation: fade 0.3s;
}

.fade-enter-leave {
  animation: fade 0.3s reverse;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
