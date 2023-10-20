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
  <textarea v-model="value"></textarea>
</template>

<style scoped>
  textarea:focus {
    outline: none;
  }
</style>
