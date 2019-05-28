import { version } from './package'

export default {
  mode: 'universal',
  env: {
    version
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' }
    ],
    link: [
      { rel: 'stylesheet', href: '//rawgit.com/filipelinhares/ress/master/dist/ress.min.css' },

      // Windows
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
      // MAC
      { rel: 'icon', type: 'image/png', href: '/favicon.png' }
    ],
    script: [
      { src: 'http://unpkg.com/@kotodaman-unofficial/dictionary' }
    ]
  },
  build: {
    cssSourceMap: false, // https://github.com/vuetifyjs/vuetify/issues/3403
    extend (config, { isDev, isClient }) {
      if (!isDev) {
        config.devtool = false
      }
      // https://github.com/nuxt-community/modules/issues/185
      config.resolve.alias['vue'] = 'vue/dist/vue.js'
    }
  },
  modules: [
    ['cookie-universal-nuxt', { parseJSON: false }]
  ],
  plugins: [
    { src: '~/plugins/store.js' },
    { src: '~/plugins/browser.js', ssr: false }
  ]
}
