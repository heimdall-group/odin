<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();

  const user = computed(() => store.getUser);
  const route = useRoute();

  const title = ref('');
  const body = ref('');
  const loading = ref(false)

  const onSubmit = async () => {
    try {
      loading.value = true;
      const token = await user.value.getIdToken();
      const result = await $fetch(`/api/v1/news/${token}`, {
        method: 'POST',
        body: {
          title: title.value,
          body: body.value,
          internal: true,
          external: false,
        }
      });
      loading.value = false;
    } catch(error: any) {
      handle_error(error)
    }
  }
</script>

<template>
  <app-news-create-template v-model:title="title" :card-title="$translate('app-create-internal-news')" v-model:body="body" :loading="loading" @submit="onSubmit" />
</template>
