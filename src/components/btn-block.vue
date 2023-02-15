<template>
  <div class="btn-block-box">
    <div class="btn" @click="tapHandler">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: ["text"],
  methods: {
    tapHandler() {
      this.$emit("taptap");
    },
  },
};
</script>

<style lang="less" scoped>
.btn-block-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;

  .btn {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    text-align: center;
    color: white;
    background-color: #3ca7fa;
    font-size: 15px;
    -ms-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;

    &:active {
      background-color: rgba(#3ca7fa, 0.9);
    }
  }
}
</style>
