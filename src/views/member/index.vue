<template>
  <div id="content" class="container">
    <!-- 用户信息 -->
    <div class="user-icon">
      <div class="left-icon" @click="$router.push({ name: 'Messages' })">
        <i class="count" v-if="newStatus"></i>
        <img
          src="../../assets/img/icon-message@2x.png"
          style="width:26px; height: 26px"
        />
      </div>
      <div class="right-icon">
        <div
          class="user-setting"
          @click="$router.push({ name: 'MemberSetting' })"
        >
          <img
            src="../../assets/img/icon-setting@2x.png"
            style="width: 26px; height: 26px"
          />
        </div>
      </div>
    </div>
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
          style="width: 12px; height: 12px"
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
          style="width: 12px; height: 12px"
        />
      </div>
    </div>

    <div class="vip-banner-box" @click="goRole">
      <img src="../../assets/img/VIPcenter@2x.png" />
    </div>

    <div class="user-banner-item">
      <div class="banner-title">我的账号</div>
      <div class="banner-body">
        <div class="grid-box">
          <div
            class="grid-item"
            v-if="isLogin"
            @click="$router.push({ name: 'MemberOrder' })"
          >
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-list@2x.png" />
              </div>
            </div>
            <div class="name">我的订单</div>
          </div>
          <div class="grid-item" v-else @click="goLogin">
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-list@2x.png" />
              </div>
            </div>
            <div class="name">我的订单</div>
          </div>

          <div
            class="grid-item"
            @click="$router.push({ name: 'MemberShare' })"
            v-if="func.share"
          >
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-money@2x.png" />
              </div>
            </div>
            <div class="name">推广赚金</div>
          </div>

          <div
            class="grid-item"
            @click="$router.push({ name: 'MemberPromoCode' })"
            v-if="isLogin && func.promoCode"
          >
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-money@2x.png" />
              </div>
            </div>
            <div class="name">我的邀请</div>
          </div>
          <div class="grid-item" @click="goLogin" v-else>
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-money@2x.png" />
              </div>
            </div>
            <div class="name">我的邀请</div>
          </div>
        </div>
      </div>
    </div>

    <div class="user-banner-item" v-if="func.paper">
      <div class="banner-title">考试练习</div>
      <div class="banner-body">
        <div class="grid-box">
          <div
            class="grid-item"
            @click="$router.push({ name: 'ExamPaper' })"
            v-if="func.paper"
          >
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-exam@2x.png" />
              </div>
            </div>
            <div class="name">试卷</div>
          </div>

          <div
            class="grid-item"
            @click="$router.push({ name: 'ExamPractice' })"
            v-if="func.practice"
          >
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-practice@2x.png" />
              </div>
            </div>
            <div class="name">练习</div>
          </div>

          <div
            class="grid-item"
            @click="$router.push({ name: 'ExamMockpaper' })"
            v-if="func.mockPaper"
          >
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-mock@2x.png" />
              </div>
            </div>
            <div class="name">模拟考试</div>
          </div>

          <div
            class="grid-item"
            @click="$router.push({ name: 'ExamWrongbook' })"
            v-if="func.wrongBook"
          >
            <div class="icon">
              <div class="icon-img">
                <img src="../../assets/img/icon-wrongbook@2x.png" />
              </div>
            </div>
            <div class="name">错题本</div>
          </div>
        </div>
      </div>
    </div>

    <div class="user-banner-item" v-if="otherFunc.length > 0">
      <div class="banner-title">其它功能</div>
      <div class="banner-body">
        <div class="grid-box">
          <div
            class="grid-item"
            @click="$router.push({ name: 'ExamCodeExchanger' })"
            v-for="(item, index) in otherFunc"
            :key="index"
          >
            <div class="icon">
              <div class="icon-img">
                <img :src="item.icon" />
              </div>
            </div>
            <div class="name">{{ item.name }}</div>
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
  margin-bottom: 53px;
  background: #f3f6f9;
}
.user-icon {
  width: 100%;
  background: #ffffff;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 20px 15px 0 15px;
  display: flex;
  justify-content: space-between;
  .left-icon {
    position: relative;
    width: 26px;
    height: 26px;
    .count {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ff5068;
      top: 0;
      right: 0;
    }
  }
  .right-icon {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    .user-setting {
      position: relative;
      width: 26px;
      height: 26px;
    }
  }
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
  height: 60px;
  float: left;
  background: #ffffff;
  text-align: center;
  img {
    height: 60px;
  }
}

.user-banner-item {
  width: 100%;
  height: auto;
  float: left;
  background-color: white;
  box-sizing: border-box;
  padding: 30px 15px;
  margin-bottom: 10px;

  .banner-title {
    width: 100%;
    height: auto;
    float: left;
    margin-bottom: 25px;
    font-size: 15px;
    font-weight: 600;
    color: #333333;
    line-height: 15px;
  }

  .banner-body {
    width: 100%;
    height: auto;
    float: left;

    .grid-box {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      box-sizing: border-box;
      padding-left: 15px;
      padding-right: 15px;

      .grid-item {
        .icon {
          width: 100%;
          height: auto;
          float: left;
          margin-bottom: 10px;
          text-align: center;

          .icon-img {
            display: inline-block;
            img {
              width: 30px;
              height: 30px;
            }
          }
        }

        .name {
          width: 100%;
          height: auto;
          float: left;
          font-size: 12px;
          font-weight: 400;
          color: #333333;
          line-height: 12px;
          text-align: center;
        }
      }
    }
  }
}
</style>

<style>
#page {
  background-color: #f3f6f9;
}
</style>
