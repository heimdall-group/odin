<script setup lang="ts">
  const props = defineProps({
    'news': {
      type: Array<News>,
      required: true,
    },
    'name': {
      type: String,
      required: true,
    },
    'cache': {
      type: Object,
      required: true,
    },
    'href': {
      type: String,
      required: true,
    },
    'refresh': {
      type: Function,
      required: true,
    }
  });

  const state = ref(0);
  const disableIncrement = ref(state.value === props.cache.max_count);
  const disableDecrement = ref(true);

  const handleClick = () => {
    if (state.value === 0) {
      disableDecrement.value = true;
    } else {
      disableDecrement.value = false;
    }

    if (state.value === props.cache.max_count - 1) {
      disableIncrement.value = true
    } else {
      disableIncrement.value = false
    }
  }

  const handleIncrementClick = () => {
    if (disableIncrement.value) {
      return
    }

    state.value++
    if ((state.value + 3 > props.news.length) && !props.cache.completed) {
      props.refresh()
    }
    handleClick();
  }

  const handleDecrementClick = () => {
    if (disableDecrement.value) {
      return
    }
    state.value--
    handleClick();
  }
  watch(props.news, handleClick)
</script>

<template>
  <v-btn @click="handleDecrementClick" :disabled="disableDecrement">-</v-btn>
  <v-btn @click="handleIncrementClick" :disabled="disableIncrement">+</v-btn>
  <v-row 
    v-if="!cache.empty"
    class="my-0 flex-nowrap news-carosuel-parent overflow-hidden"
    :style="`--parent-i: ${state};`"
    align="start"
  >
    <v-col
      v-for="(article, index) in news"
      :key="`news-carosuel-${name}-${index}`"
      cols="12"
      class="pa-1 hover-parent news-carosuel-child d-flex"
      :style="[`--child-i: ${index};`,`background-image: ${article.cover}`]"
    >
        <img :src="article.cover"  height="100" width="100"/>
        <h2 class="text-white font-weight-regular">{{article.title}}</h2>
        <v-card-text class="hover-target">{{ article.summary }}...</v-card-text>
        <v-card-subtitle class="text-white mb-4 hover-target">
          {{article.author.nickname}} |
          {{$d(article.date)}}
        </v-card-subtitle>
    </v-col>
  </v-row>
</template>

<style scoped>
  .v-row,
  .news-carosuel-child {
    height: 600px;
  }

  .news-carosuel-parent {
    position: relative;
  }
  .news-carosuel-child {
    position: absolute;
    transition-property: transform;
    transition-timing-function: ease-in-out;
    transition-duration: 125ms;
    transform: translateX(calc(calc(var(--child-i) * 100%) - calc(var(--parent-i) * 100%)));
  }
</style>
