<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const user = computed(() => store.getUser);

  const publicPermissions = computed(() => store.getPermissions('public-news'))
  const internalPermissions = computed(() => store.getPermissions('internal-news'))
</script>

<template>
  <v-container>
    <template v-if="internalPermissions.read">
      <app-templates-title class="mt-8" :card-title="$translate('app-section-title-internal-news')" title-color="white">
        <v-btn
          color="secondary"
          :ripple="false"
          class="font-weight-bold text-decoration-underline"
          variant="text"
          to="/app/news/internal"
        >
          {{$translate('app-news-view-all')}}
        </v-btn>
      </app-templates-title>
      <news-list-internal />
    </template>
    <template v-if="publicPermissions.read">
      <app-templates-title class="mt-4" :card-title="$translate('app-section-title-public-news')" title-color="white">
        <v-btn
          color="secondary"
          :ripple="false"
          class="font-weight-bold text-decoration-underline"
          variant="text"
          to="/app/news/public"
        >
          {{$translate('app-news-view-all')}}
        </v-btn>
      </app-templates-title>
      <news-list-public />
    </template>
  </v-container>
</template>
