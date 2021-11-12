import TweetCard from '~/components/display/TweetCard.vue'
import { shallowMount } from '~/test/util/mount'

describe('ツイート表示用ブロック', () => {
  test('スロットを指定', () => {
    const span = document.createElement('span')
    span.textContent = 'content-test'

    const slots = {
      content: span.outerHTML,
    }
    const wrapper = shallowMount(TweetCard, {
      slots,
    })

    const card = wrapper.find('v-card-stub > span')
    expect(card.html()).toContain(slots.content)
  })
})
