<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const user = computed(() => store.getUser);
  const token = ref(await user.value.getIdToken());

  const props = defineProps({
    'pagination': {
      type: Boolean,
      required: false,
      default: false,
    }
  });
  const news = ref([] as Array<News>);
  const cache:usePaginationCache = reactive({limit: props.pagination ? 10 : 6});

  const { data, pending, refresh } = await useAsyncData('list-internal-news', () => usePagination({
    url: `/api/v1/news/articles/internal/${token.value}`,
    cache: cache,
    remove: ['body', 'summary']
  }, news));

  const handleRefresh = async () => {
    token.value = await user.value.getIdToken()
    refresh();
  }
</script>

<template>
  <news-list-template :news="news" name="internal" :cache="cache" href="/app/news/internal" :pagination="handleRefresh" />
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>