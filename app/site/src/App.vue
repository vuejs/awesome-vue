<template>
  <div id="app">
    <section class="left">
      <div class="wrap">
        <hgroup>
          <h1><span class="thin">Awesome</span> Vue.js</h1>
          <h2 class="tagline thin">A curated list of awesome things related to
            <a href="https://vuejs.org/">Vue.js</a></h2>
        </hgroup>
        <form>
          <label>
            <input
              type="search"
              placeholder="type to filter"
              v-model="q"
              id="seachField"
              autofocus="autofocus">
            <a :href="'#' + q"
              v-show="q.trim()"
              title="Link to this search"
              class="link">
              <i class="fa fa-link"></i>
            </a>
          </label>
        </form>
        <explore></explore>

        <footer>
          <a href="https://github.com/vuejs/awesome-vue"
            title="Contribute on GitHub"
            class="github">
            <i class="fa fa-github"></i>
          </a>
        </footer>
      </div>
    </section>

    <div class="right">
      <div class="wrap">
        <group v-for="g in groups" :group="g"></group>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { event } from './utils'
import group from './components/Group.vue'
import explore from './components/Explore.vue'

export default {
  components: { group, explore },

  data () {
    return {
      groups: window.data,
      q: ''
    }
  },

  watch: {
    q() {
      let q = this.q.trim()

      if (q === 'everything') {
        q = ''
      }

      if (!q) {
        this.groups = window.data
        return
      }

      this.groups = this.filter(_.cloneDeep(window.data), q)
    }
  },

  created() {
    event.on('tag-selected', tag => {
      this.q = tag[0]

      // Set the focus into the search field. Some little UX doesn't kill.
      this.$nextTick(() => {
        document.getElementById('seachField').focus()
      })
    })

    if (window.location.hash) {
      this.q = /^#(.*)/.exec(window.location.hash)[1].toLowerCase()
    }
  },

  methods: {
    /**
     * Filter our awesome data.
     * @param  {Array.<Object>} groups The groups to apply filtering on
     * @param  {String} q
     * @return {Array}
     */
    filter(groups, q) {
      q = q.toLowerCase()
      const res = []
      _.each(groups, g => {
        // If the group name contains the keyword, it passes the test.
        if (g.name.toLowerCase().indexOf(q) !== -1) {
          res.push(g)
          return
        }

        // Keep a copy of the original children and work out the filtered ones.
        const children = g.children
        g.children = []

        // Recursively process the subgroups, if any.
        const subGroups = _.filter(children, { type: 'group' })
        if (subGroups.length) {
          g.children = this.filter(subGroups, q)
        }

        // Apply our filter logic on the items.
        const items = _.filter(children, item => {
          return item.type === 'item'
            && this.buildFilterHaystack(item).indexOf(q) !== -1
        })

        g.children = _.concat(g.children, items)

        if (g.children.length) {
          res.push(g)
        }
      })

      return res
    },

    /**
     * Build a "haystack" of keywords to filter.
     * @param  {Object} item
     * @return {String}
     */
    buildFilterHaystack(item) {
      let haystack = ''

      _.each(['name', 'description', 'url'], p => {
        if (item.content[p]) {
          haystack += ` ${item.content[p]}`
        }
      })

      if (item.content.author) {
        haystack += ` ${item.content.author.name}`
      }

      return _.reduce(item.content.tags, (h, tag) => `${h} ${tag}`, haystack)
        .toLowerCase()
        .trim()
    }
  }
}
</script>

<style lang="sass">
body, html {
  font: 400 15px/22px "Source Sans Pro", sans-serif;
  color: #34495e;
  height: 100%;
}

*, *::before, *::after {
  box-sizing: border-box;
}

a {
  color: #3cb982;
  text-decoration: none;
  transition: color .3s;

  &:hover {
    color: darken(#3cb982, 20%);
  }
}

.thin {
  font-weight: 300;
}

#app {
  display: flex;
  flex-flow: row wrap;
  height: 100%;
  overflow: hidden;

  .left, .right {
    width: 50%;
    padding: 64px;
  }

  .left {
    text-align: right;
    border-right: 1px solid #ebebeb;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: #fcfcfc;

    hgroup {
      h1 {
        font-size: 2.7rem;
        margin-bottom: 1.6rem;
      }

      h2 {
        font-size: 1.3rem;
        margin-bottom: 2.4rem;
      }
    }

    form {
      margin-bottom: 1.2rem;

      label {
        display: inline-block;
        overflow: hidden;
        position: relative;
      }

      $searchHeight: 36px;

      input[type="search"]::-webkit-search-decoration,
      input[type="search"]::-webkit-search-cancel-button,
      input[type="search"]::-webkit-search-results-button,
      input[type="search"]::-webkit-search-results-decoration {
        display: none;
      }

      input[type="search"] {
        -webkit-appearance: none;
        border: 1px solid #ebebeb;
        height: $searchHeight;
        line-height: $searchHeight;
        border-radius: $searchHeight/2;
        width: 234px;
        outline: none;
        background: #fff url(./assets/search.png) 8px no-repeat;
        background-size: 24px;
        padding: 0 40px 0 32px;
        font: 300 1rem "Source Sans Pro", sans-serif;
        transition: border-color .3s;

        &:focus {
          border-color: #42b983;
        }
      }

      .link {
        background: #42b983;
        background: linear-gradient(to bottom,  #42b983 0%,#2a8f61 100%);
        color: #fff;
        height: $searchHeight;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 0 $searchHeight/2 $searchHeight/2 0;
        line-height: $searchHeight;
        padding: 0 12px;

        &:hover {
          background: linear-gradient(to top,  #42b983 0%,#2a8f61 100%);
        }

        &:active {
          background: linear-gradient(to top,  #42b983 0%, darken(#2a8f61, 10%) 100%);
          box-shadow: inset -2px 3px 4px rgba(0,0,0,.2);
        }
      }
    }
  }

  .right {
    overflow: auto;

    .wrap {
      max-width: 480px;
    }
  }
}

@keyframes soho {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(-8deg);
  }
  100% {
    transform: rotate(0);
  }
}

footer {
  margin-top: 4rem;

  .github {
    color: #34495e;
    font-size: 2rem;
    width: 149px;
    display: inline-block;
    position: relative;

    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 27px;
      background: url(./assets/look-here.png) no-repeat;
      background-size: 149px;
      position: absolute;
      right: -5px;
      transform: rotate(-4deg);
      transform-origin: 100% 0;
    }

    &:hover::after {
      animation: soho 1s ease-in-out infinite;
    }
  }
}
</style>
