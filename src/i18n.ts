import { createI18n } from 'vue-i18n'
import zh from './lang/zh'
import en from './lang/en'
import ja from './lang/ja'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
    ja
  }
})