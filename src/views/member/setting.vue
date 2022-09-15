<template>
  <div class="container">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">关于平台</div>
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

    <copyright-comp></copyright-comp>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import CopyrightComp from "../../components/copyright";

export default {
  components: {
    CopyrightComp,
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
