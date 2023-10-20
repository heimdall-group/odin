<script setup lang="ts">
  const route = useRoute();
  const path = route.params.path;


  const index = path.length === 0;
  const roles = path.includes('roles');
</script>

<template>
  <v-container v-if="index">
  </v-container>
  <super-admin-roles v-else-if="roles" />
  <div v-else>{{$translate('page-doesnt-exists')}}</div>
</template>
