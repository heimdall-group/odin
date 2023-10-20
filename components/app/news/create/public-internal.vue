<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();

  const user = computed(() => store.getUser);
  const route = useRoute();

  const title = ref('');
  const body = ref('');
  const loading = ref(false);
  const internal = ref(false);
  const external = ref(false);

  const onSubmit = async () => {
    try {
      loading.value = true;
      const token = await user.value.getIdToken();
      const result = await $fetch(`/api/v1/news/${token}`, {
        method: 'POST',
        body: {
          title: title.value,
          body: body.value,
          internal: internal.value,
          external: external.value,
        }
      });
      loading.value = false;
    } catch(error: any) {
      handle_error(error)
    }
  }
</script>

<template>
  <app-news-create-template v-model:title="title" :card-title="$translate('app-create-news')" v-model:body="body" :loading="loading" :internal="internal" :external="external" :both="true" @submit="onSubmit" />
</template>
