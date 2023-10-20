<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const public_news = computed(() => store.getPermissions('public-news'));
  const internal_news = computed(() => store.getPermissions('internal-news'));
  const router = useRouter();
  
  if (!public_news.value || !public_news.value.read) {
    await router.push('/app/news')
  }
  if (!internal_news.value || !internal_news.value.read) {
    await router.push('/app/news')
  }

</script>

<template>
  <app-news-create />
</template>