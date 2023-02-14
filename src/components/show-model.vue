<template>
  <transition name="fade">
    <div class="mask">
      <div class="modal">
        <div class="body">
          <div class="top">
            {{ title }}
          </div>
          <div class="item">{{ text }}</div>
        </div>
        <div class="bottom">
          <div class="btn_cancel" @click="cancel">
            退出登录
          </div>
          <div class="btn_primary" @click="change">
            {{ confirmText }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: ["title", "text", "confirmText"],
  data() {
    return {
      captcha: {
        key: null,
        img: null,
      },
      form: {
        captcha: "",
      },
    };
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit("cancel", true);
    },
    change() {
      this.$emit("change", this.form.captcha, this.captcha);
    },
  },
};
</script>
<style lang="less" scoped>
.mask {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);

  .modal {
    position: fixed;
    z-index: 999;
    width: 295px;
    height: 173px;
    background: #ffffff;
    border-radius: 8px;
    top: calc(50% - 86.5px);
    left: calc(50% - 147.5px);
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    animation: window-open 0.3s;

    .body {
      width: 100%;
      box-sizing: border-box;
      .top {
        width: 100%;
        height: 24px;
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 30px;
      }
      .item {
        width: 100%;
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        text-align: center;
        margin-bottom: 30px;
      }
    }
    .bottom {
      width: 100%;
      height: 46px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-top: 1px solid #f5f5f5;
      box-sizing: border-box;
      .btn_primary {
        width: 50%;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 500;
        color: #3ca7fa;
        line-height: 16px;
        border-left: 1px solid #f5f5f5;
      }
      .btn_cancel {
        width: 50%;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 500;
        color: #666666;
        line-height: 16px;
      }
    }
  }
}
</style>
