<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const user = computed(() => store.getUser);
  const router = useRouter();
  const route = useRoute();
</script>

<template>
  <v-container>
    <v-row class="ma-0">
      <app-news-sections-internal />
      <app-news-sections-public />
    </v-row>
  </v-container>
</template>
