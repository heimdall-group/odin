<script setup lang="ts">
  import { useStore } from '~/stores/main'
  const store = useStore();
  const route = useRoute();
  const user = computed(() => store.getUser)
  const token = ref(await user.value.getIdToken());
  const applications: Ref<Array<AppEventApplication>> = ref([]);

  const cache:usePaginationCache = reactive({limit: 20});
  const { data, pending, refresh } = await useAsyncData('events-applications', () => usePagination({
    url: `/api/v1/events/applications/${token}`,
    cache: cache,
  }, applications));

  const handleRefresh = async () => {
    token.value = await user.value.getIdToken()
    refresh();
  }

  const handleApproval = async (application: AppEventApplication) => {
    const { id } = application;
    const token = await user.value.getIdToken();
    const { success, data } = await useInternalFetch(`/api/v1/events/applications/pledge/${token}`, {
      method: 'POST',
      body: {
        id
      }
    }); 
  };

  const handleRejection = async (application: AppEventApplication) => {
    const { id } = application;
    const token = await user.value.getIdToken();
      const { success, data } = await useInternalFetch(`/api/v1/events/applications/revoke/${token}`, {
      method: 'POST',
      body: {
        id
      }
    }); 
  };
</script>

<template>
  <v-container>
    <v-row class="h-100">
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
        <v-sheet class="pa-3" rounded="lg">
          {{ application }}
          <v-btn @click="handleRejection(application)">Revoke</v-btn>
          <v-btn @click="handleApproval(application)">Approve</v-btn>
        </v-sheet>
      </v-col>
      <pagination-intersection :handler="handleRefresh" :cache="cache"  />
    </v-row>
  </v-container>
</template>
