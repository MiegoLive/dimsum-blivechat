import { createWebHashHistory, createRouter } from 'vue-router'
import { RouteRecordRaw } from 'vue-router'
import Layout from './layout/index.vue'
import Home from './views/Home.vue'
import StyleGenerator from './views/StyleGenerator/index.vue'
import Help from './views/Help.vue'
import Room from './views/Room.vue'
import NotFound from './views/NotFound.vue'

const routes : Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'stylegen', name: 'stylegen', component: StyleGenerator },
      { path: 'help', name: 'help', component: Help }
    ]
  },
  {
    path: '/room/test',
    name: 'test_room',
    component: Room,
    props: route => ({ strConfig: route.query, isTestRoom: true })
  },
  {
    path: '/room/',
    name: 'room',
    component: Room,
    props: route => ({ strConfig: route.query, isTestRoom: false })
  },
  { path: '/:pathMatch(.*)', component: NotFound }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})