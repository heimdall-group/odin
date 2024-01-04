<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const public_news = computed(() => store.getPermissions('public-news'));
  const internal_news = computed(() => store.getPermissions('internal-news'));
</script>

<template>
  <v-container>
    <app-news-create-public-internal v-if="public_news.write && internal_news.write" />
    <template v-else>
      <app-news-create-public v-if="public_news.write" />
      <app-news-create-internal v-if="internal_news.write" />
    </template>
  </v-container>
</template>

<style scoped>
  .v-container {
    overflow: hidden;
    height: calc(100vh - 64px);
  }
</style>
