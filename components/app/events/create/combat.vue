<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { useI18n } from 'vue-i18n';
  const store = useStore();
  const router = useRouter();
  const user = computed(() => store.getUser);
  const { t } = useI18n();

  const props = defineProps({
    'date': {
      type: Date,
      required: true,
    },
    'desc': {
      type: String,
      required: true,
    },
    'public': {
      type: Boolean,
      required: true,
    },
    'title': {
      type: String,
      required: true,
    },
    recurring: {
      type: String,
      required: true,
    }
  });

  const emits = defineEmits(['back'])

  const templates: Ref<Array<CreateAppEventCombatRole>> = ref([
    {
      title: 'app-create-event-combat-custom',
      value: 'custom',
      application: false,
    },
    {
      title: 'app-create-event-combat-group-chief',
      value: 'group-chief',
      application: true,
      template: true,
    },
    {
      title: 'app-create-event-combat-xo',
      value: 'xo',
      application: true,
      template: true,
    },
    {
      title: 'app-create-event-combat-troop',
      value: 'troop',
      application: false,
      template: true,
    },
  ]);
  const template = ref(templates.value[0].value)

  const types = [
    {
      title: 'app-event-combat-types-air',
      value: 'air',      
    },
    {
      title: 'app-event-combat-types-ground',
      value: 'ground',      
    },
    {
      title: 'app-event-combat-types-mechanised',
      value: 'mechanised',      
    },
  ];

  const optionalGroupStartingName = ref('')
  const groups: Ref<Array<CreateAppEventCombatGroup>> = ref([
    {
      name: 'Odin',
      type: 'air',
      roles: [
        {
          name: t('app-create-event-combat-group-chief'),
          title: 'app-create-event-combat-group-chief',
          value: 'group-chief',
          application: true,
          template: true,
        },
        {
          name: t('app-create-event-combat-xo'),
          title: 'app-create-event-combat-xo',
          value: 'xo',
          application: true,
          template: true,
        },
      ],
      template: templates.value[0].value,
    },
  ]);

  const handleAddNewGroup = () => {
    const roles: Array<CreateAppEventCombatRole> = [];
    const items = templates.value.filter((item: CreateAppEventCombatRole) => item.template && (item.value === 'group-chief' || item.value === 'xo'))
    items.forEach((item) => {
      let { title, value, name, application, template } = item;
      name = t(title ? title : '')
      roles.push({ title, value, name, application, template });
    })
    groups.value.push({
      name: optionalGroupStartingName.value !== '' ? optionalGroupStartingName.value : `Strikeforce-${groups.value.length + 1}`,
      type: 'air',
      roles: roles,
      template: templates.value[0].value,
    })
  }

  const handleAddNewRole = (group: CreateAppEventCombatGroup) => {
    if (Array.isArray(group.roles)) {
      const item = templates.value.filter((item) => item.value === group.template)
      if (item[0]) {
        let { title, name, value, application, template } = item[0];
        name = t(title ? title : '')
        group.roles.push({ title, name, value, application, template })
      }
      
    }
  }

  const handleRemoveGroup = (group: CreateAppEventCombatGroup) => {
    groups.value.splice(groups.value.indexOf(group), 1);
  }

  const handleRemoveRole = (group: CreateAppEventCombatGroup, role: CreateAppEventCombatRole) => {
    group.roles.splice(group.roles.indexOf(role), 1);
  }

  const handleCancelEvent = () => {
    emits('back');
  }

  const getNewRoleName = (roles: Array<CreateAppEventCombatRole>, name: string, index = 2): string => {
    const item = roles.find((item) => {
      return item.name == `${name}-${index}`
    });
    if (item) {
      return getNewRoleName(roles, name, index + 1)
    } else {
      return `${name}-${index}`;
    }

  }

  const handleSuccessEvent = async () => {
    const token = await user.value.getIdToken();
    const assignees: Array<CreateAppEventCombatGroup> = [];

    let order = 0
    for (const key in groups.value) {
      const { name, type, roles } = groups.value[key];
      const newRoles: Array<CreateAppEventCombatRole> = []
      roles.forEach(({ name, application }, order) => {
        if (name) {
          const item = newRoles.find((item) => item.name === name)
          newRoles.push({
            uid: '',
            name: item ? getNewRoleName(newRoles, name) : name,
            application,
            order
          })
        }
      });

      assignees.push({ name, type, roles: newRoles, order })
      order++
    }

    const { success, data } = await useInternalFetch(`/api/v1/events/event/${token}`, {
      method: 'POST',
      body: {
        assignees,
        date: props.date,
        desc: props.desc,
        interested: [],
        recurring: props.recurring,
        max_assignes: 0,
        external: props.public,
        title: props.title,
        type: 'combat',
      }
    })
    if (success) {
      router.push(`/app/events/${data}`)
    }
  }

</script>

