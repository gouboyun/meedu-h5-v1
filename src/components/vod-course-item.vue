<template>
  <div class="vod-course-item-comp" @click="goShow">
    <div class="vod-course-thumb">
      <img :src="thumb" />
    </div>
    <div class="vod-course-body">
      <div class="vod-course-title">
        {{ title }}
      </div>
      <div class="vod-course-info">
        <div class="vod-course-sub">{{ userCount }}人已订阅</div>
        <div class="vod-course-charge">
          <div class="charge-text" v-if="isFree === 0 && charge > 0">
            <span class="unit">￥</span>{{ charge }}
          </div>
          <div class="free-text" v-if="isFree === 1">免费</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: [
    "cid",
    "title",
    "videosCount",
    "thumb",
    "userCount",
    "charge",
    "category",
    "isFree",
  ],
  computed: {
    ...mapState(["config"]),
  },
  methods: {
    goShow() {
      this.$router.push({ name: "VodDetail", query: { id: this.cid } });
    },
  },
};
</script>

<style lang="less" scoped>
.vod-course-item-comp {
  width: 100%;
  height: auto;
  float: left;
  display: flex;
  .vod-course-thumb {
    width: 120px;
    height: 90px;
    margin-right: 10px;
    img {
      width: 120px;
      height: 90px;
      border-radius: 4px;
    }
  }

  .vod-course-body {
    flex: 1;
    padding-top: 5px;

    .vod-course-title {
      width: 100%;
      height: 40px;
      float: left;
      font-size: 15px;
      font-weight: 500;
      color: #171923;
      line-height: 20px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 15px;
    }

    .vod-course-info {
      width: 100%;
      height: auto;
      float: left;
      display: flex;
      align-items: center;

      .vod-course-sub {
        flex: 1;
        text-align: left;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
      }

      .vod-course-charge {
        flex: 1;
        text-align: right;
        font-size: 18px;
        line-height: 18px;
        font-weight: 600;

        .charge-text {
          color: #ff5858;

          .unit {
            font-size: 14px;
          }
        }

        .free-text {
          font-size: 14px;
          font-weight: 600;
          color: #52c41a;
        }
      }
    }
  }
}
</style>
