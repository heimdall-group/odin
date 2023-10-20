<script setup lang="ts">
  const dialog = ref(false);
  const loading = ref(false);
  const props = defineProps({
    links: {
      type: Array<{href: string, icon: string, key: string}>,
      required: true,
    }
  })

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
  <v-list>
    <v-list-item
      v-for="(link, index) in links"
      :key="`default-navigation-append-${index}`"
      :prepend-icon="link.icon"
    >
      <v-btn block rounded="lg" :href="link.href">
        {{$translate(link.key)}}
      </v-btn>
    </v-list-item>
    <v-list-item
      prepend-icon="fa-solid fa-gear"
    >
      <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        min-width="300px"
        max-width="500px"
      >
        <template v-slot:activator = {props}>
          <v-btn block rounded="lg" @click="dialog = !dialog">
            {{$translate('navigation-settings')}}
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
    </v-list-item>
  </v-list>
</template>
