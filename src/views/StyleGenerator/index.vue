<template>
  <el-row :gutter="20">
    <el-col :sm="24" :md="16">
      <el-form label-width="150px" size="small">
        <h3>{{ $t('stylegen.result') }}</h3>
        <el-card shadow="never">
          <el-form-item label="CSS">
            <el-input v-model="inputResult" type="textarea" :rows="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="copyResult">{{ $t('stylegen.copy') }}</el-button>
          </el-form-item>
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
            <el-switch v-model="exampleBgLight" :active-text="$t('stylegen.light')" :inactive-text="$t('stylegen.dark')"></el-switch>
          </el-form-item>
        </el-form>
        <div id="example-container" :class="{ light: exampleBgLight }">
          <div id="fakebody">
            <Room :is-test-room="true" ref="roomRef"/>
          </div>
        </div>
      </el-affix>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, useTemplateRef } from 'vue'
import Room from '../Room.vue'
import { debounce } from '../../utils'

const activeTab = ref<'general' | 'legacy' | 'lineLike'>('general')
const inputResult = ref('')
const debounceResult = ref('')
const playAnimation = ref(true)
const exampleBgLight = ref(false)

type RoomType = InstanceType<typeof Room>
const roomRef = useTemplateRef<RoomType>('roomRef')

const subComponentResults = reactive({
  general: '',
  legacy: '',
  lineLike: ''
})

const styleElement = document.createElement('style')
document.head.appendChild(styleElement)

const subComponentResult = computed(() => subComponentResults[activeTab.value])
const exampleCss = computed(() => debounceResult.value.replace(/^body\b/gm, '#fakebody'))

watch(subComponentResult, (val) => {
  inputResult.value = val
})

watch(inputResult, debounce((val: string) => {
  debounceResult.value = val
}, 500))

watch(exampleCss, (val) => {
  styleElement.innerText = val
})

onMounted(() => {
  debounceResult.value = inputResult.value = subComponentResult.value
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
</style>