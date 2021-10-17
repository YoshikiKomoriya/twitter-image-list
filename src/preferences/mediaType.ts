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

/**
 * メディアの種別が動画であることを判定する
 * @param type メディアの種別
 * @returns 判定結果
 */
const isVideo = (type: string) => {
  return type === mediaType.video
}

/**
 * メディアの種別がGIFアニメーションであることを判定する
 * @param type メディアの種別
 * @returns 判定結果
 */
const isGifAnimation = (type: string) => {
  return type === mediaType.animatedGif
}

export { mediaType, MediaType, isPhoto, isVideo, isGifAnimation }
