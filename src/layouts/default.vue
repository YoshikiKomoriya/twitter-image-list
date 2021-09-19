<template>
  <v-app>
    <!-- ナビゲーションの実際の表示領域 -->
    <navigation-drawer :drawer.sync="navigationDrawer"></navigation-drawer>

    <header-component @input="setNavigationDrawer(true)"></header-component>

    <v-main>
      <v-container>
        <!-- 各ページのコンテンツ -->
        <nuxt></nuxt>
      </v-container>
    </v-main>

    <footer-component></footer-component>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import FooterComponent from '~/components/navigation/Footer.vue'
import HeaderComponent from '~/components/navigation/Header.vue'
import NavigationDrawer from '~/components/navigation/NavigationDrawer.vue'

export default Vue.extend({
  components: {
    FooterComponent,
    HeaderComponent,
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
