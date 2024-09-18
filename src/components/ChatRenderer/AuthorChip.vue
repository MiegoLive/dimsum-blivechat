<template>
<yt-live-chat-author-chip>
  <span id="author-name" dir="auto" class="style-scope yt-live-chat-author-chip" :class="{ member: isInMemberMessage }"
    :type="authorTypeText"
  >
    {{ authorName }}
    <!-- 这里是已验证勋章 -->
    <span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span>
  </span>
  <span id="chat-badges" class="style-scope yt-live-chat-author-chip">
    <author-badge v-if="isInMemberMessage" class="style-scope yt-live-chat-author-chip"
      :isAdmin="false" :privilegeType="privilegeType"
    ></author-badge>
    <template v-else>
      <author-badge v-if="authorType === AUTHOR_TYPE_ADMIN" class="style-scope yt-live-chat-author-chip"
        isAdmin :privilegeType="0"
      ></author-badge>
      <author-badge v-if="privilegeType > 0" class="style-scope yt-live-chat-author-chip"
        :isAdmin="false" :privilegeType="privilegeType"
      ></author-badge>
    </template>
  </span>
</yt-live-chat-author-chip>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { AUTHOR_TYPE_ADMIN, AUTHOR_TYPE_TO_TEXT } from './constants'

const props = defineProps<{
  isInMemberMessage: boolean
  authorName: string
  authorType: 0 | 1 | 2 | 3
  privilegeType: number
}>()

const authorTypeText = computed(() => {
  AUTHOR_TYPE_TO_TEXT[props.authorType]
})
</script>

<style src="../../assets/css/youtube/yt-live-chat-author-chip.css"></style>
