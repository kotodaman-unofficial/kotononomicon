<template>
  <div>
    <h2>{{ $route.params.kana }}</h2>
    <div v-for="result in sortedResults" :key="result.thema" class="result">
      <h3>{{ result.thema }}<small class="count">（全{{ (result.digit2.length + result.digit3.length + result.other.length).toLocaleString() }}件）</small></h3>
      <ul>
        <li>
          <nuxt-link :to="{path:'/',query:{q:$route.params.kana,mode:'center',thema: result.thema, digit:2}}">
            ２文字
          </nuxt-link>：<em class="count">{{ result.digit2.length.toLocaleString() }}件</em>
          <nav class="words">
            <span v-for="row in result.digit2" :key="result.thema + row.word">{{ row.word }}</span>
          </nav>
        </li>
        <li>
          <nuxt-link :to="{path:'/',query:{q:$route.params.kana,mode:'center',thema: result.thema, digit:3}}">
            ３文字
          </nuxt-link>：<em class="count">{{ result.digit3.length.toLocaleString() }}件</em>
          <nav class="words">
            <span v-for="row in result.digit3.slice(0, 7)" :key="result.thema + row.word">{{ row.word }}</span>
            <span v-if="result.digit3.length > 7">...</span>
          </nav>
        </li>
        <li>
          <nuxt-link :to="{path:'/',query:{q:$route.params.kana,mode:'center',thema: result.thema, digit:[4,5,6,7]}}">
            ほか
          </nuxt-link>：<em class="count">{{ result.other.length.toLocaleString() }}件</em>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    sortedResults () {
      return this.results.slice().sort((a, b) => {
        if (a.digit2.length > b.digit2.length) return -1
        if (a.digit2.length < b.digit2.length) return 1
        return 0
      })
    }
  },
  async asyncData ({ params }) {
    const results = kotodamanFinder.amulet(params.kana)
    return { results }
  }
}
</script>

<style lang="stylus" scoped>
a
  cursor pointer
  color #339
  text-decoration none

.result + .result
  margin-top 1em

.result
  position relative
  h3
    .count
      position absolute
      top 0
      left 8em

  ul
    li
      display block

      > a
        display inline-block
        min-width 3em
      > .count
        display inline-block
        min-width 6em
        font-style normal
        text-align right

.words
  span
    display inline-block

  span + span
    margin-left 1em
</style>
