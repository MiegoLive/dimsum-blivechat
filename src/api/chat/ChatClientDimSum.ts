import { isGiftDanmakuByContent } from "."
import { Message } from "../../components/ChatRenderer/constants"
import { onMessage, getBfaceURL, Parser } from "https://fastly.jsdelivr.net/npm/dimsum-chat@0/+esm"
import { getUuid4Hex } from "../../utils"

const openbliveParser = new Parser({
  type: 'LIVE_OPEN_PLATFORM_DM',
  content: {
    cmd: 'LIVE_OPEN_PLATFORM_DM',
    data: {
      msg: ''
    }
  }
})

const douyinParser = new Parser({
  type: 'WebcastChatMessage',
  content: {
    content: ''
  }
})

const kuaishouParser = new Parser({
  type: 'KuaishouCommentFeeds',
  content: {
    content: ''
  }
})

function getEmotsFromParser(p: Parser, outputEmots: {keyword: string, url: string}[], tag: string): void {
  if (outputEmots.length === 0) {
    p.CommentBuilder((_comment, _stickerUrl, emots) => {
      if (!emots) return ''
      // emots格式 [keyword, url][]
      // 清空
      outputEmots.splice(0, outputEmots.length)
      // 重新赋值
      outputEmots.push(...emots.map(item => {
        return {
          keyword: item[0],
          url: item[1],
          tag: tag
        }
      }))
      return ''
    })
  }
}

export class ChatClientDimSum {
  roomOwnerUid?: string | number
  roomId?: string | number
  onAddText?: (message: Message) => void
  onAddGift?: (message: Message) => void
  onAddMember?: (message: Message) => void
  onAddSuperChat?: (message: Message) => void
  onDelSuperChat?: (message: Message) => void
  onUpdateTranslation?: (message: Message) => void
  onInteractWord?: (message: Message) => void
  onFatalError?: (error: Error) => void

  static openbliveEmots: {keyword: string, url: string}[] = []
  static douyinEmots: {keyword: string, url: string}[] = []
  static kuaishouEmots: {keyword: string, url: string}[] = []

