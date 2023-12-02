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
  <v-card
    color="background-700"
    class="ma-2"
    variant="outlined"
    flat
  >
    <v-row class="ma-0">
      <v-col class="pa-0">
        <v-card-title class="text-white">{{article.title}}</v-card-title>
        <v-card-subtitle class="text-white mb-4">
          {{article.author.nickname}} |
          {{new Date(article.date).toDateString()}}
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
          {{$translate('news-read-more')}}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>