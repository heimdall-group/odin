<script setup lang="ts">
import { useStore } from '~/stores/main';

  const { DISCORD_OAUTH_URL, ENVIRONMENT, SESSION_ID_COOKIE_NAME } = useRuntimeConfig().public

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const sid = useInternalCookie(SESSION_ID_COOKIE_NAME);
  const user = computed(() => store.getUser);
  const code = ref(route.query.code ? route.query.code : false);
  const state = ref(route.query.state ? route.query.state : false);

  const signedIn = ref(Object.keys(user.value).length > 0)

  if(isElectron() && !window.location.href.includes('app://odin/app')) {
    window.location.assign(`app://odin/app?code=${code.value}&state=${state.value}`);
  } else if (code.value && state.value && state.value === sid.value) {
    const { data } = await useAsyncData('authenticate', () => useInternalFetch('/api/v1/authenticate/user', {
      method: 'POST',
      body: {
        code: code.value,
        state: state.value,
      }
    }));

    watch(user, (newUser) => {
      signedIn.value = Object.keys(newUser).length > 0
    })

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
  <v-container class="pa-0" fluid v-if="!signedIn">
    <v-row class="ma-0 fill-height" justify="center" align="center">
      <v-btn color="primary" :href="`${DISCORD_OAUTH_URL}&state=${sid}&environment=${ENVIRONMENT.toString().trim()}`">Login</v-btn>
      <!-- <v-btn v-else-if="ENVIRONMENT.toString().trim() === 'app'" color="primary" @click="electronAuthentication">App Login</v-btn> -->
    </v-row>
  </v-container>
  <app-authentication-success-display v-else />
</template>

<style scoped>
  .v-container {
    height: 100vh;
  }

  .v-card {
    transform: translateY(-10vh);
  }
</style>
