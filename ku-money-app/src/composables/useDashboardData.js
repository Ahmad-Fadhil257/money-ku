import { ref, computed, unref } from 'vue'
import {
  getDashboardSummary,
  getExpensesByCategory,
  getIncomeVsExpenses,
  getRecentTransactions,
} from '@/services/dashboard.service'
import { getAccounts } from '@/services/account.service'

export function useDashboardData(dateRange, selectedAccountId) {
  // Convert to computed to make it reactive
  const dateRangeRef = computed(() => unref(dateRange))
  const selectedAccountIdRef = computed(() => unref(selectedAccountId))
  const isLoading = ref(false)
  const isLoadingExpenses = ref(false)
  const isLoadingIncomeVsExpenses = ref(false)
  const isLoadingTransactions = ref(false)
  const isLoadingAccounts = ref(false)
  const summary = ref(null)
  const expensesByCategory = ref([])
  const incomeVsExpenses = ref([])
  const recentTransactions = ref([])
  const accounts = ref([])

  // Fetch accounts
  const fetchAccounts = async () => {
    isLoadingAccounts.value = true
    try {
      const response = await getAccounts()
      accounts.value = response.data || []
    } catch (error) {
      console.error('Error fetching accounts:', error)
      accounts.value = []
    } finally {
      isLoadingAccounts.value = false
    }
  }

  // Fetch dashboard summary
  const fetchDashboardData = async () => {
    isLoading.value = true
    try {
      const params = {
        fromDate: dateRangeRef.value.fromDate,
        toDate: dateRangeRef.value.toDate,
      }
      if (selectedAccountIdRef.value) {
        params.accountId = selectedAccountIdRef.value
      }
      const summaryData = await getDashboardSummary(params)
      summary.value = summaryData
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch expenses by category
  const fetchExpensesByCategory = async () => {
    isLoadingExpenses.value = true
    try {
      const params = {
        fromDate: dateRangeRef.value.fromDate,
        toDate: dateRangeRef.value.toDate,
      }
      if (selectedAccountIdRef.value) {
        params.accountId = selectedAccountIdRef.value
      }
      const response = await getExpensesByCategory(params)
      expensesByCategory.value = response.data || []
    } catch (error) {
      console.error('Error fetching expenses by category:', error)
      expensesByCategory.value = []
    } finally {
      isLoadingExpenses.value = false
    }
  }

  // Fetch income vs expenses
  const fetchIncomeVsExpenses = async () => {
    isLoadingIncomeVsExpenses.value = true
    try {
      const params = {
        fromDate: dateRangeRef.value.fromDate,
        toDate: dateRangeRef.value.toDate,
        periodType: 'daily',
      }
      if (selectedAccountIdRef.value) {
        params.accountId = selectedAccountIdRef.value
      }
      const response = await getIncomeVsExpenses(params)
      incomeVsExpenses.value = response.data || []
    } catch (error) {
      console.error('Error fetching income vs expenses:', error)
      incomeVsExpenses.value = []
    } finally {
      isLoadingIncomeVsExpenses.value = false
    }
  }

  // Fetch recent transactions
  const fetchRecentTransactions = async () => {
    isLoadingTransactions.value = true
    try {
      const params = {
        limit: 10,
        page: 1,
        fromDate: dateRangeRef.value.fromDate,
        toDate: dateRangeRef.value.toDate,
      }
      if (selectedAccountIdRef.value) {
        params.accountId = selectedAccountIdRef.value
      }
      const response = await getRecentTransactions(params)
      recentTransactions.value = response.data || []
    } catch (error) {
      console.error('Error fetching recent transactions:', error)
      recentTransactions.value = []
    } finally {
      isLoadingTransactions.value = false
    }
  }

  // Refresh all dashboard data
  const refreshDashboardData = async () => {
    await Promise.all([
      fetchDashboardData(),
      fetchExpensesByCategory(),
      fetchIncomeVsExpenses(),
      fetchRecentTransactions(),
    ])
  }

  // Fetch all data
  const fetchAllData = async () => {
    await Promise.all([
      fetchDashboardData(),
      fetchExpensesByCategory(),
      fetchIncomeVsExpenses(),
      fetchRecentTransactions(),
    ])
  }

  return {
    isLoading,
    isLoadingExpenses,
    isLoadingIncomeVsExpenses,
    isLoadingTransactions,
    isLoadingAccounts,
    summary,
    expensesByCategory,
    incomeVsExpenses,
    recentTransactions,
    accounts,
    fetchAccounts,
    fetchDashboardData,
    fetchExpensesByCategory,
    fetchIncomeVsExpenses,
    fetchRecentTransactions,
    refreshDashboardData,
    fetchAllData,
  }
}
