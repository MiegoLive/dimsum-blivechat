<template>
  <yt-live-chat-ticker-renderer :hidden="showMessages.length === 0">
    <div id="container" dir="ltr" class="style-scope yt-live-chat-ticker-renderer">
      <transition-group tag="div" :css="false" @enter="onTickerItemEnter" @leave="onTickerItemLeave" id="items"
        class="style-scope yt-live-chat-ticker-renderer">
        <yt-live-chat-ticker-paid-message-item-renderer v-for="message in showMessages" :key="message.raw.id"
          tabindex="0" class="style-scope yt-live-chat-ticker-renderer" style="overflow: hidden;"
          @click="onItemClick(message.raw)"
          :privilegeType="message.raw.type == MESSAGE_TYPE_MEMBER ? message.raw.privilegeType : ''"
          :type="message.raw.type" :price="message.raw.price" :giftName="message.raw.giftName" :style="{
            '--yt-live-chat-ticker-item-primary-color': message.bgColor.primaryColor,
            '--yt-live-chat-ticker-item-secondary-color': message.bgColor.secondaryColor
          }">
          <div id="container" dir="ltr" class="style-scope yt-live-chat-ticker-paid-message-item-renderer" :style="{
            background: message.formatBgColor,
          }">
            <div id="content"
              :type="message.raw.type === MESSAGE_TYPE_MEMBER ? MESSAGE_TYPE_MEMBER : MESSAGE_TYPE_SUPER_CHAT"
              class="style-scope yt-live-chat-ticker-paid-message-item-renderer" :style="{
                color: message.color
              }">
              <img-shadow id="author-photo" height="24" width="24"
                class="style-scope yt-live-chat-ticker-paid-message-item-renderer"
                :imgUrl="message.raw.avatarUrl"></img-shadow>
              <span id="text" dir="ltr" class="style-scope yt-live-chat-ticker-paid-message-item-renderer"
                v-if="message.raw.giftName !== undefined">{{
                  message.raw.giftName + "x" + message.raw.num
                }}</span>
              <span id="text" dir="ltr" class="style-scope yt-live-chat-ticker-paid-message-item-renderer"
                v-if="message.raw.giftName == undefined">{{
                  message.text
                }}</span>
            </div>
          </div>
        </yt-live-chat-ticker-paid-message-item-renderer>
      </transition-group>
    </div>
    <template v-if="pinnedMessage">
      <membership-item :key="pinnedMessage.id + '_MEMBER'" v-if="pinnedMessage.type === MESSAGE_TYPE_MEMBER"
        class="style-scope yt-live-chat-ticker-renderer" :avatarUrl="pinnedMessage.avatarUrl"
        :authorName="getShowAuthorName(pinnedMessage)" :privilegeType="pinnedMessage.privilegeType"
        :title="pinnedMessage.title" :time="pinnedMessage.time"></membership-item>
      <paid-message :key="pinnedMessage.id" v-else class="style-scope yt-live-chat-ticker-renderer"
        :price="pinnedMessage.price" :avatarUrl="pinnedMessage.avatarUrl" :authorName="getShowAuthorName(pinnedMessage)"
        :time="pinnedMessage.time" :content="pinnedMessageShowContent"></paid-message>
    </template>
  </yt-live-chat-ticker-renderer>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { getGiftShowContent, getShowContent, getShowAuthorName, MESSAGE_TYPE_GIFT, MESSAGE_TYPE_MEMBER, MESSAGE_TYPE_SUPER_CHAT, getPriceConfig, Message } from './constants'
import { formatCurrency } from '../../utils';

const props = defineProps<{
  showGiftName?: boolean
}>()

const messages = defineModel<Message[]>(
  'messages',
  {
    required: true,
    default: () => []
  }
)

const curTime = ref<number>(new Date().getTime())
const updateTimerId = window.setInterval(updateProgress, 1000)
const pinnedMessage = ref<Message>()

const showMessages = computed(() => {
  let res = []
  for (let message of messages.value) {
    if (!needToShow(message)) {
      continue
    }
    res.push({
      raw: message,
      bgColor: getBgColor(message),
      formatBgColor: getFormatBgColor(message),
      color: getColor(message),
      text: getText(message)
    })
  }
  return res
})

