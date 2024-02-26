<script setup lang="ts">
  import { useStore } from '~/stores/main'
  const store = useStore();
  const permissions = computed(() => store.getPermissions('event'));
  const user = computed(() => store.getUser);

  const date = ref(new Date());
  date.value.setHours(0, 0, 0, 0);

  const token = ref(await user.value.getIdToken());
  const cache:usePaginationCache = reactive({limit: 10});
  const start = new Date(date.value);
  const end = new Date(date.value);
  start.setHours(0,0,0);
  end.setHours(23,59,59);
  const events: Ref<Array<AppEvent>> = ref([]);
  const body = reactive({
    start,
    end,
  });

  const { refresh } = await useAsyncData('events-date', () => usePagination({
    url: `/api/v1/events/${token.value}`,
    cache: cache,
    body,
    remove: ['assignees'],
  }, events));
</script>

<template>
  <app-templates-section cols="12" :card-title="$t('app-event-title')" >
    <v-row class="ma-0">
      <v-col
        v-if="cache.empty"
        class="d-flex justify-center align-center"
      >
        <p class="text-white">{{ $t('app-event-empty') }}</p>
      </v-col>
      <app-events-list-item
        v-else
        v-for="(event, index) in events"
        :key="`app-events-calender-event-${index}`"
        :event="event"
      />
      <pagination-intersection :cache="cache" :handler="refresh" />
    </v-row>
  </app-templates-section>
</template>

<style scoped>
  .v-row {
    min-height: 166px;
  }
</style>
