<template>
  <article>
    <h1>
      <a v-if="item.url" :href="item.url">{{ item.name }}</a>
      <span v-else>{{ item.name }}</span>
      <span class="author thin" v-if="item.author">by
        <a v-if="item.author.url" :href="item.author.url">{{ item.author.name }}</a>
        <template v-else>{{ item.author.name }}</template>
      </span>
    </h1>
    <p class="thin" v-if="item.description">{{ item.description }}</p>
    <footer class="thin" v-if="item.tags">
      <ul>
        <li v-for="tag in item.tags">
          <a :href="'#' + tag" @click="filterByTag(tag)">{{ tag }}</a>
        </li>
      </ul>
    </footer>
  </article>
</template>

<script>
import { filterByTag } from '../mixins'

export default {
  props: ['item'],
  mixins: [filterByTag]
}
</script>

<style lang="sass" scoped>
article {
  border-bottom: 1px solid #efefef;
  padding: 17px 0;

  &:first-of-type {
    padding-top: 0;
  }

  h1 {
    font-size: 1.2rem;
    margin-bottom: .5rem;

    &:only-child {
      margin-bottom: 0;
    }
  }

  footer {
    margin-top: .8rem;

    ul {
      &::before {
        font-family: FontAwesome;
        content: "\f02c";
        color: #7f8c8d;
        margin-right: 6px;
      }
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
}
</style>
