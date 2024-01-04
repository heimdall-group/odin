<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const user = computed(() => store.getUser);
  const router = useRouter();
  const route = useRoute();

  const internal_news = store.getPermissions('internal-news');
  const public_news = store.getPermissions('public-news');

</script>

<template>
  <v-container>
    <v-row>
      <app-news-sections-internal v-if="internal_news.read" />
      <app-news-sections-public v-if="public_news.read" />
    </v-row>
  </v-container>
</template>
