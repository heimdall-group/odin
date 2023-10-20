<script setup lang="ts">
  const props = defineProps({
    'cols': {
      type: String,
      required: true,
    },
    'sm': {
      type: String,
      required: false,
    },
    'md': {
      type: String,
      required: false,
    },
    'lg': {
      type: String,
      required: false,
    },
    'xl': {
      type: String,
      required: false,
    },
    'xxl': {
      type: String,
      required: false,
    },
    'title': {
      type: String,
      required: false,
    },
    'cardTitle': {
      type: String,
      required: false,
    },
    'titleColor': {
      type: String,
      required: false,
    },
    'modelValue': {
      type: Boolean,
      required: false,
      default: true,
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
  <v-col 
    :cols="cols"
    :sm="sm"
    :md="md"
    :lg="lg"
    :xl="xl"
    :xxl="xxl"
    :title="title"
    class="v-col pa-0"
    :class="{
      'closable': modelValue !== undefined,
      'open': value,
    }"
  >
    <v-card
      rounded="lg"
      variant="outlined"
      class="pa-3"
      :class="{
        'pt-2': modelValue === undefined,
      }"
    >
      <app-templates-title :card-title="cardTitle" :title-color="titleColor">
        <slot name="actions"></slot>
      </app-templates-title>
      <slot></slot>
    </v-card>
  </v-col>
</template>

<style scoped>
  .v-card {
    overflow: hidden;
    border-color: rgba(var(--v-theme-background-700));
  }

  .v-col.closable,
  .v-col.closable .v-card {
    max-height: 64px;
    transition: max-height 250ms linear;
  }

  .v-col.closable.open,
  .v-col.closable.open .v-card {
    max-height: 2000px;
    transition: max-height 250ms linear;
  }
</style>
