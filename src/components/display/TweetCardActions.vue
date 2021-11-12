<template>
  <v-row>
    <v-col cols="auto">
      <v-btn icon :href="mediaHref" target="_blank" rel="noopener noreferrer">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="auto">
      <v-btn icon :href="tweetHref" target="_blank" rel="noopener noreferrer">
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    mediaHref: {
      type: String,
      required: true,
    },
    tweetHref: {
      type: String,
      required: true,
    },
  },
})
</script>
