// import MainPage from 'pages/MainPage.vue'
import SystemIntroduction from 'pages/SystemIntroduction.vue'
import TextSimilarity from 'pages/TextSimilarity.vue'
import TextSentiment from 'pages/TextSentiment.vue'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'system-introduction', component: SystemIntroduction },
      { path: 'text-similarity', component: TextSimilarity },
      { path: 'text-sentiment', component: TextSentiment }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
