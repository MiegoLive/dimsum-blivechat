import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'

// @ts-ignore
self.MonacoEnvironment = {
  // @ts-ignore
  getWorker(_, label) {
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    return new editorWorker()
  },
}

createApp(App).use(router).use(i18n).mount('#app')
