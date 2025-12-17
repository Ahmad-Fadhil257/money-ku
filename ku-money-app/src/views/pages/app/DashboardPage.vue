<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Selamat Datang, {{ userName }}! 👋</h2>
        <h3 class="text-lg font-semibold text-gray-700">Yup ini dia hasilnya</h3>
        <p class="text-gray-600 mt-1">Ringkasan keuangan Anda</p>
      </div>

      <!-- Filters -->
      <DashboardFilters
        :accounts="accounts"
        :selected-account-id="selectedAccountId"
        :selected-date-filter="selectedDateFilter"
        :custom-start-date="customStartDate"
        :custom-end-date="customEndDate"
        @update:selected-account-id="selectedAccountId = $event"
        @update:selected-date-filter="selectedDateFilter = $event"
        @update:custom-start-date="customStartDate = $event"
        @update:custom-end-date="customEndDate = $event"
        @filter-change="refreshDashboardData"
      />
    </div>

    <!-- Stats Cards -->
    <div class="mb-6">
      <DashboardStats :summary="summary" />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ExpenseByCategoryChart :data="expensesByCategory" :is-loading="isLoadingExpenses" />
      <IncomeVsExpenseChart :data="incomeVsExpenses" :is-loading="isLoadingIncomeVsExpenses" />
    </div>

    <!-- Recent Transactions -->
    <div class="mb-6">
      <RecentTransactionsSection
        :transactions="recentTransactions"
        :is-loading="isLoadingTransactions"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboardFilters } from '@/composables/useDashboardFilters'
import { useDashboardData } from '@/composables/useDashboardData'
import DashboardFilters from '@/views/components/dashboard/DashboardFilters.vue'
import DashboardStats from '@/views/components/dashboard/DashboardStats.vue'
import ExpenseByCategoryChart from '@/views/components/dashboard/ExpenseByCategoryChart.vue'
import IncomeVsExpenseChart from '@/views/components/dashboard/IncomeVsExpenseChart.vue'
import RecentTransactionsSection from '@/views/components/dashboard/RecentTransactionsSection.vue'

const authStore = useAuthStore()
const userName = computed(() => authStore.user?.name || 'User')

// Use composables
const {
  selectedDateFilter,
  selectedAccountId,
  customStartDate,
  customEndDate,
  dateRange,
  resetFilters,
} = useDashboardFilters()

const {
  summary,
  expensesByCategory,
  incomeVsExpenses,
  recentTransactions,
  accounts,
  fetchAccounts,
  refreshDashboardData,
  fetchAllData,
} = useDashboardData(dateRange, selectedAccountId)

// Reset filter to default when component is mounted
onMounted(async () => {
  resetFilters()

  // Fetch accounts first
  await fetchAccounts()

  // Then fetch all dashboard data
  await fetchAllData()
})

// Reset filter when leaving the page
onBeforeUnmount(() => {
  resetFilters()
})
</script>
