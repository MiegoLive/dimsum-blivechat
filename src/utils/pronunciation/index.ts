export const DICT_PINYIN = 'pinyin'
export const DICT_KANA = 'kana'

type Dict = { default: string }

export class PronunciationConverter {
  pronunciationMap: Map<string, string> = new Map<string, string>()

  async loadDict(dictName: any) {
    let promise: Promise<Dict> | undefined
    switch (dictName) {
    case DICT_PINYIN:
      promise = import('./dictPinyin')
      break
    case DICT_KANA:
      promise = import('./dictKana')
      break
    default:
      return
    }

    let dictTxt = (await promise).default
    let pronunciationMap = new Map<string, string>()
    for (let item of dictTxt.split('\n')) {
      if (item.length === 0) {
        continue
      }
      pronunciationMap.set(item.substring(0, 1), item.substring(1))
    }
    this.pronunciationMap = pronunciationMap
  }

  getPronunciation(text: string): string {
    let res = []
    let lastHasPronunciation = null
    for (let char of text) {
      let pronunciation = this.pronunciationMap.get(char)
      if (pronunciation === undefined) {
        if (lastHasPronunciation !== null && lastHasPronunciation) {
          res.push(' ')
        }
        lastHasPronunciation = false
        res.push(char)
      } else {
        if (lastHasPronunciation !== null) {
          res.push(' ')
        }
        lastHasPronunciation = true
        res.push(pronunciation)
      }
    }
    return res.join('')
  }
}