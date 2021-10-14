/**
 * 動画の情報を解析して処理を行う
 */
import { VideoInfoVariants } from '~openapi/generated/src'

/**
 * 動画に関する情報の中から、最も品質が高いものを選択する
 * @param variants 動画の情報
 * @returns 動画の情報
 */
const selectHighestQuality = (variants: VideoInfoVariants[]) => {
  // ビットレート情報が存在しない（.m3u8）ファイルは対象としない
  const filteredValiants = variants.filter((variant) => {
    return variant.bitrate
  })

  const sortedVariants = filteredValiants.sort((current, old) => {
    // ビットレートの値を比較する
    return current.bitrate! - old.bitrate!
  })

  const highestQuality = sortedVariants.shift()
  if (highestQuality === undefined) {
    throw new Error('動画情報が存在しません')
  }

  return highestQuality
}

export { selectHighestQuality }
