<template>
  <el-container class="app-wrapper" :class="{ mobile: isMobile }">
    <div v-show="isMobile && !hideSidebar" class="drawer-bg" @click="hideSidebar = true"></div>
    <el-aside width="230px" class="sidebar-container" :class="{ 'hide-sidebar': hideSidebar }">
      <div class="logo-container">
        <router-link :to="{ name: 'home' }">
          <img src="../assets/img/logo.png" class="sidebar-logo">
          <h1 class="sidebar-title">点心 BLiveChat</h1>
        </router-link>
      </div>
      <div class="version">
        {{ APP_VERSION }}-250924
      </div>
      <div class="version">
        <a href="https://space.bilibili.com/882177" target="_blank">特里羊羊Terry</a>
      </div>
      <div class="version">
        <a href="https://space.bilibili.com/3546391313910327" target="_blank">Miego糕社</a>
      </div>
      <details>
        <summary class="version">本项目基于只熊版BLC</summary>
        <div class="version">
          <a href="https://space.bilibili.com/12236936" target="_blank">只熊KUMA</a>
        </div>
        <div class="version">
          <a href="https://www.yuque.com/doodle-irifi/ueaigm/laogg2" target="_blank" style="color: #bed742;">使用教程</a>
        </div>
        <div class="version">
          <a href="https://www.yuque.com/doodle-irifi/ueaigm/stntb3" target="_blank">下载更新/版本记录</a>
        </div>
        <div class="version">
          <a href="https://github.com/xfgryujk/blivechat/releases" target="_blank">下载原版blivechat</a>
        </div>
      </details>
      <sidebar></sidebar>
    </el-aside>
    <el-main>
      <el-button v-show="isMobile" class="menu-button" :icon="Expand" @click="hideSidebar = false"></el-button>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { Expand } from '@element-plus/icons-vue'
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Sidebar from './Sidebar.vue';

const APP_VERSION = __APP_VERSION__;
const isMobile = ref(false);
const hideSidebar = ref(true);

const onResize = () => {
  isMobile.value = document.body.clientWidth <= 992;
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize(); // 初始调用以设置正确的值
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<style>
html {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE \8F6F \96C5 \9ED1 ", "微软雅黑", Arial, sans-serif;
}

html, body, #app, .app-wrapper, .sidebar-container {
  height: 100%;
}

body {
  margin: 0;
  background-color: #f6f8fa;
}

a, a:focus, a:hover {
  text-decoration: none;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.sidebar-container {
  background-color: #304156;
  overflow: hidden;
}

.app-wrapper.mobile .sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  transition-duration: 0.3s;
  z-index: 1001;
}

.app-wrapper.mobile .sidebar-container.hide-sidebar {
  pointer-events: none;
  transition-duration: 0.3s;
  transform: translate3d(-230px, 0, 0);
}

.sidebar-container .logo-container {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
}

.sidebar-container .logo-container .sidebar-logo {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 12px;
}

.sidebar-container .logo-container .sidebar-title {
  display: inline-block;
  margin: 0;
  color: #fff;
  font-weight: 600;
  line-height: 50px;
  font-size: 14px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
}

.sidebar-container .version {
  height: 30px;
  background: #2b2f3a;
  color: #aaa;
  font-weight: 600;
  line-height: 30px;
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
}

.sidebar-container .is-horizontal {
  display: none;
}

.version a {
  color: #409eff
}

summary.version {
  cursor: pointer;
}
</style>