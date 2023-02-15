<template>
  <div id="app">
    <router-view />
    <show-model
      v-if="visible"
      :title="modelTitle"
      :text="modelText"
      :confirmText="confirmText"
      @change="confirmModel"
      @cancel="cancelModel"
    ></show-model>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ShowModel from "@/components/show-model.vue";

export default {
  components: {
    ShowModel,
  },
  data() {
    return {
      token: this.$route.query.token,
      verifyLoading: false,
      visible: false,
      modelTitle: null,
      modelText: null,
      confirmText: null,
    };
  },
  watch: {
    $route(to, from) {
      if (to.query.login_code && to.query.action === "login") {
        this.CodeLogin(to.query.login_code);
      }
    },
  },
  async mounted() {
    await this.getConfig();
    await this.autoLogin();
  },
  computed: {
    ...mapState(["config"]),
  },
  methods: {
    ...mapMutations(["submitLogin", "logout", "setConfig"]),
    cancelModel() {
      this.logout();
      this.visible = false;
      this.$router.replace({
        name: "Me",
      });
    },
    confirmModel() {
      this.visible = false;
      if (this.modelTitle === "实名认证") {
        this.goFaceVerify();
      } else if (this.modelTitle === "绑定手机号") {
        //将token临时存储
        let token = this.$utils.getToken();
        this.$utils.saveTmpToken(token);
        //清除已保存的token->形成未登录的情景->也就是必须绑定手机号之后才能登录
        this.$utils.clearToken();
        //跳转到手机号绑定页面
        this.$router.push({
          name: "BindMobile",
        });
      }
    },
    async autoLogin() {
      if (this.$route.name !== "Login") {
        let token = this.$utils.getToken();

        if (token) {
          await this.getUser();
        }
      }
    },
    async getUser() {
      try {
        //获取用户信息
        let res = await this.$api.User.Detail();

        //检测是否开启强制绑定手机号
        if (
          res.data.is_bind_mobile === 0 && //未绑定手机号
          this.config.member.enabled_mobile_bind_alert === 1 //已开启强制绑定手机号
        ) {
          this.modelTitle = "绑定手机号";
          this.modelText = "登录前请绑定手机号";
          this.confirmText = "立即绑定";
          this.visible = true;
          return;
        }

        //保存token到本地->意味着用户已完成登录
        this.submitLogin(res.data);

        //检测是否开启强制实名认证+未进行实名认证
        if (
          this.$route.name !== "FaceSuccesss" && //非实名认证结果查询页面
          res.data.is_face_verify === false && //未完成实名认证
          this.config.member.enabled_face_verify === true //已开启强制实名认证
        ) {
          this.modelTitle = "实名认证";
          this.modelText = "登录前请完成实名认证";
          this.confirmText = "立即认证";
          this.visible = true;
        }
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    async getConfig() {
      let res = await this.$api.Other.Config();
      this.setConfig(res.data);
      if (!this.$utils.isMobile()) {
        if (res.data.pc_url !== "") {
          window.location.href = res.data.pc_url;
        }
      }
    },
    goFaceVerify() {
      if (this.verifyLoading) {
        return;
      }
      this.verifyLoading = true;
      let redirect = this.$utils.getHost() + "/auth/faceSuccess";
      this.$api.Member.TecentFaceVerify({
        s_url: redirect,
      })
        .then((res) => {
          this.$utils.saveBizToken(res.data.biz_token);
          this.$utils.saveRuleId(res.data.rule_id);
          this.verifyLoading = false;
          window.location.href = res.data.url;
        })
        .catch((e) => {
          this.$message.error(e.message || "无法发起实名认证");
        });
    },
    CodeLogin(code) {
      if (this.$utils.getSessionLoginCode(code)) {
        return;
      }
      this.$utils.saveSessionLoginCode(code);
      this.$api.Auth.CodeLogin({ code: code })
        .then((res) => {
          if (res.data.success === 1) {
            this.$utils.saveToken(res.data.token);
            this.getUser();
          } else {
            if (res.data.action === "bind_mobile") {
              this.$utils.saveLoginCode(code);
              this.$router.push({
                name: "CodeBindMobile",
              });
            }
          }
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
  },
};
</script>
