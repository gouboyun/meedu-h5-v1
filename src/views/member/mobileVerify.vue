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
    <template v-if="!verify && !confirmDialog">
      <div class="group-form-box" v-if="user">
        <div class="group-title">验证原手机号</div>
        <div class="item">
          <div class="mobile">
            <span class="tit">原手机号</span>{{ user.mobile }}
          </div>
        </div>
      </div>

      <div class="box pl-60 pr-60">
        <div class="btn-confirm active" @click="openDialog">获取短信验证码</div>
      </div>
    </template>
    <template v-else-if="!verify && confirmDialog">
      <confirm-login
        text="绑定"
        scene="mobile_bind"
        :status="confirmDialog"
        :mobile="user.mobile"
        @change="submit"
        @cancel="cancel"
      ></confirm-login>
    </template>
    <template v-else>
      <newmobile :sign="sign"></newmobile>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ConfirmLogin from "../auth/components/confirm-login";
import CaptchaDialog from "../../components/captcha-dialog";
import Newmobile from "./components/newmobile";
export default {
  components: {
    ConfirmLogin,
    Newmobile,
    CaptchaDialog,
  },
  data() {
    return {
      verify: false,
      confirmDialog: false,
      sign: null,
      captcha: {
        img: null,
        key: null,
      },
      form: {
        sms: "",
        captcha: "",
      },
      sms: {
        max: 120,
        current: 0,
        loading: false,
      },
      openmask: false,
      reCaptcha: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {},
  methods: {
    openDialog() {
      if (this.sms.loading) {
        // 冷却中
        return;
      }
      this.form.captcha = null;
      this.openmask = true;
    },
    qx() {
      this.openmask = false;
    },
    sendSms(val, cap) {
      this.form.captcha = val;
      this.captcha = cap;
      this.$api.Other.SendSms({
        mobile: this.user.mobile,
        image_key: this.captcha.key,
        image_captcha: this.form.captcha,
        scene: "mobile_bind",
      })
        .then((res) => {
          // 发送成功
          this.openmask = false;
          this.confirmDialog = true;
        })
        .catch((e) => {
          this.reCaptcha = !this.reCaptcha;
          this.$message.error(e.message);
        });
    },
    cancel() {
      this.confirmDialog = false;
    },
    submit(val) {
      this.form.sms = val;
      this.$api.Member.MobileVerify({
        mobile: this.user.mobile,
        mobile_code: this.form.sms,
      })
        .then((res) => {
          this.sign = res.data.sign;
          this.$message.success("成功");
          setTimeout(() => {
            this.verify = true;
          }, 500);
        })
        .catch((e) => {
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
      .mobile {
        height: 36px;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 36px;
        .tit {
          margin-right: 14px;
        }
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
        }
      }
    }
  }
}
</style>
