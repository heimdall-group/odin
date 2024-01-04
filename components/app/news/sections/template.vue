<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';

  const viewsStore = useViewsStore();
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
    },
    'href': {
      type: String,
      required: true,
    }
  })
  const main_article = ref(props.news[0]);
  const latest_articles = ref(props.news.splice(1, props.news.length));
</script>

<template>
  <app-templates-section v-if="!cache.empty" cols="12" lg="8" xl="6" :card-title="$t(cardTitle)">
      <template #actions>
        <v-btn
          color="secondary"
          :ripple="false"
          class="font-weight-bold text-decoration-underline"
          variant="text"
          :to="href"
        >
          {{$t('news-view-all')}}
        </v-btn>
      </template>
      <v-row class="ma-0" justify="center">
          <v-col cols="12" md="6">
            <v-sheet class="h-100" flat>
              <v-card-title class="text-white">{{main_article.title}}</v-card-title>
              <v-card-subtitle class="text-white">
                {{main_article.author.nickname}} |
                {{new Date(main_article.date).toDateString()}}
              </v-card-subtitle>
              <v-card-text class="text-white px-6">{{ main_article.summary }}...</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  :ripple="false"
                  class="font-weight-bold"
                  variant="text"
                  :to="href + `/${main_article.id}`"
                >
                  {{$t('news-read-more')}}
                </v-btn>
              </v-card-actions>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="6" class="pa-1">
            <v-row class="ma-0">
              <v-col
                v-for="(article, index) in latest_articles"
                :key="`home-news-latest-articles-${index}`"
                cols="12"
                class="pa-0"
              >
                <news-list-item :href="href + `/${article.id}`" :article="article" />
              </v-col>
            </v-row>
          </v-col>
      </v-row>
  </app-templates-section>
  <app-templates-section v-else cols="12" lg="8" xl="6" :card-title="$t(cardTitle)">
    <v-row class="ma-0 mb-12 mt-6 news-list-empty" justify="center" align="center">
      <h3 class="font-weight-regular">{{ $t('news-empty') }}</h3>
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