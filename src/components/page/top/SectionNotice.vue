<template>
  <section>
    <v-row justify="center">
      <v-col cols="12">
        <h2 class="text-center">{{ $config.appTitle }}について</h2>
      </v-col>
      <v-col cols="12" md="8">
        <!-- nuxt-contentはページコンポーネントでしか動作しない様子なので、実際の内容は親コンポーネントで定義する -->
        <slot name="notice"></slot>
      </v-col>
    </v-row>
  </section>
</template>
