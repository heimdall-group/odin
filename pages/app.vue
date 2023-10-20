<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const user = computed(() => store.getUser);
  const router = useRouter();

  definePageMeta({
    layout: "app",
  });

  if (Object.keys(user.value).length === 0) {
    await router.push('/')
  }

  if (!user.value.member && !user.value.super_admin) {
    await router.push('/')
  }

  console.log('app.vue')
</script>

<template>
  <NuxtPage v-if="Object.keys(user).length > 0"></NuxtPage>
</template>
