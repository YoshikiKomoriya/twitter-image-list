import { CustomError, MediaDownloadError } from '~/modules/customError'

describe('カスタムエラークラス', () => {
  test('独自のエラークラスが生成される', () => {
    const message = 'カスタムエラー'
    const error = new CustomError(message)

    expect(error instanceof CustomError).toBe(true)
    expect(error.name).toBe('CustomError')
    expect(error.message).toBe(message)
    expect(error.stack).toContain(`CustomError: ${message}`)
  })
})

describe('メディアダウンロード用エラークラス', () => {
  test('独自のエラークラスが生成される', () => {
    const message = 'メディアダウンロードエラー'
    const error = new MediaDownloadError(message)

    expect(error instanceof MediaDownloadError).toBe(true)
    expect(error.name).toBe('MediaDownloadError')
    expect(error.message).toBe(message)
    expect(error.stack).toContain(`MediaDownloadError: ${message}`)
  })

  test('独自のデータを扱うことができる', () => {
    const object = {
      message: 'メディアダウンロードエラー',
      data: {
        object: 'オブジェクト',
        array: ['配列'],
        string: '文字列',
        number: 1,
        boolean: true,
      },
    }

    const error = new MediaDownloadError(object)

    expect(error.data).toEqual(object.data)
  })
})
