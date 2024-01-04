<script setup lang="ts">
  import { useLocale } from 'vuetify'

  const { current } = useLocale()
  function changeLocale (locale: string) {
    const cookie = useInternalCookie('odin-preselected-language')
    cookie.value = locale;
    current.value = locale
  }
</script>

<template>
    <v-select 
      variant="solo"
      menu-icon="fa-solid fa-chevron-down" 
      @update:modelValue="(value) => { changeLocale(value) }"
      :items="$i18n.availableLocales" :modelValue="$i18n.locale"
      >
    </v-select>
</template>
