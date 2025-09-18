<template>
  <chat-renderer ref="rendererRef" :showGiftInfo="config.showGiftInfo" :danmakuAtBottom="config.danmakuAtBottom"
    :tickerAtButtom="config.tickerAtButtom" :randomXOffset="config.randomXOffset" :randomYOffset="config.randomYOffset"
    :floatTime="config.floatTime" :mergeSameUserDanmakuInterval="config.mergeSameUserDanmakuInterval"
    :mergeSameUserDanmaku="config.mergeSameUserDanmaku" :minGiftPrice="config.minGiftPrice"
    :minTickerPrice="config.minTickerPrice" :maxNumber="config.maxNumber" :fadeOutNum="config.fadeOutNum"
    :pinTime="config.pinTime" :customCss="config.customCss">
  </chat-renderer>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, useTemplateRef, provide } from 'vue';
import { mergeConfig, toBool, toInt, toFloat, Config, emoticon } from '../utils'
import { Trie } from '../utils/trie'
import { PronunciationConverter } from '../utils/pronunciation'
import * as chatConfig from '../api/chatConfig'
import { useI18n } from 'vue-i18n'
import ChatClientTest from '../api/chat/ChatClientTest';
import { ChatClientDimSum } from '../api/chat/ChatClientDimSum';
import { CONTENT_TYPE_EMOTICON, CONTENT_TYPE_IMAGE, CONTENT_TYPE_TEXT, IMAGE_SHOW_TYPE_ADD_AFTER, IMAGE_SHOW_TYPE_REPLACE, INTERACT_TYPE_ENTER, INTERACT_TYPE_FOLLOW, INTERACT_TYPE_MUTUAL_FOLLOW, INTERACT_TYPE_SHARE, INTERACT_TYPE_SPECIAL_FOLLOW, Message, MESSAGE_TYPE_GIFT, MESSAGE_TYPE_INTERACT, MESSAGE_TYPE_MEMBER, MESSAGE_TYPE_SUPER_CHAT, MESSAGE_TYPE_TEXT, PRIVILEGE_TYPE_ALL, UID_COLOR_MAP_REGEX } from '../components/ChatRenderer/constants';
import ChatRenderer from '../components/ChatRenderer/index.vue';

const { t, locale } = useI18n();
const i18nLocale = locale;

interface Props {
  isTestRoom: boolean
  strConfig?: Config
}

const {
  isTestRoom = true,
  strConfig = {}
} = defineProps<Props>()

const config = ref<Config>(chatConfig.deepCloneDefaultConfig());
const pronunciationConverter = ref<PronunciationConverter>();
const danmu_pic_json = ref([]);
const textEmoticons = ref<any[]>([]); // 官方的文本表情
const uidColorMap = ref<{[uid: string]: string}>({});

type ChatRendererType = InstanceType<typeof ChatRenderer>
const rendererRef = useTemplateRef<ChatRendererType>('rendererRef')

let chatClient: ChatClientTest | ChatClientDimSum | undefined = undefined;

const blockKeywordsTrie = computed(() => {
  let blockKeywords = config.value.blockKeywords.split('\n');
  let res = new Trie();
  for (let keyword of blockKeywords) {
    if (keyword !== '') {
      res.set(keyword, true);
    }
  }
  return res;
});

const blockUsersTrie = computed(() => {
  let blockUsers = config.value.blockUsers.split('\n')
  let res = new Trie()
  for (let user of blockUsers) {
    if (user !== '') {
      res.set(user, true)
    }
  }
  return res
});

const blockUsersByKeywordsTrie = computed(() => {
  let blockUsersByKeywords = config.value.blockUsersByKeywords.split('\n')
  let res = new Trie()
  for (let user of blockUsersByKeywords) {
    if (user !== '') {
      res.set(user, true)
    }
  }
  return res
});

const emoticonsTrie = computed(() => {
  let res = new Trie()
  let danmu_emoticons: emoticon[] = []

  if (config.value.useLocalEmoticonSetting) {
    // 使用本地json设置
    // console.log("使用本地 json 文件设置表情包")
    danmu_emoticons = danmu_pic_json.value
  } else if (config.value.emoticons) {
    // 使用网页设置
    danmu_emoticons = config.value.emoticons
  }

  for (let emoticon of danmu_emoticons) {
    // 1个个添加 emoticon
    if (emoticon.keyword !== '' && emoticon.align !== '' && emoticon.height !== '' && emoticon.url !== '') {
      res.set(emoticon.keyword, emoticon)
    }
  }
  // TODO: 本地设置的表情包，会覆盖官方的表情包
  // NOTE: 原 blivechat 解析 textEmoticons 的代码
  // for (let emoticon of Object.values(this.textEmoticons)) {
  //   res.set(emoticon.keyword, emoticon)
  // }
  for (let emoticon of textEmoticons.value) {
    // 不覆盖用户自定义的表情包
    if (res.has(emoticon.keyword) === false) {
      let data = {
        keyword: emoticon.keyword,
        align: 'inline',
        height: 64,
        level: 0,
        url: emoticon.url,
        tag: emoticon.tag,
      }
      res.set(emoticon.keyword, data)
    } else {
      const originalData = res.get(emoticon.keyword)
      const newData = {
        keyword: emoticon.keyword,
        align: 'inline',
        height: 64,
        level: 0,
        url: emoticon.url,
        tag: emoticon.tag,
      }
      let newDataArray
      if (originalData.length !== undefined) {
        newDataArray = [
          ...originalData,
          newData,
        ]
      } else {
        newDataArray = [
          originalData,
          newData,
        ]
      }
      res.set(emoticon.keyword, newDataArray)
    }
  }
  return res
});

