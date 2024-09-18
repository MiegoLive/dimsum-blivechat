<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      router
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="rgb(64, 158, 255)"
      :default-active="$route.path"
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>{{ t('sidebar.home') }}
      </el-menu-item>
      <el-menu-item index="/stylegen">
        <el-icon><BrushFilled /></el-icon>{{ t('sidebar.stylegen') }}
      </el-menu-item>
      <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2" target="_blank">
        <el-menu-item>
          <el-icon><QuestionFilled /></el-icon>{{ t('sidebar.help') }}
        </el-menu-item>
      </a>
      <a href="https://github.com/DoodleBears/blivechat" target="_blank">
        <el-menu-item>
          <el-icon><Share /></el-icon>{{ t('sidebar.projectAddress') }}
        </el-menu-item>
      </a>
      <a href="http://link.bilibili.com/ctool/vtuber" target="_blank">
        <el-menu-item>
          <el-icon><Link /></el-icon>{{ t('sidebar.giftRecordOfficial') }}
        </el-menu-item>
      </a>
      <el-sub-menu index="null">
        <template #title>
          <el-icon><ChatLineSquare /></el-icon>
          <span>Language</span>
        </template>
        <el-menu-item v-for="locale in LOCALES" :key="locale.locale" @click="onSelectLanguage(locale.locale)">
          {{ locale.name }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import {
  HomeFilled,
  BrushFilled,
  QuestionFilled,
  Share,
  Link,
  ChatLineSquare
} from '@element-plus/icons-vue'
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();

const LOCALES = ref([
  { locale: 'zh', name: '中文' },
  { locale: 'ja', name: '日本語' },
  { locale: 'en', name: 'English' }
]);

const onSelectLanguage = (newlocale: string) => {
  locale.value = newlocale;
};
</script>

<style>
.el-scrollbar {
  height: 100%;
}

.scrollbar-wrapper {
  overflow-x: hidden !important;
}

.scrollbar-wrapper .el-menu {
  border: none;
}
</style>