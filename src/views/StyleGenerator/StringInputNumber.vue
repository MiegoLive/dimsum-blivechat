<template>
  <!-- 把 $attrs 与监听器全部透传，保证所有 el-input-number 能力都还在 -->
  <el-input-number
    :model-value="numValue"
    @update:modelValue="onInput"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

/* ---------------- props & emit ---------------- */
const props = defineProps({
  /* 外部 v-model 的字符串 */
  modelValue: { type: String, default: '0' },
  /* 小数位精度 */
  decimal: { type: Number, default: 0 },
  /* 字符串格式：'int' | 'float' | 'percent' | 自定义函数 */
  stringFormat: {
    type: [String, Function],
    default: 'int'
  },
  /* 如果你同时想要数字，用 .sync 拿回去 */
  modelNumber: { type: Number, default: 0 }
})
const emit = defineEmits(['update:modelValue', 'update:modelNumber'])

/* ---------------- 工具函数 ---------------- */
// 把外部字符串解析成数字
function parseNumber(str: string) {
  if (typeof str === 'number') return str
  if (typeof str !== 'string') return 0
  const n = parseFloat(str.toString().replace('%', ''))
  return Number.isNaN(n) ? 0 : n
}

// 把数字格式化成字符串
function stringifyNumber(n: number) {
  if (typeof props.stringFormat === 'function') {
    return props.stringFormat(n)
  }
  switch (props.stringFormat) {
    case 'percent':
      return `${n.toFixed(props.decimal)}%`
    case 'float':
      return n.toFixed(props.decimal)
    case 'int':
    default:
      return String(Math.round(n))
  }
}

/* ---------------- 内部真正给 el-input-number 用的数字值 ---------------- */
const numValue = computed(() => parseNumber(props.modelValue))

/* ---------------- 数值变化时同步回外部 ---------------- */
function onInput(val: any) {
  const str = stringifyNumber(val)
  emit('update:modelValue', str)
  emit('update:modelNumber', val)
}

/* ---------------- 外部字符串变化时，也同步数字出去（可选） ---------------- */
watch(
  () => props.modelValue,
  v => emit('update:modelNumber', parseNumber(v)),
  { immediate: true }
)
</script>