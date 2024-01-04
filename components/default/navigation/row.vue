<script setup lang="ts">
</script>

<template>
  <v-row class="ma-0 flex-column fill-height" justify="center">
    <v-list>
      <v-list-item
        prepend-icon="empty"
      >
        <v-btn block rounded="lg" to="/">
          {{$t('navigation-home')}}
        </v-btn>
      </v-list-item>
      <v-list-item
        prepend-icon="empty"
      >
        <v-btn block rounded="lg" to="/information">
          {{$t('navigation-about-us')}}
        </v-btn>
      </v-list-item>
      <v-list-item
        prepend-icon="empty"
      >
        <v-btn block rounded="lg" to="/information/news">
          {{$t('navigation-news')}}
        </v-btn>
      </v-list-item>
      <v-list-item
        prepend-icon="empty"
      >
        <v-btn color="primary" block rounded="lg" to="/information/join-us">
          {{$t('navigation-join-us')}}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-row>
</template>
