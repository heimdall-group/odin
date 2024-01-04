import { useStore } from '~/stores/main'

export const uploadFiles = async (files: Array<File | null> | File | null): Promise<Return> => {
  try {
    if (!Array.isArray(files)) {
      files = [files]
    }
  
    const store = useStore();
    const user = computed(() => store.getUser);
    const urls: Array<string> = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const form = new FormData();
      let path = 'file';
      if (file === undefined || file === null) {
        continue
      }
      form.append('file', file);
  
      if (file.type.includes('image')) {
        path = 'images'
      } else if (file.type.includes('video')) {
        path = 'videos'
      }

      const token = await user.value.getIdToken();
      urls.push(await useInternalFetch(`/api/v1/upload/${path}/${token}`, {
        method: 'POST',
        body: form
      }));
    }

    return {
      success: true,
      data: urls,
    }
  } catch(error: any) {
    return {
      success: false,
      error: error,
    }
  }
}
