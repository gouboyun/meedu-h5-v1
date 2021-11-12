<template>
  <div class="container">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">密码登录</div>
    </div>
    <div class="password-login-form">
      <div class="item">
        <div class="name">手机号</div>
        <div class="input">
          <input
            type="text"
            class="input-text"
            placeholder="手机号"
            v-model="passwordForm.mobile"
          />
        </div>
      </div>
      <div class="item">
        <div class="name">密码</div>
        <div class="input">
          <input
            type="password"
            class="input-text"
            placeholder="密码"
            v-model="passwordForm.password"
          />
        </div>
      </div>
    </div>

    <div class="box border-box mt-15 pl-30 pr-30">
      <btn-block @taptap="passwordLoginHandler" text="登录"></btn-block>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import BtnBlock from "../../components/btn-block";

export default {
  components: {
    BtnBlock,
  },
  data() {
    return {
      passwordForm: {
        mobile: "",
        password: "",
      },
    };
  },
  computed: {},
  methods: {
    ...mapMutations(["submitLogin"]),
    passwordLoginHandler() {
      if (!this.passwordForm.mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.passwordForm.password) {
        this.$message.error("请输入密码");
        return;
      }
      this.$api.Auth.PasswordLogin({
        mobile: this.passwordForm.mobile,
        password: this.passwordForm.password,
      })
        .then((res) => {
          // 写入token
          window.localStorage.setItem("token", res.data.token);

          this.$api.User.Detail()
            .then((res) => {
              this.submitLogin(res.data);
              this.$router.push({ name: "Index" });
            })
            .catch((e) => {
              if (e.code === 401) {
                window.localStorage.removeItem("token");
                this.$router.replace({
                  name: "Index",
                });
              } else {
                this.$message.error(e.message);
              }
            });
        })
        .catch((e) => {
          this.$message.error(e.message);
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
}
.box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
}

.password-login-form {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 15px;
  background-color: white;

  .item {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 8px 15px;
    display: flex;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    .name {
      width: 100px;
      height: auto;
      font-size: 14px;
      font-weight: 400;
      color: #333;
      line-height: 40px;
    }

    .input {
      flex: 1;
      box-sizing: border-box;

      .input-text {
        width: 100%;
        height: 40px;
        font-size: 14px;
        float: left;
        box-sizing: border-box;
        outline: none;
        color: #333;
        border: none;
        padding: 0;
        margin: 0;
        text-decoration: inherit;
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
