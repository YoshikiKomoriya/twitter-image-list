<template>
  <v-app>
    <!-- ナビゲーションの実際の表示領域 -->
    <navigation-drawer :drawer.sync="navigationDrawer"></navigation-drawer>

    <app-header @input="setNavigationDrawer(true)"></app-header>

    <v-main>
      <v-container>
        <!-- 各ページのコンテンツ -->
        <nuxt></nuxt>
      </v-container>
    </v-main>

    <app-footer></app-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import AppFooter from '~/components/navigation/AppFooter.vue'
import AppHeader from '~/components/navigation/AppHeader.vue'
import NavigationDrawer from '~/components/navigation/NavigationDrawer.vue'

export default Vue.extend({
  components: {
    AppHeader,
    AppFooter,
    NavigationDrawer,
  },
  data: () => ({
    navigationDrawer: false,
  }),
  methods: {
    /**
     * ナビゲーションドロワーに関するモデルを設定する
     */
    setNavigationDrawer(value: boolean) {
      this.navigationDrawer = value
    },
  },
})
</script>
