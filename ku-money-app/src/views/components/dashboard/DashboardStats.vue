<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Balance -->
    <StatCard
      label="Total Saldo"
      :value="formatRupiah(summary?.totalBalance || 0)"
      icon="mdi mdi-wallet"
      icon-bg-color="bg-indigo-100"
      icon-color="text-indigo-600"
    />

    <!-- Income -->
    <StatCard
      label="Pemasukan"
      :value="formatRupiah(summary?.totalIncome || 0)"
      icon="mdi mdi-trending-up"
      icon-bg-color="bg-green-100"
      icon-color="text-green-600"
      value-color="text-green-600"
    />

    <!-- Expense -->
    <StatCard
      label="Pengeluaran"
      :value="formatRupiah(summary?.totalExpenses || 0)"
      icon="mdi mdi-trending-down"
      icon-bg-color="bg-red-100"
      icon-color="text-red-600"
      value-color="text-red-600"
    />

    <!-- Transactions -->
    <StatCard
      label="Total Transaksi"
      :value="String(summary?.totalTransactions || 0)"
      icon="mdi mdi-swap-horizontal"
      icon-bg-color="bg-amber-100"
      icon-color="text-amber-600"
    />
  </div>
</template>

<script setup>
import { formatRupiah } from '@/helpers/formatCurrency'
import StatCard from '@/views/components/ui/StatCard.vue'

defineProps({
  summary: {
    type: Object,
    default: null,
  },
})
</script>
