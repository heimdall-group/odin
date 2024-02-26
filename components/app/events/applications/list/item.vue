<script setup lang="ts">
  import { useStore } from '~/stores/main'
  const store = useStore();
  const route = useRoute();
  const user = computed(() => store.getUser)
  const props = defineProps({
    application: {
      type: Object,
      required: true,
    }
  });
  const emits = defineEmits(['refresh'])

  const application: Ref<AppEventApplication> = ref(props.application as AppEventApplication)

  const handleApproval = async (application: AppEventApplication) => {
    const { id } = props.application;
    const token = await user.value.getIdToken();
    const { success, data } = await useInternalFetch(`/api/v1/events/applications/pledge/${token}`, {
      method: 'POST',
      body: {
        id
      }
    });
    if (success) {
      emits('refresh', application);
    }
  };

  const handleRejection = async (application: AppEventApplication) => {
    const { id } = props.application;
    const token = await user.value.getIdToken();
    const { success, data } = await useInternalFetch(`/api/v1/events/applications/revoke/${token}`, {
      method: 'POST',
      body: {
        id
      }
    });
    if (success) {
      emits('refresh', application);
    }
  };
</script>

<template>
  <v-sheet rounded="lg">
    <v-row class="ma-0" justify="end">
      <v-col cols="12" class="pb-0">
        <v-card-title>{{ application.event.title }}</v-card-title>
        <v-card-text class="pb-0">{{ application.applicant }} {{ $t('app-event-application-applies') }} {{ application.group.name }}: {{ application.role.name }}</v-card-text>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn
          @click="handleApproval(application)"
          color="secondary"
          class="font-weight-bold"
          variant="text"
        >
          {{ $t('app-event-application-pledge') }}  
        </v-btn>
        <v-btn
          @click="handleRejection(application)"
          color="secondary"
          class="font-weight-bold"
          variant="text"
          >
          {{ $t('app-event-application-revoke') }}
        </v-btn>
        <v-btn
          :to="`/app/events/${application.event.id}`"
          color="secondary"
          class="font-weight-bold"
          variant="text"
        >
          {{ $t('app-event-application-read-more') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>
