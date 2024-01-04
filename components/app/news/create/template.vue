<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const router = useRouter();

  const props = defineProps({
    'cardTitle': {
      type: String,
      required: true,
    },
    'public': {
      type: Boolean,
      required: false,
      default: false,
    },
    'internal': {
      type: Boolean,
      required: false,
      default: false,
    },
  });
  const emits = defineEmits(['onSubmit']);

  const title = ref('');
  const body = ref('');
  const loading = ref(false);
  const internalArticle = ref(props.internal);
  const external = ref(props.public);
  
  const state = ref(1);
  const image = ref('');
  const file: Ref<File> = ref(null as unknown as File);
  const dialog = ref(false);

  const handleBackClick = () => {
    if (state.value === 1) {
      router.back();    
    } else {
      state.value--
    }
  }
</script>

<template>
  <navigation-sub-back-menu :name="$t('app-create-news')" :handler="handleBackClick" />
  <upload-2-step-drop-zone v-model="state" v-model:files="file" v-model:images="image" single class="h-100" button>
    <v-form
      bg-color="background"
      @submit.prevent="() => {$emit('onSubmit', file, title, body, internal, external, loading)}"
      class="d-flex flex-column flex-nowrap fill-height"
    >
      <v-text-field v-model="title" :label="$t('app-create-news-title-label')" bg-color="background-800" variant="solo"></v-text-field>
      <markdown v-model="body" />
      <section>
        <template v-if="public && internal">
          <v-row class="flex-column" align="center">
            <v-col cols="auto" class="pa-0">
              <v-checkbox 
                v-model="external"
                :ripple="false"
                :label="$t('app-create-news-publish-public')"
                hide-details
                density="comfortable"
                false-icon="fa-solid fa-square-xmark"
                true-icon="fa-solid fa-square-check"
              />
            </v-col>
            <v-col cols="auto" class="pa-0">
              <v-checkbox 
                v-model="internalArticle"
                :ripple="false"
                :label="$t('app-create-news-publish-internal')"
                hide-details
                density="comfortable"
                false-icon="fa-solid fa-square-xmark"
                true-icon="fa-solid fa-square-check"
              />
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
          {{$t('app-create-news-submit')}}
        </v-btn>
        <v-dialog v-model="dialog">
        <template #activator>
          <v-btn
            @click="dialog = !dialog"
            block
            variant="plain"
            :ripple="false"
          >
            {{$t('app-create-news-preview-picture')}}
          </v-btn>
        </template>
          <v-card class="pa-3" color="transparent" flat elevation="0">
            <v-row class="mb-0" justify="end">
              <v-btn
                @click="dialog = !dialog"
                color="secondary"
                icon="fa-solid fa-xmark"
                variant="plain"
                :ripple="false"
              />
            </v-row>
            <v-img :src="image"></v-img>
          </v-card>
        </v-dialog>
      </section>
    </v-form>
  </upload-2-step-drop-zone>
</template>

<style scoped>
  .v-row label[for="upload-cover-image"] {
    cursor: pointer;
    padding: 8px 16px;
  }
</style>
