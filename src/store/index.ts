/**
 * Typed Vuexに型定義を追加するためのファイル
 *
 * @see https://typed-vuex.roe.dev/getting-started-nuxt
 */
import {
  getAccessorType,
  actionTree,
  getterTree,
  mutationTree,
} from 'nuxt-typed-vuex'

// Import all your submodules
// Storeを新規作成するたびに、インポートするモジュールを追加する

// これらは後にgetAccessorTypeで利用する際に型定義が必要であるため、あらかじめ空で定義する
export const state = () => ({})
export const getters = getterTree(state, {})
export const mutations = mutationTree(state, {})
export const actions = actionTree({ state, getters, mutations }, {})

// Keep your existing vanilla Vuex code for state, getters, mutations, actions, plugins, etc.

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    // Storeを新規作成するたびに、ここにモジュール名を追加する
  },
})
