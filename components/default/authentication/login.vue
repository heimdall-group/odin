<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const { DISCORD_OAUTH_URL, SESSION_ID_COOKIE_NAME } = useRuntimeConfig().public

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const sid = useCookie(SESSION_ID_COOKIE_NAME);
  const user = computed(() => store.getUser);
  const code = ref(route.query.code ? route.query.code : false);
  const state = ref(route.query.state ? route.query.state : false);

  if (typeof code.value === 'string' && typeof state.value === 'string' && state.value !== sid.value) {
    router.push('/')
  }

  if (code.value && state.value) {
    const { data } = await useAsyncData('authenticate', () => $fetch('/api/v1/authenticate/user', {
      method: 'POST',
      body: {
        code: code.value,
        state: state.value,
      }
    }));

    watch(data, (newData) => {
      firebase_initialize_user(newData)
    })
    cutQuery()
    firebase_initialize_user(data)
  }

  function cutQuery() {
    const query = Object.assign({}, route.query);
    delete query.code;
    delete query.state;
    router.replace({ query });
  }

  onUnmounted(() => {
    cutQuery()
  });
</script>

<template>
    <v-container class="pa-0" fluid>
      <v-row class="ma-0 fill-height" justify="center" align="center">
        <v-btn color="primary" :href="`${DISCORD_OAUTH_URL}&state=${sid}`">Login</v-btn>
      </v-row>
  </v-container>
</template>

<style scoped>
  .v-container {
    height: 100vh;
  }

  .v-card {
    transform: translateY(-10vh);
  }
</style>
