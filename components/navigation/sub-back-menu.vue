<script setup lang="ts">
  const router = useRouter();

  const props = defineProps({
    "name": {
      type: String,
      required: false,
    }
  })

  const sendBack = () => {
    router.back();
  }  

</script>

<template>
  <v-toolbar
    :title="name"
    color="background"
  >
    <v-spacer></v-spacer>
    <slot name="prepend"></slot>
    <v-btn @click="sendBack" color="secondary" class="font-weight-bold mx-2">
      <template #prepend>
        <font-awesome-icon icon="fa-solid fa-arrow-left-long" />
      </template>
      {{ $translate('button-back') }}
    </v-btn>
    <slot name="append"></slot>
  </v-toolbar>
</template>

