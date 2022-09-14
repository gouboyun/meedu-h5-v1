<template>
  <div id="content" class="container">
    <!-- 用户信息 -->
    <div class="user-icon"></div>
    <div
      class="user-info-box"
      @click="$router.push({ name: 'MemberProfile' })"
      v-if="isLogin"
    >
      <div class="user-avatar-box">
        <img :src="user.avatar" />
      </div>
      <div class="user-body">
        <div class="user-nickname">{{ user.nick_name }}</div>
        <div class="role-name">
          {{ user.role ? user.role.name : "免费会员" }}
        </div>
      </div>
      <div class="user-back">
        <img
          src="../../assets/img/new/back.png"
          style="width: 15px; height: 15px"
        />
      </div>
    </div>
    <div class="user-info-box" @click="goLogin" v-else>
      <div class="user-avatar-box">
        <img src="../../assets/img/default_avatar.png" />
      </div>
      <div class="user-body">
        <div class="login-button">请登录</div>
      </div>
      <div class="user-back">
        <img
          src="../../assets/img/new/back.png"
          style="width: 15px; height: 15px"
        />
      </div>
    </div>

    <div class="vip-banner-box">
      <div class="banner" @click="goRole">
        <img class="icon" src="../../assets/img/new/VIP.png" />
        <img class="back" src="../../assets/img/new/banner.png" />
        <div class="info">海量课程免费学！</div>
        <div class="btn">会员中心</div>
      </div>
    </div>

    <div class="user-banner-item">
      <div class="banner-body">
        <div
          class="item"
          v-if="isLogin"
          @click="$router.push({ name: 'MemberOrder' })"
        >
          <div class="icon">
            <div class="icon-img">
              <img src="../../assets/img/new/order.png" />
            </div>
            <div class="name">我的订单</div>
          </div>
          <div class="arrow-icon">
            <img src="../../assets/img/new/back.png" />
          </div>
        </div>
        <div class="item" v-else @click="goLogin">
          <div class="icon">
            <div class="icon-img">
              <img src="../../assets/img/new/order.png" />
            </div>
            <div class="name">我的订单</div>
          </div>
          <div class="arrow-icon">
            <img src="../../assets/img/new/back.png" />
          </div>
        </div>
        <div
          class="item"
          v-if="isLogin"
          @click="$router.push({ name: 'Messages' })"
        >
          <div class="icon">
            <div class="icon-img">
              <img src="../../assets/img/new/message.png" />
            </div>
            <div class="name">我的消息</div>
          </div>
          <i class="count" v-if="newStatus"></i>
          <div class="arrow-icon">
            <img src="../../assets/img/new/back.png" />
          </div>
        </div>
        <div class="item" v-else @click="goLogin">
          <div class="icon">
            <div class="icon-img">
              <img src="../../assets/img/new/message.png" />
            </div>
            <div class="name">我的消息</div>
          </div>
          <div class="arrow-icon">
            <img src="../../assets/img/new/back.png" />
          </div>
        </div>
        <div class="item" @click="$router.push({ name: 'MemberSetting' })">
          <div class="icon">
            <div class="icon-img">
              <img src="../../assets/img/new/setting.png" />
            </div>
            <div class="name">我的设置</div>
          </div>
          <div class="arrow-icon">
            <img src="../../assets/img/new/back.png" />
          </div>
        </div>
      </div>
    </div>

    <tech-support></tech-support>
    <nav-footer type="me"></nav-footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavFooter from "../../components/nav-footer";
import TechSupport from "../../components/tech-support";

export default {
  components: {
    TechSupport,
    NavFooter,
  },
  data() {
    return {
      newStatus: false,
    };
  },
  watch: {
    isLogin(val) {
      if (val) {
        this.getUnread();
      }
    },
  },
  computed: {
    ...mapState(["isLogin", "user", "func"]),
    otherFunc() {
      let a = [];

      if (this.func.codeExchanger) {
        a.push({
          name: "兑换码",
          url: "/codeExchanger/index",
          icon: "../../assets/img/icon-exchange@2x.png",
        });
      }

      return a;
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      if (this.isLogin) {
        this.getUnread();
      }
    },
    goLogin() {
      this.$router.push({
        name: "Login",
        query: {
          url: window.location.href,
        },
      });
    },
    goRole() {
      this.$router.push({ name: "Role" });
    },
    getUnread() {
      this.$api.Member.UnReadNum().then((res) => {
        let num = res.data;
        if (num === 0) {
          this.newStatus = false;
        } else {
          this.newStatus = true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  background: #fff;
  overflow: hidden;
}
.user-icon {
  width: 100%;
  background: #ffffff;
  height: 25px;
  float: left;
  box-sizing: border-box;
  display: flex;
}

/* 用户信息 */
.user-info-box {
  width: 100%;
  background: #ffffff;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 25px 15px 30px 15px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;

  .user-avatar-box {
    width: auto;
    height: 64px;
    box-sizing: border-box;
    padding-right: 15px;
    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
  }

  .user-body {
    flex: 1;
    height: 64px;
    .user-nickname {
      width: 100%;
      height: auto;
      float: left;
      box-sizing: border-box;
      padding-top: 10px;
      padding-bottom: 15px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 16px;
    }

    .role-name {
      width: 100%;
      height: auto;
      float: left;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      line-height: 13px;
    }

    .login-button {
      width: 100%;
      height: auto;
      float: left;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      line-height: 64px;
    }
  }
}

/* vip-banner */
.vip-banner-box {
  width: 100%;
  height: auto;
  float: left;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0px 15px;
  .banner {
    width: 100%;
    float: left;
    height: 94px;
    background: linear-gradient(90deg, #ffe9b8 0%, #efcc8d 100%);
    box-shadow: 0px 8px 24px 0px rgba(255, 179, 59, 0.2);
    border-radius: 16px;
    position: relative;
    box-sizing: border-box;
    padding: 30px;
    .icon {
      position: absolute;
      height: 20px;
      top: 20px;
      left: 30px;
    }
    .back {
      position: absolute;
      height: 68px;
      top: 0px;
      right: 0px;
    }
    .info {
      width: 100%;
      font-size: 14px;
      font-weight: 500;
      color: #613400;
      line-height: 14px;
      margin-top: 30px;
    }
    .btn {
      position: absolute;
      top: 34px;
      right: 20px;
      width: 68px;
      height: 26px;
      background: #9b5300;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 400;
      color: #f9ddb2;
      line-height: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.user-banner-item {
  width: 100%;
  height: auto;
  float: left;
  background-color: white;
  box-sizing: border-box;
  padding: 20px 0px;

  .banner-body {
    width: 100%;
    height: auto;
    float: left;
    .item {
      width: 100%;
      height: 75px;
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      .icon {
        width: 100%;
        height: 35px;
        float: left;
        display: flex;
        flex-direction: row;
        align-items: center;
        .icon-img {
          display: inline-block;
          height: 35px;
          img {
            width: 35px;
            height: 35px;
            margin-right: 15px;
          }
        }
        .name {
          width: 100%;
          float: left;
          height: 15px;
          font-size: 15px;
          font-weight: 400;
          color: #333333;
          line-height: 15px;
        }
      }

      .count {
        position: absolute;
        width: 9px;
        height: 9px;
        background: #ff4d4f;
        border-radius: 50%;
        top: 33px;
        right: 45px;
      }

      .arrow-icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        img {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}
</style>

<style>
#page {
  background-color: #fff;
}
</style>