const pinnedMessageShowContent = computed(() => {
  if (!pinnedMessage.value) {
    return ''
  }
  if (pinnedMessage.value.type === MESSAGE_TYPE_GIFT) {
    return getGiftShowContent(pinnedMessage.value, props.showGiftName)
  } else {
    return getShowContent(pinnedMessage.value)
  }
})

function updateProgress() {
  // 更新进度
  curTime.value = new Date().getTime()

  // 删除过期的消息
  let filteredMessages = []
  let messagesChanged = false
  for (let message of messages.value) {
    let pinTime = getPinTime(message)
    if ((curTime.value - message.addTime) / (60 * 1000) >= pinTime) {
      messagesChanged = true
      if (pinnedMessage.value === message) {
        pinnedMessage.value = null
      }
      continue
    }
    filteredMessages.push(message)
  }
  if (messagesChanged) {
    messages.value = filteredMessages
  }
}

onBeforeUnmount(() => {
  window.clearInterval(updateTimerId)
})

async function onTickerItemEnter(_el: Element, done: () => void) {
  const el = _el as HTMLElement
  let width = el.clientWidth
  if (width === 0) {
    // CSS指定了不显示固定栏
    done()
    return
  }
  el.style.width = '0'
  await nextTick()
  el.style.width = `${width}px`
  window.setTimeout(done, 200)
}

function onTickerItemLeave(_el: Element, done: () => void) {
  const el = _el as HTMLElement
  el.classList.add('sliding-down')
  window.setTimeout(() => {
    el.classList.add('collapsing')
    el.style.width = '0'
    window.setTimeout(() => {
      el.classList.remove('sliding-down')
      el.classList.remove('collapsing')
      el.style.width = 'auto'
      done()
    }, 200)
  }, 200)
}

function needToShow(message: Message) {
  let pinTime = getPinTime(message)
  // pinTime 对应的是 min，而 new Date() 对应的是 ms
  return (new Date().getTime() - message.addTime) / (60 * 1000) < pinTime
}

function getBgColor(message: Message) {
  let color1, color2
  if (message.type === MESSAGE_TYPE_MEMBER) {
    color1 = 'rgba(15,157,88,1)'
    color2 = 'rgba(11,128,67,1)'
  } else {
    let config = getPriceConfig(message.price)
    color1 = config.colors.contentBg
    color2 = config.colors.headerBg
  }

  return { primaryColor: color1, secondaryColor: color2 }
}

function getFormatBgColor(message: Message) {
  let color = getBgColor(message)

  let pinTime = getPinTime(message)
  let progress = (1 - ((curTime.value - message.addTime) / (60 * 1000) / pinTime)) * 100
  if (progress < 0) {
    progress = 0
  } else if (progress > 100) {
    progress = 100
  }
  return `linear-gradient(90deg, var(--yt-live-chat-ticker-item-primary-color ,${color.primaryColor}), \
          var(--yt-live-chat-ticker-item-primary-color ,${color.primaryColor}) ${progress}%, \
          var(--yt-live-chat-ticker-item-secondary-color ,${color.secondaryColor}) ${progress}%, \
          var(--yt-live-chat-ticker-item-secondary-color ,${color.secondaryColor}))`
}

function getColor(message: Message) {
  if (message.type === MESSAGE_TYPE_MEMBER) {
    return 'rgb(255,255,255)'
  }
  return getPriceConfig(message.price).colors.header
}

function getText(message: Message) {
  if (message.type === MESSAGE_TYPE_MEMBER) {
    // 方便用户 CSS 自定义
    return ''
    // return this.$t('chat.tickerMembership')
  }
  return `CN¥${formatCurrency(message.price)}`
}

function getPinTime(message: Message) {
  if (message.type === MESSAGE_TYPE_MEMBER) {
    if (message.privilegeType === 3) {
      return 5
    } else if (message.privilegeType === 2) {
      return 15
    } else if (message.privilegeType === 1) {
      return 30
    }
  }
  // 价格小于最小置顶常驻礼物价格时, 不显示

  return getPriceConfig(message.price).pinTime
}

function onItemClick(message: Message) {
  if (pinnedMessage.value === message) {
    pinnedMessage.value = null
  } else {
    pinnedMessage.value = message
  }
}
</script>

<style src="../../assets/css/youtube/yt-live-chat-ticker-renderer.css"></style>
<style src="../../assets/css/youtube/yt-live-chat-ticker-paid-message-item-renderer.css"></style>