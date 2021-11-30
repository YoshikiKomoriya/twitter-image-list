/**
 * ツイート内のメディア情報で使う属性一覧
 */

/**
 * ツイート内のメディア情報で使う属性の値
 */
const mediaType = {
  photo: 'photo',
  video: 'video',
  animatedGif: 'animated_gif',
} as const

/**
 * ツイート内のメディア情報で使う属性の型
 */
type MediaType = typeof mediaType[keyof typeof mediaType]

/**
 * メディアの種別が画像であることを判定する
 * @param type メディアの種別
 * @returns 判定結果
 */
const isPhoto = (type: string) => {
  return type === mediaType.photo
}

export { mediaType, MediaType, isPhoto }
