/**
 * ボタンに利用する大きさ一覧
 */
const buttonSize = {
  small: 'small',
  xSmall: 'x-small',
  normal: 'normal',
  large: 'large',
  xLarge: 'x-large',
} as const

type ButtonSizeType = typeof buttonSize[keyof typeof buttonSize]

export { buttonSize, ButtonSizeType }
