<script setup lang="ts">
  import { useStore } from '~/stores/main'
  const store = useStore();
  const route = useRoute();
  const user = computed(() => store.getUser)
  const token = ref(await user.value.getIdToken());
  const applications: Ref<Array<AppEventApplication>> = ref([]);

  const cache:usePaginationCache = reactive({limit: 20});
  const { data, pending, refresh } = await useAsyncData('events-applications', () => usePagination({
    url: `/api/v1/events/applications/${token.value}`,
    cache: cache,
  }, applications));

  const handleRefresh = async () => {
    token.value = await user.value.getIdToken()
    refresh();
  }

  const removeApplication = (application: AppEventApplication) => {
    applications.value.splice(applications.value.indexOf(application), 1);
    if (applications.value.length === 0) {
      cache.empty = true;
    }
  }
</script>

<template>
  <v-container>
    <navigation-sub-back-menu :name="$t('app-event-application-title')" />
    <v-row class="h-100" align="center">
      <v-col v-if="cache.empty" class="h-100 d-flex justify-center align-center">
        <v-card-title>{{ $t('app-event-application-empty') }}</v-card-title>
      </v-col>
      <v-col
        v-else
        v-for="(application, index) in applications"
        :key="`app-events-applications-${index}`"
        cols="12"
        md="6"
      >
        <app-events-applications-list-item :application="application" @refresh="removeApplication" />
      </v-col>
      <pagination-intersection :handler="handleRefresh" :cache="cache"  />
    </v-row>
  </v-container>
</template>

<style scoped>
  .v-row {
    min-height: 250px;
  }
</style>
