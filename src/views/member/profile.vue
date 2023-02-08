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
      <div class="popup borderbox" v-if="dialog">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="text">
          <template v-if="resource === 'qq'">是否解除绑定QQ？</template>
          <template v-else>是否解除绑定微信？</template>
        </div>
        <div class="confirm" @click="cancelBind()">确认</div>
      </div>
      <div class="popup borderbox" v-if="destroyDialog">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="text">
          确认注销账号？确认之后账号将在7天后自动注销，期间内登录账号将会自动取消账号注销。
        </div>
        <div class="confirm" @click="destroyUserValidate()">确认</div>
      </div>
      <div class="popup borderbox" v-if="logoutDialog">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="text">
          确认安全退出登录？
        </div>
        <div class="confirm" @click="goLogout()">确认</div>
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
      <div
        class="group-item"
        v-if="config && config.socialites.wechat_oauth === 1 && isInH5Wechat"
      >
        <div class="name">绑定微信</div>
        <div class="value" @click="bindWechat">
          <span v-if="user.is_bind_wechat === 1">已绑定</span>
          <span class="un" v-else>点击绑定</span>
          <img src="../../assets/img/new/back@2x.png" class="arrow" />
        </div>
      </div>
      <div
        class="group-item"
        v-if="config && config.socialites.qq === 1 && !isInH5Wechat"
      >
        <div class="name">绑定QQ</div>
        <div class="value" @click="bindQQ">
          <span v-if="user.is_bind_qq === 1">已绑定</span>
          <span class="un" v-else>点击绑定</span>
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
      <div class="group-item">
        <div class="name">实名认证</div>
        <div class="value">
          <span v-if="user.is_face_verify === true" @click="goLocalFaceCheck"
            >已认证</span
          >
          <span class="un" v-else @click="goFaceVerify">未认证</span>
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
      <div class="group-item" @click="destroyUser">
        <div class="name">账号注销</div>
        <div class="value">
          <img src="../../assets/img/new/back@2x.png" class="arrow" />
        </div>
      </div>
      <div class="group-item" @click="openLogoutDialog">
        <div class="name">退出登录</div>
        <div class="value">
          <img src="../../assets/img/new/back@2x.png" class="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(["isLogin", "config", "user"]),
    isInH5Wechat() {
      return this.$utils.isWechat();
    },
  },
  data() {
    return {
      list: [],
      openmask: false,
      changeNick: false,
      dialog: false,
      error: this.$route.query.error,
      loading: false,
      profile: [],
      scene: null,
      form: {
        nick_name: null,
        content: null,
      },
      resource: null,
      destroyDialog: false,
      logoutDialog: false,
      verifyLoading: false,
    };
  },
  mounted() {
    this.$router.onReady(() => {
      // 社交绑定回调处理
      if (this.$route.query.login_code && this.$route.query.action === "bind") {
        this.CodeBind(this.$route.query.login_code);
      }
      if (this.$route.query.login_err_msg) {
        this.$message.error(this.$route.query.login_err_msg);
      }
      if (this.error) {
        this.$message.error(this.error);
      }
      this.getProfile();
      this.getData();
    });
  },
  methods: {
    ...mapMutations(["submitLogin", "logout"]),
    getProfile() {
      this.$api.Member.Profile().then((res) => {
        this.profile = res.data;
      });
    },
    getData() {
      this.$api.User.Detail().then((res) => {
        this.submitLogin(res.data);
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
      this.$api.Member.UploadAvatar(formData).then((res) => {
        if (res.code === 0) {
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
      this.logoutDialog = false;
      this.destroyDialog = false;
      this.dialog = false;
      this.changeNick = false;
      this.openmask = false;
      this.resource = null;
    },
    bindWechat() {
      if (this.user.is_bind_wechat === 1) {
        this.dialog = true;
        this.openmask = true;
        this.resource = "wechat";
        return;
      }
      let host = window.location.href;
      let redirect = encodeURIComponent(host);
      window.location.href =
        this.config.url +
        "/api/v3/auth/login/wechat/oauth?s_url=" +
        redirect +
        "&f_url=" +
        redirect +
        "&action=bind";
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
    goLocalFaceCheck() {
      this.$router.push({
        name: "FaceSuccesss",
      });
    },
    bindQQ() {
      if (this.user.is_bind_qq === 1) {
        this.dialog = true;
        this.openmask = true;
        this.resource = "qq";
        return;
      }
      let host = window.location.href;
      let redirect = encodeURIComponent(host);
      window.location.href =
        this.config.url +
        "/api/v3/auth/login/socialite/qq?s_url=" +
        redirect +
        "&f_url=" +
        redirect +
        "&action=bind";
    },
    CodeBind(code) {
      if (this.$utils.getSessionLoginCode(code)) {
        return;
      }
      this.$utils.saveSessionLoginCode(code);
      this.$api.Auth.CodeBind({ code: code })
        .then((res) => {
          this.$message.success("绑定成功");
          this.cancel();
          this.getData();
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    cancelBind() {
      this.$api.Member.CancelBind(this.resource).then((res) => {
        this.$message.success("解绑成功");
        this.cancel();
        this.getData();
      });
    },
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
    changeMobile() {
      this.$router.push({
        name: "MobileVerify",
      });
    },
    bindMobile() {
      this.$router.push({
        name: "ChangeMobile",
      });
    },
    changePassword() {
      if (this.user.is_bind_mobile !== 1) {
        this.$message.error("请绑定手机号");
        return;
      }
      this.$router.push({
        name: "ChangePassword",
      });
    },
    submitHandle() {
      if (this.loading) {
        return;
      }
      if (!this.form.content) {
        this.$message.error("请输入昵称");
        return;
      }
      this.loading = true;
      this.$api.Member.NicknameChange({
        nick_name: this.form.content,
      })
        .then(() => {
          this.loading = false;
          this.$message.success("修改成功");
          this.form.content = null;
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
    destroyUser() {
      this.destroyDialog = true;
      this.openmask = true;
    },
    destroyUserValidate() {
      this.$api.Auth.DestroyUser()
        .then((res) => {
          this.$message.success("注销成功");
          this.cancel();
          this.logout();
          this.$router.push({
            name: "Me",
          });
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    openLogoutDialog() {
      this.logoutDialog = true;
      this.openmask = true;
    },
    goLogout() {
      this.$message.success("已安全退出");
      this.cancel();
      this.logout();
      this.$router.push({
        name: "Me",
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
  z-index: 999;
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
    .text {
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: center;
      margin-top: 35px;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      padding: 0 15px;
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
