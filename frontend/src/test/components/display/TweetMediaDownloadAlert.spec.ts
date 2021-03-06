import TweetMediaDownloadAlert from '~/components/display/TweetMediaDownloadAlert.vue'
import { MediaDownloadError } from '~/modules/customError'
import { assertIsTextArea } from '~/test/util/assert'
import { mount } from '~/test/util/mount'

describe('メディアダウンロード用アラート表示', () => {
  const props: { errors: MediaDownloadError[] } = {
    errors: [],
  }
  type Props = typeof props

  test('エラー情報が追加されると、アラートに反映される', async () => {
    const mountedWrapper = mount(TweetMediaDownloadAlert, { propsData: props })

    // 初期表示の検証
    const alert = mountedWrapper.find('div.v-alert')
    expect(alert.text()).toContain('')

    // エラーの追加
    const propsData: Props = JSON.parse(JSON.stringify(props))
    propsData.errors.push(
      new MediaDownloadError('メディアのダウンロード中にエラーが発生しました'),
    )
    await mountedWrapper.setProps(propsData)

    // 値の検証
    const addedAlert = mountedWrapper.find('div.v-alert')
    expect(addedAlert.text()).toContain(
      'メディアのダウンロード中にエラーが発生しました',
    )
  })

  test('エラー情報が追加されると、エラー詳細に反映される', async () => {
    const mountedWrapper = mount(TweetMediaDownloadAlert, { propsData: props })

    // エラーの追加
    const propsData: Props = JSON.parse(JSON.stringify(props))
    propsData.errors.push(
      new MediaDownloadError('メディアのダウンロード中にエラーが発生しました'),
    )
    propsData.errors.push(
      new MediaDownloadError({
        message: 'メディアが見つかりませんでした',
        data: { reason: 'Not Found.' },
      }),
    )
    propsData.errors.push(
      new MediaDownloadError({
        message: '通信エラーが発生しました',
        data: { reason: 'Network Error.' },
      }),
    )
    await mountedWrapper.setProps(propsData)

    // 値の検証
    // 検証用の値を用意する
    const filteredData = propsData.errors.filter((error) => {
      return error.data
    })
    const mappedData = filteredData.map((error) => {
      return JSON.stringify(error.data)
    })
    const traces = mappedData.join('\n')

    // エラー詳細の値を検証する
    const field = mountedWrapper.find('div.expansion-field')
    await field.find('.button').trigger('click') // 表示ボタンを押して、内容をHTML内に展開する
    const textarea = field.find('textarea')
    assertIsTextArea(textarea.element) // テキストエリアの値を取得するために、専用の型であることを保証する（valueプロパティが存在する型へ変換する）
    expect(textarea.element.value).toContain(traces)
  })
})
