<template>
  <div class="box">
    <div class="group-form-box">
      <div class="group-title">换绑手机号</div>
      <div class="item">
        <div class="name">新手机号</div>
        <div class="value">
          <input
            type="number"
            class="input"
            v-model="form.mobile"
            placeholder="请输入新的手机号码"
          />
          <img
            v-show="form.mobile"
            src="../../../assets/img/new/close.png"
            style="width:16px;height:16px;"
            @click="clearMobile()"
          />
        </div>
      </div>
      <div class="item">
        <div class="name">验证码</div>
        <div class="value">
          <input
            type="text"
            class="input-text"
            v-model="form.captcha"
            placeholder="请输入图形验证码"
          />
        </div>
        <div class="captcha" @click="getCaptcha">
          <img
            style="width:100px;height:36px;"
            v-show="captcha.img"
            :src="captcha.img"
          />
        </div>
      </div>
      <div class="item">
        <div class="name">验证码</div>
        <div class="value">
          <input
            class="input-text"
            type="number"
            v-model="form.sms"
            placeholder="请输入短信验证码"
          />
        </div>
        <div class="buttons">
          <span class="send-sms-button" @click="sendSms">
            <template v-if="sms.loading">{{ sms.current }}s</template>
            <template v-else>获取验证码</template>
          </span>
        </div>
      </div>
    </div>

    <div class="box pl-60 pr-60">
      <div
        class="btn-confirm"
        :class="{ active: form.captcha && form.sms && form.mobile }"
        @click="submit"
      >
        立即绑定
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["sign"],
  data() {
    return {
      interval: null,
      captcha: {
        img: null,
        key: null,
      },
      form: {
        mobile: "",
        sms: "",
        captcha: "",
      },
      sms: {
        max: 120,
        current: 0,
        loading: false,
      },
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.getCaptcha();
  },
  methods: {
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    clearMobile() {
      this.form.mobile = null;
    },
    sendSms() {
      if (this.sms.loading) {
        // 冷却中
        return;
      }
      if (!this.form.mobile) {
        this.$message.error("请输入新手机号");
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
        scene: "mobile_bind",
      })
        .then(() => {
          // 发送成功

          this.sms.loading = this;
          this.sms.current = this.sms.max;
          this.interval = setInterval(() => {
            if (this.sms.current <= 1) {
              this.sms.loading = false;
              clearInterval(this.interval);
            } else {
              this.sms.current--;
            }
          }, 1000);
        })
        .catch((e) => {
          this.form.captcha = null;
          this.getCaptcha();
          this.$message.errort(e.message);
        });
    },
    submit() {
      if (this.form.mobile.trim() === "" || this.form.sms.trim() === "") {
        return;
      }

      this.$api.Member.MobileChange({
        mobile: this.form.mobile,
        mobile_code: this.form.sms,
        sign: this.sign,
      })
        .then(() => {
          this.$message.success("成功");
          setTimeout(() => {
            this.$router.back();
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

.box {
  width: 100%;
  height: 100%;
  float: left;
  background: white;
  box-sizing: border-box;
  .nav-top {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 30px 0 0 15px;
  }
  .group-form-box {
    display: block;
    width: 100%;
    height: auto;
    float: left;
    margin-top: 0px;
    background-color: white;
    box-sizing: border-box;
    padding: 30px 30px 0 30px;
    .group-title {
      display: block;
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
        height: 36px;
        .input {
          max-width: 200px;
          height: 36px;
          float: left;
          box-sizing: border-box;
          outline: none;
          color: #333333;
          font-size: 16px;
          border: none;
        }
        .input-text {
          max-width: 133px;
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
            background-color: rgba(#3ca7fa, 0.6);
          }
        }
      }
    }
  }
}
</style>
