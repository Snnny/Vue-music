import Vue from 'vue'
import Loading from './loading'

const loading = {
  install: function(vue) {
    Vue.component('Loading', Loading)
  }
}

export default loading