onMounted(() => {
  if (document.visibilityState === 'visible') {
    init();
    setCustomCss();
  } else {
    document.addEventListener('visibilitychange', onVisibilityChange);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange);
  if (chatClient) {
    chatClient.stop();
  }
});

defineExpose({
  start,
  stop
})

// methods
function setCustomCss() {
  console.log('custom css is')
  console.log(config.value.customCss)
  let customCss: HTMLLinkElement | null = document.querySelector('#custom-css')
  if (customCss) {
    customCss.href = config.value.customCss
    if (config.value.customCss === '') {
      customCss.remove()
    }
  } else {
    // create custom css, add to yt-live-chat-renderer
    let link = document.createElement('link')
    link.id = 'custom-css'
    link.rel = 'stylesheet'
    link.href = config.value.customCss
    document.head.appendChild(link)
  }
}

function onVisibilityChange() {
  if (document.visibilityState !== 'visible') {
    return
  }
  document.removeEventListener('visibilitychange', onVisibilityChange)
  init()
}

function init() {
  initConfig()
  initChatClient()
  initTextEmoticons()
  if (config.value.giftUsernamePronunciation !== '') {
    pronunciationConverter.value = new PronunciationConverter()
    pronunciationConverter.value.loadDict(config.value.giftUsernamePronunciation)
  }

  /*
  // 在页面刷新缓存时, 读取用户emoticons.json, 并建立表情包库
  axios.get('/emoticons.json')
    .then(res => {
      if (res && res.data) {
        this.danmu_pic_json = res.data
      }

    // console.log(this.danmu_pic_json)
    })

  // 提示用户已加载
  this.$message({
    message: 'Loaded',
    duration: 500
  })
    */
}

function initConfig() {
  let locale = strConfig.lang
  if (locale) {
    i18nLocale.value = locale
  }

  //* {} 内留空的使用上次预设值
  let cfg: Config = { ...chatConfig.getLocalConfig() }
  for (let i in strConfig) {
    if (strConfig[i] !== '') {
      cfg[i] = strConfig[i]
    }
  }
  //* 若上次预设值有留空，则使用默认值
  // cfg = mergeConfig(cfg, chatConfig.DEFAULT_CONFIG)
  cfg = mergeConfig(cfg, chatConfig.deepCloneDefaultConfig())

  cfg.customCss = cfg.customCss.toString()

  cfg.minGiftPrice = toFloat(cfg.minGiftPrice, chatConfig.DEFAULT_CONFIG.minGiftPrice)
  cfg.minTickerPrice = toFloat(cfg.minTickerPrice, chatConfig.DEFAULT_CONFIG.minTickerPrice)

  cfg.showDanmaku = toBool(cfg.showDanmaku)
  cfg.showInteractWordEnter = toBool(cfg.showInteractWordEnter)
  cfg.showInteractWordFollow = toBool(cfg.showInteractWordFollow)
  cfg.showInteractWordShare = toBool(cfg.showInteractWordShare)
  cfg.showSuperchat = toBool(cfg.showSuperchat)
  cfg.showNewMember = toBool(cfg.showNewMember)
  cfg.showGift = toBool(cfg.showGift)
  cfg.showGiftInfo = toBool(cfg.showGiftInfo)

  cfg.mergeSameUserDanmaku = toBool(cfg.mergeSameUserDanmaku)
  cfg.mergeSameUserDanmakuInterval = toInt(cfg.mergeSameUserDanmakuInterval)
  cfg.mergeSimilarDanmaku = toBool(cfg.mergeSimilarDanmaku)
  cfg.mergeGift = toBool(cfg.mergeGift)

  cfg.danmakuAtBottom = toBool(cfg.danmakuAtBottom)
  cfg.tickerAtButtom = toBool(cfg.tickerAtButtom)

  cfg.randomXOffset = toBool(cfg.randomXOffset)
  cfg.randomXRangeMin = toInt(cfg.randomXRangeMin)
  cfg.randomXRangeMax = toInt(cfg.randomXRangeMax)
  cfg.randomYOffset = toBool(cfg.randomYOffset)
  cfg.randomYRangeMin = toInt(cfg.randomYRangeMin)
  cfg.randomYRangeMax = toInt(cfg.randomYRangeMax)
  cfg.randomXInitialOffset = toInt(cfg.randomXInitialOffset)
  cfg.randomYInitialOffset = toInt(cfg.randomYInitialOffset)
  cfg.floatDistanceXMin = toInt(cfg.floatDistanceXMin)
  cfg.floatDistanceXMax = toInt(cfg.floatDistanceXMax)
  cfg.floatDistanceYMin = toInt(cfg.floatDistanceYMin)
  cfg.floatDistanceYMax = toInt(cfg.floatDistanceYMax)
  cfg.floatDistanceThreshold = toInt(cfg.floatDistanceThreshold)
  cfg.floatTime = toInt(cfg.floatTime)
  cfg.allowTextColorSetting = toBool(cfg.allowTextColorSetting)

  cfg.blockTranslateDanmaku = toBool(cfg.blockTranslateDanmaku)
  cfg.showTranslateDanmakuOnly = toBool(cfg.showTranslateDanmakuOnly)
  cfg.translationSign = cfg.translationSign.toString()

  cfg.emoticons = toObjIfJson(cfg.emoticons, []) as emoticon[]
  cfg.useLocalEmoticonSetting = toBool(cfg.useLocalEmoticonSetting)
  cfg.autoRenderOfficialSmallEmoji = toBool(cfg.autoRenderOfficialSmallEmoji)
  cfg.autoRenderOfficialGeneralEmoji = toBool(cfg.autoRenderOfficialGeneralEmoji)
  cfg.autoRenderStreamerEmoji = toBool(cfg.autoRenderStreamerEmoji)
  cfg.autoRenderPersonalEmoji = toBool(cfg.autoRenderPersonalEmoji)

  cfg.isGreedyMatch = toBool(cfg.isGreedyMatch)
  cfg.isSkipSameImage = toBool(cfg.isSkipSameImage)
  cfg.maxImage = toInt(cfg.maxImage, chatConfig.DEFAULT_CONFIG.maxImage)
  cfg.maxEmoji = toInt(cfg.maxEmoji, chatConfig.DEFAULT_CONFIG.maxEmoji)

  cfg.maxNumber = toInt(cfg.maxNumber, chatConfig.DEFAULT_CONFIG.maxNumber)
  cfg.fadeOutNum = toInt(cfg.fadeOutNum, chatConfig.DEFAULT_CONFIG.fadeOutNum)
  cfg.pinTime = toInt(cfg.pinTime, chatConfig.DEFAULT_CONFIG.pinTime)
  cfg.imageShowType = toInt(cfg.imageShowType, chatConfig.DEFAULT_CONFIG.imageShowType)

  cfg.blockGiftDanmaku = toBool(cfg.blockGiftDanmaku)
  cfg.blockLevel = toInt(cfg.blockLevel, chatConfig.DEFAULT_CONFIG.blockLevel)
  cfg.blockNewbie = toBool(cfg.blockNewbie)
  cfg.blockNotMobileVerified = toBool(cfg.blockNotMobileVerified)
  cfg.blockMedalLevel = toInt(cfg.blockMedalLevel, chatConfig.DEFAULT_CONFIG.blockMedalLevel)

  cfg.autoTranslate = toBool(cfg.autoTranslate)

  cfg.compatibilityMedalLevelToGuardLevelEnabled = toBool(
    cfg.compatibilityMedalLevelToGuardLevelEnabled)
  cfg.compatibilityMedalLevelToGuardLevel = toObjIfJson(
    cfg.compatibilityMedalLevelToGuardLevel,
    chatConfig.DEFAULT_CONFIG.compatibilityMedalLevelToGuardLevel
  ) as number[]
  cfg.compatibilityGiftToGuardBuyEnabled = toBool(
    cfg.compatibilityGiftToGuardBuyEnabled)
  cfg.compatibilityGiftToGuardBuy = toObjIfJson(
    cfg.compatibilityGiftToGuardBuy,
    chatConfig.DEFAULT_CONFIG.compatibilityGiftToGuardBuy
  ) as number[]

  cfg.timeFormat = cfg.timeFormat.toString()

  cfg.minDanmakuInterval = toInt(cfg.minDanmakuInterval, chatConfig.DEFAULT_CONFIG.minDanmakuInterval)
  cfg.maxDanmakuInterval = toInt(cfg.maxDanmakuInterval, chatConfig.DEFAULT_CONFIG.maxDanmakuInterval)

  chatConfig.sanitizeConfig(cfg)
  config.value = cfg
}

