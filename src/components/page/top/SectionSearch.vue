<template>
  <section>
    <v-row justify="center">
      <v-col cols="12" class="pt-0">
        <search-keyword></search-keyword>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchKeyword from '~/components/form/SearchKeyword.vue'

export default Vue.extend({
  components: {
    SearchKeyword,
  },
})
</script>
