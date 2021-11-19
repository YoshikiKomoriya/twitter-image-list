import { Wrapper } from '@vue/test-utils'
import TweetMediaDownloadButton from '~/components/display/TweetMediaDownloadButton.vue'
import { MediaDownloadError } from '~/modules/customError'
import { MediaDownloader, ProcessCounter } from '~/modules/mediaDownloader'
import { FileInformation } from '~/modules/mediaZipGenerator'
import { mount, shallowMount } from '~/test/util/mount'

describe('メディアダウンロードボタン', () => {
  let wrapper: Wrapper<Vue>
  const props = { statuses: [] }

  beforeEach(() => {
    wrapper = shallowMount(TweetMediaDownloadButton, { propsData: props })

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
  })

  describe('表示の検証', () => {
    test('ボタンが表示される', () => {
      const mountedWrapper = mount(TweetMediaDownloadButton, {
        propsData: props,
      })

      const button = mountedWrapper.find('button.v-btn')
      expect(button.text()).toBe('ダウンロード')
    })

    test('ボタンクリック時、ダイアログが表示される', async () => {
      // ダウンロード処理は該当モジュールで検証するため、こちらではモック化する
      jest.spyOn(MediaDownloader.prototype, 'download').mockResolvedValue()

      const mountedWrapper = mount(TweetMediaDownloadButton, {
        propsData: { statuses: [] },
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
        propsData: props,
      })
      expect(mountedWrapper.find('div.v-dialog--active').exists()).toBe(false)

      // 「ダウンロード」ボタンをクリックするとダイアログが開き、ダウンロード処理が開始される
      const button = mountedWrapper.find('button.v-btn')
      await button.trigger('click')

      expect(mountedWrapper.find('div.v-dialog--active').exists()).toBe(true)
      expect(mountedWrapper.vm.$data.downloader.download).toBeCalled()
    })

    test('キャンセルボタンを押すと、キャンセル処理が行われる', async () => {
      // ダウンロードやキャンセルに関する処理をモック化
      const mockDownload = jest
        .spyOn(MediaDownloader.prototype, 'download')
        .mockResolvedValue()
      const mockAbort = jest
        .spyOn(MediaDownloader.prototype, 'abort')
        .mockReturnValue()
      const mockRevoleURL = jest.fn()
      window.URL.revokeObjectURL = mockRevoleURL // jest.spyOnではエラーが発生するため、関数を定義している
      window.URL.createObjectURL = jest.fn()

      const mountedWrapper = mount(TweetMediaDownloadButton, {
        propsData: props,
      })

      // 「ダウンロード」ボタンを押して、ダイアログを表示する
      const button = mountedWrapper.find('button.v-btn')
      await button.trigger('click')

      expect(mountedWrapper.find('div.v-dialog--active').exists()).toBe(true)
      expect(mockDownload).toHaveBeenCalled()

      // 「キャンセル」ボタンを押して、ダウンロード処理をキャンセルする
      const cancelButton = mountedWrapper
        .findAll('div.v-card__actions button.v-btn')
        .at(0)
      await cancelButton.trigger('click')

      expect(mockAbort).toHaveBeenCalled()
      expect(mockRevoleURL).toHaveBeenCalledWith(
        mountedWrapper.vm.$data.file.objectUrl,
      )
      expect(mountedWrapper.vm.$data.process.processing).toBe(false)
      expect(mountedWrapper.vm.$data.downloader.errors.length).toBe(0)
    })

    test('メディアのダウンロードでエラーが発生した場合、アラートに表示される', () => {})

    test('コンポーネントの破棄前にキャンセルされる', () => {})
  })
})
