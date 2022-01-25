import { Wrapper } from '@vue/test-utils'
import axios from 'axios'
import SectionTrend from '~/components/page/top/SectionTrend.vue'
import { encodeQuery } from '~/modules/query'
import { env } from '~/test/util/dotenv'
import { shallowMount } from '~/test/util/mount'
import { Trend } from '~openapi/generated/src'

describe('トップページ内のトレンドブロック', () => {
  let wrapper: Wrapper<Vue>
  let trends: Trend[]

  // テスト向けにモックの初期化を行う
  beforeEach(async () => {
    // モックサーバーに接続して、レスポンス内容を取得するように設定する
    const mockServerOrigin = env.get('MOCK_SERVER_URL')
    const value = (await axios.get(`${mockServerOrigin}/trends/place`)).data
    trends = value[0].trends

    wrapper = shallowMount(SectionTrend, {
      data: () => {
        return { trends }
      },
    })
  })

  test('h2タグの表示', () => {
    const h2 = wrapper.get('h2')
    expect(h2.text()).toBe('トレンドから検索する')
  })

  test('トレンドキーワードの表示', () => {
    const chipGroup = wrapper.get('v-chip-group-stub')
    const chips = chipGroup.findAll('v-chip.stub')

    for (let i = 0; i < chips.length; i++) {
      expect(chips.at(i).text()).toBe(trends[i].name)
    }
  })

  test('トレンドのボタンがリンクになっている', () => {
    const chipGroup = wrapper.get('v-chip-group-stub')
    const chips = chipGroup.findAll('v-chip.stub')

    for (let i = 0; i < chips.length; i++) {
      const encodedKeyword = encodeQuery(trends[i].name)
      const to = `/keyword/${encodedKeyword}`
      expect(chips.at(i).attributes('to')).toBe(to)
    }
  })

  test('データが取得できない場合、ブロックを表示しない', () => {
    const mountedWrapper = shallowMount(SectionTrend, {
      data: () => {
        return { trends: [] }
      },
    })

    expect(mountedWrapper.isVisible()).toBe(false)
  })
})
