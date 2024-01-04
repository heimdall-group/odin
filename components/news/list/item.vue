<script setup lang="ts">
  const props = defineProps({
    'article': {
      type: Object,
      required: true,
    },
    'href': {
      type: String,
      required: true,
    }
  })
</script>

<template>
  <v-sheet
    class="ma-2"
    rounded
    flat
  >
    <v-row class="ma-0">
      <v-col class="pa-0">
        <v-card-title class="text-white">{{article.title}}</v-card-title>
        <v-card-subtitle class="text-white mb-4">
          {{article.author.nickname}} |
          {{$d(article.date)}}
        </v-card-subtitle>
      </v-col>
      <v-col cols="auto" class="pa-3 d-flex align-center">
        <v-btn
          color="secondary"
          :ripple="false"
          class="font-weight-bold"
          variant="text"
          :to="href"
        >
          {{$t('news-read-more')}}
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>
