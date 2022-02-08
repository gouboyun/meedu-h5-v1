<template>
  <div class="box" v-if="status">
    <captcha-dialog
      :status="openmask"
      :reStatus="reCaptcha"
      @change="sendSms"
      @cancel="qx"
    ></captcha-dialog>
    <div class="sms-login-form">
      <div class="sms-login-title">输入短信验证码</div>
      <div class="item">
        <div class="text">
          验证码已发送至
          <span class="value">{{ mobile }}</span>
        </div>
        <div class="buttons">
          <span class="send-sms-button" @click="openDialog()">
            <template v-if="sms.loading"> {{ sms.current }}s </template>
            <template v-else>重新发送</template>
          </span>
        </div>
      </div>
      <div class="item">
        <div class="name">验证码</div>
        <div class="input">
          <input
            type="number"
            class="input-text"
            placeholder="请输入短信验证码"
            v-model="form.sms"
          />
          <img
            v-show="form.sms"
            src="../../../assets/img/new/close.png"
            style="width:16px;height:16px;"
            @click="clearSms()"
          />
        </div>
      </div>
    </div>
    <div class="login-button-box">
      <div class="btn-confirm" :class="{ active: form.sms }" @click="confirm">
        {{ text }}
      </div>
    </div>
  </div>
</template>
<script>
import CaptchaDialog from "../../../components/captcha-dialog";

export default {
  components: {
    CaptchaDialog,
  },
  props: ["mobile", "status", "text", "scene"],
  data() {
    return {
      interval: null,
      openmask: false,
      captcha: {
        key: null,
        img: null,
      },
      form: {
        sms: "",
        captcha: "",
      },
      sms: {
        loading: false,
        max: 120,
        current: 0,
      },
      reCaptcha: false,
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.sms.loading = true;
    this.sms.current = this.sms.max;
    this.interval = setInterval(() => {
      if (this.sms.current <= 1) {
        this.sms.loading = false;
        clearInterval(this.interval);
      } else {
        this.sms.current--;
      }
    }, 1000);
  },
  methods: {
    goBack() {
      this.$emit("cancel", true);
    },
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
        mobile: this.mobile,
        image_key: this.captcha.key,
        image_captcha: this.form.captcha,
        scene: this.scene,
      })
        .then(() => {
          this.sms.loading = true;
          this.sms.current = this.sms.max;
          this.interval = setInterval(() => {
            if (this.sms.current <= 1) {
              this.sms.loading = false;
              clearInterval(this.interval);
            } else {
              this.sms.current--;
            }
          }, 1000);
          this.openmask = false;
        })
        .catch((e) => {
          this.reCaptcha = !this.reCaptcha;
          this.$message.error(e.message);
        });
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    clearSms() {
      this.form.sms = null;
    },
    confirm() {
      if (this.form.sms.trim() === "") {
        this.$message.error("请输入短信验证码");
        return;
      }
      this.$emit("change", this.form.sms);
    },
  },
};
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  float: left;
  background: white;
  .nav-top {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 30px 0 0 15px;
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
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
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
      .text {
        width: auto;
        height: auto;
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        line-height: 12px;
        .value {
          margin-left: 5px;
          font-size: 12px;
          line-height: 12px;
        }
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
            background-color: rgba(#3ca7fa, 0.6);
          }
        }
      }
    }
  }
  .login-button-box {
    width: 100%;
    height: auto;
    float: left;
    margin-top: 0px;
    background-color: white;
    box-sizing: border-box;
    padding: 0 30px;
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
  }
}
</style>
