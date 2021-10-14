<template>
  <v-app-bar flat color="gray" app absolute>
    <v-container>
      <v-row align="center">
        <!-- 左側 -->
        <v-col cols="auto">
          <v-toolbar-title>
            <logo width="12rem"></logo>
          </v-toolbar-title>
        </v-col>

        <v-spacer></v-spacer>

        <!-- 右側 -->
        <v-col cols="auto">
          <!-- モバイル表示時はアイコンのみ表示 -->
          <template v-if="$vuetify.breakpoint.mobile">
            <v-app-bar-nav-icon
              @click="dispatchInputEvent"
            ></v-app-bar-nav-icon>
          </template>
          <!-- PC表示時はメニュー用リンクを表示 -->
          <template v-else>
            <nav>
              <v-btn
                v-for="(link, index) in links"
                :key="index"
                text
                :to="link.path"
                class="mx-1"
                nuxt
              >
                {{ link.title }}
              </v-btn>
            </nav>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/display/Logo.vue'
import { links } from '~/preferences/links'

/**
 * ヘッダー向けのツールバー
 */
export default Vue.extend({
  components: { Logo },
  data() {
    return {
      links,
    }
  },
  methods: {
    /**
     * ナビゲーションボタンのクリック時に実行される関数
     * 親コンポーネントに対してイベントを発生させる
     */
    dispatchInputEvent() {
      this.$emit('input')
    },
  },
})
</script>
