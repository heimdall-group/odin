<script setup lang="ts">
  const props = defineProps({
    links: {
      type: Array<{href: string, icon: string, key: string}>,
      required: true,
    }
  })
</script>

<template>
  <v-list>
    <v-list-item
      v-for="(link, index) in links"
      :key="`default-navigation-append-${index}`"
      :prepend-icon="link.icon"
    >
      <v-btn block rounded="lg" target="_blank" :href="link.href">
        {{$t(link.key)}}
      </v-btn>
    </v-list-item>
    <v-list-item
      prepend-icon="fa-solid fa-gear"
    >
      <dialogs-settings />
    </v-list-item>
  </v-list>
</template>
