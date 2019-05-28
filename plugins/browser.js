import Vue from 'vue'
import vueShortkey from 'vue-shortkey'

Vue.use(vueShortkey)
// `v-focus` というグローバルカスタムディレクティブを登録します
Vue.directive('focus', {
  // ひも付いている要素が DOM に挿入される時...
  inserted: function (el) {
    // 要素にフォーカスを当てる
    el.focus()
  }
})
