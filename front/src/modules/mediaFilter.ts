/**
 * メディア情報に関する抽出処理
 */

import { mediaType } from '~/preferences/mediaType'
import { Tweet } from '~openapi/generated/src'

/**
 * 与えられたツイート群について、メディア情報が存在するもののみを抽出する
 * @param statuses ツイート群
 * @returns 抽出されたツイート群
 */
const filterTweetsToExistMedia = (statuses: Tweet[]) => {
  return statuses.filter((status) => {
    // メディア情報が存在しない場合、取り除く
    const entities = status.extended_entities
    if (entities === undefined) {
      return false
    }

    const firstMedia = entities.media[0]
    switch (firstMedia.type) {
      case mediaType.photo:
        return true
      case mediaType.video:
      case mediaType.animatedGif:
        return firstMedia.video_info !== undefined // 動画情報が存在しない場合には取り除く
      default:
        return false
    }
  })
}

/**
 * 与えられたツイート群について、メディア情報のみの配列を作成する
 * @param statuses ツイート群
 * @returns メディア情報の配列
 */
const mapMediasByTweets = (statuses: Tweet[]) => {
  // メディア情報が存在しない場合は要素の対象としない
  const filteredStatus = filterTweetsToExistMedia(statuses)

  // 1ツイートあたりに複数のメディアが存在することを考慮して、扱いやすいようにメディアの総数分の配列要素を作成する
  const mappedStatus = filteredStatus.map((status) => {
    if (status.extended_entities === undefined) {
      throw new TypeError('メディア情報が存在しません')
    }

    // メディアは複数存在する可能性があるため、2次元配列として返却→後に1次元配列化の手順を踏む
    return status.extended_entities.media
  })

  return mappedStatus.flat()
}

export { filterTweetsToExistMedia, mapMediasByTweets }
