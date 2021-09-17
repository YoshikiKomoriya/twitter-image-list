<template>
  <v-navigation-drawer
    :value="drawer"
    app
    temporary
    @input="dispatchInputEvent"
  >
    <!-- linksはルートの要素にdivタグを持つため、v-list系のコンポーネントに影響が出ないよう外側で展開する -->
    <v-list nav>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(link, index) in links"
          :key="index"
          :to="link.path"
          nuxt
          link
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="link.title"> </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { links } from '~/components/navigation/links'

/**
 * メニュー向けのドロワー
 */
export default Vue.extend({
  props: {
    /**
     * ドロワー表示用のモデル
     */
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      links,
    }
  },

  methods: {
    /**
     * ドロワーの開閉時に実行される関数
     * 親コンポーネントに対してイベントを発生させる
     */
    dispatchInputEvent(value: boolean) {
      this.$emit('update:drawer', value)
    },
  },
})
</script>
