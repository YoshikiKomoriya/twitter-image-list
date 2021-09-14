<template>
  <v-footer color="gray_light" app absolute>
    <v-container>
      <links>
        <template #default="slotProps">
          <nav>
            <v-row justify="center">
              <v-col
                v-for="(link, index) in slotProps.links"
                :key="index"
                cols="12"
                md="auto"
              >
                <v-btn text :to="link.path" :block="$vuetify.breakpoint.mobile">
                  {{ link.title }}
                </v-btn>
              </v-col>
            </v-row>
          </nav>
        </template>
      </links>

      <v-row>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="auto">
          <copyright></copyright>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import Copyright from '~/components/display/Copyright.vue'
import Links from '~/components/navigation/Links.vue'

export default Vue.extend({
  components: { Copyright, Links },
})
</script>
