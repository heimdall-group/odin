<script setup lang="ts">
  import { useStore } from '~/stores/main'
  const store = useStore();
  const permissions = computed(() => store.getPermissions('event'));
  const user = computed(() => store.getUser);

  const date = ref(new Date());
  date.value.setHours(0, 0, 0, 0);
  const prevDate = ref(date.value);

  const token = ref(await user.value.getIdToken());
  const cache:usePaginationCache = reactive({limit: 10});
  const start = new Date(date.value);
  const end = new Date(date.value);
  start.setHours(0,0,0)
  end.setHours(23,59,59);
  const preCache: Ref<{
    [key: string]: {
      events: Array<AppEvent>,
      cache: usePaginationCache,
    }
  }> = ref({});
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

  const handleDateFetch = async (newDate: Date) => {
    const preCacheInstance = preCache.value[newDate.toDateString()];
    const start = new Date(newDate);
    const end = new Date(newDate);
    start.setHours(0,0,0)
    end.setHours(23,59,59);

    preCache.value[prevDate.value.toDateString()] = { 
      cache: Object.assign({}, cache),
      events: JSON.parse(JSON.stringify(events.value)),
    };
    body.start = start;
    body.end = end;
    prevDate.value = newDate;

    if (preCacheInstance && preCacheInstance.cache && preCacheInstance.events) {
      events.value = preCacheInstance.events;
      Object.assign(cache, preCacheInstance.cache);
    } else {
      events.value = [];
      Object.assign(cache, {
        completed: false,
        skip: 0,
        max_count: 0,
        empty: false,
        limit: cache.limit,
      });
      token.value = await user.value.getIdToken();
      refresh();
    }
  }
  watch(date, handleDateFetch)
</script>

<template>
  <v-container class="smaller-max-container">
    <navigation-sub-back-menu :name="$t('app-event-title')">
      <template v-if="permissions.write" #prepend>
        <v-btn
          to="/app/events/create"
          color="secondary"
          class="font-weight-bold"
        >
          <template #prepend>
            <font-awesome-icon icon="fa-solid fa-plus" />
          </template>
          {{ $t('app-create-event') }}
        </v-btn>
      </template>
    </navigation-sub-back-menu>
    <app-events-template v-model="date">
      <v-row>
        <app-events-list-item
          v-for="(event, index) in events"
          :key="`app-events-calender-event-${index}`"
          :event="event"
        />
        <pagination-intersection :cache="cache" :handler="refresh" />
      </v-row>
    </app-events-template>
  </v-container>
</template>
