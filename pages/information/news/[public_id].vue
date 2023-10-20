<script setup lang="ts">
  const route = useRoute();
  const public_id = route.params.public_id
</script>

<template>
  {{ public_id }}
</template>