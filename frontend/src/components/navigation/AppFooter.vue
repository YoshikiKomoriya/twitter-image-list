<template>
  <v-footer color="gray" app absolute>
    <v-container>
      <nav>
        <v-row justify="center">
          <v-col
            v-for="(link, index) in links"
            :key="index"
            cols="12"
            md="auto"
          >
            <v-btn
              text
              :to="link.path"
              :block="$vuetify.breakpoint.mobile"
              nuxt
            >
              {{ link.title }}
            </v-btn>
          </v-col>
        </v-row>
      </nav>

      <v-row>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="auto">
          <string-copyright></string-copyright>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import StringCopyright from '~/components/display/StringCopyright.vue'
import { links } from '~/preferences/links'

export default Vue.extend({
  components: { StringCopyright },
  data() {
    return {
      links,
    }
  },
})
</script>
