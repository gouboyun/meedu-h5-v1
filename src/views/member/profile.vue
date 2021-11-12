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
      <div
        style="height: 380px"
        class="mobile-box borderbox"
        v-if="forgetPassword"
      >
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="input-box">
          <input
            class="input-item"
            autocomplete="off"
            v-model="messageForm.mobile"
            required=""
            placeholder="请输入手机号"
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
        <div class="input-box">
          <input
            type="password"
            placeholder="请设置账号密码"
            autocomplete="off"
            v-model="messageForm.password"
            class="input-item"
            required=""
          />
        </div>
        <div class="confirm" @click="editValidate()">重置密码</div>
      </div>
    </div>
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">个人资料</div>
    </div>
    <div class="group-box">
      <div class="group-item">
        <div class="name">头像</div>
        <div class="value">
          <img
            :src="user.avatar"
            border-radius="50%"
            width="36px"
            height="36px"
          />
        </div>
        <input
          class="input-avatar"
          type="file"
          accept="image/*"
          @change="uploadAvatar"
        />
      </div>
      <div class="group-item" @click="changeNickname">
        <div class="name">昵称</div>
        <div class="value">
          <span>{{ user.nick_name }}</span>
        </div>
      </div>
    </div>
    <div class="group-box">
      <div class="group-item">
        <div class="name">绑定微信</div>
        <div class="value">
          <span v-if="user.is_bind_wechat === 1">已绑定</span>
          <span v-else @click="bindWechat">点击绑定</span>
        </div>
      </div>
      <div class="group-item">
        <div class="name">绑定QQ</div>
        <div class="value">
          <span v-if="user.is_bind_qq === 1">已绑定</span>
          <span v-else @click="bindQQ">点击绑定</span>
        </div>
      </div>
      <div class="group-item">
        <div class="name">绑定手机号</div>
        <div class="value">
          <span v-if="user.is_bind_mobile === 1" @click="changeMobile">{{
            user.mobile.substr(0, 3) + "****" + user.mobile.substr(7)
          }}</span>
          <span v-else @click="bindMobile">点击绑定</span>
        </div>
      </div>
      <div class="group-item">
        <div class="name">修改密码</div>
        <div class="value">
          <span @click="changePassword">点击修改</span>
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
      forgetPassword: false,
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
      this.forgetPassword = false;
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
    editValidate() {
      if (this.loading) {
        return;
      }
      if (!this.messageForm.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.messageForm.sms) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.messageForm.password) {
        this.$message.error("请设置账号密码");
        return;
      }
      this.loading = true;
      this.$api.Member.PasswordChange({
        mobile: this.messageForm.mobile,
        mobile_code: this.messageForm.sms,
        password: this.messageForm.password,
      })
        .then((resp) => {
          this.loading = false;
          this.$message.success("设置成功");
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
      this.scene = "password_reset";
      this.getCaptcha();
      this.forgetPassword = true;
      this.openmask = true;
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
  background: #f6f6f6;
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
.group-box {
  width: 100%;
  height: auto;
  float: left;
  background: #fff;
  margin-top: 10px;
  .group-item {
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
    padding: 7px 15px;
    height: auto;
    float: left;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    border-bottom: 1px solid #f6f6f6;
    position: relative;
    .input-avatar {
      position: absolute;
      top: 7px;
      left: 0;
      opacity: 0;
      width: 100%;
      height: 37px;
    }
    .name {
      width: 150px;
      height: 37px;
      float: left;
      line-height: 37px;
      font-size: 15px;
      color: #333333;
    }
    .value {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      height: 37px;
      text-align: right;
      line-height: 37px;
      font-size: 14px;
      color: #999999;
      img {
        width: 37px;
        height: 37px;
        border-radius: 50%;
        overflow: visible;
        opacity: 1;
        transition: opacity 0.5s ease-in-out 0s;
        background-color: transparent;
      }
    }
  }
}
</style>