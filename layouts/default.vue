<template>
  <div>
    <h1>
      <nuxt-link to="/">
        ことののみこん-v{{ version }}
      </nuxt-link>
      <nuxt-link to="/amulet">
        お守り
      </nuxt-link>
      <nuxt-link to="/board" class="board">
        盤面
      </nuxt-link>
    </h1>

    <Nuxt class="main" />
  </div>
</template>

<script>
export default {
  data () {
    const version = process.env.version
    return { version }
  }
}
</script>

<style lang="stylus">
*
  font-family YuGothic, monospace, "ヒラギノ角ゴ ProN", sans-serif

input
  cursor pointer
  @media screen and (max-width 799px)
    box-sizing border-box
    padding-top .25em
    line-height 1.25 // fix safari text bug
a
button
  cursor pointer
  text-decoration none
  color #339
</style>

<style lang="stylus" scoped>
h1
  white-space nowrap
  overflow hidden
  margin-bottom .5em
  @media screen and (max-width 799px)
    font-size 5vw

  a:not(.nuxt-link-exact-active)
    opacity .5

  .board.nuxt-link-active
    opacity 1

.main
  max-width 800px

.main::after
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  content ''
  background url('/background.png') no-repeat right bottom
  opacity 0.1
  z-index -1
  max-width 800px
</style>
