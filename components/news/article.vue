<script setup lang="ts">
  import { useStore } from '~/stores/main';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const user = computed(() => store.getUser);
  const id = route.params.id;
  const token = user.value.getIdToken ? await user.value.getIdToken() : '';

  const edit_public = ref(false)
  const edit_internal = ref(false)
  const dialog = ref(false);

  if (Object.keys(user).length > 0) {
    if (store.getPermissions('public-news').write) {
      edit_public.value = true;
    }
    if (store.getPermissions('internal-news').write) {
      edit_internal.value = true;
    }
  }

  const { data, refresh } = await useAsyncData('news-article', () => useInternalFetch(`/api/v1/news/id/${id}`, {
    method: 'POST',
    body: {
      token: token,
    }
  }));

  const edit_state_number = ref(1);
  const edit_state = ref('');
  const edit_cover_state = ref(1);
  const article: Ref<News> = ref(data.value.data);
  const edit_menu = [
    {
      translation: 'news-edit-cover',
      state: 'cover',
    },
    {
      translation: 'news-edit-content',
      state: 'content',
    }
  ]

  const body = ref(article.value.body);
  const tempBody = ref(article.value.body);
  const title = ref(article.value.title);
  const tempTitle = ref(article.value.title);
  const cover = ref(article.value.cover);
  const internal = ref(article.value.internal);
  const external = ref(article.value.external);

  const loading = ref(false);
  const files: Ref<Array<File>> = ref([] as Array<File>);
  const tempFiles: Ref<Array<File>> = ref([] as Array<File>);
  const images: Ref<string> = ref(article.value.cover);
  const tempImages: Ref<string> = ref(article.value.cover);

  const resetEditVariables = () => {
    body.value = article.value.body
    tempBody.value = article.value.body
    title.value = article.value.title
    tempTitle.value = article.value.title
    cover.value = article.value.cover
    internal.value = article.value.internal
    external.value = article.value.external

    files.value = [];
    images.value = article.value.cover;
    tempFiles.value = [];
    tempImages.value = article.value.cover;
  }
  watch(data, (newData) => {
    if (newData.success) {
      article.value = newData.data
      resetEditVariables();
    }
  })

  const handleBackAction = () => {
    if (edit_state_number.value === 2) {
      if (edit_state.value === "content") {
        tempBody.value = body.value;
        tempTitle.value = title.value;
        edit_state_number.value--;
        edit_state.value = "";
      } else if (edit_state.value === "cover") {
        if (edit_cover_state.value !== 2) {
          edit_state_number.value--;
          edit_state.value = "";
        }
        tempFiles.value = [];
        tempImages.value = article.value.cover;
        edit_cover_state.value = 1;
      }
    } else {
      dialog.value = false;
      resetEditVariables();
    }
  };

  const handleBackConfirmClick = (toggle: Function) => {
    if (edit_state_number.value === 1) {
      const arr: Array<boolean> = [
        title.value !== article.value.title,
        body.value !== article.value.body,
        files.value.length !== 0,
        internal.value !== article.value.internal,
        external.value !== article.value.external,
      ]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
          toggle();
          return;
        }
      }
      handleBackAction();
    } else if (edit_state.value === 'cover' && tempImages.value !== images.value) {
      toggle();
    } else if (edit_state.value === 'content' && (tempBody.value !== body.value || tempTitle.value !== title.value)) {
      toggle();
    } else {
      handleBackAction();
    }
  }
  
  const handleStepTwoSaveContentClick = () => {
    body.value = tempBody.value;
    title.value = tempTitle.value;
    edit_state_number.value--
    edit_state.value = '';
  }

  const handleStepTwoSaveCoverClick = () => {
    files.value = tempFiles.value
    images.value = tempImages.value
    tempFiles.value = [];
    tempImages.value = '';
    edit_cover_state.value = 1;
    edit_state_number.value--
    edit_state.value = '';
  }

  const getNewObject = async () => {
    const obj: {[key: string]: string | boolean} = {}
    const comparisonArray = [
      [body.value, article.value.body, 'body'],
      [title.value, article.value.title, 'title'],
      [internal.value, article.value.internal, 'internal'],
      [external.value, article.value.external, 'external'],
    ]

    for (let i = 0; i < comparisonArray.length; i++) {
      const comparison = comparisonArray[i];
      const newValue = comparison[0];
      const oldValue = comparison[1];
      const name = comparison[2];
      if (newValue !== oldValue) {
        obj[name] = newValue;
      }
    }

    if (files.value.length !== 0) {
      const result = await uploadFiles(files.value);
      if (result.success) {
        obj.cover = result.data[0].data.url;
      }
    }

    return obj
  }

  const getChangeType = (oldValue: boolean | string | Array<any>, newValue?: boolean | string | Array<any>) => {
    if (typeof oldValue === 'boolean' && typeof newValue === 'boolean') {
      // Returns either Added or Removed 
      return !oldValue && newValue ? 'remove' : 'add'
    } else if (Array.isArray(oldValue) || (typeof oldValue === 'string' && typeof newValue === 'string')) {
      // Returns Changed
      return 'change'
    }
  }

  const getIcon = (oldValue: boolean | string | Array<any>, newValue?: boolean | string | Array<any>) => {
    const type = getChangeType(oldValue, newValue);
    switch(type) {
      case 'add':
        return 'fa-regular fa-square-plus'
        break;
      case 'remove':
        return 'fa-regular fa-square-minus'
        break;
      case 'change':
        return 'fa-solid fa-square-pen'
        break;
    }
  }

  const getColorClass = (oldValue: boolean | string | Array<any>, newValue?: boolean | string | Array<any>) => {
    const type = getChangeType(oldValue, newValue);
    switch(type) {
      case 'add':
        return 'text-success'
        break;
      case 'remove':
        return 'text-error'
        break;
      case 'change':
        return 'text-warning'
        break;
    }
  }

  const handleRemoveClick = async () => {
    const token = await user.value.getIdToken();
    const { success, data } = await useInternalFetch(`/api/v1/news/article/${token}`, {
      method: 'DELETE',
      body: {
        id: id,
      }
    });
    if (success) {
      router.back();
    }
  }

  const handleSaveClick = async () => {
    try {
      loading.value = true;
      const token = await user.value.getIdToken();
      const result = await useInternalFetch(`/api/v1/news/article/${token}`, {
        method: 'PUT',
        body: {
          id: id,
          ... await getNewObject()
        }
      });
      await refresh();
      loading.value = false;
      dialog.value = false;
    } catch(error: any) {
      handle_error(error)
    }
  }
