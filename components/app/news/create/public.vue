<script setup lang="ts">
  import { useStore } from '~/stores/main'

  const store = useStore();
  const user = computed(() => store.getUser);
  const router = useRouter();
  const onSubmit = async (file: File, title: string, body:string, internal: boolean, external: boolean) => {
    try {
      const token = await user.value.getIdToken();
      const coverResult = await uploadFiles(file);
      if (!coverResult.success) {
        throw 'Cover wasnt able to be uploaded'
      }
      const { success, data } = await useInternalFetch(`/api/v1/news/article/${token}`, {
        method: 'POST',
        body: {
          title: title,
          body: body,
          cover: coverResult.data[0].data.url,
          internal: internal,
          external: external,
        }
      });
      if (success) {
        router.push(`/app/news/public/${data}`)
      }
    } catch(error: any) {
      console.log(error)
      handle_error(error)
    }
  }
</script>

<template>
  <app-news-create-template :card-title="$t('app-create-public-news')" @on-submit="onSubmit" public />
</template>
