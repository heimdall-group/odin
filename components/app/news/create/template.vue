<script setup lang="ts">
  const props = defineProps({
    'title': {
      type: String,
      required: true,
    },
    'body': {
      type: String,
      required: true,
    },
    'cardTitle': {
      type: String,
      required: true,
    },
    'loading': {
      type: Boolean,
      required: true,
    },
    'internal': {
      type: Boolean,
      required: false,
    },
    'external': {
      type: Boolean,
      required: false,
    },
    'both': {
      type: Boolean,
      required: false,
    },
  });

  const emits = defineEmits(['update:title', 'update:body', 'update:internal', 'update:external', 'submit'])
  const state = ref(1);
  const file = ref([]);
  const image = ref('');
  const dialog = ref(false);

  const internal_title = computed({
    get() {
      return props.title
    },
    set(value) {
      emits('update:title', value)
    }
  })
  const internal_body = computed({
    get() {
      return props.body
    },
    set(value) {
      emits('update:body', value)
    }
  })
  const internal_internal = computed({
    get() {
      return props.internal
    },
    set(value) {
      console.log(value)
      emits('update:internal', value)
    }
  })
  const internal_external = computed({
    get() {
      return props.external
    },
    set(value) {
      console.log(value)
      emits('update:external', value)
    }
  })

  const onInput = () => {
    console.log(file.value[0])
    if (file.value[0]) {
      const reader = new FileReader(); 
      reader.onload = () => {
        if (reader.result) {
          image.value = reader.result as string;
          state.value++
        }
      }
      reader.readAsDataURL(file.value[0])
    }
  }
</script>

<template>
  <v-row class="ma-0 flex-column flex-nowrap fill-height">
    <v-toolbar class="flex-grow-0" :title="cardTitle" color="background"></v-toolbar>
    <v-row class="flex-nowrap flex-grow-1" :class="{
      'state-1': state === 1,
      'state-2': state === 2,
    }">
      <v-col cols="12">
        <v-card height="100%" variant="outlined" color="background-700" class="d-flex justify-center align-center pa-4">
          <v-file-input v-model="file" @update:model-value="onInput" id="upload-cover-image" class="d-none"></v-file-input>
          <v-btn color="primary" class="px-0">
            <label for="upload-cover-image">{{$translate('app-create-news-upload-picture')}}</label>
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-form
          bg-color="background"
          @submit.prevent="$emit('submit')"
          class="d-flex flex-column flex-nowrap fill-height"
        >
          <v-text-field v-model="internal_title" :label="$translate('app-create-news-title-label')" bg-color="background-800" variant="solo"></v-text-field>
          <markdown v-model="internal_body" />
          <section>
            <template v-if="both">
              <v-row class="flex-column" align="center">
                <v-col cols="auto" class="pa-0">
                  <v-checkbox 
                    v-model="internal_external"
                    :ripple="false"
                    :label="$translate('app-create-news-publish-public')"
                    hide-details
                    density="comfortable"
                    false-icon="fa-solid fa-square-xmark"
                    true-icon="fa-solid fa-square-check"
                  ></v-checkbox>
                </v-col>
                <v-col cols="auto" class="pa-0">
                  <v-checkbox 
                    v-model="internal_internal"
                    :ripple="false"
                    :label="$translate('app-create-news-publish-internal')"
                    hide-details
                    density="comfortable"
                    false-icon="fa-solid fa-square-xmark"
                    true-icon="fa-solid fa-square-check"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </template>
            <v-btn
              block
              color="primary"
              :loading="loading"
              class="my-6"
              type="submit"
            >
              {{$translate('app-create-news-submit')}}
            </v-btn>
            <v-dialog v-model="dialog">
              <template #activator>
                <v-btn
                  @click="dialog = !dialog"
                  block
                  variant="plain"
                  :ripple="false"
                >
                  {{$translate('app-create-news-preview-picture')}}
                </v-btn>
              </template>
              <v-card class="pa-3" color="transparent" flat elevation="0">
                <v-row class="mb-0" justify="end">
                  <v-btn
                    @click="dialog = !dialog"
                    icon="fa-solid fa-xmark"
                    variant="plain"
                    :ripple="false"
                  >
                  </v-btn>
                </v-row>
                <v-img :src="image"></v-img>
              </v-card>
            </v-dialog>
          </section>
        </v-form>
      </v-col>
    </v-row>
  </v-row>
</template>

<style scoped>
  .v-row {
    transition-property: transform, height;
    transition-duration: 250ms, 250ms;
  }

  .v-row.state-1,
  .v-row.state-2 {
    max-height: calc(100% - 64px);
  }

  .v-row.state-1 .v-col,
  .v-row.state-2 .v-col {
    max-height: 100%;
  }

  .v-row.state-1 {
    transform: translateX(0);
  }

  .v-row.state-2 {
    transform: translateX(-100%);
  }

  .v-row label[for="upload-cover-image"] {
    cursor: pointer;
    padding: 8px 16px;
  }
</style>
