<script setup lang="ts">
  const props = defineProps({
    'successHandler': {
      type: Function,
      required: true,
    },
    'modelValue': {
      type: Boolean,
      required: false,
    },
  })
  const emits = defineEmits(['update:modelValue'])

  const dialog = props.modelValue ?
    computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emits('update:modelValue', value)
      }
    }) :
    ref(false);
  const loading = ref(false);

  const toggle = () => {
    dialog.value = !dialog.value
  }

  const successHandler = () => {
    toggle();
    props.successHandler();
  }
</script>

<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    min-width="300px"
    max-width="350px"
  >
    <template #activator>
      <slot name="activator" :toggle="toggle"></slot>
    </template>
    <v-card
      width="100%"
      class="text-center py-6"
      color="background-800"
    >
      <v-card-title>{{$translate('dialog-confirm-title')}}</v-card-title>
      <v-card-text>
        <slot name="label">{{$translate('dialog-confirm-label-default')}}</slot>
      </v-card-text>
      <v-row class="ma-0 py-4" justify="center">
        <v-btn color="error" variant="outlined" @click="toggle" class="mx-2">{{$translate('button-cancel')}}</v-btn>
        <v-btn color="success" variant="outlined" @click="successHandler" class="mx-2">{{$translate('button-confirm')}}</v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>
