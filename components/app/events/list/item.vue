<script setup lang="ts">
  import { useStore } from '~/stores/main';
  const store = useStore();
  const user = computed(() => store.getUser);

  const interestedLoading = ref(false);
  const props = defineProps({
    'event': {
      type: Object,
      required: true,
    }
  });

  const handleInterestedClick = async () => {
    const { event } = props;
    const token = await user.value.getIdToken();
    interestedLoading.value = true
    const { success } = await useInternalFetch(`/api/v1/events/${token}/interested`, {
      method: 'POST',
      body: {
        id: event.id
      }
    })
    if (success) {
      event.interested.push(user.value.nickname);
      event.currentUserIsInterested = true;
    }
    interestedLoading.value = false;
  };
</script>

<template>
  <v-col cols="12">
    <v-sheet
      class="pa-1"
      rounded
      flat
    >
      <v-row class="ma-0" justify="start">
        <v-col class="pa-0">
          <v-card-title class="text-white pb-0">{{ event.title }}</v-card-title>
          <v-card-subtitle class="text-white">{{ event.author.nickname }}</v-card-subtitle>
        </v-col>
        <v-col cols="auto">
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
            {{ $t(`app-event-types-${event.type}`) }}
          </v-chip>
          <v-chip class="mr-1">
            {{ $d(event.date, 'time') }}
          </v-chip>
          <v-chip v-if="event.interested.length >= 1">
            <font-awesome-icon v-if="event.interested.length > 9" class="mr-1" icon="fa-solid fa-plus" />
              {{ event.interested.length }}
              <font-awesome-icon class="ml-1" icon="fa-solid fa-user" />
            </v-chip>
        </v-col>
      </v-row>
      <v-row class="ma-4 mt-0" justify="end">
        <v-btn @click="handleInterestedClick" :loading="interestedLoading" variant="text" color="secondary" :ripple="false" class="font-weight-bold" :disabled="event.currentUserIsInterested || (event.status === 'completed' || event.status === 'rescheduled')">
          <template v-if="event.currentUserIsInterested" #prepend>
            <font-awesome-icon icon="fa-solid fa-check" />
          </template>
          {{ $t('app-event-calender-interested') }}
        </v-btn>
        <v-btn variant="text" color="secondary" :ripple="false" :to="`/app/events/${event.id}`" class="font-weight-bold" :disabled="event.status === 'completed' || event.status === 'rescheduled'">{{ $t('app-event-calender-read-more') }}</v-btn>
      </v-row>
    </v-sheet>
  </v-col>
</template>
