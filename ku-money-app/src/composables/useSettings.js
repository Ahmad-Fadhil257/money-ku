import { ref, reactive } from 'vue'
import { updatePassword } from '@/services/auth.service'
import Swal from 'sweetalert2'

export function useSettings() {
  const isLoading = ref(false)
  const showOldPassword = ref(false)
  const showNewPassword = ref(false)
  const showConfirmPassword = ref(false)

  const form = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const errors = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const validateForm = () => {
    // Reset errors
    errors.oldPassword = ''
    errors.newPassword = ''
    errors.confirmPassword = ''

    let isValid = true

    // Validate old password
    if (!form.oldPassword) {
      errors.oldPassword = 'Password lama wajib diisi'
      isValid = false
    }

    // Validate new password
    if (!form.newPassword) {
      errors.newPassword = 'Password baru wajib diisi'
      isValid = false
    } else if (form.newPassword.length < 6) {
      errors.newPassword = 'Password baru minimal 6 karakter'
      isValid = false
    }

    // Validate confirm password
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password wajib diisi'
      isValid = false
    } else if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password tidak sesuai'
      isValid = false
    }

    // Check if new password is same as old password
    if (form.oldPassword && form.newPassword && form.oldPassword === form.newPassword) {
      errors.newPassword = 'Password baru harus berbeda dengan password lama'
      isValid = false
    }

    return isValid
  }

  const handleUpdatePassword = async () => {
    if (isLoading.value) return

    // Validate form
    if (!validateForm()) {
      return
    }

    try {
      isLoading.value = true

      // Call update password API
      await updatePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      })

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Password Berhasil Diubah!',
        text: 'Password Anda telah berhasil diubah.',
        confirmButtonColor: '#4F46E5',
      })

      // Reset form
      form.oldPassword = ''
      form.newPassword = ''
      form.confirmPassword = ''
      errors.oldPassword = ''
      errors.newPassword = ''
      errors.confirmPassword = ''
    } catch (error) {
      console.error('Update password error:', error)

      // Handle specific error codes
      if (error.code === 'INVALID_OLD_PASSWORD') {
        errors.oldPassword = 'Password lama tidak benar'
      } else if (error.code === 'SAME_PASSWORD') {
        errors.newPassword = 'Password baru harus berbeda dengan password lama'
      } else if (error.details && Array.isArray(error.details)) {
        // Handle validation errors
        error.details.forEach((detail) => {
          if (detail.field === 'newPassword') {
            errors.newPassword = detail.message
          } else if (detail.field === 'oldPassword') {
            errors.oldPassword = detail.message
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengubah Password',
          text: error.message || 'Terjadi kesalahan saat mengubah password. Silakan coba lagi.',
          confirmButtonColor: '#4F46E5',
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    showOldPassword,
    showNewPassword,
    showConfirmPassword,
    form,
    errors,
    handleUpdatePassword,
  }
}
