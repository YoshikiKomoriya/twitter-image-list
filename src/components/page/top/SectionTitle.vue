<template>
  <section>
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h1>Twitter画像検索&amp;ダウンロード</h1>
          <h2 class="text-center">
            <logo v-if="$vuetify.breakpoint.mobile" width="100%"></logo>
            <logo v-else width="40rem"></logo>
          </h2>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/display/Logo.vue'

export default Vue.extend({
  components: { Logo },
})
</script>
