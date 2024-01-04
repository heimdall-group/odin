<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const user = computed(() => store.getUser);
  const router = useRouter();
  const route = useRoute();

  definePageMeta({
    layout: "super-admin",
  });

  if (Object.keys(user.value).length === 0) {
    router.push('/')
  }

  if (!user.value.super_admin) {
    router.push('/')
  }
</script>

<template>
  <NuxtPage v-if="Object.keys(user).length > 0 && user.super_admin"></NuxtPage>
</template>
