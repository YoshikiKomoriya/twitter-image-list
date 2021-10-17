<template>
  <v-row>
    <v-col>
      <h1 class="text-center">キーワード検索</h1>
      <search-bar-keyword></search-bar-keyword>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBarKeyword from '~/components/form/SearchBarKeyword.vue'

export default Vue.extend({
  components: { SearchBarKeyword },
})
</script>
