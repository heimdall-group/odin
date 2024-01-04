<script setup lang="ts">
  import { useViewsStore } from '~/stores/view-state';

  const viewsStore = useViewsStore();
  const width = computed(() => viewsStore.getWidth);

  const drawer = ref(false);
  const external_links = reactive([
    {
      icon: 'fa-brands fa-discord',
      key: 'navigation-our-discord',
      href: 'https://discord.com/invite/zs5humSzF7',
    },
    {
      icon: 'fa-brands fa-twitch',
      key: 'navigation-our-twitch',
      href: 'https://www.twitch.tv/asgardsverige',
    },
    {
      icon: 'fa-brands fa-youtube',
      key: 'navigation-our-youtube',
      href: 'https://www.youtube.com/channel/UCSnHzDo2QJmOdnJ-z0taUgw',
    },
  ])
</script>

<template>
  <template v-if="width < 1280">
    <v-app-bar color="background">
      <v-app-bar-nav-icon @click="drawer = !drawer" icon="fa-solid fa-bars"></v-app-bar-nav-icon>
      <v-app-bar-title>{{$t('navigation-title')}}</v-app-bar-title>
      <template v-if="width > 600" v-slot:append>
        <v-btn
          color="primary" 
          rounded="xl" 
          variant="flat"
          class="mr-2"
          to="/information/join-us"
        >
          {{$t('navigation-join-us')}}
        </v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      disable-route-watcher
      disable-resize-watcher
      class="default-navigation"
    >
      <default-navigation-row />
      <template v-slot:append>
        <default-navigation-append :links="external_links" />
      </template>
    </v-navigation-drawer>
  </template>
  <v-navigation-drawer
    v-else
    rail
    disable-resize-watcher
    disable-route-watcher
    expand-on-hover
    class="default-navigation"
  >
    <template v-slot:prepend>
      <v-list>
        <v-list-item
          prepend-icon="fa-solid fa-bars"
          class="navigation-title"
          :title="$t('navigation-title')"
        />
      </v-list>
    </template>
    <default-navigation-row />
    <template v-slot:append>
      <default-navigation-append :links="external_links" />
    </template>
  </v-navigation-drawer>
</template>

<style>
  .default-navigation {
    background: rgba(var(--v-theme-background), 0.9) !important;
  }
 
  .default-navigation .v-icon.fa-solid {
    font-size: 23px;
    width: 24px;
  }

  .default-navigation .v-list-item.ma-2 .v-icon.fa-solid {
    margin-left: -8px !important;
  }

  .default-navigation .fa-discord {
    font-size: 22px;
    margin-left: -2px;
    width: 24px;
  }

  .default-navigation .fa-youtube {
    font-size: 22px;
    width: 24px;
  }
</style>
