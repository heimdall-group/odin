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
      default: false,
    },
    // If component is supposed to have a Upload Button
    button: {
      type: Boolean,
      required: false,
      default: false,
    },
    // Prop to pass to Upload Button
    block: {
      type: Boolean,
      required: false,
    },
    // Prop to pass to Upload Button
    color: {
      type: String,
      require: false,
      default: 'primary',
    },
  });
  const emits = defineEmits(["update:files", "update:images", "update"]);
  
  const isSingle = props.single;
  const isHovering = ref(false);
  const counter = ref(0);
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

  const dropHandler = async (event: any) => {
    isHovering.value = false;
    counter.value = 0;
    const internalFiles: Array<File> = [];
    if (event.dataTransfer.items) {
      [...event.dataTransfer.items].forEach((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          internalFiles.push(file);
        }
      });
    } else {
      [...event.dataTransfer.files].forEach((file) => {
        internalFiles.push(file);
      });
    }

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
    emits('update')
  };

  const dragStartHandler = () => {
    counter.value++;
    isHovering.value = true;
  }
  const dragEndHandler = (event: Event) => {
    counter.value--;
    if (counter.value === 0) {
      isHovering.value = false;
    }
  }
</script>

<template>
  <v-sheet
    id="drop-zone"
    @drop.prevent="dropHandler"
    @dragenter.prevent="dragStartHandler"
    @dragleave.prevent="dragEndHandler"
    @dragover.prevent
    :class="{active: isHovering}"
  >
    <v-row class="ma-4 flex-column h-100 ga-6" :v-show="!isHovering" justify="center" align="center">
      <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path opacity="1" fill="#1E3050" d="M128 64c0-35.3 28.7-64 64-64H352V128c0 17.7 14.3 32 32 32H512V448c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V336H302.1l-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39H128V64zm0 224v48H24c-13.3 0-24-10.7-24-24s10.7-24 24-24H128zM512 128H384V0L512 128z"/></svg>
      <!-- <svg xmlns="http://www.w3.org/2000/svg" height="32" width="24" viewBox="0 0 384 512"><path opacity="1" fill="#1E3050" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z"/></svg> -->
      <upload-button v-if="button" :color="color" :single="single" v-model:files="files" v-model:images="images" @update="$emit('update')"></upload-button>
    </v-row>
  </v-sheet>
</template>

<style scoped>

  .v-sheet {
    transition-property: border-color, border-width;
    transition-duration: 250ms, 125ms;
    height: 100%;
    width: 100%;
  }

  .v-sheet.active {
    border-color: rgba(var(--v-theme-secondary), var(--v-border-opacity));
    border-width: 4px;
  }

  svg {
    height: 240px;
    width: 240px;
  }

  svg > * {
    fill: rgba(var(--v-theme-background-700));
  }

</style>
