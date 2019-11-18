// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import httpRequest from './util/httpRequest'
import Vuex from 'vuex'
import store from './store/store'
import { Toast, Dialog, Popup, Button, Checkbox, CheckboxGroup, Notify, Icon, RadioGroup, Radio, Cell, CellGroup, Lazyload} from 'vant'
import 'vant/lib/index.css'
import VueWechatTitle from 'vue-wechat-title'
import './style.css'
Vue.use(Vuex)
Vue.use(VueWechatTitle).use(Toast).use(Dialog).use(Popup).use(Cell).use(CellGroup).use(Lazyload)
.use(Button).use(Checkbox).use(CheckboxGroup).use(Notify).use(Icon).use(Radio).use(RadioGroup)

// import layout from './components/layout'

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// 根据路由设置标题
router.beforeEach((to, from, next) => {
  // 路由发生改变修改页面的title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
