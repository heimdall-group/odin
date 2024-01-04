<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';
  import { useStore } from '~/stores/main';

  const viewsStore = useViewsStore();
  const store = useStore();
  const width = computed(() => viewsStore.getWidth);

  const user = computed(() => store.getUser)
  const event_application = computed(() => store.getPermissions('event-application'))

  const drawer = ref(false);
</script>

<template>
  <v-app-bar elevation="8" border rounded="lg" color="background">
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
          <v-btn block rounded="lg" exact to="/app">
            {{$t('app-navigation-dashboard')}}
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block rounded="lg" to="/app/news">
            {{$t('app-navigation-news')}}
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block rounded="lg" to="/app/events">
            {{$t('app-navigation-events')}}
          </v-btn>
        </v-list-item>
        <v-list-item v-if="event_application.read">
          <v-btn block rounded="lg" to="/app/events/applications">
            {{$t('app-navigation-events-applications')}}
          </v-btn>
        </v-list-item>
        <v-list-item disabled>
          <v-btn block rounded="lg" to="/app/jobs">
            {{$t('app-navigation-jobs')}}
          </v-btn>
        </v-list-item>
        <v-list-item disabled>
          <v-btn block rounded="lg" to="/app/market">
            {{$t('app-navigation-market')}}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-row>
    <template v-slot:append>
      <v-list>
        <v-list-item>
          <v-btn block rounded="lg" @click="firebase_signout">{{$t('navigation-settings-signout')}}</v-btn>
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
