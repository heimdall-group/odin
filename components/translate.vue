<script setup>
  const props = defineProps({
    translation: {
      validator(value) {
        return ['string', 'object'].includes(typeof value)
      },
      required: true,
    },
  })

  const {translation} = props 
  const string = ref(typeof translation === 'string');
</script>

<template>
  <template v-if="string">{{translation}}</template>
  <template v-else>
    {{translation.append}}<nuxt-link v-if="translation.to" :to="translation.to">{{translation.text}}</nuxt-link><a v-else target="_blank" :href="translation.href">{{translation.text}}</a>{{translation.prepend}}
  </template>
</template>
