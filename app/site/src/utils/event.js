import Vue from 'vue'

const event = {
  bus: null,

  init() {
    if (!this.bus) {
      this.bus = new Vue()
    }

    return this.bus
  },

  emit(name, ...args) {
    this.bus.$emit(name, args)
  },

  on(name, func) {
    this.bus.$on(name, func)
  }
}

export { event }
