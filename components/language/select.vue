<script setup lang="ts">

</script>

<template>
    <v-select 
      variant="solo"
      menu-icon="fa-solid fa-chevron-down" 
      @update:modelValue="(value) => { $changeLocale(value) }"
      :items="$locale.getAllLocale()" :modelValue="$locale.getCurrentLocale()"
      >
    </v-select>
</template>
