import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import utils from './js/utils'
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
Vue.prototype.$utils = utils;
import { format } from 'timeago.js';

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.meta.auth === true) {
    let token = utils.getToken();
    if (!token) {
      next({
        name: "Login",
        query: {
          url: window.location.href,
        },
      });
      return
    }
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
Vue.mixin({
  methods: {
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push({ name: "Index" })
      } else {
        this.$router.back(-1)
      }
    },
  }
})


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')