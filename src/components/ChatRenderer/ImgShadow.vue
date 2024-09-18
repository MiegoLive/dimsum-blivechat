<template>
  <yt-img-shadow class="no-transition" :height="height" :width="width" style="background-color: transparent;" loaded>
    <img id="img" class="style-scope yt-img-shadow" alt="" :height="height" :width="width" :src="imgUrl">
  </yt-img-shadow>
</template>

<script setup lang="ts">
defineProps<{
  imgUrl: string;
  height: string;
  width: string;
}>();
</script>

<style src="../../assets/css/youtube/yt-img-shadow.css"></style>