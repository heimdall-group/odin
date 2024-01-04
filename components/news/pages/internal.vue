<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const internal_news = computed(() => {return store.getPermissions('internal-news')});
</script>

<template>
  <news-pages-template v-if="internal_news.read" :name="$t('app-news-list-internal')">
    <news-list-internal :pagination="true" />
  </news-pages-template>
  <v-container v-else class="fill-height">
  </v-container>
</template>

