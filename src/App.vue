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
      if (to.query.token) {
        this.autoLogin(to.query.token);
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
    async autoLogin(key) {
      if (this.$route.name !== "Login") {
        let token = null;
        if (key) {
          token = key;
          this.$utils.saveToken(token);
          let newUrl = this.$utils.removeTokenParams(window.location.href);
          window.location.href = newUrl;
        } else {
          token = this.$utils.getToken();
        }
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
  },
};
</script>
