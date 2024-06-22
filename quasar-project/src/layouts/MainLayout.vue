<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          人工智能培训平台
        </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
<!--        <q-item-label header>Essential Links</q-item-label>-->
<!--        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />-->
        <q-item-label header>导航</q-item-label>
        <q-item clickable v-ripple @click="goTo('system-introduction')">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            <q-item-label>系统介绍</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goTo('text-similarity')">
          <q-item-section avatar>
            <q-icon name="compare" />
          </q-item-section>
          <q-item-section>
            <q-item-label>文本相似度</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goTo('text-sentiment')">
          <q-item-section avatar>
            <q-icon name="sentiment_satisfied" />
          </q-item-section>
          <q-item-section>
            <q-item-label>文字情感分析</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'MainLayout'
})

const router = useRouter()
const leftDrawerOpen = ref(false)

// const linksList = [
//   {
//     title: 'Docs',
//     caption: 'quasar.dev',
//     icon: 'school',
//     link: 'https://quasar.dev'
//   },
//   {
//     title: 'Github',
//     caption: 'github.com/quasarframework',
//     icon: 'code',
//     link: 'https://github.com/quasarframework'
//   },
//   {
//     title: 'Discord Chat Channel',
//     caption: 'chat.quasar.dev',
//     icon: 'chat',
//     link: 'https://chat.quasar.dev'
//   },
//   {
//     title: 'Forum',
//     caption: 'forum.quasar.dev',
//     icon: 'record_voice_over',
//     link: 'https://forum.quasar.dev'
//   },
//   {
//     title: 'Twitter',
//     caption: '@quasarframework',
//     icon: 'rss_feed',
//     link: 'https://twitter.quasar.dev'
//   },
//   {
//     title: 'Facebook',
//     caption: '@QuasarFramework',
//     icon: 'public',
//     link: 'https://facebook.quasar.dev'
//   },
//   {
//     title: 'Quasar Awesome',
//     caption: 'Community Quasar projects',
//     icon: 'favorite',
//     link: 'https://awesome.quasar.dev'
//   }
// ]

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goTo (page) {
  router.push(`/${page}`)
}
</script>
