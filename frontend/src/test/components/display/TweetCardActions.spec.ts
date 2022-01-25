import { Wrapper } from '@vue/test-utils'
import TweetCardActions from '~/components/display/TweetCardActions.vue'
import { shallowMount } from '~/test/util/mount'

describe('ツイート表示用ブロック（ボタン配置欄）', () => {
  let wrapper: Wrapper<Vue>

  const props = {
    mediaHref: 'https://example.com?mediaHref=true',
    tweetHref: 'https://example.com?tweetHref=true',
  }

  beforeEach(() => {
    wrapper = shallowMount(TweetCardActions, { propsData: props })
  })

  test('ボタンが表示されている', () => {
    const buttons = wrapper.findAll('v-btn-stub')

    const exportButtonIcon = buttons.at(0).find('v-icon-stub')
    expect(exportButtonIcon.text()).toBe('mdi-export')

    const twitterButtonIcon = buttons.at(1).find('v-icon-stub')
    expect(twitterButtonIcon.text()).toBe('mdi-twitter')
  })

  test('ボタンが左右に分かれて配置されている', () => {
    const contents = wrapper.findAll('v-btn-stub, v-spacer-stub')

    expect(contents.at(0).find('v-btn-stub').exists()).toBe(true)
    expect(contents.at(1).find('v-spacer-stub').exists()).toBe(true)
    expect(contents.at(2).find('v-btn-stub').exists()).toBe(true)
  })

  test('リンク先が指定されている', async () => {
    const props = {
      mediaHref: 'https://example.com?mediaHref=true',
      tweetHref: 'https://example.com?tweetHref=true',
    }
    await wrapper.setProps(props)

    // ボタンを取得して、表示されているアイコン種別とリンク先が対応しているかどうか検証する
    const buttons = wrapper.findAll('v-btn-stub')

    const exportButton = buttons.at(0)
    expect(exportButton.attributes('href')).toBe(props.mediaHref)
    const exportButtonIcon = exportButton.find('v-icon-stub')
    expect(exportButtonIcon.text()).toBe('mdi-export')

    const tweetButton = buttons.at(1)
    expect(tweetButton.attributes('href')).toBe(props.tweetHref)
    const twitterButtonIcon = tweetButton.find('v-icon-stub')
    expect(twitterButtonIcon.text()).toBe('mdi-twitter')
  })

  test('リンク先が新規ウィンドウで表示される', () => {
    const buttons = wrapper.findAll('v-btn-stub')

    for (let i = 0; i < buttons.length; i++) {
      expect(buttons.at(i).attributes('target')).toBe('_blank')
    }
  })

  test('リンク先に元ページのオブジェクト・リファラーを無効化する設定が付け加えられている', () => {
    const buttons = wrapper.findAll('v-btn-stub')

    for (let i = 0; i < buttons.length; i++) {
      expect(buttons.at(i).attributes('rel')).toBe('noopener noreferrer')
    }
  })
})
