/**
 * Vueファイルのテスト向けに、コンポーネントのマウントを行う設定
 *
 * @see https://vue-test-utils.vuejs.org/ja/
 * @see https://vuetifyjs.com/ja/getting-started/unit-testing/
 */
import {
  createLocalVue,
  FunctionalComponentMountOptions,
  mount as utilsMount,
  RouterLinkStub,
  shallowMount as utilsShallowMount,
} from '@vue/test-utils'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import NuxtContentMock from '~/test/util/__mocks__/NuxtContentMock.vue'

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
 * 指定のオプションに'router'が存在するか調べて、ない場合は追加する
 * @param options
 * @returns
 */
const addRouterOption = (options: FunctionalComponentMountOptions<Vue>) => {
  if (Object.keys(options).includes('router')) {
    return
  }

  options.router = new VueRouter()
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
  localVue.use(VueRouter)
  addRouterOption(options)
  addVuetifyOption(options)

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
  localVue.use(VueRouter)
  addRouterOption(options)
  addVuetifyOption(options)

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
