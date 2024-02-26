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

  const removeApplication = (application: AppEventApplication) => {
    applications.value.splice(applications.value.indexOf(application), 1);
    if (applications.value.length === 0) {
      cache.empty = true;
    }
  }

  const handleRefresh = async () => {
    token.value = await user.value.getIdToken()
    refresh();
  }
</script>

<template>
  <app-templates-section :card-title="$t('app-event-application-title')" cols="12">
    <template #actions>
      <v-btn></v-btn>
    </template>
    <v-row class="h-100 ma-0">
      <v-col v-if="cache.empty" class="d-flex justify-center align-center">
        <p class="text-white">{{ $t('app-event-application-empty') }}</p>
      </v-col>
      <v-col
        v-else
        v-for="(application, index) in applications"
        :key="`app-events-applications-${index}`"
        cols="12"
      >
        <app-events-applications-list-item :application="application" @refresh="removeApplication" />
      </v-col>
      <pagination-intersection :handler="handleRefresh" :cache="cache"  />
    </v-row>
  </app-templates-section>
</template>

<style scoped>
  .v-row {
    min-height: 166px;
  }
</style>
