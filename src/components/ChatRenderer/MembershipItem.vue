<template>
  <yt-live-chat-membership-item-renderer show-only-header class="style-scope yt-live-chat-item-list-renderer"
    :privilegeType="privilegeType" :is-deleted="isDelete||undefined">
    <div id="card" class="style-scope yt-live-chat-membership-item-renderer">
      <div id="header" class="style-scope yt-live-chat-membership-item-renderer">
        <img-shadow id="author-photo" height="40" width="40" class="style-scope yt-live-chat-membership-item-renderer"
          :imgUrl="avatarUrl"></img-shadow>
        <div id="header-content" class="style-scope yt-live-chat-membership-item-renderer">
          <div id="header-content-primary-column" class="style-scope yt-live-chat-membership-item-renderer">
            <div id="header-content-inner-column" class="style-scope yt-live-chat-membership-item-renderer">
              <author-chip class="style-scope yt-live-chat-membership-item-renderer" isInMemberMessage
                :authorName="authorName" :authorType="0" :privilegeType="privilegeType"></author-chip>
            </div>
            <div id="header-subtext" class="style-scope yt-live-chat-membership-item-renderer">{{ title }}</div>
          </div>
          <div id="timestamp" class="style-scope yt-live-chat-membership-item-renderer">{{ timeText }}</div>
        </div>
      </div>
    </div>
  </yt-live-chat-membership-item-renderer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getTimeTextByFormat } from '../../utils'

const props = defineProps<{
  avatarUrl: string
  authorName: string
  privilegeType: 0 | 1 | 2 | 3
  title: string
  time: Date
  timeFormat?: string
  isDelete?: boolean
}>()

const timeText = computed(() => {
  return getTimeTextByFormat(props.time, props.timeFormat)
})
</script>

<style src="../../assets/css/youtube/yt-live-chat-membership-item-renderer.css"></style>
