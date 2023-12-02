<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const user = computed(() => store.getUser);

  const props = defineProps({
    'cardTitle': {
      type: String,
      required: true,
    },
    'both': {
      type: Boolean,
      required: false,
    },
  });

  const title = ref('');
  const body = ref('');
  const loading = ref(false);
  const internal = ref(true);
  const external = ref(true);

  const state = ref(1);
  const image = ref('');
  const files = ref<File| null>(null);
  const dialog = ref(false);

  const onInput = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const reader = new FileReader(); 
      reader.onload = () => {
        if (reader.result) {
          image.value = reader.result as string;
          state.value++

          files.value = file
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async () => {
    try {
      const token = await user.value.getIdToken();
      const coverResult = await uploadFiles(files.value);
      if (!coverResult.success) {
        throw 'Cover wasnt able to be uploaded'
      }
      const articleResult = await useInternalFetch(`/api/v1/news/article/new/${token}`, {
        method: 'POST',
        body: {
          title: title.value,
          body: body.value,
          cover: coverResult.data[0].data.url,
          internal: internal.value,
          external: external.value,
        }
      });
      loading.value = false;
    } catch(error: any) {
      console.log(error)
      handle_error(error)
    }
  }

</script>

<template>
  <v-row class="ma-0 flex-column flex-nowrap fill-height">
    <v-row class="flex-nowrap flex-grow-1" :class="{
      'state-1': state === 1,
      'state-2': state === 2,
    }">
      <v-col cols="12">
        <v-card height="100%" variant="outlined" color="background-700" class="d-flex justify-center align-center pa-4">
          <input type="file" accept="image/png, image/gif, image/jpeg" @change="onInput" id="upload-cover-image" class="d-none" />
          <v-btn color="primary" class="px-0">
            <label for="upload-cover-image">{{$translate('app-create-news-upload-picture')}}</label>
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-form
          bg-color="background"
          @submit.prevent="onSubmit"
          class="d-flex flex-column flex-nowrap fill-height"
        >
          <v-text-field v-model="title" :label="$translate('app-create-news-title-label')" bg-color="background-800" variant="solo"></v-text-field>
          <markdown v-model="body" />
          <section>
            <template v-if="both">
              <v-row class="flex-column" align="center">
                <v-col cols="auto" class="pa-0">
                  <v-checkbox 
                    v-model="external"
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
                    v-model="internal"
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
