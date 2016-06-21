import { event } from '../utils'

const filterByTag = {
  methods: {
    filterByTag(tag) {
      event.emit('tag-selected', tag)
    }
  }
}

export { filterByTag }
