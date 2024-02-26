<script setup lang="ts">
  const router = useRouter();

  const props = defineProps({
    "name": {
      type: String,
      required: false,
    },
    'button-name': {
      type: String,
      required: false,
    },
    'handler': {
      type: Function,
      required: false,
    }
  })

  const translation = props['button-name'] ? props['button-name'] : 'button-back'
  const sendBack = props.handler ? props.handler : () => {
    router.back();
  }
</script>

<template>
  <v-toolbar
    :title="name"
    color="background"
  >
    <template v-if="name === undefined" #title>
      <slot name="title"></slot>
    </template>
    <template #append>
      <slot name="prepend"></slot>
      <v-btn @click="sendBack" color="secondary" class="font-weight-bold mx-2">
        <template #prepend>
          <font-awesome-icon icon="fa-solid fa-arrow-left-long" />
        </template>
        {{ $t(translation) }}
      </v-btn>
      <slot name="append"></slot>
    </template>
  </v-toolbar>
</template>

