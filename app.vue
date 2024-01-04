<script setup lang="ts">
  import { useStore } from '~/stores/main';
  import { useViewsStore } from '~/stores/view-state';
  const store = useStore()
  const viewsStore = useViewsStore();
  const loading = computed(() => store.getGlobalLoading);

  onMounted(() => {
    firebase_initialize_authentication()
    viewsStore.setState(window.innerWidth)
    window.addEventListener('resize', () => {viewsStore.setState(window.innerWidth)})
  });
</script>

<template>
  <v-app v-if="loading">
    <v-row class="ma-0" align="center" justify="center">
      <v-progress-circular indeterminate :size="40" :width="2"></v-progress-circular>
    </v-row>
  </v-app>
  <v-app full-height v-else>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<style>
@import url(~/assets/css/fonts.css);
@import url(~/assets/css/loaders.css);
@import url(~/assets/css/cursors.css);
@import url(~/assets/css/selects.css);
@import url(~/assets/css/hover.css);
@import '@felixrydberg/discord-markdown';

* {
  font-family: 'Quicksand';
  text-transform: unset !important;
}

.v-application {
  min-height: calc(100vh + 192px);
}

.v-application .v-main > .v-container {
  min-height: calc(100vh - 64px);
}

.v-container {
  overflow-x: hidden;
}

.v-sheet.bg-background.v-sheet--border {
  border-color: rgba(var(--v-theme-border-color));
}

.v-footer {
  height: calc(192px) !important;
}

.v-btn[class^='font-weight-'] .v-btn__content {
  font-weight: 400;
}

html {
  touch-action: manipulation;
  /* overflow-y: auto; */
  width: 100vw;
}

.v-overlay__scrim {
  background: rgb(var(--v-theme-background));
  opacity: 0.7;
}

.markdown-container * {
  padding: initial;
  margin: initial;
  text-transform: initial;
}

.markdown-container ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}

.markdown-container pre {
  background: rgba(var(--v-theme-background-700), 1);
  border-radius: 4px;
  padding: 8px;
}

.markdown-container p {
  white-space: pre-wrap;
}

.v-icon.fa-solid,
.v-icon.fa-regular {
  font-size: 0.875rem;
  margin: 0;
}

.v-list-item-check .v-icon.fa-solid,
.v-list-item-check .v-icon.fa-regular,
.v-checkbox .v-icon.fa-solid,
.v-checkbox .v-icon.fa-regular {
  font-size: calc(var(--v-icon-size-multiplier) * 1.4em);
  margin: -1px 0 0 0;
}

.v-list-item-check .v-icon.fa-square-xmark,
.v-checkbox .v-icon.fa-square-xmark {
  color: rgb(var(--v-theme-error))
}

.v-list-item-check .v-icon.fa-square-check,
.v-checkbox .v-icon.fa-square-check {
  color: rgb(var(--v-theme-success))
}

.v-date-picker .v-btn {
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-date-picker-month__day--selected .v-btn {
  background-color: rgb(var(--v-theme-background-700));
  color: rgb(var(--v-theme-on-background-700));
}

@media screen and (min-width: 1900px) {
    .v-container.smaller-max-container {
      max-width: 1192px;
    }
  }

/* Scroll */

*::-webkit-scrollbar-button {
  display: none;
}

*::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  background: transparent;
}

*::-webkit-scrollbar-track {
  background: transparent;
  width: 9px;
}

*::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 7px;
  width: 7px;
  border: 1px solid transparent;
}

</style>