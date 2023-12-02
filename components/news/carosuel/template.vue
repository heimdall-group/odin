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
  });
</script>

<template>
  <v-row v-if="!cache.empty" class="my-0" align="start">
    <v-col
      v-for="(article, index) in news"
      :key="`news-carosuel-${name}-${index}`"
      cols="12"
      class="pa-1 d-flex"
    >
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-row class="ma-0 flex-column" align="center" v-bind:="props" justify="center">
              <v-card-title>{{ article.title }}</v-card-title>
              <v-card-subtitle v-show="isHovering" class="text-white mb-4">
                {{article.author.nickname}} |
                {{new Date(article.date).toDateString()}}
              </v-card-subtitle>
            </v-row>
          </template>
        </v-hover>   
    </v-col>
  </v-row>
</template>

<style scoped>
</style>
