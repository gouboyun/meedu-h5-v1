<template>
  <div class="face-success-box">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">实名认证</div>
    </div>
    <template v-if="checkSuccess">
      <div class="icon">
        <img src="../../assets/img/faceSuccess.png" />
      </div>
      <div class="profile">
        <div class="profile-item">
          <span class="label">姓名</span>
          <span>{{ user.profile_real_name }}</span>
        </div>
        <div class="profile-item">
          <span class="label">身份证号</span>
          <span>{{ user.profile_id_number }}</span>
        </div>
      </div>
    </template>
    <div class="result" v-else>正在查询实人认证结果</div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      loading: false,
      checkSuccess: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "config", "user"]),
  },
  mounted() {
    if (this.$utils.getBizToken() && this.$utils.getBizToken()) {
      this.getData(this.$utils.getBizToken(), this.$utils.getBizToken());
    }
    if (this.user.is_face_verify) {
      this.checkSuccess = true;
    }
  },
  methods: {
    ...mapMutations(["submitLogin"]),
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
          this.getUser();
        }
      });
    },
    getUser() {
      this.$api.User.Detail().then((res) => {
        this.submitLogin(res.data);
        this.$message.success("实人认证成功");
        this.checkSuccess = true;
        this.$utils.clearBizToken();
        this.$utils.clearRuleId();
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
  margin-top: 80px;
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
  .profile {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 0 20px;
    .profile-item {
      width: 100%;
      height: 56px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #f3f6f9;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 16px;
    }
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
