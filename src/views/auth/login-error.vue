<template>
  <div class="pay-success-box">
    <div class="icon">
      <img src="../../assets/img/icon-error.png" />
    </div>
    <div class="text">{{ msg }}</div>
    <div class="btn-box">
      <div class="button" @click="goIndex()">返回首页</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      msg: this.$route.query.msg,
    };
  },
  methods: {
    goIndex() {
      this.$router.replace({
        name: "Index",
      });
    },
  },
};
</script>
<style lang="less" scoped>
.pay-success-box {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
    margin-bottom: 30px;
  }
  .text {
    height: 30px;
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    line-height: 30px;
  }
  .btn-box {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 56px;
    .button {
      width: 315px;
      height: 48px;
      border-radius: 4px;
      background: #3ca7fa;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 400;
      color: #fff;
    }
  }
}
</style>
