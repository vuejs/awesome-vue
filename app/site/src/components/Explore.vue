<template>
    <section class="explore">
      <h1 class="thin">Explore</h1>
      <ul>
        <li v-for="tag in coolStuff">
          <a :href="`#${tag}`"
            @click="filterByTag(tag)">{{ tag }}</a>
        </li>
      </ul>
    </section>
</template>

<script>
import { filterByTag } from '../mixins'

export default {
  mixins: [filterByTag],

  data() {
    return {
      coolStuff: [
        'tutorials',
        'official examples',
        'boilerplates',
        'websites',
        'projects using Vue.js',
        'everything'
      ]
    }
  }
}
</script>

<style lang="sass" scoped>
.explore {
  font-size: 1.25rem;

  h1 {
    margin-bottom: .4rem;
  }

  ul {
    max-width: 274px;
    display: inline-block;
    font-size: 1rem;
  }

  li {
    display: inline-block;

    &::before {
      content: "·";
      color: #7f8c8d;
      margin: 0 5px;
    }

    &:first-child::before {
      display: none;
    }
  }
}
</style>
