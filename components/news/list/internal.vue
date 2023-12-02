<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const user = computed(() => store.getUser);
  const token = await user.value.getIdToken();

  const news = ref([] as Array<News>);
  const cache:usePaginationCache = reactive({limit: 6});
  const props = defineProps({
    'pagination': {
      type: Boolean,
      required: false,
      default: false,
    }
  })

  const { data, pending, refresh } = await useAsyncData('list-internal-news', () => usePagination({
    url: `/api/v1/news/articles/internal/${token}`,
    cache: cache,
    excluded_keys: ['body']
  }, news));
</script>

<template>
  <news-list-template :news="news" name="internal" :cache="cache" href="/app/news/internal" :pagination="refresh" />
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>