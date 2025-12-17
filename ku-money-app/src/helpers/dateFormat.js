/**
 * Format date to Indonesian format: "DD MonthName YYYY"
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date string
 */
export function formatDateID(date) {
  if (!date) return ''

  const d = new Date(date)
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()

  return `${day} ${month} ${year}`
}

/**
 * Get day name in Indonesian
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Day name (Senin, Selasa, etc.)
 */
export function getDayNameID(date) {
  if (!date) return ''

  const d = new Date(date)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

  return days[d.getDay()]
}

/**
 * Get month name in Indonesian
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Month name
 */
export function getMonthNameID(date) {
  if (!date) return ''

  const d = new Date(date)
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  return months[d.getMonth()]
}

/**
 * Format date to YYYY-MM-DD for API
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDateAPI(date) {
  if (!date) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Get start and end date of month
 * @param {Date} date - Date object (default: current date)
 * @returns {Object} { startDate, endDate } in YYYY-MM-DD format
 */
export function getMonthRange(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()

  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)

  return {
    startDate: formatDateAPI(startDate),
    endDate: formatDateAPI(endDate),
  }
}
