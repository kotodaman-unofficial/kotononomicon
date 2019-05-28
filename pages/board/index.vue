<template>
  <div>
    <ul>
      <li>
        <nuxt-link to="/board/new">
          自分で作る（β版）
        </nuxt-link>
      </li>
      <li v-for="(enemy, index) in enemies" :key="index">
        <nuxt-link :to="{path:'/board/'+enemy.boards[0].word, query: {id: enemy.id, wall: enemy.boards[0].wall}}">
          {{ enemy.name }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import enemies from '~/enemies'

export default {
  data () {
    return { enemies }
  }
}
</script>

<style lang="stylus" scoped>
a
  cursor pointer
  color #339
  text-decoration none
</style>
