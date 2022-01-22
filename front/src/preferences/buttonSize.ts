/**
 * ボタンに利用する大きさ一覧
 */

/**
 * ボタンに利用する大きさの値
 */
const buttonSize = {
  small: 'small',
  xSmall: 'x-small',
  normal: 'normal',
  large: 'large',
  xLarge: 'x-large',
} as const

/**
 * ボタンに利用する大きさの型
 */
type ButtonSizeType = typeof buttonSize[keyof typeof buttonSize]

export { buttonSize, ButtonSizeType }
