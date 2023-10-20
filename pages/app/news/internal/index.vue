<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const permission = computed(() => store.getPermissions('internal-news'));
  const router = useRouter();
  
  if (!permission.value || !permission.value.read) {
    await router.push('/app/news')
  }
</script>

<template>
  <app-news-internal />
</template>