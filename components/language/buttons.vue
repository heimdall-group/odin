<script setup lang="ts">
  const props = defineProps({
    'cols': {
      type: String,
      required: true,
    }
  })
</script>

<template>
    <v-row class="ma-0 language-buttons">
      <v-col
        v-for="(locale, index) in $locale.getAllLocale()"
        :key="`language-buttons-${index}`"
        :cols="cols"
        class="pa-0 d-flex justify-center"
      >
        <v-btn
          variant="text"
          @click="() => $changeLocale(locale)"
        >
          {{locale}}
        </v-btn>
      </v-col>
    </v-row>
</template>

<style>
  .language-buttons .v-btn {
    text-transform: capitalize !important;
  }
</style>
