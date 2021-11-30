import { isPhoto } from '~/preferences/mediaType'

describe('ツイート内のメディア情報で使う属性一覧', () => {
  test.each([
    [['画像'], { type: 'photo', result: true }],
    [['動画'], { type: 'video', result: false }],
    [['GIFアニメーション'], { type: 'animated_gif', result: false }],
  ])('メディア種別が画像であるかどうかを判定できる（%p）', (_label, data) => {
    expect(isPhoto(data.type)).toBe(data.result)
    expect(isPhoto(data.type)).toBe(data.result)
    expect(isPhoto(data.type)).toBe(data.result)
  })
})
