<script setup lang="ts">
  const props = defineProps({
    state: {
      type: Number,
      required: true,
    }
  })

</script>

<template>
  <v-row
    class="flex-nowrap"
    :class="{
      'state-1': state === 1,
      'state-2': state === 2,
    }"
  >
    <v-col cols="12">
      <slot name="step-one"></slot>
    </v-col>
    <v-col cols="12">
      <slot name="step-two"></slot>
    </v-col>
  </v-row>
</template>

<style scoped>
  .v-row {
    transition-property: transform, height;
    transition-duration: 250ms, 250ms;
  }

  .v-row.state-1,
  .v-row.state-2 {
    max-height: calc(100% - 64px);
  }

  .v-row.state-1 .v-col,
  .v-row.state-2 .v-col {
    max-height: 100%;
  }

  .v-row.state-1 {
    transform: translateX(0);
  }

  .v-row.state-2 {
    transform: translateX(-100%);
  }
</style>
