<template>
  <div class="container">
    <captcha-dialog
      :status="openmask"
      :reStatus="reCaptcha"
      @change="sendSms"
      @cancel="qx"
    ></captcha-dialog>
    <div class="navheader borderbox" style="border-bottom:none;">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
    </div>
    <template v-if="!confirmDialog">
      <div class="sms-login-form">
        <div class="sms-login-title">登录/注册</div>
        <div class="item">
          <div class="name">手机号</div>
          <div class="input">
            <input
              type="number"
              class="input-text"
              placeholder="请输入手机号码"
              v-model="form.mobile"
            />
            <img
              v-show="form.mobile"
              src="../../assets/img/new/close.png"
              style="width:16px;height:16px;"
              @click="clearMobile()"
            />
          </div>
        </div>
      </div>

      <div class="box border-box mt-15 pl-60 pr-60">
        <div
          class="btn-confirm"
          :class="{ active: form.mobile }"
          @click="openDialog"
        >
          获取短信验证码
        </div>
      </div>

      <div class="login-button-box">
        <span class="login-password-way" @click="goLoginPasswordPage"
          >使用密码登录</span
        >
      </div>

      <protocol @agree="protocolAgree"></protocol>

      <!-- H5社交登录 -->
      <div class="login-other-way" v-if="config">
        <div class="socialite-box">
          <div
            class="socialite-login-item"
            v-if="!isInH5Wechat && config.socialites.qq === 1"
            @click="socialiteLogin('qq')"
          >
            <img src="../../assets/img/icon-qq.png" />
          </div>

          <div
            class="socialite-login-item"
            v-if="isInH5Wechat && config.socialites.wechat_oauth === 1"
            @click="h5WorkWeixinLogin()"
          >
            <img src="../../assets/img/wechat.png" />
          </div>
        </div>
      </div>
      <!-- #endif -->
    </template>
    <template v-if="confirmDialog">
      <confirm-login
        text="登录/注册"
        scene="login"
        :status="confirmDialog"
        :mobile="form.mobile"
        @change="loginHandler"
        @cancel="loginCancel"
      >
      </confirm-login>
    </template>
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
import Protocol from "../../components/protocol";
import ConfirmLogin from "./components/confirm-login";
import CaptchaDialog from "../../components/captcha-dialog";
import ShowModel from "@/components/show-model.vue";

import { mapState, mapMutations } from "vuex";

