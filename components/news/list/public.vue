<script setup lang="ts">
  const props = defineProps({
    'href': {
      type: String,
      required: true,
    },
    'pagination': {
      type: Boolean,
      required: false,
      default: false,
    }
  });
  const news = ref([] as Array<News>);
  const cache:usePaginationCache = reactive({limit: props.pagination ? 10 : 6});

  const { data, pending, refresh } = await useAsyncData('list-public-news', () => usePagination({
    url: `/api/v1/news/articles/public`,
    cache: cache,
    remove: ['body', 'summary']
  }, news));
</script>

<template>
  <news-list-template :news="news" name="public" :cache="cache" :href="href" :pagination="refresh" />
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
