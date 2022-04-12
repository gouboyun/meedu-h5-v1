<template>
  <div class="pay-success-box">
    <div class="icon">
      <img src="../../assets/img/icon-adopt.png" />
    </div>
    <div class="text">支付成功</div>
    <div class="btn-box">
      <div class="button" @click="goIndex()">返回首页</div>
      <div class="button find" @click="find()">查看订单</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    goIndex() {
      this.$router.replace({
        name: "Index",
      });
    },
    find() {
      this.$router.replace({
        name: "MemberOrder",
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
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  }
  .text {
    height: 18px;
    font-size: 18px;
    font-weight: 500;
    color: #04c877;
    line-height: 18px;
    margin-top: 30px;
    margin-bottom: 50px;
  }
  .btn-box {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .button {
      width: 120px;
      height: 45px;
      border-radius: 4px;
      border: 1px solid #cccccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 400;
      color: #666666;
      &.find {
        color: #ff4d4f;
        border: 1px solid #ff4d4f;
        margin-left: 35px;
      }
    }
  }
}
</style>
