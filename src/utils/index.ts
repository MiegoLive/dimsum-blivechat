export interface emoticon {
  keyword: string,
  level: number,
  align: string,
  height: number | string,
  url: string
}

export type Config = {
  emoticons?: emoticon[],
  [x: string]: any
};

export function mergeConfig(config: Config, defaultConfig: Config) {
  let res: Config = {}
  for (let i in defaultConfig) {
    res[i] = i in config ? config[i] : defaultConfig[i]
  }
  return res
}

export function toBool(val: string) {
  if (typeof val === 'string') {
    return ['false', 'no', 'off', '0', ''].indexOf(val.toLowerCase()) === -1
  }
  return Boolean(val)
}

export function toInt(val: string, _default: number = 0) {
  let res = parseInt(val)
  if (isNaN(res)) {
    res = _default
  }
  return res
}

export function toFloat(val: string, _default: number = 0) {
  let res = parseFloat(val)
  if (isNaN(res)) {
    res = _default
  }
  return res
}

export function formatCurrency(price: number) {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: price < 100 ? 2 : 0
  }).format(price)
}

export function getTimeTextHourMin(date: Date) {
  let hour = date.getHours()
  let min = `00${date.getMinutes()}`.slice(-2)
  return `${hour}:${min}`
}

export function getTimeTextByFormat(date: Date, format: string = 'HH:mm') {
  let year = date.getFullYear().toString()
  let month = `0${date.getMonth() + 1}`.slice(-2)
  let day = `0${date.getDate()}`.slice(-2)
  let hour = `0${date.getHours()}`.slice(-2)
  let min = `00${date.getMinutes()}`.slice(-2)
  let sec = `00${date.getSeconds()}`.slice(-2)
  let res = format.replace('YYYY', year)
   .replace('YY', year.slice(-2))
   .replace('MM', month)
   .replace('DD', day)
   .replace('HH', hour)
   .replace('mm', min)
   .replace('ss', sec)
  return res
}

export function getUuid4Hex() {
  let chars = []
  for (let i = 0; i < 32; i++) {
    let char = Math.floor(Math.random() * 16).toString(16)
    chars.push(char)
  }
  return chars.join('')
}

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};