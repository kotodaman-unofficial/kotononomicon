<template>
  <div>
    <ul v-for="(line, index) in kana" :key="index">
      <li v-for="(key, index) in line" :key="index">
        <button @click="click(key)">
          {{ key }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      kana: [
        'あいうえお',
        'かきくけこ',
        'さしすせそ',
        'たちつてと',
        'なにぬねの',
        'はひふへほ',
        'まみむめも',
        'やゆよわん',
        'らりるれろ'
      ]
    }
  },
  methods: {
    click (key) {
      this.$emit('click', key)
    }
  }
}
</script>

<style lang="stylus" scoped>
ul
  list-style-type none

  width 100%
  li
    display inline-block

    width 20%
    button
      width 100%
      line-height 2

      font-size x-large
      cursor pointer
</style>
