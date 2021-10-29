<template>
  <div class="protocol" @click="agreeHandle">
    <div class="checkbox-circle">
      <div class="checkbox-dot" v-if="agree"></div>
    </div>
    <div class="protocol-text">
      我同意
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
  props: ["action"],
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
  justify-content: center;
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 15px;
  color: rgba(0, 0, 0, 0.4);

  .checkbox-circle {
    width: 12px;
    height: 12px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 1px solid #3ca7fa;
    padding: 3px;

    .checkbox-dot {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #3ca7fa;
    }
  }

  .protocol-text {
    font-size: 12px;
    line-height: 12px;
    display: inline-block;
    padding-left: 5px;

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