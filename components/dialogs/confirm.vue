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
    title: {
      type: String,
      required: false,
      default: 'dialog-confirm-title',
    },
    label: {
      type: String,
      required: false,
      default: 'dialog-confirm-label-default'
    }
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
      <v-card-title class="text-white">{{$t(title)}}</v-card-title>
      <v-card-text class="text-white">
        {{$t(label)}}
      </v-card-text>
      <v-row class="ma-0 py-4" justify="center">
        <v-btn color="error" variant="outlined" @click="toggle" class="mx-2">{{$t('button-cancel')}}</v-btn>
        <v-btn color="success" variant="outlined" @click="successHandler" class="mx-2">{{$t('button-confirm')}}</v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>
