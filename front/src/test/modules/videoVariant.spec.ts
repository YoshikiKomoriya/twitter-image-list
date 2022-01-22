import {
  sortByQuality,
  selectHighest,
  selectLowest,
  selectHighestAndLowest,
} from '~/modules/videoVariant'
import { VideoInfoVariants } from '~openapi/generated/src'

// テスト用データを生成する
const id = Math.random().toString(36).slice(-8)
const generateFileName = () => {
  return Math.random().toString(36).slice(-8)
}
const variants: VideoInfoVariants[] = [
  {
    content_type: 'application/x-mpegURL',
    url: `https://video.twimg.com/ext_tw_video/${id}/pu/pl/${generateFileName()}.m3u8?tag=12&container=fmp4`,
  },
  {
    bitrate: 2176000,
    content_type: 'video/mp4',
    url: `https://video.twimg.com/ext_tw_video/${id}/pu/vid/960x720/${generateFileName()}.mp4?tag=12`,
  },
  {
    bitrate: 832000,
    content_type: 'video/mp4',
    url: `https://video.twimg.com/ext_tw_video/${id}/pu/vid/480x360/${generateFileName()}.mp4?tag=12`,
  },
  {
    bitrate: 256000,
    content_type: 'video/mp4',
    url: `https://video.twimg.com/ext_tw_video/${id}/pu/vid/360x270/${generateFileName()}.mp4?tag=12`,
  },
]

describe('動画情報を解析して特定のファイルを取得する', () => {
  test('ソート処理', () => {
    // テストデータは品質の高い順に並んでいるため、逆順にしたものを対象にする
    const reversedVariants = [...variants].reverse()
    const videos = sortByQuality(reversedVariants)

    // テストデータの順番（品質の高い順）通りにソートされていることを検証する
    // テストデータの先頭はプレイリスト情報であるため、それが取り除かれていることも検証する
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i]).toEqual(variants[i + 1])
    }
  })

  test('品質がもっとも高いもの', () => {
    const video = selectHighest(variants)
    expect(video).toEqual(variants[1])
  })

  test('品質がもっとも低いもの', () => {
    const video = selectLowest(variants)
    expect(video).toEqual(variants[3])
  })

  test('品質がもっとも高いもの・もっとも低いもの', () => {
    const videos = selectHighestAndLowest(variants)
    expect(videos.highest).toEqual(variants[1])
    expect(videos.lowest).toEqual(variants[3])
  })

  test('品質がもっとも高いもの・もっとも低いもの（動画情報がひとつのみ存在する場合）', () => {
    const filteredVariants = [variants[0], variants[1]]
    const videos = selectHighestAndLowest(filteredVariants)
    expect(videos.highest).toEqual(filteredVariants[1])
    expect(videos.lowest).toEqual(filteredVariants[1])
  })
})

describe('動画情報が存在しない場合、エラーが発生する', () => {
  const data = [variants[0]]

  test('ソート処理中', () => {
    expect(() => {
      sortByQuality(data)
    }).toThrow(TypeError('動画情報が存在しません'))
  })
})
