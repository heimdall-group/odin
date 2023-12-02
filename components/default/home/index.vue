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
      <v-parallax src="/image/16_9/banner.webp" height="100vh">
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
            <v-card-title class="text-center">{{$translate('home-title')}}</v-card-title>
              <v-btn
                color="primary"
                block
                size="large"
                rounded="xl"
                nuxt
                to="/information/join-us"
              >
              {{$translate('home-join-us')}}
              </v-btn>
              <v-row class="ma-0" justify="center">
                <v-btn
                  variant="plain"
                  class="my-1"
                  :ripple="false"
                  to="/information"
                >
                  {{$translate('home-about-us')}}
                </v-btn>
              </v-row>
          </v-card>
          </v-row>
          <animation-scroll-down />
      </v-parallax>
    </section>
    <v-container>
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
</style>
