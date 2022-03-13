<template>
  <div
    class="none"
    :class="{ active: type === 'white', gray: type === 'gray' }"
  >
    <div class="empty-box">
      <div class="image-empty-item">
        <img src="../assets/img/img-placeholder.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["type"],
};
</script>
<style lang="less" scoped>
.none {
  width: 100%;
  height: 100%;
  float: left;
  background-color: #f4fafe;
  &.active {
    background-color: #fff;
  }
  &.gray {
    background-color: #f6f6f6;
  }
  .empty-box {
    width: 100%;
    height: auto;
    float: left;
    text-align: center;
    padding-top: 50px;
    padding-bottom: 50px;
    .image-empty-item {
      display: inline-block;
      img {
        width: 120px;
        height: 120px;
      }
    }
  }
}
</style>
