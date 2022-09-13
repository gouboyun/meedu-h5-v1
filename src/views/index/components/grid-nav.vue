<template>
  <div class="nav-box">
    <div
      class="nav-box-row"
      :class="{ active: lineCount === 5 }"
      v-for="(childrenRows, index) in navs"
      :key="index"
    >
      <div
        class="nav-item"
        v-for="(childrenItem, index2) in childrenRows"
        :key="index2"
        @click="goNav(childrenItem)"
      >
        <div class="icon">
          <img :src="childrenItem.src" />
        </div>
        <div class="name">{{ childrenItem.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["lineCount", "items"],
  computed: {
    ...mapState(["isLogin"]),
    navs() {
      let rows = [];
      let lineCount = parseInt(this.lineCount);
      let count = parseInt(this.items.length / lineCount);
      let mod = this.items.length % lineCount;
      let len = mod === 0 ? count : count + 1;

      for (let i = 0; i < len; i++) {
        let tmp = [];

        for (let j = 0; j < lineCount; j++) {
          let tmpItem = this.items[i * lineCount + j];
          if (!tmpItem) {
            break;
          }
          tmp.push(tmpItem);
        }

        rows.push(tmp);
      }

      return rows;
    },
  },
  methods: {
    goLogin() {
      this.$router.push({
        name: "Login",
        query: {
          url: window.location.href,
        },
      });
    },
    goNav(nav) {
      let url = nav.href;
      if (url.substr(0, 4) === "http") {
        // 网页
        window.location.href = url;
      } else {
        if (!this.isLogin) {
          this.goLogin();
          return;
        }
        this.$router.push({
          path: url,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.nav-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  background-color: white;
  padding: 10px 25px 5px 25px;

  .nav-box-row {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 50px;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
    margin-bottom: 15px;
    &.active {
      gap: 20px;
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
    .nav-item {
      width: 48px;
      height: auto;

      .icon {
        width: 100%;
        height: 44px;
        float: left;
        margin-bottom: 8px;
        display: flex;
        justify-content: center;
        img {
          width: 44px;
          height: 44px;
        }
      }

      .name {
        width: 100%;
        height: auto;
        float: left;
        text-align: center;
        color: #333333;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
</style>
