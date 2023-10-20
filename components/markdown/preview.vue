<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    }
  })
  
  const emits = defineEmits(['update:modelValue'])

  const value = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emits('update:modelValue', value)
    }
  })
</script>

<template>
  <section v-html="$md_render(value)"></section>
</template>
