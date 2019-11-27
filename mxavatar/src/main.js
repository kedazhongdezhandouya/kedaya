import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData;
Vue.prototype.globalData.token = '';  // 消息推送token
Vue.prototype.globalData.requestNum = 0;  // 发送formId次数(只发送10次)
Vue.prototype.globalData.scene = 1;  // 判断是否重新进入小程序

