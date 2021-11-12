/**
 * メディアのURLに関する設定
 */

/**
 * URLからファイル名を特定するための正規表現パターン
 */
const pattern = {
  image: /(?<name>[a-zA-Z0-9-_]+\.[jpg|jpeg|png]+)/i,
  video: /(?<name>[a-zA-Z0-9-_]+\.[mp4]+)/i,
}

export { pattern }
