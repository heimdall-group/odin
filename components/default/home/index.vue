<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const user = computed(() => store.getUser);
  const news = ref([] as Array<News>);
  const cache:usePaginationCache = reactive({limit: 5});
  const { data, pending, refresh } = await useAsyncData('home-public-news', () => usePagination({
    url: `/api/v1/news/articles/public`,
    cache: cache,
  }, news));
</script>

<template>
  <v-container class="pa-0" fluid>
    <section>
      <v-parallax src="/image/16x9/banner.webp" height="100vh">
        <v-row class="ma-0 h-100" justify="center" align="center">
          <v-card
            color="transparent"
            flat
          >
            <v-row class="ma-0" justify="center">
              <v-img
                :width="175"
                :height="175"
                src="/image/logo/ASGARD.webp"
              ></v-img>
            </v-row>
            <h1 class="font-weight-medium text-center text-white">
              <span
                v-for="(letter, index) in ['A', 'S', 'G', 'A', 'R', 'D']"
                :key="index"
                class="title-span px-3 py-4"
                :style="`--i: ${index};`"
              >
                {{ letter }}
              </span>
            </h1> 
            <v-btn
              color="primary"
              block
              size="large"
              rounded="xl"
              nuxt
              to="/information/join-us"
            >
            {{$t('home-join-us')}}
            </v-btn>
            <v-row class="ma-0" justify="center">
              <v-btn
                variant="plain"
                class="my-1"
                :ripple="false"
                to="/information"
              >
                {{$t('home-about-us')}}
              </v-btn>
            </v-row>
          </v-card>
          </v-row>
          <animation-scroll-down />
      </v-parallax>
    </section>
    <v-container>
      <h1 class="font-weight-regular text-center pa-6">Nyhets placeholder</h1>
      <news-carosuel-public href="/information/news" />
    </v-container>
  </v-container>
</template>

<style scoped>
  .v-container > .v-container,
  .v-container > section {
    height: 100vh;
  }

  .v-container .news-row {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .v-container .v-card .v-card-text {
    max-height: 400px;
    overflow-y: scroll;
  }

  .title-span {
    font-family: monospace;
    display: inline-block;
    animation: pop-up 0.4s cubic-bezier(0.2, 0, 0.5, 1) forwards;
    animation-delay: calc(var(--i) * 0.08s);
    opacity: 0;
  }
  @keyframes pop-up {
    from {
      transform: translateY(50px);
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }
</style>
