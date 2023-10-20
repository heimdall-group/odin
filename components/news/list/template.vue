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
    }
  })
</script>

<template>
  <v-row>
    <template
      v-for="(article, index) in news"
      :key="`news-lists-${name}-${index}`"
    >
      <v-col cols="12" class="pa-2">
        <news-list-item :article="article" />
      </v-col>
    </template>
  </v-row>
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