</script>

<template>
  <v-container class="smaller-max-container">
    <navigation-sub-back-menu >
      <template #prepend v-if="(edit_public && article.external) || (edit_internal && article.internal) ">
        <v-btn @click="dialog = !dialog" color="secondary" class="font-weight-bold mx-2">
          <template #prepend>
            <font-awesome-icon icon="fa-solid fa-pen-to-square" />
          </template>
          {{ $t('app-edit-news') }}
        </v-btn>
        <v-dialog
          v-model="dialog"
          fullscreen
        >
          <v-sheet>
            <v-container class="h-100 overflow-x-hidden">
              <v-toolbar
                color="background"
                :title="$t('app-edit-news')"
              >
                <v-spacer></v-spacer>
                <dialogs-confirm
                  :label="edit_state_number === 1 ? 'news-edit-default-label' : edit_state === 'cover' ? 'news-edit-cover-label' : 'news-edit-content-label'"
                  :success-handler="handleBackAction">
                  <template #activator="{toggle}">
                    <v-btn @click="() => {handleBackConfirmClick(toggle)}" color="secondary" class="font-weight-bold mx-2">
                      <template #prepend>
                        <font-awesome-icon icon="fa-solid fa-arrow-left-long" />
                      </template>
                      {{ $t(edit_state_number === 1 ? 'button-cancel' : 'button-back') }}
                    </v-btn>
                  </template>
                </dialogs-confirm>
              </v-toolbar>
              <templates-2-step :state="edit_state_number" class="h-100">
                <template #step-one>               
                  <v-row class="article-edit-container ma-0" justify="center">
                    <v-col>
                      <v-card-title class="pt-0 text-center">{{ $t('news-edit-categories-title') }}:</v-card-title>
                      <v-list bg-color="background" class="pt-0" min-width="230px">
                        <v-list-item
                          v-for="(state, index) in edit_menu"
                          :key="`article-edit-dialog-list-item-${index}`"
                          border
                          rounded="lg"
                          class="ma-3"
                          @click="() => {edit_state = state.state; edit_state_number++}"
                        >
                          <v-list-item-title>{{ $t(state.translation) }}</v-list-item-title>
                          <template #append><font-awesome-icon icon="fa-solid fa-chevron-right" /></template>
                        </v-list-item>
                        <v-list-item
                          border
                          rounded="lg"
                          class="ma-3"
                        >
                        <v-checkbox 
                          v-model="internal"
                          :ripple="false"
                          :label="$t('app-create-news-publish-internal')"
                          hide-details
                          density="comfortable"
                          false-icon="fa-solid fa-square-xmark"
                          true-icon="fa-solid fa-square-check"
                        ></v-checkbox>
                        </v-list-item>
                        <v-list-item
                          border
                          rounded="lg"
                          class="ma-3"
                        >
                        <v-checkbox 
                          v-model="external"
                          :ripple="false"
                          :label="$t('app-create-news-publish-public')"
                          hide-details
                          density="comfortable"
                          false-icon="fa-solid fa-square-xmark"
                          true-icon="fa-solid fa-square-check"
                        ></v-checkbox>
                        </v-list-item>
                      </v-list>
                      <v-card-title class="pt-0 text-center">{{ $t('news-edit-changes') }}:</v-card-title>
                      <v-list bg-color="background" class="pt-0" min-width="230px">
                        <v-list-item border rounded="lg" class="v-list-item-check ma-3" :class="getColorClass(title, article.title)" :prepend-icon="getIcon(title, article.title)" :title="$t('news-edit-names-title')" v-show="title !== article.title" />
                        <v-list-item border rounded="lg" class="v-list-item-check ma-3" :class="getColorClass(body, article.body)" :prepend-icon="getIcon(body, article.body)" :title="$t('news-edit-names-body')" v-show="body !== article.body" />
                        <v-list-item border rounded="lg" class="v-list-item-check ma-3" :class="getColorClass(files)" :prepend-icon="getIcon(files)" :title="$t('news-edit-names-cover')" v-show="files.length !== 0" />
                        <v-list-item border rounded="lg" class="v-list-item-check ma-3" :class="getColorClass(internal, article.internal)" :prepend-icon="getIcon(internal, article.internal)" :title="$t('news-edit-names-internal')" v-show="internal !== article.internal" />
                        <v-list-item border rounded="lg" class="v-list-item-check ma-3" :class="getColorClass(external, article.external)" :prepend-icon="getIcon(external, article.external)" :title="$t('news-edit-names-external')" v-show="external !== article.external" />
                      </v-list>                      
                    </v-col>
                  </v-row>
                  <v-row class="article-edit-controls">
                    <v-col class="pa-3">
                      <dialogs-confirm
                        :success-handler="handleBackAction"
                        label="news-edit-default-label"
                      >
                        <template #activator="{toggle}">
                          <v-btn
                            block
                            color="error"
                            variant="outlined"
                            @click="() => {handleBackConfirmClick(toggle)}"
                          >
                            {{ $t('button-cancel') }}
                          </v-btn>
                        </template>
                      </dialogs-confirm>
                    </v-col>
                    <v-col class="pa-3"><v-btn block color="success" variant="outlined" @click="handleSaveClick" :loading="loading">{{ $t('button-save') }}</v-btn></v-col>
                  </v-row>
                </template>
                <template #step-two>
                  <div v-show="edit_state === 'cover'" class="h-100">
                    <upload-2-step-drop-zone class="article-edit-container" v-show="edit_state === 'cover'" v-model="edit_cover_state" v-model:files="tempFiles" single v-model:images="tempImages" button />
                    <v-row class="article-edit-controls">
                      <v-col class="pa-3">
                        <dialogs-confirm
                          label="news-edit-cover-label"
                          :success-handler="handleBackAction">
                          <template #activator="{toggle}">
                            <v-btn
                              block
                              color="error"
                              variant="outlined"
                              @click="() => {handleBackConfirmClick(toggle)}"
                            >
                              {{ $t('button-back') }}
                            </v-btn>
                          </template>
                        </dialogs-confirm>
                      </v-col>
                      <v-col class="pa-3"><v-btn block color="success" :disabled="edit_cover_state === 1" variant="outlined" @click="handleStepTwoSaveCoverClick">{{ $t('button-save') }}</v-btn></v-col>
                    </v-row>
                  </div>
                  <div v-show="edit_state === 'content'" class="h-100">
                    <div class="article-edit-container ma-0">
                      <v-text-field v-model="tempTitle" :label="$t('app-create-news-title-label')" bg-color="background-800" variant="solo"></v-text-field>
                      <markdown v-model="tempBody" />
                    </div>
                    <v-row class="article-edit-controls">
                      <v-col class="pa-3">
                        <dialogs-confirm
                          label="news-edit-content-label"
                          :success-handler="handleBackAction">
                          <template #activator="{toggle}">
                            <v-btn
                              block
                              color="error"
                              variant="outlined"
                              @click="() => {handleBackConfirmClick(toggle)}"
                            >
                              {{ $t('button-back') }}
                            </v-btn>
                          </template>
                        </dialogs-confirm>
                      </v-col>
                      <v-col class="pa-3"><v-btn block color="success" variant="outlined" @click="handleStepTwoSaveContentClick">{{ $t('button-save') }}</v-btn></v-col>
                    </v-row>
                  </div>
                </template>
              </templates-2-step>
            </v-container>
          </v-sheet>
        </v-dialog>
      </template>
    </navigation-sub-back-menu>
    <v-row class="ma-0" justify="center">
      <v-img v-if="article.cover" :src="article.cover" width="100px" max-height="70vh" class="rounded-lg my-4"></v-img>
    </v-row>
    <h1 class="text-white font-weight-regular pb-4">{{article.title}}</h1>
    <v-card-subtitle class="text-white mb-4 px-0">
      {{article.author.nickname}} |
      {{$d(article.date)}}
    </v-card-subtitle>
    <article v-html="$md_render(article.body)"></article>
    <v-btn
      v-if="(edit_public && article.external) || (edit_internal && article.internal)"
      @click="handleRemoveClick"
      class="mt-8"
      block
      color="error"
      variant="outlined"
    >
      {{ $t('button-remove') }}
    </v-btn>
  </v-container>
</template>

<style scoped>
  .article-edit-container {
    min-height: 90%;
  }

  .article-edit-controls {
    margin: 0px;
  }
</style>
