<template>
  <div class="container" v-if="user">
    <div class="mask" v-if="openmask">
      <div class="popup borderbox" v-if="changeNick">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="input-box">
          <input
            type="text"
            class="input-item"
            v-model="form.content"
            placeholder="请输入昵称"
          />
        </div>
        <div class="confirm" @click="submitHandle()">确认</div>
      </div>
      <div class="mobile-box borderbox" v-if="changeMo">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="mobile">
          <span
            >原手机号码验证：<strong>{{ user.mobile }}</strong></span
          >
        </div>
        <div class="input-box">
          <input
            type="text"
            class="input-short"
            required=""
            autocomplete="off"
            v-model="messageForm.captcha"
            placeholder="请输入图形验证码"
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-box">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required=""
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms(user.mobile)">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>
        <div class="confirm" @click="mobileValidate()">确认</div>
      </div>

      <div class="mobile-box borderbox" v-if="verMobile">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="input-box">
          <input
            class="input-item"
            autocomplete="off"
            v-model="messageForm.mobile"
            required=""
            placeholder="请输入新手机号码"
          />
        </div>
        <div class="input-box">
          <input
            type="text"
            class="input-short"
            required=""
            autocomplete="off"
            v-model="messageForm.captcha"
            placeholder="请输入图形验证码"
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-box">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required=""
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>
        <div class="confirm" @click="changeMobileValidate()">立即绑定</div>
      </div>
      <div class="mobile-box borderbox" v-if="newMobile">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="input-box">
          <input
            class="input-item"
            autocomplete="off"
            v-model="messageForm.mobile"
            required=""
            placeholder="请输入新手机号码"
          />
        </div>
        <div class="input-box">
          <input
            type="text"
            class="input-short"
            required=""
            autocomplete="off"
            v-model="messageForm.captcha"
            placeholder="请输入图形验证码"
          />
          <div class="captcha">
            <img
              class="captcha-img"
              :src="captcha.img"
              mode="widthFix"
              @click="getCaptcha"
            />
          </div>
        </div>
        <div class="input-box">
          <input
            type="text"
            placeholder="请输入手机验证码"
            autocomplete="off"
            v-model="messageForm.sms"
            class="input-short"
            required=""
          />
          <div class="buttons">
            <span class="send-sms-button" @click="sendSms()">
              <template v-if="sms.loading"> {{ sms.current }}s </template>
              <template v-else>获取验证码</template>
            </span>
          </div>
        </div>
        <div class="confirm" @click="NewMobileValidate()">立即绑定</div>
      </div>
    </div>
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">个人中心</div>
    </div>
    <div class="user-avatar">
      <div class="value">
        <img :src="user.avatar" />
        <input
          class="input-avatar"
          type="file"
          accept="image/*"
          @change="uploadAvatar"
        />
      </div>
      <div class="name">点击更换头像</div>
    </div>
    <div class="form-box">
      <div class="tit">账户信息</div>
      <div class="group-item" @click="changeNickname">
        <div class="name">昵称</div>
        <div class="value">
          <span>{{ user.nick_name }}</span>
          <img src="../../assets/img/new/back@2x.png" class="arrow" />
        </div>
      </div>
      <div class="group-item">
        <div class="name">绑定微信</div>
        <div class="value">
          <span v-if="user.is_bind_wechat === 1">已绑定</span>
          <span class="un" v-else @click="bindWechat">点击绑定</span>
          <img src="../../assets/img/new/back@2x.png" class="arrow" />
        </div>
      </div>
      <div class="group-item">
        <div class="name">绑定QQ</div>
        <div class="value">
          <span v-if="user.is_bind_qq === 1">已绑定</span>
          <span class="un" v-else @click="bindQQ">点击绑定</span>
          <img src="../../assets/img/new/back@2x.png" class="arrow" />
        </div>
      </div>
      <div class="group-item">
        <div class="name">绑定手机号</div>
        <div class="value">
          <span v-if="user.is_bind_mobile === 1" @click="changeMobile">{{
            user.mobile.substr(0, 3) + "****" + user.mobile.substr(7)
          }}</span>
          <span class="un" v-else @click="bindMobile">点击绑定</span>
          <img src="../../assets/img/new/back@2x.png" class="arrow" />
        </div>
      </div>
      <div class="group-item" @click="changePassword">
        <div class="name">修改密码</div>
        <div class="value">
          <span v-if="user.is_password_set === 1">已设置</span>
          <span class="un" v-else>设置密码</span>
          <img src="../../assets/img/new/back@2x.png" class="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import config from "../../js/config";
