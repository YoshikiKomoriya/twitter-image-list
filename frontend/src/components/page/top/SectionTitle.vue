<template>
  <section>
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h1>Twitter画像検索&amp;ダウンロード</h1>
          <h2 class="text-center">
            <image-logo
              v-if="$vuetify.breakpoint.mobile"
              width="100%"
            ></image-logo>
            <image-logo v-else width="40rem"></image-logo>
          </h2>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ImageLogo from '~/components/display/ImageLogo.vue'

export default Vue.extend({
  components: { ImageLogo },
})
</script>
