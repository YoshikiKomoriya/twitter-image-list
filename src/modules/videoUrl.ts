/**
 * 動画URLを解析して処理を行う
 */

import { pattern } from '~/preferences/mediaUrl'

/**
 *動画URLからファイル名を抽出する
 * @param url 動画のURL
 * @returns ファイル名
 * @throws {@link TypeError} ファイル名を抽出できなかった場合
 */
const getFileName = (url: string) => {
  // URL・ファイル名の抽出
  const regExpResult = pattern.video.exec(url)
  const name = regExpResult?.groups?.name

  if (name === undefined) {
    throw new TypeError('動画のファイル名を抽出できませんでした')
  }

  return name
}

export { getFileName }
