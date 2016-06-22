<template>
  <section>
    <h1>{{ group.name }}</h1>
    <group v-for="g in subGroups" :group="g"></group>
    <item v-for="i in items" :item="i.content"></item>
  </section>
</template>

<script>
import _ from 'lodash'
import item from './Item.vue'

export default {
  props: ['group'],
  components: { item },
  computed: {
    items() {
      return _.filter(this.group.children, { type: 'item' })
    },
    subGroups() {
      return _.filter(this.group.children, { type: 'group' })
    }
  }
}
</script>

<style lang="sass" scoped>
section {
  > h1 {
    font-size: 2rem;
    margin: 1.5rem 0 1.7rem;
  }

  > section {
    h1 {
      font-size: 1.6rem;
      margin: 1.2rem 0;
    }
  }
}
</style>
