<script setup lang="ts">
  const props = defineProps({
    'news': {
      type: Array<News>,
      required: true,
    },
    'cardTitle': {
      type: String,
      required: true,
    },
    'cache': {
      type: Object,
      required: true,
    }
  })
  const main_article = ref(props.news[0]);
  const latest_articles = ref(props.news.splice(1, props.news.length))
</script>

<template>
  <app-templates-section v-if="!cache.empty" cols="12" lg="8" xl="6" :card-title="$translate(cardTitle)">
    <template #actions>
      <v-btn
        color="secondary"
        :ripple="false"
        class="font-weight-bold text-decoration-underline"
        variant="text"
      >
        {{$translate('app-news-view-all')}}
      </v-btn>
    </template>
      <v-row class="ma-0" justify="center">
          <v-col cols="12" md="7">
            <v-card color="background-700" variant="outlined" class="h-100" flat>
              <v-card-title class="text-white">{{main_article.title}}</v-card-title>
              <v-card-subtitle class="text-white">
                {{main_article.author.nickname}} |
                {{new Date(main_article.date).toDateString()}}
              </v-card-subtitle>
              <v-card-text class="text-white px-6" v-html="$md_render(main_article.body)"></v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  :ripple="false"
                  class="font-weight-bold"
                  variant="text"
                >
                  {{$translate('app-news-read-more')}}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="5">
            <v-row>
              <v-col
                v-for="(article, index) in latest_articles"
                :key="`home-news-latest-articles-${index}`"
                cols="3" md="12"
              >
                <news-list-item :article="article" />
              </v-col>
            </v-row>
          </v-col>
      </v-row>
  </app-templates-section>
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .v-card .v-card-text {
    overflow-y: scroll;
    max-height: 500px;
  }

</style>