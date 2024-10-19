<template>
  <yt-live-chat-renderer class="style-scope yt-live-chat-app" style="--scrollbar-width:11px;" hide-timestamps
    @mousemove="refreshCantScrollStartTime" :danmaku-at-bottom="danmakuAtBottom?true:undefined" :ticker-at-buttom="tickerAtButtom?true:undefined">
    <ticker class="style-scope yt-live-chat-renderer" :messages="paidMessages" :showGiftInfo="showGiftInfo?true:undefined"></ticker>
    <yt-live-chat-item-list-renderer class="style-scope yt-live-chat-renderer" allow-scroll>
      <div ref="scrollerRef" id="item-scroller" class="style-scope yt-live-chat-item-list-renderer animated"
        @scroll="onScroll">
        <div ref="itemOffsetRef" id="item-offset" class="style-scope yt-live-chat-item-list-renderer"
          :style="`${(randomXOffset || randomYOffset) ? 'overflow: visible;' : 'overflow: hidden; position: relative;'}`">
          <div ref="itemsRef" id="items" class="style-scope yt-live-chat-item-list-renderer" style="" :style="{
            transform: `translateY(${Math.floor(scrollPixelsRemaining)}px)`,
            overflow: `${(randomXOffset || randomYOffset) ? 'visible !important' : 'hidden !important'}`
          }">
            <transition-group tag="div" :css="false" @leave="onMessageLeave" id="chat-items"
              class="style-scope yt-live-chat-item-list-renderer">
              <template v-for="message in messages">
                <interact-message :key="message.id" v-if="message.type === MESSAGE_TYPE_INTERACT"
                  class="style-scope yt-live-chat-item-list-renderer" :style="`--x-offset:${message.xOffset}px;
                    --y-offset:${message.yOffset}px;
                    --float-distance-x: ${message.floatDistanceX}px;
                    --float-distance-y: ${message.floatDistanceY}px;
                    --float-time: ${getFloatTime}s;`
                    " :randomXOffset="randomXOffset||undefined" :randomYOffset="randomYOffset||undefined"
                  :time="message.time" :time-format="message.timeFormat"
                  :avatarUrl="message.avatarUrl" :authorName="message.authorName" :medalName="message.medalName"
                  :medalLevel="message.medalLevel" :isFanGroup="message.isFanGroup||undefined"
                  :privilegeType="message.privilegeType" :msgType="message.msgType"
                  :isDelete="message.isDelete||undefined"></interact-message>
                <text-message :key="message.id + '_TEXT'" v-else-if="message.type === MESSAGE_TYPE_TEXT"
                  class="style-scope yt-live-chat-item-list-renderer" :style="`--x-offset:${message.xOffset}px;
                    --y-offset:${message.yOffset}px;
                    --float-distance-x: ${message.floatDistanceX}px;
                    --float-distance-y: ${message.floatDistanceY}px;
                    --float-time: ${getFloatTime}s;`
                    " :mergeSameUserDanmaku="mergeSameUserDanmaku" :textColor="message.textColor"
                  :randomXOffset="randomXOffset||undefined" :randomYOffset="randomYOffset||undefined"
                  :time="message.time" :time-format="message.timeFormat"
                  :avatarUrl="message.avatarUrl" :authorName="message.authorName" :authorType="message.authorType"
                  :privilegeType="message.privilegeType" :repeated="message.repeated"
                  :repeatedThread="message.repeatedThread" :threadLength="message.threadLength"
                  :medalName="message.medalName" :medalLevel="message.medalLevel" :isFanGroup="message.isFanGroup||undefined"
                  :isDelete="message.isDelete||undefined" :richContents="getShowRichContentThread(message)"></text-message>
                <paid-message :key="message.id + '_GIFT'" v-else-if="message.type === MESSAGE_TYPE_GIFT"
                  class="style-scope yt-live-chat-item-list-renderer" :style="`--x-offset:${message.xOffset}px;
                    --y-offset:${message.yOffset}px;
                    --float-distance-x: ${message.floatDistanceX}px;
                    --float-distance-y: ${message.floatDistanceY}px;
                    --float-time: ${getFloatTime}s;`
                    " :randomXOffset="randomXOffset||undefined" :randomYOffset="randomYOffset||undefined"
                  :time="message.time" :time-format="message.timeFormat"
                  :avatarUrl="message.avatarUrl" :authorName="getShowAuthorName(message)" :price="message.price"
                  :content="getGiftShowContentLocal(message)" :giftName="message.giftName"
                  :isDelete="message.isDelete||undefined"></paid-message>
                <membership-item :key="message.id + '_MEMBER'" v-else-if="message.type === MESSAGE_TYPE_MEMBER"
                  class="style-scope yt-live-chat-item-list-renderer" :style="`--x-offset:${message.xOffset}px;
                    --y-offset:${message.yOffset}px;
                    --float-distance-x: ${message.floatDistanceX}px;
                    --float-distance-y: ${message.floatDistanceY}px;
                    --float-time: ${getFloatTime}s;`
                    " :randomXOffset="randomXOffset||undefined" :randomYOffset="randomYOffset||undefined"
                  :time="message.time" :time-format="message.timeFormat"
                  :avatarUrl="message.avatarUrl" :authorName="getShowAuthorName(message)" :price="message.price"
                  :guardNum="message.guardNum" :guardUnit="message.guardUnit" :privilegeType="message.privilegeType"
                  :title="message.title" :isDelete="message.isDelete||undefined"></membership-item>
                <paid-message :key="message.id + '_SC'" v-else-if="message.type === MESSAGE_TYPE_SUPER_CHAT"
                  class="style-scope yt-live-chat-item-list-renderer" giftName="superchat" :style="`--x-offset:${message.xOffset}px;
                    --y-offset:${message.yOffset}px;
                    --float-distance-x: ${message.floatDistanceX}px;
                    --float-distance-y: ${message.floatDistanceY}px;
                    --float-time: ${getFloatTime}s;`
                    " :randomXOffset="randomXOffset||undefined" :randomYOffset="randomYOffset||undefined"
                  :time="message.time" :time-format="message.timeFormat"
                  :avatarUrl="message.avatarUrl" :authorName="getShowAuthorName(message)" :price="message.price"
                  :content="getShowContent(message)" :isDelete="message.isDelete||undefined"></paid-message>
              </template>
            </transition-group>
          </div>
        </div>
      </div>
    </yt-live-chat-item-list-renderer>
  </yt-live-chat-renderer>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import * as chatConfig from '../../api/chatConfig'
import {
  getGiftShowContent, getShowContent, getShowRichContentThread, getShowAuthorName,
  Message, MESSAGE_TYPE_GIFT, MESSAGE_TYPE_INTERACT, MESSAGE_TYPE_MEMBER, MESSAGE_TYPE_SUPER_CHAT, MESSAGE_TYPE_TEXT, 
  MESSAGE_TYPE_DEL,
  MESSAGE_TYPE_UPDATE} from './constants';

// 只有要添加的消息需要平滑
const NEED_SMOOTH_MESSAGE_TYPES = [
  MESSAGE_TYPE_INTERACT,
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_GIFT,
  MESSAGE_TYPE_MEMBER,
  MESSAGE_TYPE_SUPER_CHAT
]
// 发送消息时间间隔范围
const MESSAGE_MIN_INTERVAL = 80
const MESSAGE_MAX_INTERVAL = 1000

// 每次发送消息后增加的动画时间，要比MESSAGE_MIN_INTERVAL稍微大一点，太小了动画不连续，太大了发送消息时会中断动画
// 84 = ceil((1000 / 60) * 5)
const CHAT_SMOOTH_ANIMATION_TIME_MS = 86
// 滚动条距离底部小于多少像素则认为在底部
const SCROLLED_TO_BOTTOM_EPSILON = 15

const props = defineProps({
  customCss: {
    type: String,
    default: chatConfig.DEFAULT_CONFIG.customCss
  },
  showGiftInfo: {
    type: Boolean,
    default: chatConfig.DEFAULT_CONFIG.showGiftInfo
  },
  danmakuAtBottom: {
    type: Boolean,
    default: chatConfig.DEFAULT_CONFIG.danmakuAtBottom
  },
  tickerAtButtom: {
    type: Boolean,
    default: chatConfig.DEFAULT_CONFIG.tickerAtButtom
  },
  randomXOffset: {
    type: Boolean,
    default: chatConfig.DEFAULT_CONFIG.randomXOffset
  },
  randomYOffset: {
    type: Boolean,
    default: chatConfig.DEFAULT_CONFIG.randomYOffset
  },
  floatTime: {
    type: Number,
    default: chatConfig.DEFAULT_CONFIG.floatTime
  },
  mergeSameUserDanmaku: {
    type: Boolean,
    default: chatConfig.DEFAULT_CONFIG.mergeSameUserDanmaku
  },
  mergeSameUserDanmakuInterval: {
    type: Number,
    default: chatConfig.DEFAULT_CONFIG.mergeSameUserDanmakuInterval
  },
  minGiftPrice: {
    type: Number,
    default: chatConfig.DEFAULT_CONFIG.minGiftPrice
  },
  minTickerPrice: {
    type: Number,
    default: chatConfig.DEFAULT_CONFIG.minTickerPrice
  },
  maxNumber: {
    type: Number,
    default: chatConfig.DEFAULT_CONFIG.maxNumber
  },
  pinTime: {
    type: Number,
    default: chatConfig.DEFAULT_CONFIG.pinTime
  },
  fadeOutNum: {
    type: Number,
    default: chatConfig.DEFAULT_CONFIG.fadeOutNum
  }
})

const messages = ref<Message[]>([]) // 显示的消息
const paidMessages = ref<Message[]>([]) // 固定在上方的消息

const smoothedMessageQueue = ref<Message[][]>([]) // 平滑消息队列，由外部调用addMessages等方法添加
const emitSmoothedMessageTimerId = ref<number>() // 消费平滑消息队列的定时器ID
const enqueueIntervals = ref<number[]>([]) // 最近进队列的时间间隔，用来估计下次进队列的时间
const lastEnqueueTime = ref<number>() // 上次进队列的时间
const estimatedEnqueueInterval = ref<number>() // 估计的下次进队列时间间隔

const messagesBuffer = ref<Message[]>([]) // 暂时未显示的消息，当不能自动滚动时会积压在这
const preinsertHeight = ref(0) // 插入新消息之前items的高度
const isSmoothed = ref(true) // 是否平滑滚动，当消息太快时不平滑滚动
const chatRateMs = ref(1000) // 用来计算消息速度
const scrollPixelsRemaining = ref(0) // 平滑滚动剩余像素
const scrollTimeRemainingMs = ref(0) // 平滑滚动剩余时间
const lastSmoothChatMessageAddMs = ref<DOMHighResTimeStamp>() // 上次showNewMessages时间
const smoothScrollRafHandle = ref<number>() // 平滑滚动requestAnimationFrame句柄
const lastSmoothScrollUpdate = ref<number>() // 平滑滚动上一帧时间

const onLeave = ref(false) // 判断消息是否正在出列，保证出列动画执行时无入列
const atBottom = ref(true) // 滚动到底部，用来判断能否自动滚动
const cantScrollStartTime = ref<number>() // 开始不能自动滚动的时间，用来防止卡住

const updateTimerId = window.setInterval(updateProgress, 1000)

// refs
const itemOffsetRef = useTemplateRef<HTMLDivElement | null>('itemOffsetRef')
const itemsRef = useTemplateRef<HTMLDivElement | null>('itemsRef')
const scrollerRef = useTemplateRef<HTMLDivElement | null>('scrollerRef')

// computed
const canScrollToBottom = computed(() => atBottom.value)
const getFloatTime = computed(() => props.floatTime!)

// watch
watch(canScrollToBottom, (value) => {
  cantScrollStartTime.value = value ? undefined : new Date().getTime()
})

watch(() => props.customCss, () => setCustomCss())

onMounted(() => {
  scrollToBottom()
})

onBeforeUnmount(() => {
  if (emitSmoothedMessageTimerId.value) {
    window.clearTimeout(emitSmoothedMessageTimerId.value)
    emitSmoothedMessageTimerId.value = undefined
  }
  window.clearInterval(updateTimerId)
  clearMessages()
})

defineExpose({
  addMessage,
  delMessages,
  updateMessage,
  mergeSameUserText,
  mergeSimilarText,
  mergeSimilarGift,
  showNewMessages,
  calculateHeight,
  nextTick,
})

function updateProgress() {
  if (props.pinTime == 0) {
    return
  }

  const curTime = new Date()
  for (let i = 0; i < messages.value.length;) {
    let message = messages.value[i]
    if ((curTime.getTime() - message.addTime) / 1000 >= props.pinTime!) {
      // console.log('删除消息')
      messages.value.splice(i, 1)
    } else {
      i++
    }
  }
}

async function onMessageLeave(el: Element, done: () => void) {
  let time_interval = estimatedEnqueueInterval.value
  let curTime = new Date().getTime()

  // console.log(curTime - lastEnqueueTime)
  // console.log(time_interval)
  el.classList.add('leaving')
  if (time_interval! < 1650 && curTime - lastEnqueueTime.value! < 2000) {
    // console.log('消息过快，省略动画')
    done()
    await nextTick()

    if (itemOffsetRef.value && itemsRef.value && itemsRef.value.clientHeight > 0)
      itemOffsetRef.value.style.height = `${itemsRef.value.clientHeight}px`
    return
  }
  onLeave.value = true

  // 等 100ms 后执行
  window.setTimeout(() => {
    el.classList.add('collapsing')
    done()
    if (itemOffsetRef.value && itemsRef.value && itemsRef.value.clientHeight > 0){
      itemOffsetRef.value.classList.add('collapsing')
      itemOffsetRef.value.style.height = `${itemsRef.value.clientHeight}px`
    }
    window.setTimeout(() => {
      if (itemOffsetRef.value)
        itemOffsetRef.value.classList.remove('collapsing')
      el.classList.remove('leaving')
      el.classList.remove('collapsing')
      onLeave.value = false
    }, 200)
  }, 100)
}

function getGiftShowContentLocal(message: Message) {
  return getGiftShowContent(message, props.showGiftInfo)
}

function addMessage(message: Message) {
  addMessages([message])
}
function addMessages(messages: Message[]) {
  enqueueMessages(messages)
}

function mergeSimilarText(content: string) {
  content = content.trim().toLowerCase()
  let res = false
  // console.log(`判断: ${content} 是否重复`)
  forEachRecentMessage(5, (message: Message) => {
    if (message.type !== MESSAGE_TYPE_TEXT) {
      return true
    }
    let index = 0
    for (let innerContent of message.contents) {
      // console.log(`判断index:${index}: ${innerContent}`)
      
      let messageContent = innerContent.trim().toLowerCase()
      let longer, shorter
      if (messageContent.length > content.length) {
        longer = messageContent
        shorter = content
      } else {
        longer = content
        shorter = messageContent
      }
      if (longer.indexOf(shorter) !== -1 // 长的包含短的
          && longer.length - shorter.length < shorter.length // 长度差较小
      ) {
        // 其实有小概率导致弹幕卡住
        
        message.repeatedThread[index]++
        message.repeated++

        // console.log(`匹配到重复子串`)
        res = true
        return false
      }
      index++
    }
    return true
  })
  return res
}

function mergeSameUserText(newContent: string, newRichContent: string, authorName: string, time: number) {
  let res = false
  // 遍历最新消息，看是不是同一个用户发送的
  forEachRecentMessage(1, (message: Message) => {
    if (message.type !== MESSAGE_TYPE_TEXT || message.authorName !== authorName) {
      return true
    } else {
      // 如果新消息的时间间隔上一条消息超过 mergeSameUserDanmakuInterval 秒，则不合并
      if (new Date(time * 1000).getTime() - message.time > props.mergeSameUserDanmakuInterval! * 1000) {
        return true
      }
      // FIXME: 翻译bug
      // 塞入最新消息的 newContent, newRichContent
      // console.log(`newContent: ${newContent}`)
      message.contents.push(newContent)
      message.richContents.push(newRichContent)
      message.repeatedThread.push(1)

      message.threadLength++
      res = true
      return false
    }
  })
  
  return res
}

function mergeSimilarGift(authorName: string, price: number, giftName: string, num: number) {
  let res = false
  forEachRecentMessage(5, (message: Message) => {
    if (message.type === MESSAGE_TYPE_GIFT
        && message.authorName === authorName
        && message.giftName === giftName
    ) {
      message.price += price
      message.num += num
      res = true
      return false
    }
    return true
  })
  return res
}

function forEachRecentMessage(num: number, callback: (message: Message) => boolean | void) {
  // 从新到老遍历num条消息
  for (let i = smoothedMessageQueue.value.length - 1; i >= 0 && num > 0; i--) {
    let messageGroup = smoothedMessageQueue.value[i]
    for (let j = messageGroup.length - 1; j >= 0 && num-- > 0; j--) {
      if (!callback(messageGroup[j])) {
        return
      }
    }
  }
  for (let arr of [messagesBuffer.value, messages.value]) {
    for (let i = arr.length - 1; i >= 0 && num-- > 0; i--) {
      if (!callback(arr[i])) {
        return
      }
    }
  }
}

function delMessage(id: string) {
  delMessages([id])
}
function delMessages(ids: string[]) {
  enqueueMessages(ids.map(
    id => ({
      type: MESSAGE_TYPE_DEL,
      id
    })
  ))
}

function clearMessages() {
  messages.value = []
  paidMessages.value = []
  smoothedMessageQueue.value = []
  messagesBuffer.value = []
  isSmoothed.value = true
  lastSmoothChatMessageAddMs.value = undefined
  chatRateMs.value = 1000
  lastSmoothScrollUpdate.value = undefined
  scrollTimeRemainingMs.value = scrollPixelsRemaining.value = 0
  smoothScrollRafHandle.value = undefined
  preinsertHeight.value = 0
  maybeResizeScrollContainer()
  if (!atBottom.value) {
    scrollToBottom()
  }
}

function updateMessage(id: string, newValuesObj: any) {
  enqueueMessages([{
    type: MESSAGE_TYPE_UPDATE,
    id,
    newValuesObj
  }])
}

function enqueueMessages(messages: Message[]) {
  // 估计进队列时间间隔
  if (lastEnqueueTime.value === undefined) {
    lastEnqueueTime.value = new Date().getTime()
  } else {
    let curTime = new Date().getTime()
    let interval = curTime - lastEnqueueTime.value
    // 真实的进队列时间间隔模式大概是这样：2500, 300, 300, 300, 2500, 300, ...
    // B站消息有缓冲，会一次发多条消息。这里把波峰视为发送了一次真实的WS消息，所以要过滤掉间隔太小的
    if (interval > 1000 || enqueueIntervals.value.length < 5) {
      enqueueIntervals.value.push(interval)
      if (enqueueIntervals.value.length > 5) {
        enqueueIntervals.value.splice(0, enqueueIntervals.value.length - 5)
      }
      // 这边估计得尽量大，只要不太早把消息缓冲发完就是平滑的。有MESSAGE_MAX_INTERVAL保底，不会让消息延迟太大
      // 其实可以用单调队列求最大值，偷懒不写了
      estimatedEnqueueInterval.value = Math.max(...enqueueIntervals.value)
    }
    // 上次入队时间还是要设置，否则会太早把消息缓冲发完，然后较长时间没有新消息
    lastEnqueueTime.value = curTime
  }

  // 把messages分成messageGroup，每个组里最多有1个需要平滑的消息
  let messageGroup = []
  for (let message of messages) {
    messageGroup.push(message)
    if (messageNeedSmooth(message)) {
      smoothedMessageQueue.value.push(messageGroup)
      messageGroup = []
    }
  }
  // 还剩下不需要平滑的消息
  if (messageGroup.length > 0) {
    if (smoothedMessageQueue.value.length > 0) {
      // 和上一组合并
      let lastMessageGroup = smoothedMessageQueue.value[smoothedMessageQueue.value.length - 1]
      for (let message of messageGroup) {
        lastMessageGroup.push(message)
      }
    } else {
      // 自己一个组
      smoothedMessageQueue.value.push(messageGroup)
    }
  }

  if (emitSmoothedMessageTimerId.value === undefined) {
    emitSmoothedMessageTimerId.value = window.setTimeout(emitSmoothedMessages)
  }
}

function messageNeedSmooth({ type }: { type: number }) {
  return NEED_SMOOTH_MESSAGE_TYPES.indexOf(type) !== -1
}

function emitSmoothedMessages() {
  emitSmoothedMessageTimerId.value = undefined
  if (smoothedMessageQueue.value.length <= 0) {
    return
  }

  // 估计的下次进队列剩余时间
  let estimatedNextEnqueueRemainTime = 10 * 1000
  if (estimatedEnqueueInterval.value) {
    estimatedNextEnqueueRemainTime = Math.max(lastEnqueueTime.value! - new Date().getTime() + estimatedEnqueueInterval.value, 1)
  }
  // 计算发送的消息数，保证在下次进队列之前发完
  // 下次进队列之前应该发多少条消息
  let shouldEmitGroupNum = Math.max(smoothedMessageQueue.value.length, 0)
  // 下次进队列之前最多能发多少次
  let maxCanEmitCount = estimatedNextEnqueueRemainTime / MESSAGE_MIN_INTERVAL
  // 这次发多少条消息
  let groupNumToEmit
  if (shouldEmitGroupNum < maxCanEmitCount) {
    // 队列中消息数很少，每次发1条也能发完
    groupNumToEmit = 1
  } else {
    // 每次发1条以上，保证按最快速度能发完
    groupNumToEmit = Math.ceil(shouldEmitGroupNum / maxCanEmitCount)
  }

  // 发消息
  let messageGroups = smoothedMessageQueue.value.splice(0, groupNumToEmit)
  let mergedGroup = []
  for (let messageGroup of messageGroups) {
    for (let message of messageGroup) {
      mergedGroup.push(message)
    }
  }
  handleMessageGroup(mergedGroup)

  if (smoothedMessageQueue.value.length <= 0) {
    return
  }
  // 消息没发完，计算下次发消息时间
  let sleepTime
  if (groupNumToEmit === 1) {
    // 队列中消息数很少，随便定个[MESSAGE_MIN_INTERVAL, MESSAGE_MAX_INTERVAL]的时间
    sleepTime = estimatedNextEnqueueRemainTime / smoothedMessageQueue.value.length
    sleepTime *= 0.5 + Math.random()
    if (sleepTime > MESSAGE_MAX_INTERVAL) {
      sleepTime = MESSAGE_MAX_INTERVAL
    } else if (sleepTime < MESSAGE_MIN_INTERVAL) {
      sleepTime = MESSAGE_MIN_INTERVAL
    }
  } else {
    // 按最快速度发
    sleepTime = MESSAGE_MIN_INTERVAL
  }
  emitSmoothedMessageTimerId.value = window.setTimeout(emitSmoothedMessages, sleepTime)
}

function handleMessageGroup(messageGroup: Message[]) {
  if (messageGroup.length <= 0) {
    return
  }

  for (let message of messageGroup) {
    switch (message.type) {
    case MESSAGE_TYPE_INTERACT:
    case MESSAGE_TYPE_TEXT:
    case MESSAGE_TYPE_GIFT:
    case MESSAGE_TYPE_MEMBER:
    case MESSAGE_TYPE_SUPER_CHAT:
      handleAddMessage(message)
      break
    case MESSAGE_TYPE_DEL:
      handleDelMessage(message)
      break
    case MESSAGE_TYPE_UPDATE:
      handleUpdateMessage(message)
      break
    }
  }

  maybeResizeScrollContainer()
  flushMessagesBuffer()
  nextTick(maybeScrollToBottom)
}
//* 处理新信息的消息入栈
function handleAddMessage(message: Message) {
  message = {
    ...message,
    addTime: new Date().getTime() // 添加一个本地时间给Ticker用，防止本地时间和服务器时间相差很大的情况
  }
  //* 判断是否要加入到弹幕队列，如果是打赏但价格低于最低打赏价格则不加入
  if (message.price == undefined || message.price >= props.minGiftPrice!) {
    messagesBuffer.value.push(message)
  }

  //* 判断礼物和醒目留言(sc)是否要加入到顶部固定贴纸，如果小于最低ticker价格就不加入
  if (message.price != undefined && message.price >= props.minTickerPrice!) {
    // unshift() push message 到 front
    paidMessages.value.unshift(message)
    const MAX_PAID_MESSAGE_NUM = 100
    if (paidMessages.value.length > MAX_PAID_MESSAGE_NUM) {
      paidMessages.value.splice(MAX_PAID_MESSAGE_NUM, paidMessages.value.length - MAX_PAID_MESSAGE_NUM)
    }
  }
}

function handleDelMessage({ id }: { id: string }) {
  for (let arr of [messages.value, paidMessages.value, messagesBuffer.value]) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        arr.splice(i, 1)
        resetSmoothScroll()
        break
      }
    }
  }
}

function handleUpdateMessage({ id, newValuesObj }: { id: string, newValuesObj: any }) {
  // 遍历滚动的消息
  forEachRecentMessage(999999999, message => {
    if (message.id !== id) {
      return true
    }
    for (let name in newValuesObj) {
      message[name] = newValuesObj[name]
    }
    return false
  })
  // 遍历固定的消息
  for (let message of paidMessages.value) {
    if (message.id !== id) {
      continue
    }
    for (let name in newValuesObj) {
      message[name] = newValuesObj[name]
    }
    break
  }
  resetSmoothScroll()
}

async function flushMessagesBuffer() {
  if (messagesBuffer.value.length <= 0) {
    return
  }
  if (onLeave.value) {
    // console.log('删除动画进行中')
    return
  }

  if (!canScrollToBottomOrTimedOut()) {
    if (messagesBuffer.value.length > props.maxNumber!) {
      // 未显示消息数 > 最大可显示数，丢弃
      messagesBuffer.value.splice(0, messagesBuffer.value.length - props.maxNumber!)
    }
    return
  }
  
  // 当buffer和现存队列中的消息总数超过maxNumber（最大弹幕数的时候），给旧弹幕加上delete属性，让CSS做消失动画
  let deleteNum = Math.max(messages.value.length + messagesBuffer.value.length - props.maxNumber!, 0)
  if (deleteNum > 0 && props.fadeOutNum! > 0) {
    for (let i = 0; i < messages.value.length; i++) {
      if (i < deleteNum) {
        messages.value[i].isDelete = true
      }
    }
    await nextTick()
  }

  //* 留[fadeOutNum]条弹幕做delete动画（默认为5）
  let removeNum = Math.max(messages.value.length + messagesBuffer.value.length - props.maxNumber! - props.fadeOutNum!, 0)
  if (removeNum > 0) {
    messages.value.splice(0, removeNum)
    // 防止同时添加和删除项目时所有的项目重新渲染 https://github.com/vuejs/vue/issues/6857
    await nextTick()
  }

  calculateHeight()
  
  for (let message of messagesBuffer.value) {
    messages.value.push(message)
  }
  messagesBuffer.value = []
  // 等items高度变化
  await nextTick()
  
  showNewMessages()
}

function calculateHeight() {
  preinsertHeight.value = itemsRef.value?.clientHeight ?? 0
}

function showNewMessages() {
  if (props.randomXOffset || props.randomYOffset) {
    return
  }
  let hasScrollBar = itemsRef.value!.clientHeight > scrollerRef.value!.clientHeight
  
  if (itemOffsetRef.value && itemsRef.value && itemsRef.value.clientHeight > 0)
    itemOffsetRef.value.style.height = `${itemsRef.value.clientHeight}px`
  // console.log(`itemOffset.height = ${itemOffsetRef.value!.style.height}`)
  if (!canScrollToBottomOrTimedOut() || !hasScrollBar) {
    return
  }

  // 计算剩余像素
  scrollPixelsRemaining.value += itemsRef.value!.clientHeight - preinsertHeight.value
  
  scrollToBottom()
  

  // 计算是否平滑滚动、剩余时间
  if (lastSmoothChatMessageAddMs.value === undefined) {
    lastSmoothChatMessageAddMs.value = performance.now()
  }
  let interval = performance.now() - lastSmoothChatMessageAddMs.value
  chatRateMs.value = (0.9 * chatRateMs.value) + (0.1 * interval)
  if (isSmoothed.value) {
    if (chatRateMs.value < 400) {
      isSmoothed.value = false
    }
  } else {
    if (chatRateMs.value > 450) {
      isSmoothed.value = true
    }
  }
  scrollTimeRemainingMs.value += isSmoothed.value ? CHAT_SMOOTH_ANIMATION_TIME_MS : 0

  if (smoothScrollRafHandle.value === undefined) {
    smoothScrollRafHandle.value = window.requestAnimationFrame(smoothScroll)
  }
  lastSmoothChatMessageAddMs.value = performance.now()

}

function smoothScroll(time: number) {
  if (lastSmoothScrollUpdate.value === undefined) {
    // 第一帧
    lastSmoothScrollUpdate.value = time
    smoothScrollRafHandle.value = window.requestAnimationFrame(smoothScroll)
    return
  }

  let interval = time - lastSmoothScrollUpdate.value
  if (
    scrollPixelsRemaining.value <= 0 || scrollPixelsRemaining.value >= 400  // 已经滚动到底部或者离底部太远则结束
    || interval >= 1000 // 离上一帧时间太久，可能用户切换到其他网页
    || scrollTimeRemainingMs.value <= 0 // 时间已结束
  ) {
    resetSmoothScroll()
    return
  }

  let pixelsToScroll = interval / scrollTimeRemainingMs.value * scrollPixelsRemaining.value
  scrollPixelsRemaining.value -= pixelsToScroll
  if (scrollPixelsRemaining.value < 0) {
    scrollPixelsRemaining.value = 0
  }
  scrollTimeRemainingMs.value -= interval
  if (scrollTimeRemainingMs.value < 0) {
    scrollTimeRemainingMs.value = 0
  }
  lastSmoothScrollUpdate.value = time
  smoothScrollRafHandle.value = window.requestAnimationFrame(smoothScroll)
}
function resetSmoothScroll() {
  scrollTimeRemainingMs.value = scrollPixelsRemaining.value = 0
  lastSmoothScrollUpdate.value = undefined
  if (smoothScrollRafHandle.value) {
    window.cancelAnimationFrame(smoothScrollRafHandle.value)
    smoothScrollRafHandle.value = undefined
  }
}
function maybeResizeScrollContainer() {
  if (itemOffsetRef.value && itemsRef.value && itemsRef.value.clientHeight > 0)
    itemOffsetRef.value.style.height = `${itemsRef.value.clientHeight}px`
  maybeScrollToBottom()
}
function maybeScrollToBottom() {
  if (canScrollToBottomOrTimedOut()) {
    scrollToBottom()
  }
}
function scrollToBottom() {
  scrollerRef.value!.scrollTop = Math.pow(2, 24)
  atBottom.value = true
}
function onScroll() {
  refreshCantScrollStartTime()
  let scroller = scrollerRef.value
  if(scroller) atBottom.value = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < SCROLLED_TO_BOTTOM_EPSILON
  flushMessagesBuffer()
}
function canScrollToBottomOrTimedOut() {
  if (canScrollToBottom.value) {
    return true
  }
  // 防止在OBS中卡住，超过一定时间也可以自动滚动
  return new Date().getTime() - cantScrollStartTime.value! >= 5 * 1000
}
function refreshCantScrollStartTime() {
  // 有鼠标事件时刷新，防止用户看弹幕时自动滚动
  if (cantScrollStartTime.value) {
    cantScrollStartTime.value = new Date().getTime()
  }
}
function setCustomCss() {
  // check if custom css already exists
  let customCssElement = document.querySelector('#custom-css') as HTMLLinkElement
  if (customCssElement) {
    customCssElement.href = props.customCss || ''
    if (props.customCss === '') {
      customCssElement.remove()
    }
  } else {
    // create custom css, add to yt-live-chat-renderer
    let link = document.createElement('link')
    link.id = 'custom-css'
    link.rel = 'stylesheet'
    link.href = props.customCss || ''
    document.head.appendChild(link)
  }
}
</script>

<style src="../../assets/css/youtube/yt-html.css"></style>
<style src="../../assets/css/youtube/yt-live-chat-renderer.css"></style>
<style src="../../assets/css/youtube/yt-live-chat-item-list-renderer.css"></style>