<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const user = computed(() => store.getUser);
  const token = await user.value.getIdToken();
  const news = ref([] as Array<News>);
  const cache:usePagnationCache = reactive({limit: 5});
  const { data, pending, refresh } = await useAsyncData('home-public-news', () => usePagnation({
    url: `/api/v1/news/internal/${token}`,
    cache: cache,
  }, news));
</script>

<template>
  <app-news-sections-template :news="news" :cache="cache" card-title="app-section-title-internal-news" />
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>