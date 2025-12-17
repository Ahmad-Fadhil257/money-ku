<template>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Catatan</h2>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Tulis Catatan</label>
      <textarea
        v-model="newNoteText"
        rows="6"
        class="w-full p-3 border rounded-lg resize-y"
        placeholder="Tulis sesuatu..."
      ></textarea>
      <div class="mt-3 flex gap-2">
        <button
          type="button"
          @click="addNote"
          :disabled="!canAdd"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Konfirmasi
        </button>
        <button
          type="button"
          @click="clearInput"
          class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Batal
        </button>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-medium mb-3">Daftar Catatan</h3>
      <div v-if="notes.length === 0" class="p-6 bg-white rounded-lg border text-gray-500">
        Belum ada catatan.
      </div>

      <ul class="space-y-4">
        <li v-for="note in notesSorted" :key="note.id" class="p-4 bg-white rounded-lg border">
          <div class="flex justify-between items-start">
            <div class="whitespace-pre-wrap text-gray-800" v-if="editingId !== note.id">
              {{ note.text }}
            </div>

            <div v-else class="w-full">
              <textarea
                v-model="editingText"
                rows="4"
                class="w-full p-2 border rounded-md"
                @keydown.ctrl.enter.prevent="saveEdit(note.id)"
                @keydown.meta.enter.prevent="saveEdit(note.id)"
                @blur="onEditBlur(note.id)"
              ></textarea>
              <div class="mt-2 flex items-center justify-between">
                <div class="flex gap-2">
                  <button
                    type="button"
                    @click="saveEdit(note.id)"
                    class="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Simpan
                  </button>
                  <button type="button" @click="cancelEdit" class="px-3 py-1 bg-gray-200 rounded">
                    Batal
                  </button>
                </div>
                <div class="text-xs text-gray-400">Tekan Ctrl+Enter / ⌘+Enter untuk simpan</div>
              </div>
            </div>

            <div class="text-sm text-gray-500 ml-4 text-right">
              <div>{{ formatDateTime(note.createdAt) }}</div>
              <div class="mt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  @click="startEdit(note)"
                  class="px-2 py-1 bg-yellow-100 rounded text-yellow-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  @click="deleteNote(note.id)"
                  class="px-2 py-1 bg-red-100 rounded text-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import Swal from 'sweetalert2'
const STORAGE_KEY = 'duit-ku-notes'

const newNoteText = ref('')
const notes = ref([])
const editingId = ref(null)
const editingText = ref('')

const canAdd = computed(() => newNoteText.value.trim().length > 0)

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    notes.value = raw ? JSON.parse(raw) : []
  } catch (e) {
    notes.value = []
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
}

function addNote() {
  if (!canAdd.value) return
  const n = {
    id: Date.now().toString(),
    text: newNoteText.value.trim(),
    createdAt: new Date().toISOString(),
  }
  notes.value.push(n)
  saveNotes()
  newNoteText.value = ''
}

function clearInput() {
  newNoteText.value = ''
}

function formatDateTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch (e) {
    return iso
  }
}

function startEdit(note) {
  editingId.value = note.id
  editingText.value = note.text
}

function cancelEdit() {
  editingId.value = null
  editingText.value = ''
}

function saveEdit(id) {
  const i = notes.value.findIndex((n) => n.id === id)
  if (i !== -1) {
    notes.value[i].text = editingText.value.trim()
    saveNotes()
  }
  cancelEdit()
}

function onEditBlur(id) {
  // Slight delay to allow click on Save button; only auto-save if still editi  ng
  setTimeout(() => {
    if (editingId.value === id) {
      saveEdit(id)
    }
  }, 120)
}

async function deleteNote(id) {
  const idx = notes.value.findIndex((n) => n.id === id)
  if (idx === -1) return

  try {
    let res
    if (Swal && typeof Swal.fire === 'function') {
      res = await Swal.fire({
        title: 'Hapus catatan?',
        text: 'Catatan akan dihapus dan tidak dapat dikembalikan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
      })
    } else {
      const ok = window.confirm(
        'Hapus catatan?\nCatatan akan dihapus dan tidak dapat dikembalikan.',
      )
      res = { isConfirmed: ok }
    }

    if (res.isConfirmed) {
      notes.value.splice(idx, 1)
      saveNotes()
      if (editingId.value === id) cancelEdit()
    }
  } catch (e) {
    // fallback to native confirm on error
    const ok = window.confirm('Hapus catatan?\nCatatan akan dihapus dan tidak dapat dikembalikan.')
    if (ok) {
      notes.value.splice(idx, 1)
      saveNotes()
      if (editingId.value === id) cancelEdit()
    }
  }
}

const notesSorted = computed(() => {
  return [...notes.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

onMounted(() => {
  loadNotes()
})
</script>

<style scoped>
/* Simple styling for notepad feel */
textarea {
  font-family: inherit;
}
</style>
