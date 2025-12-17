<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-md shadow-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          {{ isEdit ? 'Edit Ticket' : 'Buat Ticket Baru' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl">
          <i class="mdi mdi-close"></i>
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- SUBJECT -->
        <div>
          <label class="block text-sm font-semibold mb-2">Subject</label>
          <input
            v-model="form.subject"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl"
            placeholder="Subject ticket"
            required
          />
        </div>

        <!-- MESSAGE -->
        <div>
          <label class="block text-sm font-semibold mb-2">Message</label>
          <textarea
            v-model="form.message"
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl"
            placeholder="Isi pesan"
            required
          ></textarea>
        </div>

        <!-- FILE -->
        <div>
          <label class="block text-sm font-semibold mb-2">File (opsional)</label>
          <input
            type="file"
            @change="handleFile"
            class="w-full text-sm"
          />
          <p v-if="form.file" class="text-xs text-green-600 mt-1">
            File dipilih: {{ form.file.name || form.file }}
          </p>
        </div>

        <!-- BUTTONS -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-3 px-4 border border-gray-300 rounded-xl"
          >
            Batal
          </button>
          <button
            type="submit"
            class="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl"
          >
            {{ isEdit ? 'Simpan' : 'Buat Ticket' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  ticketData: Object,
})

const emit = defineEmits(["close", "submit"])

const form = ref({
  subject: "",
  message: "",
  file: null,
})

watch(
  () => props.ticketData,
  (data) => {
    if (props.isEdit && data) {
      form.value = {
        subject: data.subject || "",
        message: data.message || "",
        file: data.file || null,
      }
    }
  },
  { immediate: true }
)

function handleFile(e) {
  form.value.file = e.target.files[0]
}

function submitForm() {
  emit("submit", { ...form.value })
}
</script>
