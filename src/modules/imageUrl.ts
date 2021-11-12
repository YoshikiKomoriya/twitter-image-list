/**
 * 画像URLを解析して処理を行う
 */

import { addParameter } from '~/modules/query'
import { pattern } from '~/preferences/mediaUrl'
import { parameter } from '~/preferences/tweetImage'

/**
 * 最小サイズの画像URLを取得する
 * @param url 画像URL
 * @returns 最小サイズの画像URL
 */
const getSmall = (url: string) => {
  return addParameter(url, parameter.small)
}

/**
 * オリジナルサイズの画像URLを取得する
 * @param url 画像URL
 * @returns オリジナルサイズの画像URL
 */
const getOriginal = (url: string) => {
  return addParameter(url, parameter.original)
}

/**
 * 画像URLからファイル名を抽出する
 * @param url 画像URL
 * @returns ファイル名
 * @throws {@link TypeError} ファイル名を抽出できなかった場合
 */
const getFileName = (url: string) => {
  // URL・ファイル名の抽出
  const regExpResult = pattern.image.exec(url)
  const name = regExpResult?.groups?.name

  if (name === undefined) {
    throw new TypeError('画像のファイル名を抽出できませんでした')
  }

  return name
}

export { getSmall, getOriginal, getFileName }
