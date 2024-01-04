<script setup lang="ts">
  import { useStore } from '~/stores/main'
  const store = useStore();
  const permissions = computed(() => store.getPermissions('event'));
  const props = defineProps({
    modelValue: {
      type: Date,
      required: true,
    }
  })
  const emits = defineEmits(['update:modelValue'])

  const date = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emits('update:modelValue', value)
    }
  });
</script>

<template>
    <v-row class="ma-0">
      <v-col cols="12" md="6">
        <v-date-picker
          rounded="lg"
          bg-color="background"
          border
          width="100%"
          show-adjacent-months
          v-model="date"
          :min="new Date().toISOString().substr(0, 10)"
          prev-icon="fa-solid fa-chevron-left"
          next-icon="fa-solid fa-chevron-right"
          mode-icon="fa-solid fa-chevron-down"
        />
      </v-col>
      <v-col cols="12" md="6">
        <slot></slot>
      </v-col>
    </v-row>
</template>