function toObjIfJson(str: any, defaultObj: any = {}): object {
  if (typeof str !== 'string') {
    return str
  }
  try {
    return JSON.parse(str)
  } catch {
    return defaultObj
  }
}

function initChatClient() {
  if (isTestRoom) {
    chatClient = new ChatClientTest(config.value.minDanmakuInterval, config.value.maxDanmakuInterval)
  } else {
    chatClient = new ChatClientDimSum()
  }
  chatClient.onAddText = onAddText
  chatClient.onAddGift = onAddGift
  chatClient.onAddMember = onAddMember
  chatClient.onAddSuperChat = onAddSuperChat
  chatClient.onDelSuperChat = onDelSuperChat
  chatClient.onUpdateTranslation = onUpdateTranslation
  chatClient.onInteractWord = onInteractWord
  chatClient.onFatalError = onFatalError
  chatClient.start()
}

async function initTextEmoticons() {
  if (config.value.autoRenderOfficialSmallEmoji) {
    // 合并数组 ChatClientDimSum.openbliveEmots 与 douyinEmots kuaishouEmots
    textEmoticons.value = [
      ...ChatClientDimSum.openbliveEmots,
      ...ChatClientDimSum.douyinEmots,
      ...ChatClientDimSum.kuaishouEmots]
  }
}

function start() {
  chatClient?.start()
}

function stop() {
  chatClient?.stop()
}

