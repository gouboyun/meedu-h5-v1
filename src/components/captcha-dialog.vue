<template>
  <transition name="fade">
    <div class="mask" v-if="status">
      <div class="modal">
        <div class="body">
          <div class="item">
            <div class="input">
              <input
                type="text"
                class="input-text"
                placeholder="请输入图形验证码"
                v-model="form.captcha"
              />
            </div>
            <div class="captcha">
              <img
                v-show="captcha.img"
                :src="captcha.img"
                @click="getCaptcha"
              />
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="btn_default" @click="cancel">取消</div>
          <div class="btn_primary" @click="change">确认</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: ["status", "reStatus"],
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
  mounted() {
    this.getCaptcha();
  },
  watch: {
    reStatus() {
      this.form.captcha = null;
      this.getCaptcha();
    },
  },
  methods: {
    getCaptcha() {
      this.$api.Other.Captcha().then((res) => {
        this.captcha = res.data;
      });
    },
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
    width: 300px;
    height: 168px;
    top: 50%;
    left: 50%;
    margin-top: -84px;
    margin-left: -150px;
    background-color: #fff;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
    animation: window-open 0.3s;

    .body {
      padding: 40px 15px;
      font-size: 15px;
      line-height: 1.4;
      color: #999;
      overflow-x: hidden;
      overflow-y: auto;
      .item {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .input {
          width: 161px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          box-sizing: border-box;
          align-items: center;
          border-bottom: 1px solid #dcdfe6;
          .input-text {
            max-width: 161px;
            height: 36px;
            float: left;
            box-sizing: border-box;
            outline: none;
            color: #333333;
            font-size: 16px;
            border: none;
          }
        }
        .captcha {
          width: 90px;
          height: 36px;
          padding-top: 0;
          margin-left: 19px;
          img {
            width: 90px;
            display: inline-block;
            overflow: hidden;
            position: relative;
          }
        }
      }
    }
    .bottom {
      position: relative;
      line-height: 48px;
      font-size: 18px;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      border-top: 1px solid #f5f5f5;
      .btn_default {
        display: block;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        color: rgb(0, 0, 0);
        text-decoration: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        position: relative;
        cursor: pointer;
        border-right: 1px solid #f5f5f5;
      }
      .btn_primary {
        display: block;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        color: rgb(0, 122, 255);
        text-decoration: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        position: relative;
        cursor: pointer;
      }
    }
  }
}
</style>