  running: boolean = false
  constructor() {
    onMessage((_msg, p) => {
      // 记录房间号
      if (p.rawType === 'INTERACT_WORD'){
        this.roomId = p.rawContent.data.roomid
      }
      if (p.platform === 'openblive'){
        this.roomId = p.rawContent.data.room_id
      }
      if (p.rawType === 'DimSumChatRoomInfo') {
        this.roomId = p.rawContent.roomId as string;
      }
      // 检测运行状态
      if (!this.running) {
        return
      }
      // 处理消息
      if (p.type === 'comment') {
        const crossPlatformAvatar = p.avatar || (p.platform === "bilibili" && p.uid ? getBfaceURL(p.uid) : undefined)
        const timestamp = new Date().getTime() / 1000
        let isAdmin = false
        if (p.platform === "bilibili") {
          isAdmin = p.rawContent.info[2][2] > 0
        } else if (p.platform === "acfun") {
          isAdmin = p.rawContent.userInfo.userIdentity.managerType > 0
        }
        let authorType = 0
        if (p.uid === this.roomOwnerUid) {
          authorType = 3
        } else if (isAdmin) {
          authorType = 2
        } else if (p.guardLevel !== 0) {
          authorType = 1
        }
        const content = p.comment ?? ''
        let isGiftDanmaku = false
        if (p.platform === 'bilibili') {
          isGiftDanmaku = Boolean(p.rawContent.info[0][9]) || isGiftDanmakuByContent(content)
        } else if (p.platform === 'openblive') {
          isGiftDanmaku = isGiftDanmakuByContent(content)
        }
        let authorLevel = 1
        if (p.platform === 'bilibili') {
          authorLevel = p.rawContent.info[4][0]
        }
        let isNewbie = false
        if (p.platform === 'bilibili') {
          isNewbie = p.rawContent.info[2][5] < 10000
        }
        let isMobileVerified = true
        if (p.platform === 'bilibili') {
          isMobileVerified = Boolean(p.rawContent.info[2][6])
        }
        let isFanGroup = false
        if (p.platform === 'bilibili') {
          isFanGroup = p.rawContent.info[3][3] === this.roomId
        } else if (p.platform === 'openblive') {
          isFanGroup = p.rawContent.data.fans_medal_wearing_status
        } else {
          isFanGroup = p.clubLevel !== undefined && p.clubLevel > 0;
        }
        let emoticon = undefined
        /*
        if (p.platform === 'bilibili') {
          emoticon = p.rawContent.info[0][13].url
        } else if (p.platform === 'openblive') {
          if (p.rawContent.data.dm_type === 1) {
            emoticon = p.rawContent.data.emoji_img_url
          }
        }
          */
        p.CommentBuilder((_comment, stickerUrl, _emots) => {
          emoticon = stickerUrl
          return ""
        });
        let emoticonDetail = undefined
        if (p.platform === 'bilibili') {
          emoticonDetail = p.rawContent.info[0][13]
        }
        let preferEmotTag = undefined
        if (p.platform === 'openblive') {
          preferEmotTag = 'openblive'
        }
        if (p.platform === 'douyin') {
          preferEmotTag = 'douyin'
        }
        if (p.platform === 'kuaishou') {
          preferEmotTag = 'kuaishou'
        }
        let data = {
          avatarUrl: crossPlatformAvatar,
          timestamp: timestamp,
          authorName: p.userName,
          authorType: authorType,
          content: content,
          privilegeType: p.guardLevel ?? 0,
          isGiftDanmaku: isGiftDanmaku,
          authorLevel: authorLevel,
          isNewbie: isNewbie,
          isMobileVerified: isMobileVerified,
          medalName: p.clubName,
          medalLevel: p.clubLevel,
          isFanGroup: isFanGroup,  // 是否是粉丝团（即粉丝勋章为当前直播间的粉丝勋章）
          id: getUuid4Hex(),
          translation: '',
          emoticon: emoticon,
          emoticonDetail: emoticonDetail,
          preferEmotTag: preferEmotTag,
        }
        this.onAddText?.(data)
      }
      if (p.type === 'gift') {
        const crossPlatformAvatar = p.avatar || (p.platform === "bilibili" && p.uid ? getBfaceURL(p.uid) : undefined)
        const timestamp = new Date().getTime() / 1000
        const data = {
          id: getUuid4Hex(),
          avatarUrl: crossPlatformAvatar,
          timestamp: timestamp,
          authorName: p.userName,
          paid: p.giftUnitPrice && p.giftUnitPrice > 0,
          totalCoin: (p.price ?? 0) * 1000,
          giftName: p.giftName,
          num: p.giftNum
        }
        this.onAddGift?.(data)
      }
      if (p.type === 'guard') {
        const crossPlatformAvatar = p.avatar || (p.platform === "bilibili" && p.uid ? getBfaceURL(p.uid) : undefined)
        const timestamp = new Date().getTime() / 1000
        const data = {
          id: getUuid4Hex(),
          avatarUrl: crossPlatformAvatar,
          timestamp: timestamp,
          authorName: p.userName,
          privilegeType: p.guardLevel,
          guardNum: p.guardNum ?? 1,
          guardUnit: '月'
        }
        this.onAddMember?.(data)
      }
      if (p.type === 'superchat') {
        const crossPlatformAvatar = p.avatar || (p.platform === "bilibili" && p.uid ? getBfaceURL(p.uid) : undefined)
        const timestamp = new Date().getTime() / 1000
        let id: number = Math.floor(Math.random() * 1000000000)
        if (p.platform === 'bilibili') {
          id = p.rawContent.data.id
        }
        const data = {
          id: id,
          avatarUrl: crossPlatformAvatar,
          timestamp: timestamp,
          authorName: p.userName,
          price: p.superChatPrice,
          content: p.superChatComment,
          translation: ''
        }
        this.onAddSuperChat?.(data)
      }
      if (p.type?.toString() === 'superchat_delete' || p.rawType === 'SUPER_CHAT_MESSAGE_DELETE' || p.rawType === 'LIVE_OPEN_PLATFORM_SUPER_CHAT_DEL') {
        let ids = []
        let rawIds = []
        if (p.rawType === 'SUPER_CHAT_MESSAGE_DELETE'){
          rawIds = p.rawContent.data.ids
        } else if (p.rawType === 'LIVE_OPEN_PLATFORM_SUPER_CHAT_DEL'){
          rawIds = p.rawContent.message_ids
        }
        for (let id of rawIds) {
          ids.push(id.toString())
        }
        this.onDelSuperChat?.({ ids })
      }
      if (p.type === 'enter' || p.type === 'follow' || p.type === 'share' || p.type === 'like'){
        const crossPlatformAvatar = p.avatar || (p.platform === "bilibili" && p.uid ? getBfaceURL(p.uid) : undefined)
        const timestamp = new Date().getTime() / 1000
        let msgType = 0;
        if (p.rawType === 'INTERACT_WORD') {
          msgType = p.rawContent.data.msg_type
        } else {
          switch (p.type) {
            case 'enter':
              msgType = 1;
              break;
            case 'follow':
              msgType = 2;
              break;
            case'share':
              msgType = 3;
              break;
            case 'like':
              msgType = 6;
              break;
            default:
              break;
          }
        }
        let isFanGroup = false
        if (p.platform === 'bilibili') {
          isFanGroup = p.rawContent.data.fans_medal?.anchor_roomid === this.roomId
        } else if (p.platform === 'openblive') {
          isFanGroup = p.rawContent.data.fans_medal_wearing_status
        } else {
          isFanGroup = p.clubLevel !== undefined && p.clubLevel > 0;
        }
        const data = {
          id: getUuid4Hex(),
          roomId: this.roomId,
          timestamp: timestamp,
          avatarUrl: crossPlatformAvatar,
          msgType: msgType,
          authorName: p.userName,
          medalName: p.clubName,
          medalLevel: p.clubLevel,
          isFanGroup: isFanGroup,  // 是否是粉丝团（即粉丝勋章为当前直播间的粉丝勋章）
          privilegeType: p.guardLevel // 所带勋章牌子的舰队等级，0非舰队，1总督，2提督，3舰长（不一定是当前直播间的粉丝勋章）
        }
        this.onInteractWord?.(data)
      }
    },{
      customWsServer: import.meta.env.DEV
        ? "ws://localhost:13500/websocket"
        : undefined,
    })
  }

  start() {
    this.running = true
  }

  stop() {
    this.running = false
  }

}

getEmotsFromParser(openbliveParser, ChatClientDimSum.openbliveEmots, 'openblive')
getEmotsFromParser(douyinParser, ChatClientDimSum.douyinEmots, 'douyin')
getEmotsFromParser(kuaishouParser, ChatClientDimSum.kuaishouEmots, 'kuaishou')