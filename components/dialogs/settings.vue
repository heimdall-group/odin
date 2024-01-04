<script setup lang="ts">
  const dialog = ref(false);
  const loading = ref(false);

  const signoutHandler = async () => {
    loading.value = true;
    const result = await firebase_signout();
    loading.value = false;
    if (result) {
      dialog.value = false;
    }
  }
</script>

<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    min-width="300px"
    max-width="500px"
  >
    <template v-slot:activator = {props}>
      <v-btn block rounded="lg" @click="dialog = !dialog">
        {{$t('navigation-settings')}}
      </v-btn>
    </template>
    <v-card
      width="100%"
      class="pa-6"
      color="background"
    >
      <language-select />
    </v-card>
  </v-dialog>
</template>