export default {
  components: {
    Protocol,
    ConfirmLogin,
    CaptchaDialog,
    ShowModel,
  },
  data() {
    return {
      loading: false,
      url: this.$route.query.url || null,
      captcha: {
        key: null,
        img: null,
      },
      form: {
        mobile: "",
        sms: "",
        captcha: "",
      },
      sms: {
        loading: false,
        max: 120,
        current: 0,
      },
      wechatMini: {
        userInfo: null,
        step: 1,
      },
      agreeProtocol: false,
      confirmDialog: false,
      openmask: false,
      reCaptcha: false,
      visible: false,
      modelTitle: null,
      modelText: null,
      confirmText: null,
    };
  },
  computed: {
    ...mapState(["config"]),
    isInH5Wechat() {
      return this.$utils.isWechat();
    },
  },
  mounted() {
    this.getCaptcha();
  },
  methods: {
    ...mapMutations(["submitLogin", "logout"]),
    cancelModel() {
      this.logout();
      this.visible = false;
      this.$router.replace({
        name: "Me",
      });
    },
    confirmModel() {
      if (this.modelTitle === "实名认证") {
        this.goFaceVerify();
      } else if (this.modelTitle === "绑定手机号") {
        this.$router.push({
          name: "BindMobile",
        });
      }
    },
    protocolAgree(bool) {
      this.agreeProtocol = bool;
    },
    loginCancel() {
      this.confirmDialog = false;
    },
    clearMobile() {
      this.form.mobile = null;
    },
    openDialog() {
      if (this.sms.loading) {
        // 冷却中
        return;
      }
      if (this.form.mobile.trim() === "") {
        return;
      }
      if (!this.$utils.isChinaMobilePhone(this.form.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      if (this.agreeProtocol === false) {
        this.$message.error("请同意协议");
        return;
      }
      this.form.captcha = null;
      this.openmask = true;
    },
    qx() {
      this.openmask = false;
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    sendSms(val, cap) {
      this.form.captcha = val;
      this.captcha = cap;
      if (!this.form.mobile) {
        return;
      }

      this.$api.Other.SendSms({
        mobile: this.form.mobile,
        image_key: this.captcha.key,
        image_captcha: this.form.captcha,
        scene: "login",
      })
        .then(() => {
          // 发送成功
          this.openmask = false;
          this.confirmDialog = true;
        })
        .catch((e) => {
          this.reCaptcha = !this.reCaptcha;
          this.$message.error(e.message);
        });
    },
    loginHandler(val) {
      if (this.loading) {
        return;
      }
      this.form.sms = val;
      this.$api.Auth.SmsLogin({
        mobile: this.form.mobile,
        mobile_code: this.form.sms,
        msv: "",
      })
        .then((res) => {
          this.loading = false;
          this.handler(res.data.token);
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    handler(token) {
      // 写入token
      this.$utils.saveToken(token);

      this.$api.User.Detail()
        .then((res) => {
          this.submitLogin(res.data);
          if (
            this.config.member.enabled_mobile_bind_alert === 1 &&
            res.data.is_bind_mobile !== 1
          ) {
            this.modelTitle = "绑定手机号";
            this.modelText = "登录前请绑定手机号";
            this.confirmText = "立即绑定";
            this.visible = true;
          } else if (
            res.data.is_face_verify === false &&
            this.config.member.enabled_face_verify === true
          ) {
            this.modelTitle = "实名认证";
            this.modelText = "登录前请完成实名认证";
            this.confirmText = "立即认证";
            this.visible = true;
          } else {
            // 跳转到之前的页面
            setTimeout(() => {
              this.$router.back();
            }, 500);
          }
        })
        .catch((e) => {
          if (e.code === 401) {
            this.$utils.clearToken();
            window.location.href = this.url;
          } else {
            this.$message.error(e.message);
          }
        });
    },
    goFaceVerify() {
      let redirect = this.$utils.getHost() + "/auth/faceSuccess";
      this.$api.Member.TecentFaceVerify({
        s_url: redirect,
      })
        .then((res) => {
          this.$utils.saveBizToken(res.data.biz_token);
          this.$utils.saveRuleId(res.data.rule_id);
          window.location.href = res.data.url;
        })
        .catch((e) => {
          this.$message.error(e.message || "无法发起实名认证");
        });
    },
    goLoginPasswordPage() {
      this.$router.push({
        name: "LoginPassword",
        query: {
          url: this.url,
        },
      });
    },
    socialiteLogin(app) {
      if (!this.agreeProtocol) {
        this.$message.error("请先同意协议");
        return;
      }
      let host = this.url;
      let redirecUrl = encodeURIComponent(this.$utils.removeTokenParams(host));
      let failUrl = encodeURIComponent(this.$utils.getHost() + "/login-error");
      window.location.href =
        this.config.url +
        "/api/v3/auth/login/socialite/" +
        app +
        "?s_url=" +
        redirecUrl +
        "&f_url=" +
        failUrl +
        "&action=login";
    },
    h5WorkWeixinLogin() {
      if (!this.agreeProtocol) {
        this.$message.error("请先同意协议");
        return;
      }
      let host = this.url;
      let redirecUrl = encodeURIComponent(this.$utils.removeTokenParams(host));
      let failUrl = encodeURIComponent(this.$utils.getHost() + "/login-error");
      window.location.href =
        this.config.url +
        "/api/v3/auth/login/wechat/oauth?s_url=" +
        redirecUrl +
        "&f_url=" +
        failUrl +
        "&action=login";
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  padding-top: 50px;
  background: #fff;
}
.btn-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
}
.btn-confirm {
  width: 100%;
  height: 48px;
  background-color: rgba(#3ca7fa, 0.6);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  &.active {
    background: #3ca7fa;
  }
}
.sms-login-form {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 0px;
  background-color: white;
  box-sizing: border-box;
  padding: 30px 30px 0 30px;
  .sms-login-title {
    width: 100%;
    height: 24px;
    font-size: 24px;
    font-weight: 500;
    color: #171923;
    line-height: 24px;
    box-sizing: border-box;
    margin-bottom: 30px;
  }

  .item {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 6px 0;
    display: flex;
    border-bottom: 1px solid #f4faff;
    margin-bottom: 50px;

    .name {
      width: auto;
      height: auto;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 36px;
      margin-right: 25px;
    }

    .input {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      box-sizing: border-box;
      align-items: center;
      .input-text {
        max-width: 200px;
        height: 36px;
        float: left;
        box-sizing: border-box;
        outline: none;
        color: #333333;
        font-size: 16px;
        border: none;
      }
    }

    .captcha {
      width: 90px;
      height: 36px;
      padding-top: 0px;
      margin-left: 19px;
      img {
        width: 90px;
        display: inline-block;
        overflow: hidden;
        position: relative;
      }
    }

    .buttons {
      width: auto;
      height: 40px;
      margin-left: 15px;

      .send-sms-button {
        display: inline-block;
        width: 80px;
        height: 30px;
        margin-top: 5px;
        line-height: 30px;
        border-radius: 5px;
        text-align: center;
        color: white;
        font-size: 13px;
        background-color: #3ca7fa;

        &:active {
          background-color: rgba(#3ca7fa, 0.9);
        }
      }
    }
  }
}

.login-button-box {
  width: 100%;
  height: auto;
  float: left;

  .login-password-way {
    display: block;
    width: 100%;
    height: auto;
    margin-top: 30px;
    margin-bottom: 35px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #3ca7fa;
  }
}

.user-info {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 100px;
  box-sizing: border-box;
  text-align: center;

  .avatar,
  .nickname {
    width: 100%;
    height: auto;
    float: left;
    margin-bottom: 15px;
    font-size: 15px;
    color: #333333;

    .avatar-img {
      display: inline-block;
    }
  }
}

.wechat-mini-login-button-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 15px;

  .login-button {
    width: 100%;
    height: 40px;
    border-radius: 5px;
    background-color: #3ca7fa;
    color: white;
    font-size: 15px;
    line-height: 40px;
  }
}

.login-other-way {
  width: 100%;
  float: left;
  height: 48px;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 120px;

  .auth-login-divider {
    background-color: #f8f8f8 !important;
  }

  .socialite-box {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 48px;
    float: left;
    text-align: center;

    .socialite-login-item {
      display: inline-block;
      width: 48px;
      height: 48px;
      border-radius: 24px;
      line-height: 48px;
      text-align: center;
      color: white;
      img {
        width: 48px;
        height: 48px;
      }
    }
  }
}
</style>

<style>
#page {
  background-color: #f8f8f8;
}
</style>
