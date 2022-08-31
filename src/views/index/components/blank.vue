<template>
  <div
    class="blank-box borderbox"
    :style="{ height: height + 'px', 'background-color': bgColor }"
  ></div>
</template>

<script>
export default {
  props: ["height", "bgColor"],
};
</script>

<style lang="less" scoped>
.blank-box {
  width: 100%;
  height: auto;
  float: left;
  background: #ffffff;
  display: flex;
}
</style>
