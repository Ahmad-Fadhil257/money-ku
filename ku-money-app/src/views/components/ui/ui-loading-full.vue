<template>
  <div
    class="fixed w-full h-full flex flex-col items-center justify-center top-0 left-0 z-50 bg-white bg-opacity-80"
  >
    <div class="mb-5">
      <ui-loading />
    </div>
    <div class="text-xl select-none text-zinc-400">Memuat..</div>
  </div>
</template>

<script>
import uiLoading from '@/views/components/ui/ui-loading.vue'
export default {
  components: { uiLoading },
}
</script>
