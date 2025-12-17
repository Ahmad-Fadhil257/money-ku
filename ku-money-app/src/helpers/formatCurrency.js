/**
 * Format number to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatRupiah(amount) {
  if (amount === null || amount === undefined) return 'Rp 0'
  if (amount === 0) return 'Rp 0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format large number with K, M, B suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (num === 0) return 'Unlimited'
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'M'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'Jt'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