function onInteractWord(data: Message) {
  // console.log(`${data.authorName} 进入房间，data 是 ${JSON.stringify(data, null, 4)}`)

  // NOTE: 判断不同的 Interact 是否显示（进入房间、关注房间、分享房间）
  if (data.msgType === INTERACT_TYPE_ENTER) {
    if (!config.value.showInteractWordEnter) {
      return
    }
  } else if (data.msgType === INTERACT_TYPE_FOLLOW || data.msgType === INTERACT_TYPE_SPECIAL_FOLLOW || data.msgType === INTERACT_TYPE_MUTUAL_FOLLOW) {
    if (!config.value.showInteractWordFollow) {
      return
    }
  } else if (data.msgType === INTERACT_TYPE_SHARE) {
    if (!config.value.showInteractWordShare) {
      return
    }
  } else {
    // 不满足指定类型的互动
    return
  }

  if (!filterInteractMessage(data)) {
    return
  }

  let xOffset = config.value.randomXRangeMin + Math.floor(Math.random() * (config.value.randomXRangeMax - config.value.randomXRangeMin + 1))
  let yOffset = config.value.randomYRangeMin + Math.floor(Math.random() * (config.value.randomYRangeMax - config.value.randomYRangeMin + 1))

  if (config.value.randomXOffset ^ config.value.randomYOffset) {
    if (config.value.randomXOffset) {
      yOffset = config.value.randomYInitialOffset
    } else if (config.value.randomYOffset) {
      xOffset = config.value.randomXInitialOffset
    }
  }

  let floatDistanceX = config.value.floatDistanceXMin + Math.floor(Math.random() * (config.value.floatDistanceXMax - config.value.floatDistanceXMin + 1))
  if (Math.abs(floatDistanceX) < config.value.floatDistanceThreshold) {
    if (floatDistanceX < 0) {
      floatDistanceX = -config.value.floatDistanceThreshold
    } else {
      floatDistanceX = config.value.floatDistanceThreshold
    }
  }
  let floatDistanceY = config.value.floatDistanceYMin + Math.floor(Math.random() * (config.value.floatDistanceYMax - config.value.floatDistanceYMin + 1))
  if (Math.abs(floatDistanceY) < config.value.floatDistanceThreshold) {
    if (floatDistanceY < 0) {
      floatDistanceY = -config.value.floatDistanceThreshold
    } else {
      floatDistanceY = config.value.floatDistanceThreshold
    }
  }

  let message = {
    id: data.id,
    type: MESSAGE_TYPE_INTERACT,
    avatarUrl: data.avatarUrl,
    time: new Date(data.timestamp * 1000),
    timeFormat: config.value.timeFormat,
    msgType: data.msgType,
    authorName: data.authorName,
    authorNamePronunciation: getPronunciation(data.authorName),

    medalName: data.medalName,
    medalLevel: data.medalLevel,
    isFanGroup: data.isFanGroup,

    privilegeType: data.privilegeType,

    xOffset: xOffset,
    yOffset: yOffset,
    floatDistanceX: floatDistanceX,
    floatDistanceY: floatDistanceY,
  }


  rendererRef.value?.addMessage(message)
}
async function onAddText(data: Message) {

  // 匹配 #Hex 的正则表达式
  let textColor = 'initial'
  if (config.value.allowTextColorSetting) {
    if (UID_COLOR_MAP_REGEX.test(data.content)) {
      uidColorMap.value[data.authorName] = data.content
      textColor = data.content
      // console.log(data.authorName + ":匹配到Hex颜色" + textColor)
    } else {
      if (uidColorMap.value[data.authorName] !== undefined) {
        textColor = uidColorMap.value[data.authorName]
      }
      // console.log(data.authorName + ":没匹配到Hex颜色" + textColor)
    }
  }

  if (!config.value.showDanmaku || !filterTextMessage(data)) {
    return
  }
  // 合并相似弹幕
  if (await mergeSimilarText(data.content)) {
    return
  }
  // 合并同一用户短期内的发言
  if (await mergeSameUserText(data.content, getRichContent(data), data.authorName, data.timestamp)) {
    // console.log("收到同一个 User 发送的消息")
    // 合并消息，即插入到 Thread 的消息需要单独写平滑（拉了，和原本的平滑方案没有很好的融合）
    rendererRef.value?.calculateHeight()
    await rendererRef.value?.nextTick()
    rendererRef.value?.showNewMessages()
    return
  }

  if (config.value.showTranslateDanmakuOnly) {
    let content_str = data.content
    if (content_str.charAt(0) !== config.value.translationSign) {
      // console.log("只显示以“"+ config.value.translationSign +"”开头的翻译弹幕")
      return
    } else {
      data.content = content_str.substring(1)
    }
  }

  if (config.value.blockTranslateDanmaku) {
    let content_str = data.content
    if (content_str.charAt(0) === config.value.translationSign) {
      return
    }
  }


  // 不是同一个user的消息的话，开启新的 thread
  // 拉了，为了减少对 key 的修改
  // 直接把Thread塞到原本的 content 和 richContent
  let contentThread = []
  contentThread[0] = data.content
  let richContentThread = []
  richContentThread[0] = getRichContent(data)
  let xOffset = config.value.randomXRangeMin + Math.floor(Math.random() * (config.value.randomXRangeMax - config.value.randomXRangeMin + 1))
  let yOffset = config.value.randomYRangeMin + Math.floor(Math.random() * (config.value.randomYRangeMax - config.value.randomYRangeMin + 1))

  if (config.value.randomXOffset ^ config.value.randomYOffset) {
    if (config.value.randomXOffset) {
      yOffset = config.value.randomYInitialOffset
    } else if (config.value.randomYOffset) {
      xOffset = config.value.randomXInitialOffset
    }
  }

  let floatDistanceX = config.value.floatDistanceXMin + Math.floor(Math.random() * (config.value.floatDistanceXMax - config.value.floatDistanceXMin + 1))
  if (Math.abs(floatDistanceX) < config.value.floatDistanceThreshold) {
    if (floatDistanceX < 0) {
      floatDistanceX = -config.value.floatDistanceThreshold
    } else {
      floatDistanceX = config.value.floatDistanceThreshold
    }
  }
  let floatDistanceY = config.value.floatDistanceYMin + Math.floor(Math.random() * (config.value.floatDistanceYMax - config.value.floatDistanceYMin + 1))
  if (Math.abs(floatDistanceY) < config.value.floatDistanceThreshold) {
    if (floatDistanceY < 0) {
      floatDistanceY = -config.value.floatDistanceThreshold
    } else {
      floatDistanceY = config.value.floatDistanceThreshold
    }
  }

  // FIXME: thread 中的翻译文本

  let message = {
    id: data.id,
    type: MESSAGE_TYPE_TEXT,
    avatarUrl: data.avatarUrl,
    time: new Date(data.timestamp * 1000),
    timeFormat: config.value.timeFormat,
    authorName: data.authorName,
    authorType: data.authorType,
    content: data.content,
    contents: contentThread,
    // richContent: this.getRichContent(data),
    richContents: richContentThread,
    privilegeType: data.privilegeType,
    medalName: data.medalName,
    medalLevel: data.medalLevel,
    isFanGroup: data.isFanGroup,
    repeated: 1,
    repeatedThread: [1],
    threadLength: 1,
    translation: data.translation,
    xOffset: xOffset,
    yOffset: yOffset,
    floatDistanceX: floatDistanceX,
    floatDistanceY: floatDistanceY,
    textColor: textColor
  }

  if (config.value.compatibilityMedalLevelToGuardLevelEnabled && data.medalLevel && data.medalLevel > 0) {
    let privilegeType = 0
    for (let i = 0; i < config.value.compatibilityMedalLevelToGuardLevel.length; i++) {
      if (data.medalLevel >= config.value.compatibilityMedalLevelToGuardLevel[i]) {
        privilegeType = i + 1
      }
    }
    if (privilegeType > 0) privilegeType = 4 - privilegeType // 3舰长 2提督 1总督 0无
    if (message.privilegeType === 0 && privilegeType > 0) {
      message.privilegeType = privilegeType
    }
  }
  rendererRef.value?.addMessage(message)
}
function onAddGift(data: Message) {
  if (!config.value.showGift) {
    // console.log("收到礼物，但是否显示礼物为" + config.value.showGift)
    return
  }
  if (config.value.showTranslateDanmakuOnly) {
    // console.log("只显示以“"+ config.value.translationSign +"”开头的翻译弹幕")
    return
  }

  let price = data.paid ? data.totalCoin / 1000 : 0
  if (mergeSimilarGift(data.authorName, price, data.giftName, data.num)) {
    return
  }
  // 银瓜子礼物不丢人
  // if (price < config.value.minGiftPrice) {
  //  return
  // }

  let xOffset = config.value.randomXRangeMin + Math.floor(Math.random() * (config.value.randomXRangeMax - config.value.randomXRangeMin + 1))
  let yOffset = config.value.randomYRangeMin + Math.floor(Math.random() * (config.value.randomYRangeMax - config.value.randomYRangeMin + 1))

  if (config.value.randomXOffset ^ config.value.randomYOffset) {
    if (config.value.randomXOffset) {
      yOffset = config.value.randomYInitialOffset
    } else if (config.value.randomYOffset) {
      xOffset = config.value.randomXInitialOffset
    }
  }

  let floatDistanceX = config.value.floatDistanceXMin + Math.floor(Math.random() * (config.value.floatDistanceXMax - config.value.floatDistanceXMin + 1))
  if (Math.abs(floatDistanceX) < config.value.floatDistanceThreshold) {
    if (floatDistanceX < 0) {
      floatDistanceX = -config.value.floatDistanceThreshold
    } else {
      floatDistanceX = config.value.floatDistanceThreshold
    }
  }
  let floatDistanceY = config.value.floatDistanceYMin + Math.floor(Math.random() * (config.value.floatDistanceYMax - config.value.floatDistanceYMin + 1))
  if (Math.abs(floatDistanceY) < config.value.floatDistanceThreshold) {
    if (floatDistanceY < 0) {
      floatDistanceY = -config.value.floatDistanceThreshold
    } else {
      floatDistanceY = config.value.floatDistanceThreshold
    }
  }

  let message: Message = {
    id: data.id,
    type: MESSAGE_TYPE_GIFT,
    avatarUrl: data.avatarUrl,
    time: new Date(data.timestamp * 1000),
    timeFormat: config.value.timeFormat,
    authorName: data.authorName,
    authorNamePronunciation: getPronunciation(data.authorName),
    price: price,
    giftName: data.giftName,
    num: data.num,
    xOffset: xOffset,
    yOffset: yOffset,
    floatDistanceX: floatDistanceX,
    floatDistanceY: floatDistanceY,
  }
  if (config.value.compatibilityGiftToGuardBuyEnabled) {
    let privilegeType = 0
    for (let i = 0; i < config.value.compatibilityGiftToGuardBuy.length; i++) {
      if (price >= config.value.compatibilityGiftToGuardBuy[i]) {
        privilegeType = i + 1
      }
    }
    if (privilegeType > 0) privilegeType = 4 - privilegeType // 3舰长 2提督 1总督 0无
    if (privilegeType > 0) {
      message.type = MESSAGE_TYPE_MEMBER
      message.privilegeType = privilegeType
      message.guardNum = data.giftName
      message.guardUnit = '个'
      message.title = `${message.giftName} x ${message.num}`
    }
  }

  rendererRef.value?.addMessage(message)
}
function onAddMember(data: Message) {
  if (!config.value.showNewMember || !filterNewMemberMessage(data)) {
    // console.log("收到上舰，但是否显示上舰信息为" + config.value.showNewMember)
    return
  }
  if (config.value.showTranslateDanmakuOnly) {
    // console.log("只显示以“"+ config.value.translationSign +"”开头的翻译弹幕")
    return
  }
  let price = 198
  if (data.privilegeType == 2) {
    price = 1998
  } else if (data.privilegeType == 3) {
    price = 19998
  }

  if (data.guardUnit === '月') {
    price *= data.guardNum
  } else if (data.guardUnit === '年') {
    price *= data.guardNum * 12
  }

  let xOffset = config.value.randomXRangeMin + Math.floor(Math.random() * (config.value.randomXRangeMax - config.value.randomXRangeMin + 1))
  let yOffset = config.value.randomYRangeMin + Math.floor(Math.random() * (config.value.randomYRangeMax - config.value.randomYRangeMin + 1))

  if (config.value.randomXOffset ^ config.value.randomYOffset) {
    if (config.value.randomXOffset) {
      yOffset = config.value.randomYInitialOffset
    } else if (config.value.randomYOffset) {
      xOffset = config.value.randomXInitialOffset
    }
  }

  let floatDistanceX = config.value.floatDistanceXMin + Math.floor(Math.random() * (config.value.floatDistanceXMax - config.value.floatDistanceXMin + 1))
  if (Math.abs(floatDistanceX) < config.value.floatDistanceThreshold) {
    if (floatDistanceX < 0) {
      floatDistanceX = -config.value.floatDistanceThreshold
    } else {
      floatDistanceX = config.value.floatDistanceThreshold
    }
  }
  let floatDistanceY = config.value.floatDistanceYMin + Math.floor(Math.random() * (config.value.floatDistanceYMax - config.value.floatDistanceYMin + 1))
  if (Math.abs(floatDistanceY) < config.value.floatDistanceThreshold) {
    if (floatDistanceY < 0) {
      floatDistanceY = -config.value.floatDistanceThreshold
    } else {
      floatDistanceY = config.value.floatDistanceThreshold
    }
  }
  // membershipText 会是舰长或者提督，或者总督
  let membershipText = ''
  if (data.privilegeType === 1) {
    membershipText = t('chat.guardLevel1')
  } else if (data.privilegeType === 2) {
    membershipText = t('chat.guardLevel2')
  } else if (data.privilegeType === 3) {
    membershipText = t('chat.guardLevel3')
  }
  // 如果单位是 月，则为 '个月'，如果单位是 年，则为 '年'
  let postFix = ''
  if (data.guardUnit === '月') {
    postFix = t('chat.month')
  } else if (data.guardUnit === '年') {
    postFix = t('chat.year')
  }

  let message = {
    id: data.id,
    type: MESSAGE_TYPE_MEMBER,
    avatarUrl: data.avatarUrl,
    time: new Date(data.timestamp * 1000),
    timeFormat: config.value.timeFormat,
    authorName: data.authorName,
    authorNamePronunciation: getPronunciation(data.authorName),
    privilegeType: data.privilegeType,
    price: price,
    guardNum: data.guardNum,
    guardUnit: data.guardUnit,
    title: `${membershipText} x ${data.guardNum}${postFix}`,
    xOffset: xOffset,
    yOffset: yOffset,
    floatDistanceX: floatDistanceX,
    floatDistanceY: floatDistanceY,
  }
  rendererRef.value?.addMessage(message)
}
function onAddSuperChat(data: Message) {
  if (!config.value.showSuperchat || !filterSuperChatMessage(data)) {
    // console.log("收到打赏(醒目留言SC)，但显示打赏(醒目留言SC)为" + config.value.showSuperchat)
    return
  }
  if (data.price < config.value.minGiftPrice) { // 丢人
    // console.log("打赏小于最低打赏金额，不以显示")
    return
  }
  if (config.value.showTranslateDanmakuOnly) {
    // console.log("只显示以“"+ config.value.translationSign +"”开头的翻译弹幕")
    return
  }

  let xOffset = config.value.randomXRangeMin + Math.floor(Math.random() * (config.value.randomXRangeMax - config.value.randomXRangeMin + 1))
  let yOffset = config.value.randomYRangeMin + Math.floor(Math.random() * (config.value.randomYRangeMax - config.value.randomYRangeMin + 1))

  if (config.value.randomXOffset ^ config.value.randomYOffset) {
    if (config.value.randomXOffset) {
      yOffset = config.value.randomYInitialOffset
    } else if (config.value.randomYOffset) {
      xOffset = config.value.randomXInitialOffset
    }
  }

  let floatDistanceX = config.value.floatDistanceXMin + Math.floor(Math.random() * (config.value.floatDistanceXMax - config.value.floatDistanceXMin + 1))
  if (Math.abs(floatDistanceX) < config.value.floatDistanceThreshold) {
    if (floatDistanceX < 0) {
      floatDistanceX = -config.value.floatDistanceThreshold
    } else {
      floatDistanceX = config.value.floatDistanceThreshold
    }
  }
  let floatDistanceY = config.value.floatDistanceYMin + Math.floor(Math.random() * (config.value.floatDistanceYMax - config.value.floatDistanceYMin + 1))
  if (Math.abs(floatDistanceY) < config.value.floatDistanceThreshold) {
    if (floatDistanceY < 0) {
      floatDistanceY = -config.value.floatDistanceThreshold
    } else {
      floatDistanceY = config.value.floatDistanceThreshold
    }
  }
  let message = {
    id: data.id,
    type: MESSAGE_TYPE_SUPER_CHAT,
    avatarUrl: data.avatarUrl,
    authorName: data.authorName,
    authorNamePronunciation: getPronunciation(data.authorName),
    price: data.price,
    time: new Date(data.timestamp * 1000),
    timeFormat: config.value.timeFormat,
    content: data.content.trim(),
    translation: data.translation,
    xOffset: xOffset,
    yOffset: yOffset,
    floatDistanceX: floatDistanceX,
    floatDistanceY: floatDistanceY,
  }
  rendererRef.value?.addMessage(message)
}
function onDelSuperChat(data: Message) {
  rendererRef.value?.delMessages(data.ids)
}
// FIXME: 更新翻译
function onUpdateTranslation(data: Message) {
  if (!config.value.autoTranslate) {
    return
  }
  rendererRef.value?.updateMessage(data.id, { translation: data.translation })
}
function onFatalError(error: Error) {
  ElMessage.error({
    message: error.toString(),
    duration: 10 * 1000
  })
  chatClient?.stop()
}