import { mapState, mapMutations } from "vuex";

// 请求域名
axios.defaults.baseURL = config.url;
axios.defaults.timeout = 10000;

// 请求拦截器(附带上token)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = "Bearer " + token);
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);
export default {
  components: {},
  computed: {
    ...mapState(["isLogin", "config", "user"]),
  },
  data() {
    return {
      list: [],
      openmask: false,
      changeNick: false,
      changeMo: false,
      newMobile: false,
      verMobile: false,
      error: this.$route.query.error,
      loading: false,
      profile: [],
      scene: null,
      form: {
        nick_name: null,
        content: null,
      },
      passwordForm: {
        mobile: null,
        password: null,
      },
      captcha: {
        key: null,
        img: null,
      },
      messageForm: {
        mobile: null,
        sms: null,
        captcha: null,
        password: null,
        agree_protocol: null,
      },
      sms: {
        loading: false,
        max: 120,
        current: 0,
      },
    };
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    ...mapMutations(["submitLogin"]),
    getProfile() {
      this.$api.Member.Profile().then((res) => {
        this.profile = res.data;
        if (this.error) {
          this.$message.error(this.error);
        }
      });
    },
    sendSms(val) {
      if (val) {
        this.messageForm.mobile = val;
      }
      if (this.sms.loading) {
        // 冷却中
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.messageForm.captcha) {
        this.$message.error("请输入图形验证码");
        return;
      }
      this.$api.Other.SendSms({
        mobile: this.messageForm.mobile,
        image_key: this.captcha.key,
        image_captcha: this.messageForm.captcha,
        scene: this.scene,
      })
        .then(() => {
          // 发送成功
          this.$message.success("发送成功");
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
          this.$message.error(e.message);
        });
    },
    getData() {
      this.$api.User.Detail()
        .then((res) => {
          this.submitLogin(res.data);
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
    uploadAvatar(e) {
      let files = e.target.files;
      if (!files[0].type.match(/.jpg|.png|.jpeg/i)) {
        this.$message.error("图片格式错误,请上传png/jpg/jpeg格式的图片");
        return;
      }
      if (files[0].size > 2048000) {
        this.$message.error("图片大小不超过2M");
        return;
      }
      let formData = new FormData();
      formData.append("file", files[0]);
      axios.post("/api/v2/member/detail/avatar", formData).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("上传头像成功");
          this.getData();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    changeNickname() {
      if (this.user.is_set_nickname === 1) {
        this.$message.error("您已经设置过昵称了哦");
        return;
      }
      this.changeNick = true;
      this.openmask = true;
    },
    cancel() {
      this.verMobile = false;
      this.changeMo = false;
      this.changeNick = false;
      this.newMobile = false;
      this.openmask = false;
      this.messageForm.mobile = null;
      this.messageForm.sms = null;
      this.messageForm.captcha = null;
      this.messageForm.password = null;
      this.messageForm.agree_protocol = null;
      this.passwordForm.mobile = null;
      this.passwordForm.password = null;
    },
    bindWechat() {
      let host = window.location.href;
      let redirect = encodeURIComponent(host);
      window.location.href =
        this.config.url +
        "/api/v2/member/wechatBind?token=" +
        window.localStorage.getItem("token") +
        "&redirect_url=" +
        redirect;
    },
    bindQQ() {
      let host = window.location.href;
      let redirect = encodeURIComponent(host);
      window.location.href =
        this.config.url +
        "/api/v2/member/socialite/qq?token=" +
        window.localStorage.getItem("token") +
        "&redirect_url=" +
        redirect;
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },

    changeMobile() {
      this.scene = "mobile_bind";
      this.getCaptcha();
      this.changeMo = true;
      this.openmask = true;
    },
    mobileValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      this.loading = true;
      this.$api.Member.MobileVerify({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("验证成功");
          this.cancel();
          this.getCaptcha();
          this.sms.loading = false;
          this.sms.current = 0;
          this.messageForm.sign = res.data.sign;
          setTimeout(() => {
            this.openmask = true;
            this.verMobile = true;
          }, 500);
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    changeMobileValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请填写新的绑定手机号码");
        return;
      }
      this.loading = true;
      this.$api.Member.MobileChange({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
        sign: this.messageForm.sign,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("绑定成功");
          this.cancel();
          setTimeout(() => {
            this.getData();
          }, 500);
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    NewMobileValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请填写新的绑定手机号码");
        return;
      }
      this.loading = true;
      this.$api.Member.NewMobile({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success("绑定成功");
          this.cancel();
          setTimeout(() => {
            this.getData();
          }, 500);
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    bindMobile() {
      this.scene = "mobile_bind";
      this.getCaptcha();
      this.newMobile = true;
      this.openmask = true;
    },
    changePassword() {
      this.$router.push({
        name: "ChangePassword",
      });
    },
    submitHandle() {
      if (!this.form.content) {
        this.$message.error("请输入昵称");
        return;
      }
      this.$api.Member.NicknameChange({
        nick_name: this.form.content,
      })
        .then(() => {
          this.$message.success("修改成功");
          this.form.content = null;
          setTimeout(() => {
            this.getData();
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
.container {
  box-sizing: border-box;
  padding-top: 50px;
  background: #fff;
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  .mobile-box {
    width: 325px;
    height: 305px;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    position: relative;
    .cancel {
      position: absolute;
      top: -42px;
      right: 0px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .mobile {
      width: 100%;
      height: 20px;
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }
    .input-box {
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: center;
      margin-top: 15px;
      .input-item {
        width: 284px;
        height: 45px;
        display: flex;
        align-items: center;
        border: none;
        border-bottom: 1px solid #d8d8d8;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        outline: none;
      }
      .input-short {
        width: 170px;
        height: 45px;
        display: flex;
        align-items: center;
        border: none;
        border-bottom: 1px solid #d8d8d8;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        outline: none;
      }
      .captcha {
        width: 110px;
        height: 45px;
        img {
          width: 110px;
          height: 45px;
        }
      }
      .buttons {
        width: 110px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
    }

    .confirm {
      width: 255px;
      height: 44px;
      background: #1784ed;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      font-weight: 500;
      color: #ffffff;
      margin: 0 auto;
      margin-top: 50px;
    }
  }
  .popup {
    width: 325px;
    height: 204px;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    position: relative;
    .cancel {
      position: absolute;
      top: -42px;
      right: 0px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .input-box {
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: center;
      margin-top: 35px;
      .input-item {
        width: 255px;
        height: 45px;
        display: flex;
        align-items: center;
        border: none;
        border-bottom: 1px solid #d8d8d8;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        outline: none;
      }
    }

    .confirm {
      width: 255px;
      height: 44px;
      background: #1784ed;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      font-weight: 500;
      color: #ffffff;
      margin: 0 auto;
      margin-top: 50px;
    }
  }
}
.user-avatar {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 50px;
  .value {
    width: 64px;
    height: 64px;
    float: left;
    position: relative;
    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
    .input-avatar {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
  }

  .name {
    width: auto;
    height: 13px;
    font-size: 13px;
    font-weight: 400;
    color: #666666;
    line-height: 13px;
    margin-top: 15px;
  }
}
.form-box {
  width: 100%;
  height: auto;
  float: left;
  margin-bottom: 50px;
  background-color: white;
  .tit {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    line-height: 16px;
    margin-bottom: 10px;
  }

  .group-item {
    width: 100%;
    height: 56px;
    float: left;
    display: flex;
    box-sizing: border-box;
    padding: 8px 20px;
    border-bottom: 1px solid #f3f6f9;

    .name {
      width: 150px;
      height: 40px;
      float: left;
      line-height: 40px;
      font-size: 16px;
      color: #333333;
    }

    .value {
      flex: 1;
      height: 40px;
      text-align: right;
      font-size: 14px;
      color: #666666;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .un {
        color: #c1c4cb;
      }
      .arrow {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 15px;
      }
      .u-image,
      u-image {
        display: inline-block;
      }

      input {
        display: inline-block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border: 0;
        text-align: right;
        outline: none;
        font-size: 14px;

        &::placeholder {
          color: #c1c4cb;
        }
      }
    }

    .captcha {
      width: auto;
      height: auto;
      line-height: 40px;
      margin-left: 30px;

      .u-image {
        display: inline-block;
      }
    }

    .buttons {
      width: auto;
      height: auto;
      line-height: 40px;
      margin-left: 30px;

      .send-sms-button,
      .promo-code-check-button {
        width: 100px;
        height: 30px;
        line-height: 30px;
        margin-top: 3px;
        text-align: center;
        color: white;
        background-color: #3ca7fa;
        font-size: 14px;
        border-radius: 3px;
        float: left;
      }

      .promo-code-check-button {
        width: 50px;
      }
    }
  }
}
</style>
