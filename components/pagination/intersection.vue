<script setup lang="ts">
  const props = defineProps({
    'handler': {
      type: Object,
      required: true,
    }
  })

  const onIntersect = (intersecting: boolean) => {
    if (intersecting) {
      props.handler.handler();
    }
  };
</script>

<template>
  <div
    v-if="handler.cache && !handler.cache.completed"
    class="pagination pagination-intersection w-100"
    v-intersect="{
      handler: onIntersect,
      options: {
        threshold: [0, 0.5, 1.0]
      }
    }"
  >
    <v-row
      class="pagination pagination-loader ma-0"
      justify="center"
      align="center"
    >
      <v-progress-circular indeterminate :size="40" :width="2"></v-progress-circular>
    </v-row>
  </div>
</template>

<style scoped>
  div {
    min-height: 50px;
  }
</style>
