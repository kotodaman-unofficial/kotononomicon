<template>
  <div>
    <input
      v-model="word"
      v-focus
      class="board"
      placeholder="○○○○○○○"
      maxlength="7"
      :class="{[mode]:true}"
    >

    <div class="count">
      <nuxt-link v-if="word" class="reset" :to="{ path: $route.path, query: { ...$route.query, q: '' } }">
        入力をクリア
      </nuxt-link>
      <p v-if="found.count">
        <strong>{{ found.count.toLocaleString() }}</strong>件あるぞい！
      </p>
      <p v-else>
        ないぞい！
      </p>
    </div>

    <section class="main">
      <ul class="rows">
        <li v-for="(item, index) in found.rows.slice(0, 100)" :key="index" class="row">
          <nuxt-link class="word" :to="{ path: $route.path, query: { ...$route.query, q: item.word } }">
            {{ item.word }}
          </nuxt-link>
          <ul class="info">
            <li>
              <span v-for="(display, index) in item.displays" :key="index">{{ display }}</span>
            </li>
            <li v-if="item.themas.length">
              <span v-for="(thema, index) in item.themas" :key="index">{{ thema }}</span>
            </li>
            <li v-if="item.combo > 1">
              {{ item.combo }}コンボ <nuxt-link v-for="(word, index) in item.contains" :key="index" :to="{ path: $route.path, query: { ...$route.query, q: word } }">
                {{ word }}
              </nuxt-link>
            </li>
          </ul>
        </li>
        <li v-if="found.rows.length > 100">
          以下略
        </li>
      </ul>

      <div class="controller">
        検索条件：
        <div class="single">
          <label><input
            v-model="kanapad"
            type="checkbox"
          ><span v-if="kanapad">かな入力を閉じる</span><span v-else>かな入力する</span></label>
          <kanapad v-if="kanapad" @click="pushBoard" />
        </div>
        <div>
          一致：
          <label><input
            v-model="mode"
            type="radio"
            value="left"
          ><span>前方</span></label>
          <label><input
            v-model="mode"
            type="radio"
            value="center"
          ><span>あいまい</span></label>
          <label><input
            v-model="mode"
            type="radio"
            value="right"
          ><span>後方</span></label>
        </div>
        <div>
          文字：<label v-for="value in [2,3,4,5,6,7]" :key="value"><input
            v-model="digit"
            :value="value"
            type="checkbox"
          ><span>{{ value }}</span></label>
        </div>
        <div>
          テーマ：
          <label><input
            v-model="thema"
            type="radio"
            value=""
          ><span>テーマ検索OFF</span></label>
          <label><input
            v-model="thema"
            type="radio"
            :value="true"
          ><span>お守り適正あり</span></label>
          <label v-for="value in themas" :key="value"><input
            v-model="thema"
            type="radio"
            :value="value"
          ><span>{{ value }}</span></label>
        </div>
        <div class="single">
          <label><input
            v-model="order"
            type="checkbox"
            value="combo"
          ><span>コンボ数で並び替え</span></label>
        </div>
        <div class="single">
          <label><input
            v-model="strict"
            type="checkbox"
          ><span>濁音拗音を区別する</span></label>
        </div>

        <nuxt-link v-if="Object.keys($route.query).length > 1" class="reset" :to="{ path: $route.path, query: { q: $route.query.q } }">
          条件リセット
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
import { themas } from '../constant'

import kanapad from '~/components/kanapad'

function normalizeArray (value) {
  value = typeof value === 'string' ? Number(value) : value || []
  value = value.length > 0 ? value : value > 0 ? [value] : []
  return value
}

export default {
  components: { kanapad },
  data () {
    return { themas, kanapad: false }
  },
  computed: {
    found () {
      const { mode, digit, thema, order: [order], strict } = this

      try {
        return kotodamanFinder(this.word, { mode, digit, thema, order, strict })
      } catch (error) {
        console.error(error)
        return { count: 0, rows: [] }
      }
    },
    word: {
      get () {
        return this.$route.query.q || ''
      },
      set (q) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, q }
        })
      }
    },
    mode: {
      get () {
        return this.$route.query.mode || 'left'
      },
      set (mode) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, mode }
        })
      }
    },
    digit: {
      get () {
        return normalizeArray(this.$route.query.digit)
      },
      set (digit) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, digit }
        })
      }
    },
    thema: {
      get () {
        return this.$route.query.thema || ''
      },
      set (thema) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, thema }
        })
      }
    },
    order: {
      get () {
        return normalizeArray(this.$route.query.order)
      },
      set (order) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, order }
        })
      }
    },
    strict: {
      get () {
        return this.$route.query.strict === 'true' || this.$route.query.strict === true
      },
      set (strict) {
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, strict }
        })
      }
    }
  },
  methods: {
    pushBoard (key) {
      this.word += key
    }
  }
}
</script>

<style lang="stylus" scoped>
.board
  display block
  background #EEE
  width 100%

  font-size 114px
  @media screen and (max-width 799px)
    font-size 14vw

.board.center
  text-align center
.board.right
  text-align right

.count
  text-align center
  margin-bottom 1em

  p
    display inline-block

  .reset
    font-weight bold

section
  display flex
</style>

<style lang="stylus" scoped>
.rows
  flex 6
  minw-dith 12em
  .row
    + .row
      margin-top .5em

  .word
    font-size x-large
    display inline-block
    width 7em

  .info
    padding-left 1em
    font-size small
    list-style-type none

    li
      span + span
        margin-left 1em

</style>

<style lang="stylus" scoped>
.controller
  flex 4
  min-width 3em

  > div
    padding 0.25em 0

    span
      display inline-block
    span + span
      margin-left 1em
    a + a
      margin-left 1em

    label
      cursor pointer
      display inline-block
      min-width 1.5em
      text-align center

      margin 0 0.25em

  .single
    label
      margin 0

  input[type="checkbox"]
  input[type="radio"]
    display none

  :checked + *
    color #339
    font-weight bold
    text-decoration underline
</style>
