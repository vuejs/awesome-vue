import Vue from 'vue'
import App from './App.vue'
import Group from './components/Group.vue'
import { event } from './utils'

new Vue({
  el: '#app',
  render: h => h(App),
  created() {
    Vue.component('group', Group)
    event.init()
  }
})
