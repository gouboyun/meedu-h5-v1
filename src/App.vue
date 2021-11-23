<template>
  <div id="app">
    <vue-confirm-dialog></vue-confirm-dialog>
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from "vuex";

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
  mounted() {
    this.autoLogin();
    this.getConfig();
  },
  methods: {
    ...mapMutations(["submitLogin", "setConfig"]),
    autoLogin(key) {
      if (this.$route.name !== "Login") {
        let token = null;
        if (key) {
          token = key;
          window.localStorage.setItem("token", token);
        } else {
          token = window.localStorage.getItem("token");
        }
        if (token) {
          this.getUser();
        }
      }
    },
    getUser() {
      this.$api.User.Detail()
        .then((res) => {
          this.submitLogin(res.data);
        })
        .catch(() => {
          window.localStorage.removeItem("token");
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
    },
    getConfig() {
      this.$api.Other.Config().then((res) => {
        this.setConfig(res.data);
        if (!this.$utils.isMobile()) {
          if (res.data.pc_url !== "") {
            window.location.href = res.data.pc_url;
          }
        }
      });
    },
  },
};
</script>