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
import NuxtContentMock from '~/test/util/__mocks__/NuxtContentMock.vue'
import nuxtConfig from '~/../nuxt.config'

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
 * 指定のオプションのプロパティにNuxt向けの設定が存在するか調べて、ない場合は追加する
 */
const addNuxtConfigOption = (options: FunctionalComponentMountOptions<Vue>) => {
  const $config = nuxtConfig.publicRuntimeConfig

  if ($config === undefined) {
    throw new Error('Nuxtの設定ファイルが読み込めませんでした')
  }

  if (typeof options.mocks !== 'object') {
    // オプションが存在しない場合、プロパティを作成する
    options.mocks = { $config }
    return
  }

  // オプションが存在する場合、プロパティを追加する
  Object.defineProperty(options.mocks, '$config', $config)
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
  addNuxtConfigOption(options)

  const wrapper = utilsMount(component, {
    localVue,
    stubs: {
      // リンク系のモジュールをテスト用モジュールで代替する
      NuxtLink: RouterLinkStub,
      RouterLink: RouterLinkStub,
      // Nuxt Contentのモジュールについて、独自にスタブ化する
      NuxtContent: NuxtContentMock,
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
  addNuxtConfigOption(options)

  const wrapper = utilsShallowMount(component, {
    localVue,
    stubs: {
      // リンク系のモジュールをテスト用モジュールで代替する
      NuxtLink: RouterLinkStub,
      RouterLink: RouterLinkStub,
      // Nuxt Contentのモジュールについて、独自にスタブ化する
      NuxtContent: NuxtContentMock,
    },
    ...options,
  })

  return wrapper
}

export { mount, shallowMount }
