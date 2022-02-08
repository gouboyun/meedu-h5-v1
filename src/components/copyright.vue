<template>
  <div class="copyright">
    <div class="item">Copyright {{ localYear }}.</div>
    <div class="item" v-if="config">{{ config.webname }} 版权所有</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["config"]),
    localYear() {
      let myDate = new Date();
      let tYear = myDate.getFullYear();
      return tYear;
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.copyright {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 100px;
  text-align: center;
}
.copyright > .item {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 20px;
}
</style>
