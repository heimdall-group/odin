<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const route = useRoute();
</script>

<template>
  <news-pages-template :name="$t(route.fullPath.includes('/app/') ? 'app-news-list-public' : 'news-list-public')">
    <news-list-public href="/information/news" :pagination="true" />
  </news-pages-template>
</template>

