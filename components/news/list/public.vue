<script setup lang="ts">
  const news = ref([] as Array<News>);
  const cache:usePagnationCache = reactive({limit: 10});
  const { data, pending, refresh } = await useAsyncData('list-public-news', () => usePagnation({
    url: `/api/v1/news/public`,
    cache: cache,
  }, news));
</script>

<template>
  <news-list-template :news="news" name="public" :cache="cache" />
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>