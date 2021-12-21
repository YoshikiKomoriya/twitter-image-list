<template>
  <article>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">アカウントサービス</h1>
      </v-col>
    </v-row>
    <section>
      <v-row>
        <v-col cols="12">
          <div class="text-center">
            <p>
              Twitterアカウントを連携すると、以下の機能がご利用いただけます。
            </p>
            <v-img
              alt="「タイムラインの表示」と「リストの表示」の機能がご利用いただけます"
            ></v-img>
            <button-login block :size="size"></button-login>
          </div>
        </v-col>
      </v-row>
    </section>
    <v-row class="my-3">
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <section>
      <nuxt-content :document="registrationNotice"></nuxt-content>
    </section>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'
import ButtonLogin from '~/components/general/ButtonLogin.vue'
import { buttonSize } from '~/preferences/buttonSize'

export default Vue.extend({
  components: { ButtonLogin },
  async asyncData({ $content }) {
    const registrationNotice = await $content('registration_notice').fetch()

    return { registrationNotice }
  },
  data() {
    return {
      size: buttonSize.xLarge,
    }
  },
  head() {
    return {
      title: 'アカウントサービス',
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
