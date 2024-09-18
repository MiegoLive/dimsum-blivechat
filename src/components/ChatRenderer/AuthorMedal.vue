<template>
<!-- 如果 medal-level == 0 或者 medalName === undefined 不显示 -->
<yt-live-chat-author-medal-renderer v-if="medalName != undefined && medalLevel > 0" :medal-name="medalName" :medal-level="medalLevel" :is-fan-group="isFanGroup||undefined"
  :style="{
      '--yt-live-chat-medal-background-color': medalColor.bgColor,
      '--yt-live-chat-medal-border-color': medalColor.borderColor,
      '--yt-live-chat-medal-text-color': medalColor.textColor
    }"
  >
    <div id='medal-card' class="style-scope yt-live-chat-author-medal-renderer">
      <div id='medal-name' class="style-scope yt-live-chat-author-medal-renderer">{{medalName}}</div>
      <div id='medal-level' class="style-scope yt-live-chat-author-medal-renderer">{{medalLevel}}</div>
    </div>
  </yt-live-chat-author-medal-renderer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getMedalConfig } from './constants'

const {
  medalLevel = 0
} = defineProps<{
  medalName?: string
  medalLevel?: number
  isFanGroup?: boolean
}>()

const medalColor = computed(() => {
  return getMedalConfig(medalLevel).colors
})
</script>

<style src="../../assets/css/youtube/yt-live-chat-author-medal-renderer.css"></style>
