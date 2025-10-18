<template>
  <el-switch
    :model-value="boolValue"
    @update:modelValue="onToggle"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

/* ---------------- props & emit ---------------- */

const props = withDefaults(
  defineProps<{
    modelValue: string
    falseValue: string
    trueValue: string
  }>(),
  {
    falseValue: 'false',
    trueValue: 'true',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/* ---------------- 字符串 ⇄ 布尔 双向映射 ---------------- */

// 外部字符串 → 内部布尔
const boolValue = computed<boolean>(() => props.modelValue === props.trueValue)

// 内部布尔 → 外部字符串
function onToggle(val: any) {
  emit('update:modelValue', val ? props.trueValue : props.falseValue)
}
</script>