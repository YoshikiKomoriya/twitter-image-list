import { Wrapper } from '@vue/test-utils'
import axios from 'axios'
import TweetMediaDownloadButton from '~/components/display/TweetMediaDownloadButton.vue'
import { MediaDownloadError } from '~/modules/customError'
import { MediaDownloader, ProcessCounter } from '~/modules/mediaDownloader'
import { FileInformation } from '~/modules/mediaZipGenerator'
import { env } from '~/test/util/dotenv'
import { mount, shallowMount } from '~/test/util/mount'
import { ResponseSearchTweets, Tweet } from '~openapi/generated/src'

describe('メディアダウンロードボタン', () => {
  let wrapper: Wrapper<Vue>

  // モックサーバーに接続して、ダウンロード対象のメディアを取得する
  const mockServerOrigin = env.get('MOCK_SERVER_URL')
  let tweets: Tweet[]

  beforeEach(async () => {
    const response: ResponseSearchTweets = (
      await axios.get(`${mockServerOrigin}/search/tweets/image`)
    ).data
    tweets = response.statuses

    wrapper = shallowMount(TweetMediaDownloadButton, {
      propsData: { statuses: tweets },
    })

    /**
     * v-dialogを使用している場合、表示する対象が指定されていない（'data-app'属性を持つ要素が存在しない）ために以下の警告が発生する
     * 対象を生成して囲むことで、発生を抑制する
     * > [Vuetify] Unable to locate target [data-app]
     *
     * @see https://teratail.com/questions/192772#reply-287770
     */
    const div = document.createElement('div')
    div.setAttribute('data-app', 'true')
    document.body.append(div)

    window.URL.createObjectURL = (_object: any) => {
      return 'test'
    }
  })

  describe('表示の検証', () => {
    test('ボタンが表示される', () => {
      const mountedWrapper = mount(TweetMediaDownloadButton, {
        propsData: { statuses: tweets },
      })

      const button = mountedWrapper.find('button.v-btn')
      expect(button.text()).toBe('ダウンロード')
    })

    test('ボタンクリック時、ダイアログが表示される', async () => {
      // ダウンロード処理は該当モジュールで検証するため、こちらではモック化する
      jest.spyOn(MediaDownloader.prototype, 'download').mockResolvedValue()

      const mountedWrapper = mount(TweetMediaDownloadButton, {
        propsData: { statuses: tweets },
      })

      expect(mountedWrapper.find('div.v-dialog--active').exists()).toBe(false)

      const button = mountedWrapper.find('button.v-btn')
      await button.trigger('click')

      expect(mountedWrapper.find('div.v-dialog--active').exists()).toBe(true)
    })

    test('ダイアログにタイトルが表示される', async () => {
      await wrapper.setData({ dialog: true })

      const dialog = wrapper.find('v-dialog-stub')
      const title = dialog.find('v-card-title-stub')

      expect(title.text()).toBe('メディアのダウンロード')
    })

    test('ダイアログに進捗バーが表示される', async () => {
      await wrapper.setData({ dialog: true })

      const dialog = wrapper.find('v-dialog-stub')
      const progressBar = dialog.find('progress-linear-stub')

      expect(progressBar.exists()).toBe(true)
    })

    test('ダイアログにアラート表示用スペースが存在する', async () => {
      await wrapper.setData({ dialog: true })

      const dialog = wrapper.find('v-dialog-stub')
      const alert = dialog.find('tweet-media-download-alert-stub')
      expect(alert.attributes('errors')).toBe('')

      // エラー情報の追加
      await wrapper.setData({
        errors: [
          new MediaDownloadError('test'),
          new MediaDownloadError('test2'),
        ],
      })
      const addedAlert = dialog.find('tweet-media-download-alert-stub')
      expect(addedAlert.attributes('errors')).toBe(
        'MediaDownloadError: test,MediaDownloadError: test2',
      )
    })

    test('ダイアログにキャンセルボタン（閉じるボタン）・ダウンロードボタンが表示される', async () => {
      await wrapper.setData({ dialog: true })
      const dialog = wrapper.find('v-dialog-stub')

      // 初期状態の検証
      // キャンセルボタン
      const cancelButton = dialog.find('v-card-actions-stub v-btn-stub')
      expect(cancelButton.text()).toBe('キャンセル')

      // ダウンロードボタン
      const downloadButton = dialog.find('v-card-text-stub v-btn-stub')
      expect(downloadButton.text()).toBe('ダウンロード')
      expect(downloadButton.attributes('href')).toBe('')
      expect(downloadButton.attributes('download')).toBe('medias.zip')
      expect(downloadButton.attributes('loading')).toBe('true')

      // ダウンロードの準備が完了した状態の検証
      const file: FileInformation = {
        objectUrl: 'blob:http%3A//localhost%3A5000/test-1t2e3s4t',
        name: 'testMedias',
      }
      const process: { processing: boolean; counter: ProcessCounter } = {
        processing: false,
        counter: {
          processed: 100,
          total: 100,
        },
      }
      await wrapper.setData({ file, process })

      // ダウンロードボタン（更新分）
      expect(downloadButton.attributes('href')).toBe(file.objectUrl)
      expect(downloadButton.attributes('download')).toBe(`${file.name}.zip`)
      expect(downloadButton.attributes('loaoding')).toBeUndefined() // falseの場合は未定義となる

      // 閉じるボタン（キャンセルボタンと入れ替わりで表示される）
      const closeButton = dialog.find('v-card-actions-stub v-btn-stub')
      expect(closeButton.text()).toBe('閉じる')
    })
  })

  describe('処理の検証', () => {
    test('ダイアログが開く際、ダウンロード処理が開始される', async () => {
      // 初期表示ではダイアログが非表示であることを検証する
      const mountedWrapper = mount(TweetMediaDownloadButton, {
        propsData: { statuses: tweets },
      })
      expect(mountedWrapper.find('div.v-dialog--active').exists()).toBe(false)

      // 「ダウンロード」ボタンをクリックするとダイアログが開き、ダウンロード処理が開始される
      const download = jest.spyOn(MediaDownloader.prototype, 'download')
      const button = mountedWrapper.find('button.v-btn')
      await button.trigger('click')

      expect(mountedWrapper.find('div.v-dialog--active').exists()).toBe(true)
      expect(download).toBeCalled()
    })

    /**
     * コンポーネントのテスト方針を検討中でテストを書いても変更になる可能性があるため、一時的に項目のみ作成
     * @todo テストを記載する
     */
    test('キャンセルボタンを押すと、キャンセル処理が行われる', () => {})

    /**
     * コンポーネントのテスト方針を検討中でテストを書いても変更になる可能性があるため、一時的に項目のみ作成
     * @todo テストを記載する
     */
    test('メディアのダウンロードでエラーが発生した場合、アラートに表示される', () => {})

    /**
     * コンポーネントのテスト方針を検討中でテストを書いても変更になる可能性があるため、一時的に項目のみ作成
     * @todo テストを記載する
     */
    test('コンポーネントの破棄前にキャンセルされる', () => {})
  })
})
