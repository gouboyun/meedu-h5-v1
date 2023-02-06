<template>
  <div class="face-success-box">
    <div class="icon" v-if="checkSuccess">
      <img src="../../assets/img/faceSuccess.png" />
    </div>
    <div class="result" v-else>正在查询实人认证结果</div>
    <div class="btn-box" v-if="loading">
      <div class="button" @click="goIndex()">返回首页</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      checkSuccess: false,
    };
  },
  mounted() {
    let url = new URL(window.location.href);
    let extra = url.searchParams.get("Extra");
    if (extra) {
      extra = JSON.parse(extra);
      if (extra["rule_id"]) {
        this.getData(extra["rule_id"], extra["biz_token"]);
      }
    }
  },
  methods: {
    goIndex() {
      this.$router.replace({
        name: "Index",
      });
    },
    getData(ruleId, bizToken) {
      this.$api.Member.TecentFaceVerifyQuery({
        biz_token: bizToken,
        rule_id: ruleId,
      }).then((res) => {
        if (res.data.status === 9) {
          this.$message.success("实人认证成功");
          this.loading = true;
          this.checkSuccess = true;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.face-success-box {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    width: 200px;
    height: 200px;
    img {
      width: 200px;
      height: 200px;
    }
    margin-bottom: 30px;
  }
  .result {
    width: 234px;
    height: 30px;
    font-size: 18px;
    font-weight: 400;
    color: #666666;
    line-height: 30px;
    text-align: center;
    margin: 0 auto;
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
