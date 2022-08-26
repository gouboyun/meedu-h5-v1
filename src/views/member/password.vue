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
      <div class="group-form-box">
        <div class="group-title">重置密码</div>
        <div class="group-item">
          <div class="mobile">
            <span class="tit">手机号</span>
            {{ localUser.mobile }}
          </div>
        </div>
        <div class="group-item">
          <div class="name">新密码</div>
          <div class="value">
            <input
              class="input-text"
              type="password"
              v-model="form.password"
              placeholder="请输入新密码"
            />
            <img
              v-show="form.password"
              src="../../assets/img/new/close.png"
              style="width:16px;height:16px;"
              @click="clearPassword()"
            />
          </div>
        </div>
      </div>

      <div class="box pl-60 pr-60">
        <div
          class="btn-confirm"
          :class="{ active: form.password }"
          @click="openDialog"
        >
          获取短信验证码
        </div>
      </div>
    </template>
    <template v-else>
      <confirm-login
        text="确定"
        scene="password_reset"
        :status="confirmDialog"
        :mobile="localUser.mobile"
        @change="submit"
        @cancel="cancel"
      ></confirm-login>
    </template>
  </div>
</template>

<script>
import ConfirmLogin from "../auth/components/confirm-login";
import CaptchaDialog from "../../components/captcha-dialog";

export default {
  components: {
    ConfirmLogin,
    CaptchaDialog,
  },
  data() {
    return {
      loading: false,
      confirmDialog: false,
      captcha: {
        img: null,
        key: null,
      },
      form: {
        mobile: "",
        sms: "",
        captcha: "",
        password: "",
      },
      sms: {
        max: 120,
        current: 0,
        loading: false,
      },
      openmask: false,
      reCaptcha: false,
      localUser: null,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$api.Member.Detail().then((res) => {
        this.localUser = res.data;
      });
    },
    clearPassword() {
      this.form.password = null;
    },
    openDialog() {
      if (this.sms.loading) {
        // 冷却中
        return;
      }
      if (!this.$utils.isChinaMobilePhone(this.localUser.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      this.form.captcha = null;
      this.openmask = true;
    },
    qx() {
      this.openmask = false;
    },
    sendSms(val, cap) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.form.captcha = val;
      this.captcha = cap;
      this.$api.Other.SendSms({
        mobile: this.localUser.mobile,
        image_key: this.captcha.key,
        image_captcha: this.form.captcha,
        scene: "password_reset",
      })
        .then((res) => {
          // 发送成功
          this.loading = false;
          this.openmask = false;
          this.confirmDialog = true;
        })
        .catch((e) => {
          this.loading = false;
          this.reCaptcha = !this.reCaptcha;
          this.$message.error(e.message);
        });
    },
    cancel() {
      this.confirmDialog = false;
    },
    submit(val) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.form.sms = val;
      if (!this.form.password) {
        this.$message.error("请输入密码");
        return;
      }
      this.$api.Member.PasswordChange({
        mobile: this.localUser.mobile,
        mobile_code: this.form.sms,
        password: this.form.password,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("成功");
          setTimeout(() => {
            this.$router.back();
          }, 500);
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
  },
};
</script>

<style lang="less" scoped>
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

.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 50px;
  float: left;
  background: white;

  .group-form-box {
    width: 100%;
    height: auto;
    float: left;
    margin-top: 0px;
    background-color: white;
    box-sizing: border-box;
    padding: 30px 30px 0 30px;
    .group-title {
      width: 100%;
      height: 24px;
      font-size: 24px;
      font-weight: 500;
      color: #171923;
      line-height: 24px;
      box-sizing: border-box;
      margin-bottom: 30px;
    }
    .group-item {
      width: 100%;
      height: auto;
      float: left;
      box-sizing: border-box;
      padding: 6px 0;
      display: flex;
      border-bottom: 1px solid #f4faff;
      margin-bottom: 50px;
      .mobile {
        width: auto;
        height: auto;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 26px;
        .tit {
          margin-right: 25px;
        }
      }

      .name {
        width: auto;
        height: auto;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 36px;
        margin-right: 25px;
      }

      .value {
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
    }
  }
}
</style>
