<script setup lang="ts">
  const news = ref([] as Array<News>);
  const cache:usePaginationCache = reactive({limit: 5});
  const { data, pending, refresh } = await useAsyncData('home-public-news', () => usePagination({
    url: `/api/v1/news/articles/public`,
    cache: cache,
  }, news));
</script>

<template>
  <app-news-sections-template :news="news" :cache="cache" card-title="app-section-title-public-news" href="/app/news/public" />
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>