<template>
  <h2 class="font-weight-regular">{{ $t('app-create-event-combat-groups-title') }}:</h2>
  <v-row class="mt-0">
    <v-col 
      v-for="(group, index) in groups"
      :key="`app-events-create-combat-${index}`"
      cols="12"
      lg="6"
    >
      <v-sheet class="pa-5">
        <v-toolbar color="background" rounded="lg" :title="`${$t('app-create-event-combat-group-title')}-${index + 1}`">
          <v-btn color="secondary" rounded="lg" :title="$t('button-remove')" variant="text" @click="() => handleRemoveGroup(group)">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </v-btn>
        </v-toolbar>
        <v-text-field v-model="group.name" :label="$t('app-create-event-combat-group-label')" bg-color="background-800" variant="solo" :rules="[requiredRule]" validate-on="input"><template #message>{{ $t('app-create-event-combat-group-label-error') }}</template></v-text-field>
        <v-label>{{ $t('app-event-combat-types-label') }}</v-label>
        <v-select
          v-model="group.type"
          :items="types"
          bg-color="background-800"
          variant="solo"
          menu-icon="fa-solid fa-chevron-down"
          :rules="[requiredRule]"
        >
          <template v-slot:selection="{ item }">
            {{ $t(item.title) }}
          </template>
          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" :title="$t(item.title)" />
          </template>
        </v-select>
        <v-label>{{ $t('app-create-event-combat-roles-label') }}:</v-label>
        <v-row class="mt-0">
          <v-col cols="12">
            <template v-if="group.roles.length !== 0">
              <v-table>
                <thead>
                  <tr>
                    <th class="table-name">{{ $t('app-create-event-combat-group-label') }}</th>
                    <th class="table-application">{{ $t('app-create-event-combat-application') }}</th>
                    <th class="table-remove"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(role, yndex) in group.roles"
                    :key="`app-events-create-combat-${index}-role-${yndex}`"
                    cols="12"
                    class="py-0"
                  >
                    <td class="table-name">
                      <v-text-field v-model="role.name" :label="$t('app-create-event-combat-roles-title')" bg-color="background-800" variant="solo" :rules="[requiredRule]" validate-on="input"><template #message>{{ $t('app-create-event-combat-roles-title-error') }}</template></v-text-field>
                    </td>
                    <td class="table-application">
                      <v-checkbox
                        v-model="role.application"
                        :disabled="role.template"
                        :ripple="false"
                        class="text-white"
                        hide-details
                        density="comfortable"
                        false-icon="fa-solid fa-square-xmark"
                        true-icon="fa-solid fa-square-check"
                      />
                    </td>
                    <td>
                      <v-btn color="secondary" rounded="lg" :title="$t('button-remove')" variant="text" @click="() => handleRemoveRole(group, role)">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </template>
            <v-card-text v-else class="text-center">{{ $t('app-create-event-combat-roles-missing') }}</v-card-text>    
          </v-col>
          <v-col cols="12">
            <v-label>{{ $t('app-create-event-combat-roles-add-label') }}:</v-label>
            <v-row align="center">
              <v-col class="pr-2">
                <v-select
                  v-model="group.template"
                  :items="templates"
                  hide-details
                  bg-color="background-800"
                  variant="solo"
                  menu-icon="fa-solid fa-chevron-down"
                  :rules="[requiredRule]"
                >
                  <template v-slot:selection="{ item }">
                    {{ $t(item.title) }}
                  </template>
                  <template v-slot:item="{ item, props }">
                    <v-list-item v-bind="props" :title="$t(item.title)" />
                  </template>
                </v-select>
              </v-col>
              <v-col cols="auto" class="pl-2">
                <v-btn rounded="lg" variant="text" :title="$t('button-add')" color="secondary" @click="() => handleAddNewRole(group)">
                  <font-awesome-icon icon="fa-solid fa-plus" />
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>
    <v-col cols="12">
      <v-label>Lägg till grupp</v-label>
      <v-row align="center">
        <v-col>
          <v-text-field v-model="optionalGroupStartingName" hide-details :label="$t('app-create-event-combat-group-label') + ` (${$t('helper-text-optional')})`" bg-color="background-800" variant="solo" />
        </v-col>
        <v-col cols="12">
          <v-btn border block rounded="lg" variant="text" :title="$t('button-add')" color="secondary" @click="handleAddNewGroup" >
            <font-awesome-icon icon="fa-solid fa-plus" />
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col><v-btn block color="error" variant="outlined" @click="handleCancelEvent">{{ $t('button-cancel') }}</v-btn></v-col>
        <v-col><v-btn block color="success" variant="outlined" @click="handleSuccessEvent">{{ $t('app-create-event') }}</v-btn></v-col>
      </v-row>
      
    </v-col>
  </v-row>
</template>

<style scoped>
  .v-toolbar {
    margin: -20px -20px 0 -20px;
    max-width: calc(100% + 40px);
    width: calc(100% + 40px);
  }
  
  .v-sheet {
    height: 100%;
  }

  .v-label {
    padding: 0 0 4px 0;
  }

  .v-table {
    background: rgba(var(--v-theme-background), 1);
  }

  .v-table tr .table-name {
    width: 80%;
  }

  .v-table tr td.table-name {
    padding: 0px !important;
  }

  .v-table tr > * {
    border-bottom: none !important;
  }

  .v-table .v-btn,
  .v-table .v-checkbox {
    margin-top: -22px;
  }
</style>
