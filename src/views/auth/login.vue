<template>
  <div class="container">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">快捷登录/注册</div>
    </div>
    <div class="sms-login-form">
      <div class="item">
        <div class="name">手机号</div>
        <div class="input">
          <input
            type="text"
            class="input-text"
            placeholder="手机号"
            v-model="form.mobile"
          />
        </div>
      </div>
      <div class="item">
        <div class="name">图形验证码</div>
        <div class="input">
          <input
            type="text"
            class="input-text"
            placeholder="图形验证码"
            v-model="form.captcha"
          />
        </div>
        <div class="captcha">
          <img
            :src="captcha.img"
            mode="widthFix"
            @click="getCaptcha"
            width="100px"
          />
        </div>
      </div>
      <div class="item">
        <div class="name">短信验证码</div>
        <div class="input">
          <input
            type="text"
            class="input-text"
            placeholder="短信验证码"
            v-model="form.sms"
          />
        </div>
        <div class="buttons">
          <span class="send-sms-button" @click="sendSms()">
            <template v-if="sms.loading"> {{ sms.current }}s </template>
            <template v-else>发送验证码</template>
          </span>
        </div>
      </div>
    </div>

    <div class="btn-box border-box mt-15 pl-30 pr-30">
      <btn-block @taptap="loginHandler" text="立即登录"></btn-block>
    </div>

    <div class="login-button-box">
      <span class="login-password-way" @click="goLoginPasswordPage"
        >密码登录</span
      >
    </div>

    <protocol @agree="protocolAgree"></protocol>

    <!-- H5社交登录 -->
    <div class="login-other-way" v-if="config">
      <div class="socialite-box">
        <div
          class="socialite-login-item"
          v-if="config.socialites.qq === 1"
          @click="socialiteLogin('qq')"
        >
          <img src="../../assets/img/qq.png" />
        </div>

        <div
          class="socialite-login-item"
          v-if="config.socialites.wechat_oauth === 1"
          @click="h5WorkWeixinLogin()"
        >
          <img src="../../assets/img/wechat.png" />
        </div>
      </div>
    </div>
    <!-- #endif -->
  </div>
</template>

<script>
import Protocol from "../../components/protocol";
import BtnBlock from "../../components/btn-block";

import { mapState, mapMutations } from "vuex";

export default {
  components: {
    Protocol,
    BtnBlock,
  },
  data() {
    return {
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
      redirectUrl: null,
      agreeProtocol: false,
    };
  },
  computed: {
    ...mapState(["config"]),
  },
  mounted() {
    this.getCaptcha();
  },
  methods: {
    ...mapMutations(["submitLogin"]),
    protocolAgree(bool) {
      this.agreeProtocol = bool;
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    sendSms() {
      if (this.sms.loading) {
        // 冷却中
        return;
      }
      if (!this.form.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.form.captcha) {
        this.$message.error("请输入图形验证码");
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
          this.sms.loading = this;
          this.sms.current = this.sms.max;
          let interval = setInterval(() => {
            if (this.sms.current <= 1) {
              this.sms.loading = false;
              clearInterval(interval);
            } else {
              this.sms.current--;
            }
          }, 1000);
        })
        .catch((e) => {
          this.getCaptcha();
          this.handler(e.message);
        });
    },
    loginHandler() {
      if (!this.form.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.form.sms) {
        this.$message.error("请输入短信验证码");
        return;
      }
      if (!this.agreeProtocol) {
        this.$message.error("请同意协议");
        return;
      }
      this.$api.Auth.SmsLogin({
        mobile: this.form.mobile,
        mobile_code: this.form.sms,
        msv: "",
      })
        .then((res) => {
          this.handler(res.data.token);
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    handler(token) {
      // 写入token
      window.localStorage.setItem("token", token);

      this.$api.User.Detail()
        .then((data) => {
          this.submitLogin(data);
          // 跳转到之前的页面
          this.$router.back();
        })
        .catch((e) => {
          if (e.code === 401) {
            window.localStorage.removeItem("token");
            this.$router.replace({
              name: "Index",
            });
          } else {
            this.$message.error(e.message);
          }
        });
    },
    goLoginPasswordPage() {
      this.$router.push({
        name: "LoginPassword",
        query: {
          redirect: this.redirectUrl,
        },
      });
    },
    socialiteLogin(app) {
      if (!this.agreeProtocol) {
        this.$message.error("请先同意协议");
        return;
      }
      let host = window.location.protocol + "//" + window.location.host;
      let redirecUrl = encodeURIComponent(host);
      window.location.href =
        this.config.url +
        "/api/v2/login/socialite/" +
        app +
        "?success_redirect=" +
        redirecUrl +
        "&failed_redirect=" +
        redirecUrl;
    },
    h5WorkWeixinLogin() {
      if (!this.agreeProtocol) {
        this.$message.error("请先同意协议");
        return;
      }
      let host = window.location.protocol + "//" + window.location.host;
      let redirecUrl = encodeURIComponent(host);
      window.location.href =
        this.config.url +
        "/api/v2/login/wechat/oauth?success_redirect=" +
        redirecUrl +
        "&failed_redirect=" +
        redirecUrl;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  padding-top: 50px;
  background: #f6f6f6;
}
.btn-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
}
.sms-login-form {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 15px;
  background-color: white;

  .item {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 8px 15px;
    display: flex;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    .name {
      width: 100px;
      height: auto;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 40px;
    }

    .input {
      flex: 1;
      box-sizing: border-box;

      .input-text {
        width: 100%;
        height: 40px;
        float: left;
        box-sizing: border-box;
        outline: none;
        color: #333333;
        font-size: 14px;
        border: none;
        padding: 0;
        margin: 0;
        text-decoration: inherit;
      }
    }

    .captcha {
      width: 100px;
      height: 35px;
      padding-top: 5px;
      margin-left: 15px;
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
    padding-top: 15px;
    text-align: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.5);
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
  height: auto;
  float: left;
  box-sizing: border-box;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 30px;

  .auth-login-divider {
    background-color: #f8f8f8 !important;
  }

  .socialite-box {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: auto;
    float: left;
    text-align: center;
    margin-top: 30px;

    .socialite-login-item {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      line-height: 40px;
      text-align: center;
      color: white;
      img {
        width: 40px;
        height: 40px;
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
