<template>
  <yt-live-chat-text-message-renderer :style="{
    '--repeated-text-color': randomColor,
    '--text-color': textColor,
  }" :is-fan-group="isFanGroup||undefined" :medal-level="medalLevel" :author-type="authorTypeText"
    :privilegeType="privilegeType" :is-admin="authorType === 2||undefined" :is-owner="authorType === 3||undefined" :is-deleted="isDelete||undefined">
    <div v-if="mergeSameUserDanmaku === true" id="thread">
      <div v-for="(richContent, richContentIndex) in richContents" :key="richContentIndex" id="card"
        class="style-scope yt-live-chat-text-message-renderer" :style="{ '--text-color': textColor }">
        <img-shadow id="author-photo" height="24" width="24" class="style-scope yt-live-chat-text-message-renderer"
          :imgUrl="avatarUrl"></img-shadow>
        <div id="content" class="style-scope yt-live-chat-text-message-renderer">
          <yt-live-chat-author-chip class="style-scope yt-live-chat-text-message-renderer">
            <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">{{ timeText }}</span>
            <span id="author-name" dir="auto" class="style-scope yt-live-chat-author-chip" :type="authorTypeText">{{
              authorName
            }}<!-- 这里是已验证勋章 -->
              <span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span>
            </span>
            <span id="chat-medal" class="style-scope yt-live-chat-author-chip">
              <author-medal class="style-scope yt-live-chat-author-chip" :medalLevel="medalLevel" :medalName="medalName"
                :isFanGroup="isFanGroup||undefined"></author-medal>
            </span>
            <span id="chat-badges" class="style-scope yt-live-chat-author-chip">
              <author-badge class="style-scope yt-live-chat-author-chip" :isAdmin="authorType === 2||undefined"
                :privilegeType="privilegeType"></author-badge>
            </span>
          </yt-live-chat-author-chip>
          <!-- 直接替换表情包 -->
          <div id='image-and-message' class="style-scope yt-live-chat-text-message-renderer">
            <template v-for="(content, contentIndex) in richContent">
              <span :key="contentIndex + '_TEXT'" v-if="content.type === CONTENT_TYPE_TEXT" id="message"
                class="style-scope yt-live-chat-text-message-renderer" display="block" :style="`
                    ${content.textColor === 'initial' ? '' : `color: ${content.textColor} !important;`};`">{{
                content.text }}</span>
              <img :key="contentIndex + '_IMAGE'" v-else-if="content.type === CONTENT_TYPE_IMAGE"
                class="image yt-formatted-string style-scope yt-live-chat-text-message-renderer"
                :style="`display: ${content.align};`" width="auto" :src="content.url" :alt="content.text"
                :shared-tooltip-text="content.text" :id="`image-${content.text}`" :height="content.height"
                :display="content.align">
              <img :key="contentIndex + '_EMOTICON'" v-else-if="content.type === CONTENT_TYPE_EMOTICON"
                class="emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer" :src="content.url"
                :alt="content.text" :shared-tooltip-text="content.text" :id="content.emoticon_unique"
                :height="content.height" width="auto">
            </template>
            <el-badge :value="getRepeatedValue(richContentIndex)" :max="99"
              v-show="getRepeatedValue(richContentIndex) > 1" class="style-scope yt-live-chat-text-message-renderer"
              :style="{ '--repeated-mark-color': repeatedMarkColor }"></el-badge>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div v-for="(richContent, richContentIndex) in richContents" :key="richContentIndex" id="card"
        class="style-scope yt-live-chat-text-message-renderer" :style="{ '--text-color': textColor }">
        <img-shadow id="author-photo" height="24" width="24" class="style-scope yt-live-chat-text-message-renderer"
          :imgUrl="avatarUrl"></img-shadow>
        <div id="content" class="style-scope yt-live-chat-text-message-renderer">
          <yt-live-chat-author-chip class="style-scope yt-live-chat-text-message-renderer">
            <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">{{ timeText }}</span>
            <span id="author-name" dir="auto" class="style-scope yt-live-chat-author-chip" :type="authorTypeText">{{
              authorName
            }}<!-- 这里是已验证勋章 -->
              <span id="chip-badges" class="style-scope yt-live-chat-author-chip"></span>
            </span>
            <span id="chat-medal" class="style-scope yt-live-chat-author-chip">
              <author-medal class="style-scope yt-live-chat-author-chip" :medalLevel="medalLevel" :medalName="medalName"
                :isFanGroup="isFanGroup"></author-medal>
            </span>
            <span id="chat-badges" class="style-scope yt-live-chat-author-chip">
              <author-badge class="style-scope yt-live-chat-author-chip" :isAdmin="authorType === 2"
                :privilegeType="privilegeType"></author-badge>
            </span>
          </yt-live-chat-author-chip>
          <!-- 直接替换表情包 -->
          <div id='image-and-message' class="style-scope yt-live-chat-text-message-renderer">
            <template v-for="(content, contentIndex) in richContent">
              <span :key="contentIndex + '_TEXT'" v-if="content.type === CONTENT_TYPE_TEXT" id="message"
                class="style-scope yt-live-chat-text-message-renderer" display="block" :style="`
                    ${content.textColor === 'initial' ? '' : `color: ${content.textColor} !important;`};
                    `">{{ content.text }}</span>
              <img :key="contentIndex + '_IMAGE'" v-else-if="content.type === CONTENT_TYPE_IMAGE"
                class="image yt-formatted-string style-scope yt-live-chat-text-message-renderer"
                :style="`display: ${content.align};`" width="auto" :src="content.url" :alt="content.text"
                :shared-tooltip-text="content.text" :id="`image-${content.text}`" :height="content.height"
                :display="content.align">
              <img :key="contentIndex + '_EMOTICON'" v-else-if="content.type === CONTENT_TYPE_EMOTICON"
                class="emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer" :src="content.url"
                :alt="content.text" :shared-tooltip-text="content.text" :id="`emoticon-${content.text}`"
                :height="content.height" width="auto">
            </template>
            <el-badge :value="getRepeatedValue(richContentIndex)" :max="99"
              v-show="getRepeatedValue(richContentIndex) > 1" class="style-scope yt-live-chat-text-message-renderer"
              :style="{ '--repeated-mark-color': repeatedMarkColor }"></el-badge>
          </div>
        </div>
      </div>
    </template>
  </yt-live-chat-text-message-renderer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { CONTENT_TYPE_TEXT, CONTENT_TYPE_IMAGE, CONTENT_TYPE_EMOTICON, AUTHOR_TYPE_TO_TEXT } from './constants'
import { getTimeTextByFormat } from '../../utils';

// HSL
const RANDOM_TEXT_COLOR_START = [0, 100.0, 55.0]
const RANDOM_TEXT_COLOR_END = [360, 60.0, 75.0]

const REPEATED_MARK_COLOR_START = [210, 100.0, 62.5]
const REPEATED_MARK_COLOR_END = [360, 87.3, 69.2]

const props = defineProps<{
  avatarUrl: string,
  time: Date,
  timeFormat?: string,
  authorName: string,
  authorType: number,
  medalName?: string,
  medalLevel?: number,
  isFanGroup?: boolean,
  isDelete?: boolean,
  emoticon?: string,
  // content: string,
  // contents: Array,
  // richContent: Array,
  richContents: Array<any>, // TODO: 类型定义
  privilegeType?: number,
  repeated: number,
  repeatedThread: Array<any>, // TODO: 类型定义
  imageShowType?: number,
  maxImage?: number,
  maxEmoji?: number,
  textColor: string,
  mergeSameUserDanmaku?: boolean
}>()

function getRepeatedValue(index: number) {
  return props.repeatedThread[index]
}

const timeText = computed(() => {
  return getTimeTextByFormat(props.time, props.timeFormat)
})

const authorTypeText = computed(() => {
  // 优先判断舰长
  return props.privilegeType && props.privilegeType > 0 ? 'member' : AUTHOR_TYPE_TO_TEXT[props.authorType]
})

const randomColor = computed(() => {
  let color = [0, 0, 0]
  let t = Math.random()
  for (let i = 0; i < 3; i++) {
    color[i] = RANDOM_TEXT_COLOR_START[i] + ((RANDOM_TEXT_COLOR_END[i] - REPEATED_MARK_COLOR_START[i]) * t)
  }
  return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`
})

const repeatedMarkColor = computed(() => {
  let color: number[]
  if (props.repeated <= 2) {
    color = REPEATED_MARK_COLOR_START
  } else if (props.repeated >= 10) {
    color = REPEATED_MARK_COLOR_END
  } else {
    color = [0, 0, 0]
    let t = (props.repeated - 2) / (10 - 2)
    for (let i = 0; i < 3; i++) {
      color[i] = REPEATED_MARK_COLOR_START[i] + ((REPEATED_MARK_COLOR_END[i] - REPEATED_MARK_COLOR_START[i]) * t)
    }
  }
  return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`
})

</script>

<style>
yt-live-chat-text-message-renderer>#content .el-badge {
  margin-left: 10px;
}

yt-live-chat-text-message-renderer>#content .el-badge .el-badge__content {
  font-size: 14px !important;
  line-height: 18px !important;
  text-shadow: none !important;
  font-family: sans-serif !important;
  color: #FFF !important;
  background-color: var(--repeated-mark-color) !important;
  border: none;
}
</style>

<style src="../../assets/css/youtube/yt-live-chat-text-message-renderer.css"></style>