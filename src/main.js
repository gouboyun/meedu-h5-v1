import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './js/request/request';
import Message from 'vue-m-message'
import VueConfirmDialog from 'vue-confirm-dialog'
import { highlight } from 'vue-words-highlight';
import 'vue-m-message/dist/index.css'
// 全局样式
import './assets/commen/variable.less';

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$Request = Request;
Vue.prototype.$message = Message;
import { format } from 'timeago.js';

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
Vue.use(highlight, {
  name: 'highlight',
  className: 'blue',
  style: 'color: #3CA7FA',
  caseSensitive: false
})
Vue.filter('changeTime', function (dateStr) {
  return format(dateStr, 'zh_CN');
})
Vue.prototype.$setgoindex = function () {
  if (window.history.length <= 1) {
    if (location.href.indexOf('?') === -1) {
      window.location.href = location.href + '?goindex=true'
    } else if (location.href.indexOf('?') !== -1 && location.href.indexOf('goindex') === -1) {
      window.location.href = location.href + '&goindex=true'
    }
  }
}
Vue.prototype.goBack = function () {   // 点击返回按钮处罚的事件
  if (this.$route.query.goindex === 'true') {
    this.$router.push({ name: "Index" })
  } else {
    this.$router.back(-1)
  }
}


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')