<template>
  <span>&copy; {{ year }}</span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    year: () => {
      const date = new Date()
      return date.getFullYear()
    },
  },
})
</script>
