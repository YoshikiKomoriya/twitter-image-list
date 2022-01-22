import {
  profileImageUrlSuffix,
  replaceSuffix,
  getOriginalProfileImageUrl,
} from '~/preferences/tweetUser'

describe('ツイート内のユーザー情報に関する設定', () => {
  test('文字列について、末尾の文字を対象に置換処理を行う', () => {
    const string = 'testtesttest.jpg'
    const acceptableString = 'testtesthoge.jpg'

    expect(replaceSuffix(string, 'test.jpg', 'hoge.jpg')).toBe(acceptableString)
  })

  test.each([
    ['JPEG画像', { suffix: profileImageUrlSuffix.jpg }],
    ['GIF画像', { suffix: profileImageUrlSuffix.gif }],
  ])(
    'アイコン画像のURLから、オリジナル画像のURLを取得する（%p）',
    (_label, suffix) => {
      const id = Math.random().toString(36).slice(-8)
      const name = 'a'.repeat(8)
      const url = `https://pbs.twimg.com/profile_images/${id}/${name}${suffix.suffix.suffix}`
      const acceptableUrl = `https://pbs.twimg.com/profile_images/${id}/${name}${suffix.suffix.replacement}`

      expect(getOriginalProfileImageUrl(url)).toBe(acceptableUrl)
    },
  )
})
