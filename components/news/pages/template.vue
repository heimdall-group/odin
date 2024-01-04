<script setup lang="ts">
  import { useStore } from '~/stores/main';
  const store = useStore();
  const route = useRoute();

  const internal_news = store.getPermissions('internal-news')
  const public_news = store.getPermissions('public-news')

  const props = defineProps({
    "name": {
      type: String,
      required: true,
    }
  });
</script>

<template>
  <v-container class="h-100">
    <navigation-sub-back-menu :name="name">
      <template v-if="(internal_news.write || public_news.write) && $route.fullPath.includes('app')" #prepend>
        <v-btn
          to="/app/news/create"
          color="secondary"
          class="font-weight-bold"
        >
          <template #prepend>
            <font-awesome-icon icon="fa-solid fa-plus" />
          </template>
          {{ $t('app-create-news') }}
        </v-btn>
      </template>
    </navigation-sub-back-menu>
    <v-row class="ma-0 mt-2">
      <slot></slot>
    </v-row>
  </v-container>
</template>
