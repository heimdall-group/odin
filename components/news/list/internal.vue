<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const user = computed(() => store.getUser);
  const token = await user.value.getIdToken();

  const news = ref([] as Array<News>);
  const cache:usePagnationCache = reactive({limit: 10});
  const { data, pending, refresh } = await useAsyncData('list-internal-news', () => usePagnation({
    url: `/api/v1/news/internal/${token}`,
    cache: cache,
  }, news));
</script>

<template>
  <news-list-template :news="news" name="internal" :cache="cache" />
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>