function filterInteractMessage(data: Message) {
  if (config.value.blockMedalLevel > 0) {
    // 如果未佩戴当前直播间勋章，或者勋章等级低于屏蔽等级，屏蔽信息
    if (data.medalLevel < config.value.blockMedalLevel || !data.isFanGroup) {
      return false
    }
  }

  return filterByAuthorName(data.authorName)
}
function filterTextMessage(data: Message) {
  if (config.value.blockGiftDanmaku && data.isGiftDanmaku) {
    return false
  } else if (config.value.blockLevel > 0 && data.authorLevel < config.value.blockLevel) {
    return false
  } else if (config.value.blockNewbie && data.isNewbie) {
    return false
  } else if (config.value.blockNotMobileVerified && !data.isMobileVerified) {
    return false
  } else if (config.value.blockMedalLevel > 0 && data.medalLevel < config.value.blockMedalLevel) {
    return false
  }
  return filterByContent(data.content) && filterByAuthorName(data.authorName)
}
function filterSuperChatMessage(data: Message) {
  return filterByContent(data.content) && filterByAuthorName(data.authorName)
}
function filterNewMemberMessage(data: Message) {
  return filterByAuthorName(data.authorName)
}
function filterByContent(content: string) {
  let _blockKeywordsTrie = blockKeywordsTrie.value
  for (let i = 0; i < content.length; i++) {
    let remainContent = content.substring(i)
    if (_blockKeywordsTrie.lazyMatch(remainContent) !== null) {
      return false
    }
  }
  return true
}
// NOTE: 根据关键词屏蔽用户（当用户名中包含关键词，如【人气】时候，屏蔽）
function filterByAuthorNameKeywords(authorName: string) {
  let _blockUsersByKeywordsTrie = blockUsersByKeywordsTrie.value
  for (let i = 0; i < authorName.length; i++) {
    let remainContent = authorName.substring(i)
    if (_blockUsersByKeywordsTrie.lazyMatch(remainContent) !== null) {
      return false
    }
  }
  return true
}
function filterByAuthorName(authorName: string) {
  return !blockUsersTrie.value.has(authorName) && filterByAuthorNameKeywords(authorName)
}
function mergeSameUserText(content: string, richContent: any, authorName: any, time: any) {
  if (!config.value.mergeSameUserDanmaku) {
    return false
  }
  return rendererRef.value?.mergeSameUserText(content, richContent, authorName, time)
}
function mergeSimilarText(content: string) {
  if (!config.value.mergeSimilarDanmaku) {
    return false
  }
  return rendererRef.value?.mergeSimilarText(content)
}
function mergeSimilarGift(authorName: string, price: number, giftName: string, num: number) {
  if (!config.value.mergeGift) {
    return false
  }
  return rendererRef.value?.mergeSimilarGift(authorName, price, giftName, num)
}
function getPronunciation(text: string) {
  if (pronunciationConverter.value === undefined) {
    return ''
  }
  return pronunciationConverter.value?.getPronunciation(text)
}
function generateTextData(content: string, textColor: string) {
  return {
    type: CONTENT_TYPE_TEXT,
    text: content,
    textColor: textColor
  }
}
function generateImageData(type: number, matchEmoticon: any) {
  return {
    type: type,
    text: matchEmoticon.keyword,
    align: matchEmoticon.align,
    height: matchEmoticon.height,
    level: matchEmoticon.level,
    url: matchEmoticon.url
  }
}
function generateEmoticonData(type: number, text: any, emoticon_unique: string, url: string, height: number) {
  return {
    type: type,
    text: text,
    emoticon_unique: emoticon_unique,
    url: url,
    height: height
  }
}
function getTextColor(data: Message): string {
  let textColor = 'initial'
  if (config.value.allowTextColorSetting) {
    if (UID_COLOR_MAP_REGEX.test(data.content)) {
      uidColorMap.value[data.authorName] = data.content
      textColor = data.content
    } else if (uidColorMap.value[data.authorName] !== undefined) {
      textColor = uidColorMap.value[data.authorName]
    }
  }
  return textColor
}
// TODO: 处理不同类型表情包
function getRichContent(data: Message) {
  let textColor = getTextColor(data)
  let richContent = []

  if (config.value.imageShowType > 1) {
    config.value.imageShowType = 1
  }

  // 翻译弹幕，只显示文字
  if (config.value.showTranslateDanmakuOnly == true) {
    richContent.push(generateTextData(data.content, textColor))
    return richContent
  }
  // TODO: 处理表情相关

  // 可能含有文本表情，需要解析
  let _emoticonsTrie = emoticonsTrie.value

  // 存在用户自定义关键词则优先显示用户设定表情，不存在则考虑B站自带表情（通用表情、房间表情、个人购买表情）
  if (_emoticonsTrie.has(data.content) === false && data.emoticon !== undefined) {
    if (data.emoticonDetail) {
      let emoticon_unique = data.emoticonDetail.emoticon_unique
      if (config.value.autoRenderOfficialGeneralEmoji === true && emoticon_unique.startsWith('official')) {
        // B站直播间通用表情（不包括 黄豆表情 autoRenderOfficialSmallEmoji）
        richContent.push(generateEmoticonData(CONTENT_TYPE_EMOTICON, data.content, data.emoticonDetail.emoticon_unique, data.emoticonDetail.url, data.emoticonDetail.height))
        return richContent
      }
      if (config.value.autoRenderStreamerEmoji === true && emoticon_unique.startsWith('room')) {
        // 主播房间表情（主播在B站网页端上传的个人表情（房间表情，房间粉丝团表情）
        richContent.push(generateEmoticonData(CONTENT_TYPE_EMOTICON, data.content, data.emoticonDetail.emoticon_unique, data.emoticonDetail.url, data.emoticonDetail.height))
        return richContent
      }
      if (config.value.autoRenderPersonalEmoji === true && emoticon_unique.startsWith('upower')) {
        // 个人购买表情（用户购买的）
        richContent.push(generateEmoticonData(CONTENT_TYPE_EMOTICON, data.content, data.emoticonDetail.emoticon_unique, data.emoticonDetail.url, data.emoticonDetail.height))
        return richContent
      }
    } else {
      if ((config.value.autoRenderOfficialGeneralEmoji === true || config.value.autoRenderPersonalEmoji === true) && typeof data.emoticon === 'string' && data.emoticon.startsWith('http://i0.hdslb.com/bfs/live')) {
        // 无法区分是通用表情还是主播自己上传的表情，开启任意一个两个都会显示
        richContent.push(generateEmoticonData(CONTENT_TYPE_EMOTICON, data.content, `official-${data.content}`, data.emoticon, 64))
        return richContent
      } else if (config.value.autoRenderStreamerEmoji === true && typeof data.emoticon === 'string' && data.emoticon.startsWith('http://i0.hdslb.com/bfs/emote')) {
        // 只能区分是否是用户自己购买的表情
        richContent.push(generateEmoticonData(CONTENT_TYPE_EMOTICON, data.content, `room-${data.content}`, data.emoticon, 64))
        return richContent
      } else {
        richContent.push(generateEmoticonData(CONTENT_TYPE_EMOTICON, data.content, `other-${data.content}`, data.emoticon, 64))
        return richContent
      }
    }
  }

  // NOTE: 上面处理了一般的表情（B站点击后显示单个图片的表情），下面开始处理可以和文字同时显示的黄豆表情和blivechat自定义表情
  let has_blivechat_emoticon = config.value.emoticons && config.value.emoticons.length !== 0
  let has_user_defined_danmu_pic = danmu_pic_json.value.length !== 0
  let has_bilibili_official_small_emoji = textEmoticons.value.length !== 0

  if (!has_blivechat_emoticon && !has_user_defined_danmu_pic && !has_bilibili_official_small_emoji) {
    // 只能是文本（没有blivechat自定义表情, 没有用户自定义文字转图片, 没有B站官方小表情）
    richContent.push(generateTextData(data.content, textColor))
    return richContent
  }

  // 开始分析弹幕文字，并按需求和表情替换
  let startPos = 0
  let pos = 0
  let emoticonCount = 0
  let imageCount = 0
  let emoticonMap: {[url: string]: boolean} = {}
  if (config.value.imageShowType === IMAGE_SHOW_TYPE_ADD_AFTER) { // 在文字之后添加图片的情况，直接添加文字
    richContent.push(generateTextData(data.content, textColor))
  }
  while (pos < data.content.length) { // 寻找需要添加的图片
    let remainContent = data.content.substring(pos)
    let _matchEmoticon
    if (config.value.isGreedyMatch) {
      _matchEmoticon = _emoticonsTrie.greedyMatch(remainContent)
    } else {
      _matchEmoticon = _emoticonsTrie.lazyMatch(remainContent)
    }
    if (!_matchEmoticon) {
      pos++
      continue
    }
    let matchEmoticon = _matchEmoticon
    if (_matchEmoticon.length !== undefined && _matchEmoticon.length > 0) {
      matchEmoticon = _matchEmoticon[0]
      if (data.preferEmotTag) {
        for (let i = 0; i < _matchEmoticon.length; i++) {
          if (_matchEmoticon[i].tag === data.preferEmotTag) {
            matchEmoticon = _matchEmoticon[i]
            break
          }
        }
      }
    }

    // 如果是替换文字为图片，则加入之前的文本（只有【替换文字为表情包】的模式需要添加文字）
    if (pos !== startPos && config.value.imageShowType === IMAGE_SHOW_TYPE_REPLACE) {
      richContent.push(generateTextData(data.content.slice(startPos, pos), textColor))
    }
    let emoticonLevel = toInt(matchEmoticon.level)
    let privilegeType = toInt(data.privilegeType)

    // 如果不满足使用权限，或者超过inline, block类型图片各自的上限 ———— 则此时显示文字，而不是图片
    if ((emoticonLevel > PRIVILEGE_TYPE_ALL && (privilegeType > emoticonLevel || privilegeType === PRIVILEGE_TYPE_ALL))
      || (matchEmoticon.align === 'inline' && emoticonCount >= config.value.maxEmoji)
      || (matchEmoticon.align === 'block' && imageCount >= config.value.maxImage)) {
      if (config.value.imageShowType === IMAGE_SHOW_TYPE_REPLACE) { // 只有【替换文字为表情包】的模式需要添加文字，否则直接跳过
        richContent.push(generateTextData(matchEmoticon.keyword, textColor))
      }
    } else { // 如果满足使用权限
      if (config.value.isSkipSameImage === false || emoticonMap[matchEmoticon.url] === undefined) { // 且【不多次显示重复图片】或者说【当前图片没出现过】
        emoticonMap[matchEmoticon.url] = true // 将出现过的图片记录到 map
        if (matchEmoticon.align === 'inline') {
          emoticonCount++
        } else {
          imageCount++
        }
        // 添加图片到消息内容（有官方大、小表情 [dog]，和网页自定义表情中设置的表情）
        richContent.push(generateImageData(matchEmoticon.type ?? CONTENT_TYPE_IMAGE, matchEmoticon))
      } else {
        if (config.value.imageShowType === IMAGE_SHOW_TYPE_REPLACE) { // 只有【替换文字为表情包】的模式需要添加文字，否则直接跳过
          richContent.push(generateTextData(matchEmoticon.keyword, textColor))
        } // end if
      } // end else
    } // end else
    pos += matchEmoticon.keyword.length
    startPos = pos
  } // end while
  // 当没有出现表情时候 如果是替换文字为表情包，则加入尾部的文本
  if (pos !== startPos && config.value.imageShowType === IMAGE_SHOW_TYPE_REPLACE) {
    richContent.push({
      type: CONTENT_TYPE_TEXT,
      text: data.content.slice(startPos, pos),
      textColor: textColor
    })
  }
  return richContent
}
</script>