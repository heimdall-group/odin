<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
  })
  
  const emits = defineEmits(['update:modelValue'])
  const editor = ref(true);

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
  <section>
    <v-row class="mb-0">
      <v-col cols="6" class="d-flex justify-center">
        <v-btn class="text-white" :active="editor" @click="editor = true" variant="text">{{$t('markdown-editor')}}</v-btn>
      </v-col>
      <v-col cols="6" class="d-flex justify-center">
        <v-btn class="text-white" :active="!editor" @click="editor = false" variant="text">{{$t('markdown-preview')}}</v-btn>
      </v-col>
    </v-row>
    <markdown-editor v-if="editor" v-model="value" />
    <markdown-preview class="theme-dark" v-else v-model="value" />
  </section>
</template>

<style scoped>
  section {
    height: 100%;
    max-height: calc(100% - 78px - 192px);
  }

  section > section,
  section > textarea {
    display: inline-block;
    border: 1px solid rgba(var(--v-theme-background-700));
    border-radius: 4px;
    padding: 16px;
    width: 100%;
    height: 100%;
    resize: none;
    overflow-y:  scroll;
    overflow-x: hidden;
    max-height: calc(100% - 88px);
  }

  section > section {
    padding: 32px;
  }
</style>
