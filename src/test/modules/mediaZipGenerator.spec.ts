import JSZip from 'jszip'
import { MediaDownloadError } from '~/modules/customError'
import { Content } from '~/modules/mediaDownloader'
import { MediaZipGenerator } from '~/modules/mediaZipGenerator'

describe('メディアダウンロード向けZIPファイル生成クラス', () => {
  let contents: Content[]

  beforeEach(() => {
    /**
     * URLに関する特定の関数を定義する
     * Jestで利用しているDOMライブラリでは、一部の関数が未実装である
     * ライブラリ側で実装されるまで、暫定的に固定値を返すように設定している
     * @see https://github.com/jsdom/jsdom/issues/1721#issuecomment-439222748
     *
     * （なお、アルゴリズムを再現して関数として定義する方法もある）
     * @see https://github.com/dumbmatter/fakeIndexedDB/issues/56#issuecomment-896353134
     *
     * @todo ライブラリで実装されたことを確認後、この処理を削除する
     */
    if (typeof window.URL.createObjectURL === 'undefined') {
      Object.defineProperty(window.URL, 'createObjectURL', {
        value: jest.fn().mockReturnValue('blob:https://example.com/testblob'),
      })
    }

    contents = [
      { name: 'test1.jpg', blob: new Blob() },
      { name: 'test2.png', blob: new Blob() },
      { name: 'test3.mp4', blob: new Blob() },
    ]
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('ZIPファイルのURLを生成する', async () => {
    const generator = new MediaZipGenerator(contents)
    await generator.generate()

    expect(generator.file.name).toBe('media')
    expect(generator.file.objectUrl).toBe('blob:https://example.com/testblob') // モック化している関係で、固定値である点に注意する
  })

  test('ZIPファイル向けライブラリが扱えない場合にエラーが発生する', () => {
    JSZip.prototype.folder = jest.fn().mockReturnValue(null)

    const generator = new MediaZipGenerator(contents)
    expect(generator.generate()).rejects.toThrow(
      new MediaDownloadError('ZIPファイルの作成に失敗しました'),
    )
  })
})
