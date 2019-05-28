<template>
  <div>
    <kanapad @click="redirect" />
  </div>
</template>

<script>
import kanapad from '~/components/kanapad'

export default {
  components: { kanapad },
  data () {
    return { kanapad: false }
  },
  methods: {
    redirect (key) {
      this.$router.push(`/amulet/${key}`)
    }
  }
}
</script>
