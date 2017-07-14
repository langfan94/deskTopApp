import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import VueAwesomeSwiper from './components/vue-awesome-swiper'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/icon/style.styl'
import './assets/styles/index.styl'

Vue.use(VueAwesomeSwiper)
Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')
