import Vue from 'vue'
import App from './App'
// import router from './router'
import VueRouter from 'vue-router'
import Home from '@/components/home'
import About from '@/components/about'

Vue.config.productionTip = false
Vue.use(VueRouter)

/* eslint-disable no-new */
const router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/about',
      component: About
    }
  ]
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
