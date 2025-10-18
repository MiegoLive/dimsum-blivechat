<template>
  <el-tooltip :content="$t('stylegen.fontSelectTip')">
    <el-select
      :model-value="innerValue"
      @update:model-value="onInnerInput"
      @visible-change="onSelectVisibleChange"
      multiple
      filterable
      allow-create
      default-first-option
      popper-class="font-select-popper"
      style="position: relative"
    >
      <el-option-group
        v-for="(groupCfg, index) in fontGroups"
        :key="index"
        :label="groupCfg.label"
      >
        <el-option v-for="font in groupCfg.fonts" :key="font" :value="font">
          <span class="fonts-select-name-line">
            <span>{{ font }}</span>
            <el-button
              v-if="groupCfg.isRecent"
              type="text"
              class="fonts-select-btn"
              style="color: #f56c6c"
              @click="() => deleteRecentFont(font)"
            >
              <i class="el-icon-delete" />
            </el-button>
          </span>
          <span class="fonts-select-sample" :style="{ fontFamily: font }">
            Sample 样例 サンプル
          </span>
        </el-option>
      </el-option-group>

      <el-option-group :label="$t('stylegen.networkFonts')">
        <el-option v-for="font in NETWORK_FONTS" :key="font" :value="font" />
      </el-option-group>

      <el-option-group :label="$t('stylegen.localFonts')">
        <el-option v-for="font in localFonts" :key="font" :value="font" />
      </el-option-group>
    </el-select>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import * as common from './common'
import * as fonts from './fonts'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

// Props
const props = defineProps<{
  modelValue: string
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Reactive state
const recentFonts = ref<string[]>(getRecentFonts())
const localFonts = ref<string[]>([])
const innerValue = ref<string[]>([])

// Constants
const PRESET_FONTS = fonts.PRESET_FONTS
const NETWORK_FONTS = fonts.NETWORK_FONTS

// Computed
const fontGroups = computed(() => [
  { fonts: recentFonts.value, label: t('stylegen.recentFonts'), isRecent: true },
  { fonts: PRESET_FONTS, label: t('stylegen.presetFonts') },
])

// Watch modelValue
watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = common.fontsStrToArr(val)
  },
  { immediate: true }
)

// Methods
function onInnerInput(val: string[]) {
  const addedFonts = val.filter((font) => !innerValue.value.includes(font))

  innerValue.value = val
  emit('update:modelValue', common.fontsArrToStr(innerValue.value))

  addedFonts.forEach((font) => addRecentFont(font))
}

function onSelectVisibleChange(visible: boolean) {
  if (!visible) return
  updateRecentFonts()
  updateLocalFonts()
}

function updateRecentFonts() {
  recentFonts.value = getRecentFonts()
}

async function updateLocalFonts() {
  localFonts.value = await fonts.getLocalFonts()
}

function getRecentFonts(): string[] {
  return common.fontsStrToArr(window.localStorage.recentFonts || '')
}

function setRecentFonts(fonts: string[]) {
  window.localStorage.recentFonts = common.fontsArrToStr(fonts)
}

function addRecentFont(font: string) {
  const list = getRecentFonts()
  const index = list.indexOf(font)
  if (index !== -1) list.splice(index, 1)
  list.unshift(font)
  setRecentFonts(list)
  updateRecentFonts()
}

function deleteRecentFont(font: string) {
  const list = getRecentFonts()
  const index = list.indexOf(font)
  if (index !== -1) {
    list.splice(index, 1)
    setRecentFonts(list)
    updateRecentFonts()
  }
}
</script>

<style>
.font-select-popper .el-select-dropdown__wrap {
  max-height: 500px;
}
</style>

<style scoped>
.el-select {
  width: 100%;
}

.font-select-popper .el-select-group .el-select-dropdown__item {
  display: flex;
  flex-direction: column;
  padding: 8px 20px;
  height: fit-content;
}

.fonts-select-name-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1.5em;
}

.fonts-select-btn {
  opacity: 0.2;
  transition: 0.5s;
  padding: 0 0 0 8px;
  margin-right: 20px;
}

.fonts-select-btn:hover {
  opacity: 1;
}

.fonts-select-sample {
  opacity: 0.4;
  line-height: 1.5em;
}
</style>