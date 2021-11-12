<template>
  <div class="container">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">设置</div>
    </div>
    <div class="group-box mt-15">
      <div class="group-item" @click="openPage(config.user_protocol)">
        <div class="name">用户协议</div>
      </div>
      <div
        class="group-item"
        @click="openPage(config.user_private_protocol, '隐私协议')"
      >
        <div class="name">隐私协议</div>
      </div>
      <div class="group-item" @click="openPage(config.aboutus, '关于我们')">
        <div class="name">关于我们</div>
      </div>
    </div>

    <div class="box pl-30 pr-30" v-if="isLogin">
      <btn-block @taptap="goLogout" text="安全退出"></btn-block>
    </div>

    <copyright-comp></copyright-comp>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import CopyrightComp from "../../components/copyright";
import BtnBlock from "../../components/btn-block";

export default {
  components: {
    CopyrightComp,
    BtnBlock,
  },
  computed: {
    ...mapState(["isLogin", "config"]),
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapMutations(["logout"]),
    openPage(url) {
      window.open(url);
    },
    goLogout() {
      this.$message.success("已安全退出");
      this.logout();
      this.$router.push({
        name: "MemberSetting",
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
  .group-box {
    width: 100%;
    height: auto;
    float: left;
    margin-bottom: 15px;
    background-color: white;
    .group-item {
      width: 100%;
      height: auto;
      float: left;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      box-sizing: border-box;
      padding: 8px 15px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.03);
      .name {
        width: 150px;
        height: auto;
        float: left;
        line-height: 36px;
        font-size: 15px;
        color: #333333;
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
