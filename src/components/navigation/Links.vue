<template>
  <!-- ルート要素にslotタグを指定することができないため、divタグで囲む -->
  <div>
    <slot :links="links"></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Link } from '~/@types/link'

export default Vue.extend({
  // 特定の型をつけたいため、一文で書くことによるreturnの省略を行わない
  data: () => {
    // リンクに設定するページ（アプリ内部向け）
    // 外部リンクはcreated()内で追加する
    const links: Link[] = [
      {
        title: 'ホーム',
        path: '/',
        icon: 'mdi-home',
      },
      {
        title: 'ご利用上の注意',
        path: 'rule',
        icon: 'mdi-account',
      },
      {
        title: 'キーワード検索',
        path: 'keyword',
        icon: 'mdi-check',
      },
      {
        title: 'ユーザー検索',
        path: 'user',
        icon: 'mdi-check',
      },
      {
        title: 'アカウントサービス',
        path: 'login',
        icon: 'mdi-check',
      },
    ]

    return {
      links,
    }
  },
  created() {},
})
</script>
