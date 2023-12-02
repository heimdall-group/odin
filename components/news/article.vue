<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const router = useRouter();
  const route = useRoute();

  const user = computed(() => store.getUser);
  const id = route.params.id;
  const token = user.value.getIdToken ? await user.value.getIdToken() : '';

  const { data, pending, refresh } = await useAsyncData('news-article', () => useInternalFetch(`/api/v1/news/article/${id}`, {
    method: 'POST',
    body: {
      token,
    }
  }));
  const article = ref(data.value.data);
  watch(data, (newData) => {
    if (newData.success) {
      article.value = newData.data
    }
  })
</script>

<template>
  <v-container>
    <navigation-sub-back-menu />
    <v-img v-if="article.cover" :src="article.cover"></v-img>
    <v-card-title class="text-white">{{article.title}}</v-card-title>
    <v-card-subtitle class="text-white mb-4">
      {{article.author.nickname}} |
      {{new Date(article.date).toDateString()}}
    </v-card-subtitle>
    <article v-html="$md_render(article.body)"></article>
  </v-container>
</template>

<style scoped>

</style>
