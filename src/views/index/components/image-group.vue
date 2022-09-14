<template>
  <div class="image-group-box">
    <template v-if="v === 'v-1' || v === 'v-2' || v === 'v-3' || v === 'v-4'">
      <div
        class="image-group-item"
        @click="go(item)"
        v-for="(item, index) in items"
        :key="index"
      >
        <img class="image" :src="item.src" />
      </div>
    </template>
    <template v-else-if="v === 'v-1-2'">
      <div @click="go(items[0])" class="image-group-item">
        <img :src="items[0].src" />
      </div>
      <div class="image-group-item">
        <div @click="go(items[1])" class="box">
          <img class="image" :src="items[1].src" />
        </div>
        <div @click="go(items[2])" class="box">
          <img class="image" :src="items[2].src" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["v", "items"],
  computed: {
    ...mapState(["isLogin"]),
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
    go(item) {
      if (!item.url) {
        return;
      }
      let url = item.url;
      if (url.substr(0, 4) === "http") {
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
.image-group-box {
  width: 100%;
  height: auto;
  float: left;
  display: flex;
  align-items: center;

  .image-group-item {
    flex: 1;
  }
}
.image {
  width: 100%;
}
</style>
