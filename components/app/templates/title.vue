<script setup lang="ts">
  const props = defineProps({
    'cardTitle': {
      type: String,
      required: false,
    },
    'titleColor': {
      type: String,
      required: false,
    },
  })
</script>

<template>
  <v-row class="mb-0">
    <v-toolbar
      :title="cardTitle"
      color="background"
      :class="[titleColor ? `text-${titleColor}` : 'text-white']"
    >      
      <slot></slot>
    </v-toolbar>
  </v-row>
</template>
