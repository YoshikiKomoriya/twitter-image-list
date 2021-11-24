<template>
  <article>
    <section-title></section-title>
    <section-search></section-search>
    <section-trend></section-trend>
    <section-information></section-information>
    <section-notice>
      <template #notice>
        <!-- nuxt-contentはページコンポーネントでしか動作しない様子なので、ここで定義する -->
        <nuxt-content :document="aboutService"></nuxt-content>
      </template>
    </section-notice>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'

import SectionInformation from '~/components/page/top/SectionInformation.vue'
import SectionNotice from '~/components/page/top/SectionNotice.vue'
import SectionSearch from '~/components/page/top/SectionSearch.vue'
import SectionTitle from '~/components/page/top/SectionTitle.vue'
import SectionTrend from '~/components/page/top/SectionTrend.vue'

export default Vue.extend({
  components: {
    SectionTitle,
    SectionTrend,
    SectionInformation,
    SectionNotice,
    SectionSearch,
  },
  async asyncData({ $content }) {
    const aboutService = await $content('about_service').fetch()

    return { aboutService }
  },
})
</script>
