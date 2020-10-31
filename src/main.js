import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import api from './api'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$api = api

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
