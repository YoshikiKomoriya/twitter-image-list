<template>
  <article>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">ご利用上の注意</h1>
      </v-col>
    </v-row>
    <v-row class="my-3">
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <section>
      <nuxt-content :document="termOfService"></nuxt-content>
    </section>
    <v-row class="my-3">
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <section>
      <nuxt-content :document="privacyPolicy"></nuxt-content>
    </section>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData({ $content }) {
    const termOfService = await $content('term_of_service').fetch()
    const privacyPolicy = await $content('privacy_policy').fetch()

    return { termOfService, privacyPolicy }
  },
  head() {
    return {
      title: 'ご利用上の注意',
    }
  },
})
</script>

<style lang="scss" scoped>
.nuxt-content {
  h2 {
    text-align: center;
  }

  ul {
    margin: 1rem 0;
    list-style-type: decimal;
  }
}
</style>
