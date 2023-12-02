<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';

  const viewsStore = useViewsStore();
  const width = computed(() => viewsStore.getWidth);

  const drawer = ref(false);
</script>

<template>
  <v-app-bar elevation="8" floating border rounded="lg" color="background">
    <v-app-bar-nav-icon @click="drawer = !drawer" icon="fa-solid fa-bars"></v-app-bar-nav-icon>
    <template v-if="width > 600" v-slot:append>

    </template>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    disable-route-watcher
    rounded="lg"
    temporary
    color="background"
  >
    <v-row class="ma-0 flex-column fill-height" justify="center">
      <v-list>
        <v-list-item>
          <v-btn block rounded="lg" exact to="/super-admin">
            {{$translate('super-admin-navigation-home')}}
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block rounded="lg" exact to="/super-admin/roles">
            {{$translate('super-admin-navigation-roles')}}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-row>
    <template v-slot:append>
      <v-list>
        <v-list-item>
          <v-btn block rounded @click="firebase_signout">{{$translate('navigation-settings-signout')}}</v-btn>
        </v-list-item>
        <v-list-item>
          <dialogs-settings />
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style>

</style>
