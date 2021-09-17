/**
 * Vueファイルのテスト向けに、コンポーネントのマウントを行う設定
 *
 * @see https://vue-test-utils.vuejs.org/ja/
 * @see https://vuetifyjs.com/ja/getting-started/unit-testing/
 */
import {
  mount as utilsMount,
  shallowMount as utilsShallowMount,
  createLocalVue,
  RouterLinkStub,
  FunctionalComponentMountOptions,
} from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'

/**
 * 指定のオプションに'vuetify'が存在するか調べて、ない場合は追加する
 * @param options
 * @returns
 */
const addVuetifyOption = (options: FunctionalComponentMountOptions<Vue>) => {
  if (Object.keys(options).includes('vuetify')) {
    return
  }

  options.vuetify = new Vuetify()
}

/**
 * コンポーネントのマウントを行う
 * @param component コンポーネント
 * @param options オプション
 * @returns マウントされたコンポーネント
 */
const mount = (
  component: typeof Vue,
  options: FunctionalComponentMountOptions<Vue> = {},
) => {
  const localVue = createLocalVue()
  addVuetifyOption(options)

  const wrapper = utilsMount(component, {
    localVue,
    stubs: {
      // リンク系のモジュールはJestの標準機能で読み込めないため、テスト用モジュールで代替する
      NuxtLink: RouterLinkStub,
    },
    ...options,
  })

  return wrapper
}

/**
 * コンポーネントのマウントを行う
 * shallowMountを利用して、子コンポーネントはスタブ化する
 * @param component コンポーネント
 * @param options オプション
 * @returns マウントされたコンポーネント
 */
const shallowMount = (
  component: typeof Vue,
  options: FunctionalComponentMountOptions<Vue> = {},
) => {
  const localVue = createLocalVue()
  addVuetifyOption(options)

  const wrapper = utilsShallowMount(component, {
    localVue,
    stubs: {
      // リンク系のモジュールはJestの標準機能で読み込めないため、テスト用モジュールで代替する
      NuxtLink: RouterLinkStub,
    },
    ...options,
  })

  return wrapper
}

export { mount, shallowMount }
