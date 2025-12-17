<template>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Detail Tiket</h2>

    <!-- Input Tiket -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Ubah Pesan Tiket</label>

      <textarea
        v-model="draftMessage"
        rows="6"
        class="w-full p-3 border rounded-lg"
        placeholder="Tulis pesan tiket..."
      ></textarea>

      <div class="mt-3 flex gap-2">
        <button
          type="button"
          @click="saveTicket"
          :disabled="!canSave"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Simpan Perubahan
        </button>

        <button
          type="button"
          @click="resetDraft"
          class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Informasi tiket -->
    <div v-if="ticket" class="p-4 bg-white rounded-lg border">
      <div class="flex justify-between">
        <div>
          <h3 class="text-lg font-medium">{{ ticket.subject }}</h3>
          <p class="text-gray-600 whitespace-pre-wrap mt-2">{{ ticket.message }}</p>
        </div>

        <div class="text-sm text-gray-500 text-right">
          <div>{{ formatDate(ticket.createdAt) }}</div>
          <div class="mt-2 capitalize">Status: <b>{{ ticket.status }}</b></div>

          <button
            type="button"
            @click="deleteTicketHandler"
            class="mt-3 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
          >
            Hapus Tiket
          </button>
        </div>
      </div>
    </div>

    <div v-else class="p-6 text-gray-500 text-center">
      Memuat tiket...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import Swal from "sweetalert2"

// IMPORT SERVICE YANG BENAR
import {
  getTicketById,
  updateTicket,
  deleteTicket,
} from "@/services/ticket.service"

const route = useRoute()
const router = useRouter()

const ticket = ref(null)
const draftMessage = ref("")

// GET ticket dari backend
async function loadTicket() {
  try {
    const res = await getTicketById(route.params.id)
    ticket.value = res.data
    draftMessage.value = res.data.message
  } catch (e) {
    Swal.fire("Error", "Gagal memuat tiket", "error")
    console.error(e)
  }
}

const canSave = computed(() => draftMessage.value.trim().length > 0)

async function saveTicket() {
  try {
    await updateTicket(ticket.value._id, {
      subject: ticket.value.subject,
      message: draftMessage.value.trim(),
    })

    ticket.value.message = draftMessage.value.trim()

    Swal.fire("Disimpan!", "Tiket telah diperbarui.", "success")
  } catch (e) {
    console.error(e)
    Swal.fire("Error", "Gagal menyimpan tiket", "error")
  }
}

function resetDraft() {
  draftMessage.value = ticket.value.message
}

function formatDate(t) {
  return new Date(t).toLocaleString()
}

async function deleteTicketHandler() {
  const confirm = await Swal.fire({
    title: "Hapus tiket?",
    text: "Tiket akan dihapus permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
  })

  if (!confirm.isConfirmed) return

  try {
    await deleteTicket(ticket.value._id)
    Swal.fire("Dihapus", "Tiket telah dihapus.", "success")
    router.push("/tickets")
  } catch (e) {
    console.error(e)
    Swal.fire("Error", "Gagal menghapus tiket", "error")
  }
}

onMounted(() => {
  loadTicket()
})
</script>

<style scoped>
textarea {
  font-family: inherit;
}
</style>
