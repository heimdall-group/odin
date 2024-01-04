<script setup lang="ts">
  import { useStore } from '~/stores/main'
  import { useLocale } from 'vuetify'

  const store = useStore();
  const user = computed(() => store.getUser);
  const router = useRouter();
  const permissions = computed(() => store.getPermissions('event'));
  const { current } = useLocale()

  const hours = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
  ].map((item, index) => {return {title: item, disabled: index > 11}});
  const minutes = [
    '00',
    '15',
    '30',
    '45',
  ];

  const types = [
    {
      name: 'app-event-types-combat',
      value: 'combat',
      disabled: false,
    },
    {
      name: 'app-event-types-industry',
      value: 'industry',
      disabled: true,
    },
    {
      name: 'app-event-types-social',
      value: 'social',
      disabled: true,
    },
  ];
  const recurringTypes = [
    {
      title: 'app-event-recurring-type-none',
      value: 'none',
    },
    {
      title: 'app-event-recurring-type-weekly',
      value: 'weekly',
    },
    {
      title: 'app-event-recurring-type-every-other-week',
      value: 'every-other-week',
    },
    {
      title: 'app-event-recurring-type-monthy-first-current-day',
      value: 'monthy-first-current-day',
    },
    {
      title: 'app-event-recurring-type-annually',
      value: 'annually',
    },
    {
      title: 'app-event-recurring-type-weekdays',
      value: 'weekdays',
    },
  ]

  const state = ref(1);
  const formValidation = ref(false);
  const changed = ref(false);

  const date = ref(new Date());
  const isPublic = ref(false);
  const includeGroups = ref(false);
  const hour = ref('18');
  const minute = ref('00');
  const title = ref('');
  const desc = ref('');
  const recurring = ref(recurringTypes[0].value);
  const type = ref(types[0].value);

  const handleBackClick = () => {
    if (state.value === 2) {
      state.value = 1;
    } else {
      router.back();
    }
  }

  const handleStepOneSubmit = async () => {
    if (formValidation.value) {
      date.value.setHours(parseInt(hour.value), parseInt(minute.value), 0, 0)
      if (includeGroups.value) {
        state.value++
      } else {
        const token = await user.value.getIdToken();
        const { success, data } = await useInternalFetch(`/api/v1/events/event/${token}`, {
          method: 'POST',
          body: {
            date: date.value,
            desc: desc.value,
            interested: [],
            recurring: recurring.value,
            external: isPublic.value,
            title: title.value,
            type: type.value,
          }
        });
        if (success) {
          router.push(`/app/events/${data}`)
        }
      }
    }
  }
</script>

<template>
  <v-container class="smaller-max-container">
    <navigation-sub-back-menu :name="$t('app-create-event')" :handler="handleBackClick" />
    <templates-2-step :state="state">
      <template #step-one>
        <app-events-template v-model="date">
          <v-sheet color="background" :border="false">
            <v-form @submit.prevent="handleStepOneSubmit" @change="changed = true" @input="changed = true" v-model="formValidation" validate-on="submit">
              <v-text-field v-model="title" :label="$t('app-create-event-title-label')" bg-color="background-800" variant="solo" :rules="[requiredRule]" validate-on="input"><template #message="{ message }">{{ $t('app-create-event-title-label-error') }}</template></v-text-field>
              <markdown v-model="desc" />
              <v-row class="text-white" align="center">
                <v-col>
                  <v-select v-model="hour" hide-details :items="hours" menu-icon="fa-solid fa-chevron-down" bg-color="background-800" variant="solo" />
                </v-col>
                :
                <v-col>
                  <v-select v-model="minute" hide-details :items="minutes" menu-icon="fa-solid fa-chevron-down" bg-color="background-800" variant="solo" />
                </v-col>
              </v-row>
              <v-card-title class="text-white">{{ $t('app-event-recurring-type-label') }}</v-card-title>
              <v-select
                v-model="recurring"
                :items="recurringTypes"
                hide-details
                bg-color="background-800"
                variant="solo"
                menu-icon="fa-solid fa-chevron-down"
                :rules="[requiredRule]"
              >
                <template v-slot:selection="{ item }">
                  {{ $t(item.title, {date: new Date().toLocaleDateString(current, { weekday: 'long' }).toLocaleLowerCase()}) }}
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props" :title="$t(item.title, {date: new Date().toLocaleDateString(current, { weekday: 'long' }).toLocaleLowerCase()})" />
                </template>
              </v-select>
              <v-card-title class="text-white">{{ $t('app-event-types-label') }}</v-card-title>
              <v-row>
                <v-col cols="6">
                  <v-radio-group v-model="type" class="text-white">
                    <v-radio
                      v-for="(type, index) in types"
                      :key="`app-create-event-type-radio-${index}`"
                      :label="$t(type.name)"
                      :value="type.value"
                      :disabled="type.disabled"
                      color="secondary"
                      false-icon="fa-regular fa-circle"
                      true-icon="fa-solid fa-circle-dot"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="6">
                  <v-checkbox
                    v-model="isPublic"
                    :ripple="false"
                    :label="$t('app-create-event-checkbox-public')"
                    class="text-white"
                    hide-details
                    density="comfortable"
                    false-icon="fa-solid fa-square-xmark"
                    true-icon="fa-solid fa-square-check"
                  />
                  <v-checkbox
                    v-model="includeGroups"
                    :ripple="false"
                    :label="$t('app-create-event-checkbox-include-groups')"
                    class="text-white"
                    hide-details
                    density="comfortable"
                    false-icon="fa-solid fa-square-xmark"
                    true-icon="fa-solid fa-square-check"
                  />
                </v-col>
              </v-row>
              <v-btn type="submit" block>{{ $t("button-next") }}</v-btn>
            </v-form>
          </v-sheet>
        </app-events-template>
      </template>
      <template #step-two>
        <app-events-create-combat v-if="type === 'combat'" :date="date" :desc="desc" :public="isPublic" :title="title" :recurring="recurring" @back="handleBackClick" />
        <template v-else-if="type === 'industy'">industy</template>
        <template v-else-if="type === 'social'">social</template>
        <template v-else>How tf did you do this</template>
      </template>
    </templates-2-step>
  </v-container>
</template>

<style scoped>
  section {
    height: 450px;
  }
</style>
