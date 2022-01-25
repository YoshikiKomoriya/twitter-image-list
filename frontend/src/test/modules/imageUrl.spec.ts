import { getFileName, getOriginal, getSmall } from '~/modules/imageUrl'

// テスト用データを生成する
const fileNames = [
  { url: '', fileName: `${Math.random().toString(36).slice(-8)}.jpg` },
  { url: '', fileName: `${Math.random().toString(36).slice(-8)}.jpg` },
  { url: '', fileName: `${Math.random().toString(36).slice(-8)}.jpg` },
]
const table = fileNames.map((object) => {
  object.url = `https://pbs.twimg.com/media/${object.fileName}`
  return object
})

describe.each(table)('画像URLを解析して処理を行う（%p）', (data) => {
  test('最小サイズの画像URLを取得する', () => {
    expect(getSmall(data.url)).toBe(`${data.url}?name=small`)
  })

  test('オリジナルサイズの画像URLを取得する', () => {
    expect(getOriginal(data.url)).toBe(`${data.url}?name=orig`)
  })

  test('画像URLからファイル名を取得する', () => {
    expect(getFileName(data.url)).toBe(data.fileName)
  })
})

describe('画像URLが不正な場合', () => {
  test.each(['https://example.com'])(
    '画像URLからファイル名を取得する際、エラーが発生する',
    (url) => {
      expect(() => {
        getFileName(url)
      }).toThrow(TypeError('画像のファイル名を抽出できませんでした'))
    },
  )
})
