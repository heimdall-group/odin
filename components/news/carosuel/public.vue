<script setup lang="ts">
  const news = ref([] as Array<News>);
  const cache:usePaginationCache = reactive({limit: 3});
  const props = defineProps({
    'href': {
      type: String,
      required: true,
    },
  })

  const { data, pending, refresh } = await useAsyncData('carosuel-public-news', () => usePagination({
    url: `/api/v1/news/articles/public`,
    cache: cache,
    remove: ['body']
  }, news));
</script>

<template>
  <news-carosuel-template :news="news" name="public" :cache="cache" :href="href" :refresh="refresh" />
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
