/**
 * 動画の情報を解析して処理を行う
 */
import { VideoInfoVariants } from '~openapi/generated/src'

/**
 * 動画に関する情報について、品質が**高い順**に並び替える
 * @param variants 動画の情報
 * @returns 動画の情報
 */
const sortByQuality = (variants: VideoInfoVariants[]) => {
  /**
   * 動画情報について、ビットレート情報が絶対に定義されている状態
   * array.filter()関数の検証後、型を保証するために使う
   */
  interface VideoInfoVariantsIncludedInfo extends VideoInfoVariants {
    bitrate: number
  }

  // ビットレート情報が存在しない（.m3u8）ファイルは対象としない
  const filteredValiants = variants.filter(
    (variant): variant is Required<VideoInfoVariantsIncludedInfo> => {
      /**
       * bitrateは`0`の可能性がある（GIFアニメーションの時）
       * JavaScriptでは`if(0)`を計算すると`false`の扱いになってしまうが、ビットレート情報自体は存在するため、これは望ましくない
       * そのため、明示的に`undefined`のみを判別するようにしている
       */
      return variant.bitrate !== undefined
    },
  )

  if (filteredValiants.length === 0) {
    throw new TypeError('動画情報が存在しません')
  }

  // ビットレートの値でソートする
  const sortedVariants = filteredValiants.sort((current, old) => {
    // 品質が**高い順**（降順）の計算式を書かなければいけない点に注意すること（サンプルでは昇順のものが多いため）
    return old.bitrate - current.bitrate
  })

  return sortedVariants
}

/**
 * 動画に関する情報について、品質がもっとも高いものを選択する
 * @param variants 動画の情報
 * @returns 動画情報
 */
const selectHighest = (variants: VideoInfoVariants[]) => {
  const sorted = sortByQuality(variants)
  const variant = sorted.shift()

  if (variant === undefined) {
    throw new TypeError('動画情報が存在しません')
  }

  return variant
}

/**
 * 動画に関する情報について、品質がもっとも低いものを選択する
 * @param variants 動画の情報
 * @returns 動画情報
 */
const selectLowest = (variants: VideoInfoVariants[]) => {
  const sorted = sortByQuality(variants)
  const variant = sorted.pop()

  if (variant === undefined) {
    throw new TypeError('動画情報が存在しません')
  }

  return variant
}

/**
 * 動画に関する情報について、品質がもっとも高いもの・もっとも低いものを選択する
 * 情報がひとつしかない場合は、出力形式はふたつ以上ある場合と同等だが、中身は同一のものとなる
 * @param variants 動画の情報
 * @returns 動画の情報（品質がもっとも高いもの・もっとも低いもの）
 */
const selectHighestAndLowest = (variants: VideoInfoVariants[]) => {
  const sorted = sortByQuality(variants)

  // 動画情報がひとつしか存在しない場合、同じものを返却する
  if (sorted.length === 1) {
    return {
      highest: sorted[0],
      lowest: sorted[0],
    }
  }

  // 複数の動画情報が存在する場合、それぞれの情報を返却する
  const highest = sorted.shift()
  const lowest = sorted.pop()

  if (highest === undefined || lowest === undefined) {
    throw new TypeError('動画情報が存在しません')
  }

  return {
    highest,
    lowest,
  }
}

export { selectHighest, selectLowest, selectHighestAndLowest }
