<template>
  <v-navigation-drawer
    :value="drawer"
    app
    temporary
    @input="dispatchInputEvent"
  >
    <links>
      <template #default="slotProps">
        <v-list>
          <!-- リンク先が内部/外部によって使用する属性が異なるため注意する（内部リンクは'to', 外部リンクは'href'を用いる） -->
          <v-list-item
            v-for="(link, index) in slotProps.links"
            :key="index"
            :to="isInternalLink(link.to) ? link.to : ''"
            :href="isInternalLink(link.to) ? '' : link.to"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ link.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </links>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import Links from '~/components/navigation/Links.vue'

/**
 * メニュー向けのドロワー
 */
export default Vue.extend({
  components: { Links },
  props: {
    /**
     * ドロワー表示用のモデル
     */
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * ドロワー表示用のモデル
     */
    drawer: {
      get(): boolean {
        return this.value
      },
      set() {},
    },
  },
  methods: {
    /**
     * ドロワーの開閉時に実行される関数
     * 親コンポーネントに対してイベントを発生させる
     */
    dispatchInputEvent(value: boolean) {
      this.$emit('input', value)
    },
    /**
     * 指定のリンク先が内部リンクであるかどうかを調べる
     */
    isInternalLink(path: string) {
      const isExternalLink = /^https?:\/\//.test(path)
      return !isExternalLink
    },
  },
})
</script>
