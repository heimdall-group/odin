<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const user = computed(() => store.getUser);
  const router = useRouter();

  definePageMeta({
    layout: "app",
  });
</script>

<template>
  <NuxtPage v-if="Object.keys(user).length > 0"></NuxtPage>
  <div v-else-if="Object.keys(user).length > 0 && !user.member && !user.super_admin">
    Not a member
  </div>
  <app-authentication-login v-else />
</template>
