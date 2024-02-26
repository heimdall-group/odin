<script setup lang="ts">
  import { useStore } from '~/stores/main'
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  const user = computed(() => store.getUser)
  const token = ref(await user.value.getIdToken());
  const id = route.params.id;
  const event: Ref<AppEvent> = ref({} as AppEvent);
  const permissions = store.getPermissions('event');

  const { data, pending, refresh } = await useAsyncData('events-event', () => useInternalFetch(`/api/v1/events/id/${id}`, {
    method: 'POST',
    body: {
      token: token.value,
    }
  }));

  const handleRemoveClick = async () => {
    token.value = await user.value.getIdToken()
    const { success } = await useInternalFetch(`/api/v1/events/event/${token.value}`, {
      method: 'DELETE',
      body: {
        id: event.value.id
      }
    });
    if (success) {
      router.push('/app/events')
    }
  }

  const handleRefresh = () => {
    if (data.value.success) {
      event.value = data.value.data;
    }
  };

  const handleRefreshEvent = async () => {
    token.value = await user.value.getIdToken()
    refresh();
  }

  const interestedLoading = ref(false);
  const handleInterestedClick = async () => {
    const token = await user.value.getIdToken();
    interestedLoading.value = true
    const { success } = await useInternalFetch(`/api/v1/events/${token}/interested`, {
      method: 'POST',
      body: {
        id: event.value.id
      }
    })
    if (success) {
      handleRefreshEvent()
    }
    interestedLoading.value = false;
  };

  handleRefresh(),
  watch(data, handleRefresh);
</script>

<template>
  <v-container class="smaller-max-container">
    <navigation-sub-back-menu>
      <template #title>  
        <v-row class="ma-0" align="center">
          <v-card-title>{{ event.title }}</v-card-title>
          <v-chip v-if="event.status === 'active'" color="success">
            {{ $t('app-event-active') }}
          </v-chip>
          <v-chip v-else-if="event.status === 'completed' || event.status === 'rescheduled'" color="error">
            {{ $t('app-event-completed') }}
          </v-chip>
          <v-chip v-else-if="new Date(event.date).getDay() === new Date().getDay()" color="warning">
            {{ $t('app-event-upcoming') }}
          </v-chip>
          <v-chip class="mx-1">
            {{ $d(event.date, 'time') }}
          </v-chip>
        </v-row>
      </template>
      <template #prepend>
        <v-btn @click="handleInterestedClick" :loading="interestedLoading" variant="text" color="secondary" :ripple="false" class="font-weight-bold" :disabled="event.currentUserIsInterested">
          <template v-if="event.currentUserIsInterested" #prepend>
            <font-awesome-icon icon="fa-solid fa-check" />
          </template>
          {{ $t('app-event-calender-interested') }}
        </v-btn>
      </template>
    </navigation-sub-back-menu>
    <v-row class="ma-0 px-3">
      <v-chip
        v-for="(interested, index) in event.interested"
        :key="`app.events-event-interested-${index}`"
        class="mr-1"
      >
        <font-awesome-icon class="mr-1" icon="fa-solid fa-user" />
        {{ interested }}
      </v-chip>
    </v-row>
    <article v-html="$md_render(event.desc)"></article>
    <app-events-event-combat v-if="event.type === 'combat'" @refresh="handleRefreshEvent" :event="event" />
    <template v-else-if="event.type === 'industry'" :event="event" />
    <template v-else-if="event.type === 'social'" :event="event" />
    <template v-else>You broke something :/</template>
    <v-btn
      v-if="permissions.write"
      @click="handleRemoveClick"
      class="mt-8"
      block
      color="error"
      variant="outlined"
    >
      {{ $t('button-remove') }}
    </v-btn>
  </v-container>
</template>
