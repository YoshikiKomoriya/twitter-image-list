<template>
  <section v-if="trends.length > 0">
    <v-row>
      <v-col cols="12">
        <h2 class="text-center">トレンドから検索する</h2>
        <v-chip-group column>
          <v-chip
            v-for="(trend, index) in trends"
            :key="index"
            :to="generateKeywordLink(trend.name)"
          >
            {{ trend.name }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { encodeQuery } from '~/modules/query'
import { Trend, TrendsApi } from '~openapi/generated/src'

export default Vue.extend({
  data() {
    const trends: Trend[] = []

    return { trends }
  },
  async fetch() {
    const api = new TrendsApi()
    const params = {
      id: 23424856,
    }
    const result = await api.trendsPlace(params)

    this.trends = result[0].trends
  },
  methods: {
    generateKeywordLink(keyword: string) {
      const encodedKeyword = encodeQuery(keyword)
      return `/keyword/${encodedKeyword}`
    },
  },
})
</script>
