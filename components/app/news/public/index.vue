<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const public_news = computed(() => {return store.getPermissions('public-news')});
  const router = useRouter();
</script>

<template>
  <v-container>
  </v-container>
</template>

