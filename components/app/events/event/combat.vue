<script setup lang="ts">
  import type { emit } from 'process';
import { useStore } from '~/stores/main'
  const store = useStore();
  const route = useRoute();
  const user = computed(() => store.getUser)
  const props = defineProps({
    'event': {
      type: Object,
      required: true,
    }
  });
  const emits = defineEmits(['refresh']);

  const handleRemoveAssignClick = async (group: AppEventCombatGroup, role: AppEventCombatRole) => {
    const { event } = props;
    const token = await user.value.getIdToken();
    const { success, data } = await useInternalFetch(`/api/v1/events/${token}/revoke/assignee`, {
      method: 'POST',
      body: {
        id: event.id,
        group_id: group.id,
        role_id: role.id
      }
    });
    if (success) {
      emits('refresh');
    };
  }

  const handleAssignClick = async (group: AppEventCombatGroup, role: AppEventCombatRole) => {
    const { event } = props;
    const token = await user.value.getIdToken();
    const { success, data } = await useInternalFetch(`/api/v1/events/${token}/pledge/assignee`, {
      method: 'POST',
      body: {
        id: event.id,
        group_id: group.id,
        role_id: role.id
      }
    });
    if (success) {
      emits('refresh');
    };
  }
</script>

<template>
    <v-row v-if="event.assignees.length > 0">
      <v-col
        v-for="(group, index) in event.assignees"
        :key="`app-events-event-group-${index}`"
        cols="12"
        md="6"
      >
        <v-sheet class="pa-3" rounded="lg">
          <v-row class="ma-0" justify="space-between" align="center">
            <v-card-title>
              {{ group.name }}
            </v-card-title>
            <v-chip class="mx-1">
              {{ $t(`app-event-combat-types-${group.type}`) }}
            </v-chip>
          </v-row>
          <v-row class="ma-0">
            <v-col
              v-for="(role, yndex) in group.roles"
              :key="`app-events-event-${index}-role-${yndex}`"
              cols="12"
              class="pa-0 py-2 d-flex justify-space-between align-center"
              :class="{'has-assignee': role.user}"
            >
              <v-sheet class="pa-3 w-100" rounded="lg">
                <v-row class="pr-2" align="center">
                  <v-col class="d-flex align-center">
                    {{ `${role.name}: ` }}
                    <v-chip class="mx-2" v-if="role.user" :color="role.user.currentUser ? 'success' : 'default'">
                      {{ role.user.nickname }}  
                    </v-chip>
                  </v-col>
                  <dialogs-confirm v-if="role.user && (role.user.currentUser || user.super_admin)" :success-handler="() => {handleRemoveAssignClick(group, role)}">
                    <template #activator="{ toggle }">
                      <v-btn color="secondary" rounded="lg" variant="text" @click="toggle">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                  </v-btn>
                    </template>
                  </dialogs-confirm>
                  <template v-else>
                    <dialogs-confirm 
                      v-if="role.application"
                      :success-handler="() => handleAssignClick(group, role)"
                      title="app-event-application-dialog-title"
                      label="app-event-application-label"
                    >
                      <template #activator="{toggle}">
                        <v-btn
                          @click="toggle"
                          color="secondary"
                          class="font-weight-bold"
                          variant="text"
                        >
                          {{ $t('app-event-reserve') }}
                        </v-btn>
                      </template>
                    </dialogs-confirm>
                    <v-btn
                      v-else
                      @click="handleAssignClick(group, role)"
                      color="secondary"
                      class="font-weight-bold"
                      variant="text"
                    >
                      {{ $t('app-event-reserve') }}
                    </v-btn>
                  </template>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
</template>

<style scoped>
  .has-assignee {
    /* opacity: 0.8; */
  }

  .v-sheet {
    height: 100%;
  }

  .v-row > .v-col .v-col {
    height: 52px;
  }
  
  .v-table {
    background: rgba(var(--v-theme-background), 1);
  }

  .v-table tr .table-name {
    width: 40%;
  }

  .v-table tr td.table-name {
    padding: 0px !important;
  }

  .v-table tr > * {
    border-bottom: none !important;
  }
</style>
