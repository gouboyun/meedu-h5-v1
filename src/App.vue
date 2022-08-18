<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      token: this.$route.query.token,
    };
  },
  watch: {
    $route(to, from) {
      if (to.query.login_code && to.query.action === "login") {
        this.CodeLogin(to.query.login_code);
      }
    },
  },
  async mounted() {
    await this.getConfig();
    await this.autoLogin();
  },
  computed: {
    ...mapState(["config"]),
  },
  methods: {
    ...mapMutations(["submitLogin", "setConfig"]),
    async autoLogin() {
      if (this.$route.name !== "Login") {
        let token = this.$utils.getToken();

        if (token) {
          await this.getUser();
        }
      }
    },
    async getUser() {
      try {
        let res = await this.$api.User.Detail();

        // 强制绑定手机号
        if (
          this.config &&
          res.data.is_bind_mobile === 0 &&
          this.config.member.enabled_mobile_bind_alert === 1
        ) {
          let token = this.$utils.getToken();
          this.$utils.saveTmpToken(token);
          this.$utils.clearToken();
          this.$router.push({
            name: "BindMobile",
          });
        } else {
          this.submitLogin(res.data);
        }
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    async getConfig() {
      let res = await this.$api.Other.Config();
      this.setConfig(res.data);
      if (!this.$utils.isMobile()) {
        if (res.data.pc_url !== "") {
          window.location.href = res.data.pc_url;
        }
      }
    },
    CodeLogin(code) {
      if (this.$utils.getSessionLoginCode(code)) {
        return;
      }
      this.$utils.saveSessionLoginCode(code);
      this.$api.Auth.CodeLogin({ code: code })
        .then((res) => {
          if (res.data.success === 1) {
            this.$utils.saveToken(res.data.token);
            this.getUser();
          } else {
            if (res.data.action === "bind_mobile") {
              this.$utils.saveLoginCode(code);
              this.$router.push({
                name: "CodeBindMobile",
              });
            }
          }
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
  },
};
</script>
