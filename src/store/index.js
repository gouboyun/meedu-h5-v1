import Vue from 'vue'
import Vuex from 'vuex'
import Utils from '@/js/utils';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: null,
    config: null,
    func: {
      // 邀请码功能[该功能是meedu自带功能，如果您使用了三级分销插件可关闭该功能]
      promoCode: true,
      // 直播[需购买插件：https://addons.meedu.vip/addons/24/Zhibo]
      live: false,
      // 电子书[需购买插件：https://addons.meedu.vip/addons/17/MeeduBooks]
      book: false,
      // 考试[需购买插件：https://addons.meedu.vip/addons/36/Paper]
      paper: false,
      // 练习
      practice: true,
      // 模拟考试
      mockPaper: true,
      // 错题本
      wrongBook: false,
      // 话题[需购买插件：https://addons.meedu.vip/addons/16/MeeduTopics]
      topic: false,
      // 兑换码[需购买插件：https://addons.meedu.vip/addons/45/CodeExchanger]
      codeExchanger: false,
      // H5微信公众号授权登录
      selfWechatLogin: true,
      // H5-QQ登录
      qqLogin: false,
      // 三级分销[需购买插件：https://addons.meedu.vip/addons/12/MultiLevelShare]
      share: false,
      // 随机拍照[需购买插件：https://addons.meedu.vip/addons/41/Snapshot]
      snapshort: false,
      // 大小班课[需购买插件：https://addons.meedu.vip/addons/35/XiaoBanKe]
      ke: false,
    },


  },
  mutations: {
    submitLogin(state, user) {
      state.user = user;
      state.isLogin = true;
    },
    setConfig(state, config) {
      state.config = config;
    },
    logout(state) {
      state.user = null;
      state.isLogin = false;
      Utils.clearToken();
    },
  },
  actions: {
  },
  modules: {
  }
})
