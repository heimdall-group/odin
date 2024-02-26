<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const user = computed(() => store.getUser);
  const router = useRouter();
  const route = useRoute();

  const internal_news = store.getPermissions('internal-news');
  const public_news = store.getPermissions('public-news');
  const events = store.getPermissions('events')
  const event_applications = store.getPermissions('events-application')
</script>

<template>
  <v-container>
    <v-row class="ma-0">
      <v-col class="pa-0" cols="12" lg="8" xl="7">    
        <v-row class="w-100 ma-0">
          <app-news-sections-internal v-if="internal_news.read" />
          <app-news-sections-public v-if="public_news.read" />
        </v-row>
      </v-col>
      <v-col class="pa-0" cols="12" lg="4" xl="5">
        <v-row class="w-100 ma-0">
          <app-events-sections-list v-if="events.read" />
          <app-events-sections-application-list v-if="event_applications.read" />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
