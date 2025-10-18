<template>
  <el-row :gutter="20">
    <el-col :sm="24" :md="16">
      <el-form label-width="150px" size="small">
        <el-color-picker v-if="false"/>
        <!-- <el-input-number /> -->
        <!-- <el-slider /> -->
        <!-- <el-input /> -->
        <!-- <el-select /> -->
        <!-- <el-switch /> -->
        <el-card shadow="never">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" v-for="item in vizItems" :key="item.label + item.property">
              <el-form-item :label="item.label">
                <component :is="item.component" v-bind="item.bind" v-model.lazy="item.value" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <el-form label-width="150px" size="small">
        <h3>{{ $t('stylegen.result') }}</h3>
        <el-card shadow="never" style="overflow: visible;">
          <div class="editor-wrapper">
            <CodeEditor class="code-editor" v-model:value="inputResult" language="css" theme="vs" :options="options" />
          </div>
          <div class="actions">
            <el-button type="primary" @click="copyResult">{{ $t('stylegen.copy') }}</el-button>
          </div>
        </el-card>
      </el-form>
    </el-col>

    <el-col :sm="24" :md="8">
      <el-affix>
        <el-form inline style="line-height: 40px">
          <el-form-item :label="$t('stylegen.playAnimation')" style="margin: 0">
            <el-switch v-model="playAnimation" @change="onPlayAnimationChange"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('stylegen.backgrounds')" style="margin: 0 0 0 30px">
            <el-switch v-model="exampleBgLight" :active-text="$t('stylegen.light')"
              :inactive-text="$t('stylegen.dark')"></el-switch>
          </el-form-item>
        </el-form>
        <div id="example-container" :class="{ light: exampleBgLight }">
          <div id="fakebody">
            <Room :is-test-room="true" ref="roomRef" />
          </div>
        </div>
      </el-affix>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, useTemplateRef } from 'vue'
import Room from '../Room.vue'
import { debounce } from '../../utils'
import { CodeEditor } from 'monaco-editor-vue3'
import { useViz } from './viz'

const options = {
  colorDecorators: true,
  tabSize: 2,
  automaticLayout: true,
}

// 动态尝试加载 ./style.css 静态文件作为初始值
async function tryInitStyle() {
  const res = await fetch('./style.css')
  console.log(res)
  // 判断是否为 css 类型
  if (res.headers.get('content-type')?.includes('text/css')) {
    const styleText = await res.text()
    inputResult.value = styleText
  }
}

onMounted(tryInitStyle)

const inputResult = ref('')
const debounceResult = ref('')
const playAnimation = ref(true)
const exampleBgLight = ref(false)

const { vizItems } = useViz(inputResult)

type RoomType = InstanceType<typeof Room>
const roomRef = useTemplateRef<RoomType>('roomRef')

const styleElement = document.createElement('style')
document.head.appendChild(styleElement)

const exampleCss = computed(() => debounceResult.value.replace(/^body\b/gm, '#fakebody'))

watch(inputResult, debounce((val: string) => {
  debounceResult.value = val
}, 500))

watch(exampleCss, (val) => {
  styleElement.innerText = val
})

onMounted(() => {
  debounceResult.value = inputResult.value
})

onBeforeUnmount(() => {
  document.head.removeChild(styleElement)
})

function onPlayAnimationChange(value: boolean | string | number) {
  if (value) {
    roomRef.value?.start()
  } else {
    roomRef.value?.stop()
  }
}

function copyResult() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(inputResult.value)
  } else {
    const el = document.createElement('textarea')
    el.value = inputResult.value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}
</script>

<style scoped lang="scss">
#example-container {
  height: calc(100vh - 150px);

  background-color: #444;
  background-image:
    -moz-linear-gradient(45deg, #333 25%, transparent 25%),
    -moz-linear-gradient(-45deg, #333 25%, transparent 25%),
    -moz-linear-gradient(45deg, transparent 75%, #333 75%),
    -moz-linear-gradient(-45deg, transparent 75%, #333 75%);
  background-image:
    -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #333), color-stop(.25, transparent)),
    -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #333), color-stop(.25, transparent)),
    -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #333)),
    -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #333));

  -moz-background-size: 32px 32px;
  background-size: 32px 32px;
  -webkit-background-size: 32px 32px;

  background-position: 0 0, 16px 0, 16px -16px, 0px 16px;

  padding: 25px;

  resize: both;
  overflow: hidden;
}

#example-container.light {
  background-color: #ddd;
  background-image:
    -moz-linear-gradient(45deg, #eee 25%, transparent 25%),
    -moz-linear-gradient(-45deg, #eee 25%, transparent 25%),
    -moz-linear-gradient(45deg, transparent 75%, #eee 75%),
    -moz-linear-gradient(-45deg, transparent 75%, #eee 75%);
  background-image:
    -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #eee), color-stop(.25, transparent)),
    -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #eee), color-stop(.25, transparent)),
    -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #eee)),
    -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #eee));
}

#fakebody {
  outline: 1px #999 dashed;
  height: 100%;
}

.actions {
  margin: 16px;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

code-editor {
  resize: vertical;
  min-height: 400px;
  overflow: auto;
}

.editor-wrapper {
  resize: vertical;
  overflow: auto;
  height: 400px;
  min-height: 400px;
}
</style>