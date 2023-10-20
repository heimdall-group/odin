<script setup lang="ts">

</script>

<template>
  <div class="mouse"></div>
</template>

<style scoped>
  .mouse {
    width: 40px;
    height: 70px;
    margin-bottom: 24px;
    border: 2px solid rgba(var(--v-theme-primary), 1);
    border-radius: 60px;
    position: relative;
    bottom: 102px;
    left: calc(50% - 20px);
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      position: absolute;
      top: 10px;
      left: calc(50% - 4px);
      background-color: rgba(var(--v-theme-primary), 1);
      border-radius: 50%;
      opacity: 1;
      animation: wheel 2s infinite;
      -webkit-animation: wheel 2s infinite;
    }
  }

  @keyframes wheel {
    to {
      opacity: 0;
      top: 60px;
    }
  }

  @-webkit-keyframes wheel {
    to {
      opacity: 0;
      top: 60px;
    }
  }
</style>
