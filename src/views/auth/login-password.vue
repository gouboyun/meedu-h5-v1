<template>
  <div class="container">
    <div class="navheader borderbox" style="border-bottom:none;">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
    </div>
    <div class="password-login-form">
      <div class="password-login-title">登录</div>
      <div class="item">
        <div class="name">手机号</div>
        <div class="input">
          <input
            type="number"
            class="input-text"
            placeholder="请输入手机号码"
            v-model="passwordForm.mobile"
          />
          <img
            v-show="passwordForm.mobile"
            src="../../assets/img/new/close.png"
            style="width:16px;height:16px;"
            @click="clearMobile()"
          />
        </div>
      </div>
      <div class="item">
        <div class="name">密码</div>
        <div class="input">
          <input
            type="password"
            class="input-text"
            placeholder="请输入密码"
            v-model="passwordForm.password"
          />
          <img
            v-show="passwordForm.password"
            src="../../assets/img/new/close.png"
            style="width:16px;height:16px;"
            @click="clearPassword()"
          />
        </div>
      </div>
    </div>

    <div class="box border-box mt-15 pl-60 pr-60">
      <div
        class="btn-confirm"
        :class="{ active: passwordForm.mobile && passwordForm.password }"
        @click="passwordLoginHandler"
      >
        登录
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      url: this.$route.query.url || null,
      passwordForm: {
        mobile: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapState(["config"]),
  },
  methods: {
    ...mapMutations(["submitLogin"]),
    clearMobile() {
      this.passwordForm.mobile = null;
    },
    clearPassword() {
      this.passwordForm.password = null;
    },
    passwordLoginHandler() {
      if (!this.passwordForm.mobile) {
        return;
      }
      if (!this.$utils.isChinaMobilePhone(this.passwordForm.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      if (!this.passwordForm.password) {
        return;
      }
      this.$api.Auth.PasswordLogin({
        mobile: this.passwordForm.mobile,
        password: this.passwordForm.password,
      })
        .then((res) => {
          // 写入token
          this.$utils.saveToken(res.data.token);

          this.$api.User.Detail().then((res) => {
            this.submitLogin(res.data);
            if (
              this.config.member.enabled_mobile_bind_alert === 1 &&
              res.data.is_bind_mobile !== 1
            ) {
              this.$router.push({
                name: "BindMobile",
              });
            } else if (
              res.data.is_face_verify === false &&
              this.config.member.enabled_face_verify === true
            ) {
              this.goFaceVerify();
            } else {
              this.$router.go(-2);
            }
          });
        })
        .catch((e) => {
          this.$message.error(e.message);
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
  },
};
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  padding-top: 50px;
  background: #fff;
}
.box {
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

.password-login-form {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 0px;
  background-color: white;
  box-sizing: border-box;
  padding: 30px 30px 0 30px;
  .password-login-title {
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
      min-width: 48px;
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
  }
}
</style>

<style>
#page {
  background-color: #f8f8f8;
}
</style>
