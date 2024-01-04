<script setup lang="ts">
  import { useStore } from '~/stores/main'
  const store = useStore();
  const route = useRoute();
  const user = computed(() => store.getUser)
  const token = ref(await user.value.getIdToken());
  const id = route.params.id;
  const event: Ref<AppEvent> = ref({} as AppEvent);

  const { data, pending, refresh } = await useAsyncData('events-event', () => useInternalFetch(`/api/v1/events/id/${id}`, {
    method: 'POST',
    body: {
      token: token.value,
    }
  }));

  const handleRefresh = () => {
    if (data.value.success) {
      event.value = data.value.data;
    }
  };

  const handleRefreshEvent = async () => {
    token.value = await user.value.getIdToken()
    refresh();
  }

  handleRefresh(),
  watch(data, handleRefresh);
</script>

<template>
  <v-container class="smaller-max-container">
    <app-events-event-combat v-if="event.type === 'combat'" @refresh="handleRefreshEvent" :event="event" />
    <template v-else-if="event.type === 'industry'" :event="event" />
    <template v-else-if="event.type === 'social'" :event="event" />
    <template>You broke something :/</template>
  </v-container>
</template>
