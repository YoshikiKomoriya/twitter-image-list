/**
 * アラートで使う属性一覧
 */

/**
 * アラートで使う属性の値
 */
const alertType = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
} as const

/**
 * アラートで使う属性の型
 */
type AlertType = typeof alertType[keyof typeof alertType]

export { alertType, AlertType }
