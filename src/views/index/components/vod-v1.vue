<template>
  <div class="index-section-box borderbox" v-if="items.length > 0">
    <div class="index-section-title">
      <div class="index-section-title-text">{{ name }}</div>
      <div class="more">
        <span
          @click="
            $router.push({
              name: 'Vod',
            })
          "
          >查看全部</span
        >
      </div>
    </div>
    <div class="index-section-body">
      <div
        class="vod-course-item"
        v-for="(course, index) in items"
        :key="index"
      >
        <vod-course-item
          :cid="course.id"
          :videos-coun="course.videos_count"
          :thumb="course.thumb"
          :category="course.category"
          :title="course.title"
          :charge="course.charge"
          :is-free="course.is_free"
          :user-count="course.user_count"
        ></vod-course-item>
      </div>
    </div>
  </div>
</template>

<script>
import VodCourseItem from "../../../components/vod-course-item";

export default {
  components: {
    VodCourseItem,
  },
  props: ["name", "items"],
};
</script>

<style lang="less" scoped>
.index-section-box {
  width: 100%;
  margin-top: 10px;
  background: #ffffff;
  padding: 25px 15px 20px 15px;
  display: flex;
  flex-direction: column;
  .index-section-title {
    width: 100%;
    height: 19px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    .index-section-title-text {
      height: 19px;
      font-size: 19px;
      font-weight: 600;
      color: #333333;
      line-height: 19px;
    }
    .more {
      display: inline-block;
      width: auto;
      height: 13px;
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      line-height: 13px;
      cursor: pointer;
    }
  }
  .index-section-body {
    width: 100%;
    .vod-course-item {
      width: 100%;
      display: flex;
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
