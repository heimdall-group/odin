<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const { ENVIRONMENT } = useRuntimeConfig().public;

  const user = computed(() => store.getUser);
  const route = useRoute();
  const router = useRouter();

  const isMember = user.value.member || user.value.super_admin;
  const countdown = ref('05')

  function startTimer(duration: number, display: Ref) {
    let timer: number = duration,
      seconds;
    if (process.client) {
      const interval = setInterval(function() {
        seconds = parseInt(timer % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.value = seconds;

        if (--timer < 0) {
          clearInterval(interval)
          if (isElectron()) {
            window.location.assign('app://-/app');
          } else {
            router.push('/app')
          }
        }
      }, 1000);
    }
  }

  onMounted(() => {
    if (isMember) {
      startTimer(4, countdown);
    }
  })
</script>

<template>
  <v-container class="pa-0" fluid>
    login display {{ isMember }}<br>
    Countdown: {{ countdown }}
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
