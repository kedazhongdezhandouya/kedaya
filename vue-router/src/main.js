import Vue from 'vue'
import App from './App'
// import router from './router'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'

Vue.config.productionTip = false
Vue.use(VueRouter)

/* eslint-disable no-new */
const router = new VueRouter({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'xiaoming',
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
