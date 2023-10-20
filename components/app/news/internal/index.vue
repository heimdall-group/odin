<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const internal_news = computed(() => {return store.getPermissions('internal-news')});
</script>

<template>
  <v-container>
  </v-container>
</template>

