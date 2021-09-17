<template>
  <span>&copy; {{ year }}</span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      year: new Date().getFullYear(),
    }
  },
})
</script>
