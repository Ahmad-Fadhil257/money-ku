<template>
  <div class="bg-white rounded-xl p-6 border border-gray-200">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Transaksi Terbaru</h3>
      <RouterLink
        to="/app/transactions"
        class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Lihat Semua →
      </RouterLink>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <i class="mdi mdi-loading mdi-spin text-2xl text-indigo-600"></i>
    </div>
    <div v-else-if="transactions && transactions.length > 0" class="space-y-2">
      <TransactionItem
        v-for="transaction in transactions"
        :key="transaction._id"
        :category-name="
          transaction.categoryId?.title || transaction.categorySnapshot || 'Tanpa Kategori'
        "
        :category-icon="transaction.categoryId?.icon || '💰'"
        :account-name="transaction.accountId?.title || transaction.accountSnapshot || 'Tanpa Akun'"
        :account-icon="transaction.accountId?.icon || '💵'"
        :amount="transaction.amount"
        :note="transaction.note"
        :is-income="transaction.categoryId?.type === 'incomes'"
        @click="() => {}"
      />
    </div>
    <EmptyState v-else icon="mdi mdi-file-document-outline" message="Belum ada transaksi">
      <RouterLink
        to="/app/transactions"
        class="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Tambah Transaksi
      </RouterLink>
    </EmptyState>
  </div>
</template>

<script setup>
import TransactionItem from '@/views/components/ui/TransactionItem.vue'
import EmptyState from '@/views/components/ui/EmptyState.vue'

defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>
