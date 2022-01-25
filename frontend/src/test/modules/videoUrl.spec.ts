import { getFileName } from '~/modules/videoUrl'

// テスト用データを生成する
const fileNames = [
  { url: '', fileName: `${Math.random().toString(36).slice(-8)}.mp4` },
  { url: '', fileName: `${Math.random().toString(36).slice(-8)}.mp4` },
  { url: '', fileName: `${Math.random().toString(36).slice(-8)}.mp4` },
]
const table = fileNames.map((object) => {
  const id = Math.random().toString(36).slice(-8)
  object.url = `https://video.twimg.com/ext_tw_video/${id}/pu/vid/960x720/${object.fileName}?tag=12`
  return object
})

describe.each(table)('動画URLを解析して処理を行う（%p）', (data) => {
  test('動画URLからファイル名を取得する', () => {
    expect(getFileName(data.url)).toBe(data.fileName)
  })
})

describe('動画URLが不正な場合', () => {
  test.each(['https://example.com'])(
    '動画URLからファイル名を取得する際、エラーが発生する',
    (url) => {
      expect(() => {
        getFileName(url)
      }).toThrow(TypeError('動画のファイル名を抽出できませんでした'))
    },
  )
})
