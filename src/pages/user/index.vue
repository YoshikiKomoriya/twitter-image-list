<template>
  <v-row>
    <v-col>
      <h1 class="text-center">ユーザー検索</h1>
      <search-bar-user></search-bar-user>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBarUser from '~/components/form/SearchBarUser.vue'

export default Vue.extend({
  components: { SearchBarUser },
})
</script>
