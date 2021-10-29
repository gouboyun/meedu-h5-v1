<template>
  <div class="meedu-filter-box">
    <div class="filter-box">
      <div class="filter-back">
        <img class="back" @click="back" src="../assets/img/icon-back.png" />
      </div>
      <div class="filter-title">录播课程</div>
      <div class="filter-button">
        <div
          class="button-text"
          :class="{ active: id2 !== 0 }"
          @click="toggleFilterShowStatus"
        >
          <span>筛选</span>
          <img src="../assets/img/icon-filter.png" />
        </div>
        <div class="category2-box" v-if="filterShowStatus" @tap.stop>
          <div class="item" :class="{ active: id2 === 0 }" @click="setCid(0)">
            全部
          </div>
          <div
            class="item"
            :class="{ active: id2 === item.id }"
            @click="setCid(item.id)"
            v-for="item in categories2"
            :key="item.id"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          class="meedu-shadow-box"
          v-if="filterShowStatus"
          @click="toggleFilterShowStatus()"
        ></div>
      </div>
    </div>

    <div class="category1-box">
      <div
        class="item"
        :class="{ active: id1 === item.id }"
        @click="setScene(item.id)"
        v-for="(item, index) in categories1"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["categories1", "categories2", "cid1", "cid2"],
  data() {
    return {
      filterShowStatus: false,
      id1: 0,
      id2: 0,
    };
  },
  mounted() {
    this.id1 = this.cid1;
    this.id2 = parseInt(this.cid2);
  },
  watch: {
    id2() {
      this.$emit("change", this.id1, this.id2);
    },
    id1() {
      this.$emit("change", this.id1, this.id2);
    },
  },
  methods: {
    toggleFilterShowStatus() {
      this.filterShowStatus = !this.filterShowStatus;
    },
    setScene(scene) {
      this.id1 = scene;
    },
    setCid(id) {
      this.id2 = id;
      this.filterShowStatus = false;
    },
    back() {
      if (window.history.length <= 1) {
        this.$router.push({ name: "Index" });
        return false;
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style lang="less">
.meedu-shadow-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 997;
  background-color: rgba(#000, 0.3);
}

.meedu-filter-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 0px 15px;
  background-color: white;
  line-height: 30px;
  position: sticky;
  top: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  .filter-box {
    width: 100%;
    height: 50px;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .filter-back {
      width: 24px;
      height: 24px;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .filter-title {
      width: 72%;
      height: 18px;
      font-size: 18px;
      font-weight: 500;
      color: #171923;
      line-height: 18px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .category1-box {
    width: 100%;
    height: 50px;
    background: #ffffff;
    display: flex;
    align-items: center;
    .item {
      width: auto;
      height: auto;
      float: left;
      font-size: 16px;
      color: #666666;
      margin-right: 16px;

      &.active {
        color: #3ca7fa;
        font-weight: bolder;
      }
    }
  }

  .filter-button {
    width: auto;
    height: auto;
    position: relative;

    .button-text {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      display: flex;
      align-items: center;

      &.active {
        color: #3ca7fa;
      }
      img {
        width: 24px;
        height: 24px;
        margin-left: 5px;
      }
    }

    .category2-box {
      position: absolute;
      top: 30px;
      right: 0;
      z-index: 10080;
      width: 166px;
      height: auto;
      box-sizing: border-box;
      padding: 0 15px;
      border-radius: 5px;
      background-color: white;

      .item {
        width: 100%;
        height: auto;
        float: left;
        font-size: 14px;
        color: #333333;
        line-height: 40px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.active {
          color: #3ca7fa;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
