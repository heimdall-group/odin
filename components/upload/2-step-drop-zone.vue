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
    modelValue: {
        type: Number,
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
        default: "primary",
    },
});

const emits = defineEmits([
    "update:files",
    "update:images",
    "update:modelValue",
    "update",
]);

const isSingle = props.single;
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



const state = props.modelValue ? computed({
    get() {
        if (props.modelValue === undefined) {
            return 1;
        }
        return props.modelValue;
    },
    set(value) {
        emits("update:modelValue", value);
    },
}) : ref(1);
</script>

<template>
    <templates-2-step :state="state">
        <template #step-one>
            <upload-drop-zone v-model:files="files" v-model:images="images" :single="single" :block="block" :color="color"
                :button="button" @update="state++" />
        </template>
        <template #step-two>
            <slot>
                <v-row class="h-100 pa-3" justify="center" align="center">
                    <template v-if="props.single && images">
                        <img :src="images.toString()" class="rounded-lg single-page" />
                    </template>
                    <template v-else>
                        <v-img v-for="(image, index) in images" :src="image.toString()" class="rounded-lg"></v-img>
                    </template>
                </v-row>
            </slot>
        </template>
    </templates-2-step>
</template>

<style scoped>
.single-page {
    max-height: 80vh;
    max-width: 100%;
    width: 100%;
}
</style>
