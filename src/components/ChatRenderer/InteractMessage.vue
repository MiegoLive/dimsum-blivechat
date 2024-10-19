<template>
<yt-live-chat-interact-message-renderer class="style-scope yt-live-chat-item-list-renderer"
  :is-fan-group="isFanGroup"
  :medal-level="medalLevel"
  :medal-name="medalName"
  :privilegeType="privilegeType"
  :msg-type="msgType"
  :is-deleted="isDelete||undefined"
>
  <div id="card" class="style-scope yt-live-chat-interact-message-renderer">
    <img-shadow id="author-photo" height="24" width="24" class="style-scope yt-live-chat-interact-message-renderer"
      :imgUrl="avatarUrl"
    ></img-shadow>
    <div id="content" class="style-scope yt-live-chat-interact-message-renderer">
      <yt-live-chat-author-chip class="style-scope yt-live-chat-interact-message-renderer">
        <span id="timestamp" class="style-scope yt-live-chat-interact-message-renderer">{{timeText}}</span>
        <span id="author-name" dir="auto" class="style-scope yt-live-chat-author-chip">{{ authorName }}
        </span>
        <span id="chat-medal" class="style-scope yt-live-chat-author-chip">
          <author-medal class="style-scope yt-live-chat-author-chip"
            :medalLevel="medalLevel" :medalName="medalName" :isFanGroup="isFanGroup||undefined"
          ></author-medal>
        </span>
        <span id="chat-badges" class="style-scope yt-live-chat-author-chip">
          <author-badge class="style-scope yt-live-chat-author-chip"
            :privilegeType="privilegeType"
          ></author-badge>
        </span>
      </yt-live-chat-author-chip>
      <span id="message" class="style-scope yt-live-chat-interact-message-renderer"
        display="block"
      >{{ interactText }}</span>
    </div>
  </div>
</yt-live-chat-interact-message-renderer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getTimeTextByFormat } from '../../utils'
import { INTERACT_TYPE_ENTER, INTERACT_TYPE_FOLLOW, INTERACT_TYPE_SHARE, INTERACT_TYPE_SPECIAL_FOLLOW } from './constants'


const props = defineProps<{
  avatarUrl: string
  authorName: string
  medalName: string
  medalLevel: number
  isFanGroup: boolean
  isDelete: boolean
  privilegeType: 0 | 1 | 2 | 3
  msgType: number
  time: Date
  timeFormat?: string
}>()

const timeText = computed(() => {
  return getTimeTextByFormat(props.time, props.timeFormat)
})

const interactText = computed(() => {
  if (props.msgType === INTERACT_TYPE_ENTER) {
    return '进入直播间'
  } else if (props.msgType === INTERACT_TYPE_FOLLOW) {
    return '关注了直播间'
  } else if (props.msgType === INTERACT_TYPE_SHARE) {
    return '分享了直播间'
  } else if (props.msgType === INTERACT_TYPE_SPECIAL_FOLLOW) {
    return '特别关注了直播间'
  } else {
    return '互相关注了直播间'
  }
})
</script>

<style src="../../assets/css/youtube/yt-live-chat-interact-message-renderer.css"></style>