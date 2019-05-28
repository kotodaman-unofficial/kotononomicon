<template>
  <div>
    <h2>{{ enemy.name }}</h2>
    <h3>
      盤面：<input v-model="word" class="board">
      <form @submit.prevent="reload">
        デッキ：<input v-model="deck" class="need" maxlength="14">
      </form>
    </h3>

    <section>
      <div class="result">
        <p>
          必要文字で絞り込み：<input
            v-model="needle"
            v-focus
            class="needle"
            maxlength="4"
          >
        </p>
        <div v-if="rows.length">
          <p>{{ rows.length.toLocaleString() }}件あるぞい！</p>

          <ul>
            <li v-for="(item, index) in rows" :key="index">
              <nuxt-link class="word" :to="{path:'/',query: {q:item.word}}">
                <component :is="highlightDeck(item)" />
                <span>{{ item.word.length }}文字</span>
                <span>{{ item.combo }}コンボ</span>
                （<span>{{ item.displays[0] }}</span>）
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div v-else>
          <p v-if="needle">
            １件もなかったぞい！
          </p>
          <p v-else>
            １件もないぞい デッキのコトダマンを増やしてくれい！
          </p>
        </div>
      </div>
      <div
        v-if="$route.query.id"
        v-shortkey="{up: ['arrowup'], down: ['arrowdown']}"
        class="enemy"
        @shortkey="changeBoard"
      >
        <h3>盤面を変える：</h3>
        <ul>
          <li v-for="(board, index) in enemy.boards" :key="index">
            <nuxt-link :to="{path: `/board/${board.word}`, query: getQuery(board)}">
              {{ board.word }}
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/board/new">
              自分で作る（β版）
            </nuxt-link>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { keyNormalizes } from '../../constant'
import enemies from '~/enemies'

function withExtraDeck (deck, deckExtra) {
  deckExtra = deckExtra.match(/./g)

  const newDeck = deck.match(/./g)
  if (deckExtra && deckExtra.length) {
    deckExtra.forEach(key => {
      if (deck.indexOf(key) === -1) {
        newDeck.push(key)
      }
    })
  }
  return newDeck.join('')
}

export default {
  watchQuery: true,
  computed: {
    deck: {
      get () {
        const id = this.$route.query.id || '_'
        return this.$store.state.decks[id] || (enemies.find(enemy => enemy.id === id) || {}).deck || 'ういんく'
      },
      set (deck) {
        const { id } = this.$route.query
        const data = { id: id || '_', deck }
        this.$store.commit('saveDeck', data)
      }
    },
    needle: {
      get () {
        return this.$route.query.needle || ''
      },
      set (needle) {
        const query = this.$route.query
        this.$router.replace({ query: { ...query, needle } })
      }
    },
    rows () {
      const word = this.word
      const needle = this.needle.length ? this.needle.match(/./g).map(chunk => keyNormalizes[chunk] || chunk).join('') : ''
      const deck = withExtraDeck(this.deck, needle)
      let { wall } = this.$route.query

      const rows = kotodamanFinder.board(word, { deck, wall })
      if (!needle) {
        return rows
      }
      return kotodamanFinder.need(needle, rows)
    },
    enemy () {
      const id = this.$route.query.id || '_'
      return (enemies.find(enemy => enemy.id === id) || {}) || {}
    }
  },
  async asyncData ({ params, query, app, store }) {
    const word = params.word
    return { word }
  },
  methods: {
    getQuery (board) {
      const query = {}
      query.id = this.$route.query.id
      query.wall = board.wall
      if (this.needle) {
        query.needle = this.needle
      }
      return query
    },
    changeBoard ({ srcKey }) {
      const boards = this.enemy.boards || []
      const index = boards.map(board => board.word).indexOf(this.word)
      let board
      if (srcKey === 'up') {
        board = boards[index - 1]
      }
      if (srcKey === 'down') {
        board = boards[index + 1]
      }

      if (board) {
        this.$router.push({ path: `/board/${board.word}`, query: this.getQuery(board) })
      }
    },
    reload () {
      const deck = this.deck + ''
      const { id, wall } = this.$route.query
      const data = { id: id || '_', deck }
      this.$store.commit('saveDeck', data)

      this.$nextTick(() => {
        this.$router.replace({ query: { id, wall } })
      })
    },
    highlightDeck (item) {
      const { index, board } = kotodamanFinder.parallelMerge(this.word, item.word, !this.$route.query.wall)
      const mergedBoard = []
      board.forEach(([board, word], pos) => {
        if (pos < index) {
          mergedBoard.push('＿')
          return
        }
        if (mergedBoard.length >= item.word) {
          mergedBoard.push('＿')
          return
        }

        if (word) {
          mergedBoard.push(`<em class="need">${word}</em>`)
        } else if (item.word.length <= pos - index) {
          mergedBoard.push('＿')
        } else {
          mergedBoard.push(board || '＿')
        }
      })

      return {
        template: `<span>${mergedBoard.join('')}</span>`
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
input
  border #339 1px solid
input[readonly]
input.board
  background #EEE
  width 8em
  text-align center
input.needle
  width 5em
form
  display inline-block
a
  cursor pointer
  color #339
  text-decoration none

section
  display flex
  margin-top 1em

  .result
    flex 7
    min-width 26em
    @media screen and (max-width 799px)
      min-width 20em
      font-size 3.5vw

      li
          white-space nowrap
          overflow hidden
          text-overflow ellipsis

  .enemy
    flex 3
    @media screen and (max-width 799px)
      min-width 7em
      overflow hidden
      h3
        font-size small

  ul
    list-style-type none

.nuxt-link-exact-active
  font-weight bold
  text-decoration underline
</style>

<style lang="stylus">
input.need
em.need
  color white
  background #339
  font-style normal
</style>
