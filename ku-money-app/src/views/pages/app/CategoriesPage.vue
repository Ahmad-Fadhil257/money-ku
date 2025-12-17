<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex-1">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Kategori Saya</h2>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          Kelola kategori pemasukan dan pengeluaran
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <i class="mdi mdi-plus"></i>
        <span>Tambah Kategori</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'expenses'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'expenses'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            <i class="mdi mdi-trending-down mr-2"></i>
            Pengeluaran
            <span
              class="ml-2 py-0.5 px-2.5 rounded-full text-xs"
              :class="
                activeTab === 'expenses'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ expensesCount }}
            </span>
          </button>
          <button
            @click="activeTab = 'incomes'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'incomes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            <i class="mdi mdi-trending-up mr-2"></i>
            Pemasukan
            <span
              class="ml-2 py-0.5 px-2.5 rounded-full text-xs"
              :class="
                activeTab === 'incomes'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ incomesCount }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="mdi mdi-loading mdi-spin text-4xl text-indigo-600 mb-2"></i>
        <p class="text-gray-600">Memuat kategori...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="currentCategories.length === 0"
      class="bg-white rounded-xl p-12 text-center border border-gray-200"
    >
      <i class="mdi mdi-tag-outline text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">
        Belum ada kategori {{ activeTab === 'incomes' ? 'pemasukan' : 'pengeluaran' }}
      </h3>
      <p class="text-gray-600 mb-6">Mulai dengan menambahkan kategori pertama Anda</p>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
      >
        <i class="mdi mdi-plus mr-2"></i>
        Tambah Kategori Pertama
      </button>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard
        v-for="category in currentCategories"
        :key="category._id"
        :title="category.title"
        :icon="category.icon"
        :type="category.type"
        :amount="category.amount"
        @edit="openEditModal(category)"
        @delete="confirmDelete(category)"
      />
    </div>

    <!-- Create/Edit Modal -->
    <CategoryModal
      :show="showModal"
      :is-loading="isSubmitting"
      :is-edit="isEditMode"
      :category-data="selectedCategory"
      :category-type="activeTab"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories'
import CategoryCard from '@/views/components/ui/CategoryCard.vue'
import CategoryModal from '@/views/components/ui/CategoryModal.vue'

const {
  activeTab,
  isLoading,
  isSubmitting,
  showModal,
  isEditMode,
  selectedCategory,
  expensesCount,
  incomesCount,
  currentCategories,
  fetchCategories,
  openCreateModal,
  openEditModal,
  closeModal,
  handleSubmit,
  confirmDelete,
} = useCategories()

onMounted(() => {
  fetchCategories()
})
</script>
