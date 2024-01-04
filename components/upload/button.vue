<script setup lang="ts">

const props = defineProps({
  files: {
    type: [File, Array<File>],
    required: false,
  },
  images: {
    type: [String, Array<String>],
    required: false,
  },
  // If component is to return an Array or String / File
  single: {
    type: Boolean,
    required: false,
  },
  // Prop to pass to V Btn
  block: {
    type: Boolean,
    required: false,
  },
  // Prop to pass to V Btn
  color: {
    type: String,
    require: false,
    default: 'primary',
  },
});
const emits = defineEmits(["update:files", "update:images", "reader", "update"]);
const isSingle = props.single ? props.single : props.images !== undefined;
const input = ref<InstanceType<typeof HTMLInputElement>>()

const files = computed({
  get() {
    return props.files;
  },
  set(value) {
    emits("update:files", value);
  },
});
const images = computed({
  get() {
    return props.images;
  },
  set(value) {
    emits("update:images", value);
  },
});

const convertFileToImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    })
  }

const onInput = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const internalFiles: Array<File> =  [];
  
  const fileList = (event.target as HTMLInputElement).files;
  if (fileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      internalFiles.push(file)
    }
  } else {
    return
  }

  if (internalFiles.length > 0) {
    if (images !== undefined) {
      if (isSingle) {
        images.value = await convertFileToImage(internalFiles[0]);
      } else {
        const arr: Array<string> = [];
        for (let i = 0; i < internalFiles.length; i++) {
          const file = internalFiles[i];
          arr.push(await convertFileToImage(file))
        }
        images.value = arr;
      }
    }

    if (isSingle) {
      files.value = internalFiles[0];
    } else {
      files.value = internalFiles
    }
    emits('update');
    if (input.value) {
      input.value.value = '';
    }
    
  }
};
</script>

<template>
  <input
    type="file"
    ref="input"
    accept="image/png, image/gif, image/jpeg"
    @change="onInput"
    id="upload-cover-image"
    class="d-none"
    :multiple="Array.isArray(files)"
  />
  <v-btn :color="color" :block="block" class="px-0">
    <label for="upload-cover-image" class="pa-2">
      <font-awesome-icon icon="fa-solid fa-upload" />
      {{$t("button-upload-image")}}
    </label>
  </v-btn>
</template>
