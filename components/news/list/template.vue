<script setup lang="ts">
  const props = defineProps({
    'news': {
      type: Array<News>,
      required: true,
    },
    'name': {
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
    },
    'pagination': {
      type: Function,
      required: false,
      default: false,
    }
  })
</script>

<template>
  <v-row class="my-0" align="start">
    <template v-if="cache.empty">
      <v-row class="ma-0 news-list-empty" justify="center" align="center">
        <h3 class="font-weight-regular">{{ $t('news-empty') }}</h3>
      </v-row>
    </template>
    <template
      v-else
      v-for="(article, index) in news"
      :key="`news-lists-${name}-${index}`"
    >
      <v-col cols="12" class="pa-1">
        <news-list-item :href="href + `/${article.id}`" :article="article" />
      </v-col>
    </template>
    <pagination-intersection v-if="pagination" :handler="pagination" :cache="cache"  />
  </v-row>
</template>

<style scoped>
  .v-container {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .news-list-empty {
    min-height: 200px;
  }

  .v-card .v-card-text {
    overflow-y: scroll;
    max-height: 400px;
  }

</style>