<template>
  <div class="footer borderbox">
    <div class="item" @click="goPage(1)">
      <img v-if="type == 'index'" src="../assets/img/icon-home-h@2x.png" />
      <img v-else src="../assets/img/icon-home-n@2x.png" />
      <span>首页</span>
    </div>
    <div class="item" @click="goPage(2)">
      <img v-if="type == 'study'" src="../assets/img/icon-study-h@2x.png" />
      <img v-else src="../assets/img/icon-study-n@2x.png" />
      <span>在学</span>
    </div>
    <div class="item" @click="goPage(3)">
      <img v-if="type == 'me'" src="../assets/img/icon-me-h@2x.png" />
      <img v-else src="../assets/img/icon-me-n@2x.png" />
      <span>我的</span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: ["type"],
  computed: {
    ...mapState(["config"]),
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  methods: {
    goPage(val) {
      if (val === 1) {
        if (this.type == "index") {
          return;
        }
        this.$router.push({ name: "Index" });
      } else if (val === 2) {
        if (this.type == "study") {
          return;
        }
        this.$router.push({ name: "Study" });
      } else {
        if (this.type == "me") {
          return;
        }
        this.$router.push({ name: "Me" });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 53px;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 50px;
  .item {
    height: 53px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    img {
      width: 28px;
      height: 28px;
      margin-bottom: 3px;
    }
    span {
      height: 11px;
      font-size: 11px;
      font-weight: 400;
      color: #333333;
      line-height: 11px;
      text-align: center;
    }
  }
}
</style>