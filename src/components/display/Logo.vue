<template>
  <nuxt-link to="/" class="inline-block">
    <v-img
      src="/logo.svg"
      :width="width"
      :max-width="maxWidth"
      contain
      class="d-inline-block"
      alt="Twistter（Twitter Image List）"
    ></v-img>
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    width: {
      default: '15rem',
      type: String,
      required: false,
    },
    maxWidth: {
      default: '50rem',
      type: String,
      required: false,
    },
  },
})
</script>
