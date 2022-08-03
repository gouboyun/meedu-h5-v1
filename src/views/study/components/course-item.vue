<template>
  <div class="course-box">
    <template v-for="(item, index) in list">
      <div
        class="course-item"
        v-if="item.course && item.course.id"
        :key="index"
        @click="goPlay(item)"
      >
        <div class="course-thumb">
          <img :src="item.course.thumb" />
          <div
            class="icon"
            v-if="item.is_subscribe === 1 || currenStatus === 'course'"
          >
            已订阅
          </div>
        </div>
        <div class="course-body">
          <div class="course-title">{{ item.course.title }}</div>
          <div class="at">
            已学&nbsp;{{ item.learned_count }}/{{
              item.course.videos_count
            }}课时
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: ["list", "currenStatus"],
  data() {
    return {};
  },
  methods: {
    goPlay(item) {
      if (this.currenStatus === "study" && item.last_view_video.length !== 0) {
        let vid = item.last_view_video.video_id;
        this.$router.push({
          name: "VodVideo",
          query: {
            id: vid,
          },
        });
      } else {
        this.goDetail(item.course_id);
      }
    },
    goDetail(id) {
      this.$router.push({ name: "VodDetail", query: { id: id } });
    },
  },
};
</script>
<style lang="less" scoped>
.course-box {
  width: 100%;
  height: auto;
  float: left;
  display: flex;
  flex-direction: column;
  .course-item {
    width: 100%;
    height: auto;
    float: left;
    margin-bottom: 15px;
    display: flex;

    &:last-child {
      margin-bottom: 0;
    }

    .course-thumb {
      position: relative;
      width: 120px;
      height: 90px;
      border-radius: 4px;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      overflow: hidden;
      img {
        width: 120px;
        height: 90px;
        border-radius: 4px;
      }
      .icon {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 56px;
        height: 22px;
        background: #ff4d4f;
        border-radius: 4px 0px 4px 0px;
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        line-height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .course-body {
      flex: 1;
      padding-top: 5px;

      .course-title {
        width: 100%;
        height: 40px;
        float: left;
        font-size: 15px;
        font-weight: 500;
        color: #171923;
        line-height: 20px;
        word-break: break-all;
        margin-bottom: 20px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
      }

      .at {
        width: 100%;
        height: auto;
        float: left;
        font-size: 13px;
        font-weight: 400;
        color: #666666;
        line-height: 13px;
      }
    }
  }
}
</style>
