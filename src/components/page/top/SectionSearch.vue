<template>
  <section>
    <v-row justify="center">
      <v-col cols="12" class="pt-0">
        <search-bar-keyword></search-bar-keyword>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBarKeyword from '~/components/form/SearchBarKeyword.vue'

export default Vue.extend({
  components: {
    SearchBarKeyword,
  },
})
</script>
