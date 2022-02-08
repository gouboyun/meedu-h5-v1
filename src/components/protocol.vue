<template>
  <div
    class="protocol"
    :class="{ active: type === 'wechat' }"
    @click="agreeHandle"
  >
    <div class="checkbox-dot" v-if="agree">
      <img src="../assets/img/new/agree.png" style="width:20px;height:20px;" />
    </div>
    <div class="checkbox-circle" v-else></div>
    <div class="protocol-text">
      勾选同意
      <span class="href" @click="openPage(config.user_protocol)"
        >《用户协议》</span
      >
      和
      <span class="href" @click="openPage(config.user_private_protocol)"
        >《隐私协议》</span
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["action", "type"],
  data() {
    return {
      agree: false,
    };
  },
  watch: {
    agree() {
      this.$emit("agree", this.agree);
    },
  },
  computed: {
    ...mapState(["config"]),
  },
  methods: {
    agreeHandle() {
      this.agree = !this.agree;
    },
    openPage(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="less" scoped>
.protocol {
  display: flex;
  align-items: center;
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 15px 30px;
  color: rgba(0, 0, 0, 0.4);
  &.active {
    padding: 15px 0;
  }

  .checkbox-circle {
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
  }
  .checkbox-dot {
    width: 20px;
    height: 20px;
    box-sizing: border-box;
  }

  .protocol-text {
    font-size: 12px;
    line-height: 12px;
    display: inline-block;
    padding-left: 10px;

    .href {
      color: #3ca7fa;
      margin-left: 5px;
      margin-right: 5px;

      &:active {
        color: rgba(#3ca7fa, 0.9);
      }
    }
  }
}
</style>
