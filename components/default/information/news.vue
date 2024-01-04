<script setup lang="ts">
    const news = ref([] as Array<News>);
    const cache:usePaginationCache = reactive({limit: 5});
    const { data, pending, refresh } = await useAsyncData('home-public-news', () => usePagination({
      url: `/api/v1/news/articles/public`,
      cache: cache,
    }, news));
</script>

<template>
  <v-container>
    <v-card v-if="!cache.empty && cache.completed" class="pa-4" rounded variant="outlined">
      <v-row class="ma-0" justify="center">
        <v-col
          v-for="(article, index) in news"
          :key="`home-news-latest-articles-${index}`"
          cols="12"
        >
          <v-card
            variant="outlined"
            flat
            class="pb-4"
          >
            <v-card-title class="text-white">{{article.title}}</v-card-title>
            <v-card-subtitle class="text-white">
              {{article.author.nickname}} |
              {{$d(article.date)}}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-else class="pa-4" height="350px" rounded variant="outlined">
      <v-row class="fill-height" justify="center" align="center">
        <v-card-title class="text-white">Inga nyhetsinlägg</v-card-title>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>