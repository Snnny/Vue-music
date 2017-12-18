import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// Vue.config.productionTip = false
import 'common/stylus/index.styl'
import vueLazyload from 'vue-lazyload'
import Loading from 'base/loading'
import store from './store'

// 解决移动端300ms延迟
import fastclick from 'fastclick'

fastclick.attach(document.body)

Vue.use(vueLazyload, {
  loading: require('common/image/default.png')
})
// 全局组件
Vue.use(Loading)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
