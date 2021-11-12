import { Wrapper } from '@vue/test-utils'
import ProgressLinear from '~/components/feedback/ProgressLinear.vue'
import { ProcessCounter } from '~/modules/mediaDownloader'
import { shallowMount } from '~/test/util/mount'

describe('処理中の旨を示すバー', () => {
  let wrapper: Wrapper<Vue>
  const props: { counter: ProcessCounter } = {
    counter: {
      processed: 0,
      total: 273, // 進捗状況のパーセンテージを確認するために、意図的に中途半端な数値にしている
    },
  }
  type Props = typeof props

  const getPercent = (progress: number) => {
    const count = progress / props.counter.total
    const percent = count * 100
    return Math.ceil(percent)
  }

  beforeEach(() => {
    wrapper = shallowMount(ProgressLinear, { propsData: props })
  })

  test('バーが表示される', () => {
    const bar = wrapper.find('v-progress-linear-stub')
    expect(bar.exists()).toBe(true)
  })

  test.each([
    { value: 0, percent: getPercent(0) },
    { value: 50, percent: getPercent(50) },
    { value: 100, percent: getPercent(100) },
    { value: 150, percent: getPercent(150) },
    { value: 200, percent: getPercent(200) },
    { value: props.counter.total, percent: getPercent(props.counter.total) },
  ])(`進捗状況が表示される（%s）`, async ({ value }) => {
    const propsData: Props = JSON.parse(JSON.stringify(props))
    propsData.counter.processed = value
    await wrapper.setProps(propsData)

    const count = propsData.counter.processed / propsData.counter.total
    const percent = count * 100
    const progress = Math.ceil(percent)

    const bar = wrapper.find('v-progress-linear-stub')
    expect(bar.attributes('value')).toBe(progress.toString())
  })
})
