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
      event.currentUserIsInterested = true;
    }
    interestedLoading.value = false;
  };

</script>

<template>
  <v-sheet
    class="pa-1"
    rounded
    flat
  >
    <v-row class="ma-0" align="center">
      <v-col class="pa-0">
        <v-card-title class="text-white pb-0">{{ event.title }}</v-card-title>
      </v-col>
      <v-col cols="auto" class="pb-0">
        <v-chip v-if="event.active" color="success">
          {{ $t('app-event-active') }}
        </v-chip>
        <v-chip class="mx-1">
          {{ $t(`app-event-types-${event.type}`) }}
        </v-chip>
        <v-chip>
          {{ $d(event.date, 'time') }}
        </v-chip>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-card-subtitle class="text-white mb-4">{{ event.author.nickname }}</v-card-subtitle>
      </v-col>
    </v-row>
    <v-card-text class="py-0">{{ event.desc }}</v-card-text>
    <v-row class="ma-4 mt-0 gc-2" justify="end">
      <v-btn @click="handleInterestedClick" :loading="interestedLoading" variant="text" color="secondary" :ripple="false" class="font-weight-bold" :disabled="event.currentUserIsInterested">
        <template v-if="event.currentUserIsInterested" #prepend>
          <font-awesome-icon icon="fa-solid fa-check" />
        </template>
        {{ $t('app-event-calender-interested') }}
      </v-btn>
      <v-btn variant="text" color="secondary" :ripple="false" :to="`/app/events/${event.id}`" class="font-weight-bold">{{ $t('app-event-calender-read-more') }}</v-btn>
    </v-row>
  </v-sheet>
</template>
