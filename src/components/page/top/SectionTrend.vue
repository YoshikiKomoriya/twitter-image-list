<template>
  <section>
    <v-row>
      <v-col cols="12">
        <h2 class="text-center">トレンドから検索する</h2>
        <v-chip-group column>
          <v-chip
            v-for="(trend, index) in trends"
            :key="index"
            :to="generateKeywordLink(trend)"
          >
            {{ trend }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { encodeQuery } from '~/plugins/query'

export default Vue.extend({
  data: () => {
    // 仮のデータとして置いている
    // TODO: トレンド関係の機能を実装する
    const trends: String[] = [
      'Work',
      'Home Improvement',
      'Vacation',
      'Food',
      'Drawers',
      'Shopping',
      'Art',
      'Tech',
      'Creative Writing',
    ]

    return { trends }
  },
  methods: {
    generateKeywordLink(keyword: string) {
      const encodedKeyword = encodeQuery(keyword)
      return `/keyword/${encodedKeyword}`
    },
  },
})
</script>
