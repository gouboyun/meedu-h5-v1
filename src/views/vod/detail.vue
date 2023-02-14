<template>
  <div class="box">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">课程详情</div>
    </div>
    <template v-if="course">
      <div class="course-thumb">
        <img :src="course.thumb" width="100%" mode="widthFix" />
      </div>
      <div class="course-title">{{ course.title }}</div>
      <div class="stat">
        <div class="item charge">
          <span class="value" v-if="course.is_free === 1 || course.charge == 0"
            >免费</span
          >
          <template v-else-if="course.charge > 0">
            <span class="small">￥</span>{{ course.charge }}
          </template>
        </div>
        <div class="item user-count">
          <span>{{ course.user_count }}人已订阅</span>
        </div>
      </div>
      <div class="line"></div>
      <div class="body">
        <div class="tabs">
          <div
            class="item-tab"
            v-for="(item, index) in tabs"
            :key="index"
            :class="{ active: currentTab === item.id }"
            @click="tabChange(item.id)"
            :is-scroll="false"
          >
            {{ item.name }}
            <div class="actline" v-if="currentTab === item.id"></div>
          </div>
        </div>

        <div class="coursr-desc" v-show="currentTab === 0">
          <div
            class="desc"
            v-html="
              course.render_desc.replace(
                /<img/g,
                '<img style=&quot;width:100%;height:auto;&quot;'
              )
            "
            style="font-size: 14px"
          ></div>
        </div>

        <div class="course-chapter-box" v-show="currentTab === 1">
          <template v-if="chapters.length > 0">
            <div
              class="chapter-item"
              v-for="(chapter, index) in chapters"
              :key="chapter.id"
            >
              <div class="chapter-name" @click="showArticle(index)">
                {{ chapter.title }}
                <img
                  width="15"
                  height="15"
                  class="normaltran"
                  style="float: right; cursor: pointer"
                  :class="{ trans: configkey[index] === true }"
                  src="../../assets/img/icon-back.png"
                />
              </div>
              <div class="chapter-videos-box" v-if="configkey[index]">
                <div
                  class="video-item"
                  @click="goVideo(video)"
                  v-for="video in videos[chapter.id]"
                  :key="video.id"
                >
                  <div class="video-title">
                    <span
                      class="free"
                      v-if="course.is_free !== 1 && video.free_seconds > 0"
                      >试看</span
                    >
                    <span class="text">{{ video.title }}</span>
                  </div>
                  <div class="video-duration">
                    <duration :seconds="video.duration"></duration>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="videos[0] && videos[0].length > 0">
              <div class="chapter-item">
                <div class="chapter-name">无章节内容</div>
                <div class="chapter-videos-box">
                  <div
                    class="video-item"
                    @click="goVideo(video)"
                    v-for="video in videos[0]"
                    :key="video.id"
                  >
                    <div class="video-title">
                      <span
                        class="free"
                        v-if="course.is_free !== 1 && video.free_seconds > 0"
                        >试看</span
                      >
                      <span class="text">{{ video.title }}</span>
                    </div>
                    <div class="video-duration">
                      <duration :seconds="video.duration"></duration>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div
              class="video-item"
              @click="goVideo(video)"
              v-for="video in videos[0]"
              :key="video.id"
            >
              <div class="video-title">
                <span
                  class="free"
                  v-if="course.is_free !== 1 && video.free_seconds > 0"
                  >试看</span
                >
                <span class="text">{{ video.title }}</span>
              </div>
              <div class="video-duration">
                <duration :seconds="video.duration"></duration>
              </div>
            </div>
          </template>
        </div>

        <div class="course-comments-box" v-show="currentTab === 2">
          <template v-if="comments.length > 0">
            <div
              class="comment-item"
              v-for="comment in comments"
              :key="comment.id"
            >
              <div class="avatar">
                <img
                  :src="commentUsers[comment.user_id].avatar"
                  width="32"
                  height="32"
                />
              </div>
              <div class="content">
                <div class="nickname">
                  {{ commentUsers[comment.user_id].nick_name }}
                </div>
                <div class="time">{{ comment.created_at | changeTime }}</div>
                <div class="text">
                  <div v-html="comment.render_content"></div>
                </div>
              </div>
            </div>
          </template>
          <none type="white" v-else></none>
        </div>
        <attach-box :status="course.id && currentTab === 3" :cid="course.id">
        </attach-box>
      </div>
      <div class="block" v-if="currentTab !== 3"></div>
      <div class="bottom-bar" v-if="currentTab !== 3">
        <template v-if="currentTab === 0 || currentTab === 1">
          <div
            class="collect-button"
            :class="{ active: isCollect }"
            @click="collectCourse"
          >
            <div class="icon">
              <img
                v-if="isCollect"
                class="like-icon"
                width="24"
                height="24"
                src="../../assets/img/collect-active.png"
              />
              <img
                v-else
                class="like-icon"
                width="24"
                height="24"
                src="../../assets/img/collect.png"
              />
            </div>
            <div class="text">收藏</div>
          </div>

          <template v-if="isBuy || course.is_free === 1">
            <div class="see-button button-item" @click="startLearn">
              <span>开始学习</span>
            </div>
          </template>
          <template v-else>
            <div
              v-if="course.charge > 0"
              class="role-button button-item"
              @click="goRole"
            >
              <span>VIP会员免费看</span>
            </div>
            <div v-else class="role-button2 button-item" @click="goRole">
              <span>VIP会员免费看</span>
            </div>
            <div
              class="buy-button button-item"
              v-if="course.charge > 0"
              @click="buyCourse"
            >
              <span>订阅课程</span>
            </div>
          </template>
        </template>

        <template v-else>
          <div class="input">
            <input
              type="text"
              placeholder-style="color:#CCC"
              v-model="comment.content"
              placeholder="请输入评论内容"
            />
          </div>
          <div
            class="comment-button"
            @click="submitComment"
            :class="{ active: comment.content.length > 0 }"
          >
            发布
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Duration from "../../components/duration";
import None from "../../components/none";
import AttachBox from "./components/attach-box.vue";

export default {
  components: {
    Duration,
    None,
    AttachBox,
  },
  data() {
    return {
      id: this.$route.query.id,
      course: null,
      attach: [],
      chapters: [],
      videos: {},
      isBuy: false,
      isCollect: false,
      videoWatchedProgress: [],
      comments: [],
      commentUsers: {},
      tabs: [
        {
          name: "介绍",
          key: "desc",
          id: 0,
        },
        {
          name: "目录",
          key: "chapter",
          id: 1,
        },
        {
          name: "评论",
          key: "comment",
          id: 2,
        },
        {
          name: "课件",
          key: "attach",
          id: 3,
        },
      ],
      comment: {
        content: "",
      },
      configkey: [],
      currentTab: 0,
    };
  },
  computed: {
    ...mapState(["isLogin", "config"]),
  },

  mounted() {
    this.getCourse();

    this.getCourseComments();
  },
  methods: {
    //展开目录文章详情
    showArticle(index) {
      this.$set(this.configkey, index, !this.configkey[index]);
    },
    tabChange(index) {
      this.currentTab = index;
    },
    animationfinish(e) {
      let current = e.detail.current;
      this.currentTab = current;
    },
    getCourse() {
      this.$api.Course.Detail(this.id).then((res) => {
        this.course = res.data.course;
        this.attach = res.data.attach;
        this.chapters = res.data.chapters;
        this.isBuy = res.data.isBuy;
        this.isCollect = res.data.isCollect;
        this.videoWatchedProgress = res.data.videoWatchedProgress;
        this.videos = res.data.videos;
        var box = res.data.chapters;
        var sel = [];
        for (var i = 0; i < box.length; i++) {
          sel.push(true);
        }
        this.configkey = sel;

        // 分享
        // this.wechatH5Share(
        //   this.course.title,
        //   this.course.short_desc,
        //   this.course.thumb
        // );

        // 浏览记录
      });
    },
    getCourseComments() {
      this.$api.Course.Comments(this.id).then((res) => {
        this.comments = res.data.comments;
        this.commentUsers = res.data.users;
      });
    },
    collectCourse() {
      this.$api.Course.Collect(this.id)
        .then(() => {
          this.isCollect = !this.isCollect;
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    startLearn() {
      let video = null;
      if (this.chapters.length === 0) {
        video = this.videos[0][0];
      } else {
        video = this.videos[this.chapters[0].id][0];
      }
      this.$router.push({
        name: "VodVideo",
        query: {
          id: video.id,
        },
      });
    },
    goVideo(video) {
      this.$router.push({
        name: "VodVideo",
        query: {
          id: video.id,
        },
      });
    },

    goRole() {
      this.$router.push({
        name: "Role",
      });
    },
    submitComment() {
      if (!this.comment.content) {
        return;
      }
      this.$api.Course.SubmitComment(this.id, this.comment)
        .then(() => {
          this.$message.success("成功");
          this.comment.content = "";
          this.comments = [];
          this.commentUsers = [];
          this.getCourseComments();
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    buyCourse() {
      this.$router.push({
        name: "Order",
        query: {
          goods_id: this.course.id,
          goods_name: this.course.title,
          goods_label: "点播课程",
          goods_charge: this.course.charge,
          goods_type: "vod",
          goods_thumb: this.course.thumb,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  box-sizing: border-box;
  padding-top: 50px;
}
.course-thumb {
  width: 100%;
  height: auto;
  float: left;
}

.course-title {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 15px 15px 0 15px;
  font-size: 15px;
  font-weight: 500;
  color: #171923;
  word-break: break-all;
  line-height: 15px;
  background-color: white;
}

.stat {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20px 15px 15px 15px;
  font-size: 20px;
  line-height: 30px;
  background-color: white;

  .item {
    display: inline;

    &.charge {
      color: #ff4d4f;
      font-weight: 500;

      .small {
        font-size: 14px;
      }

      .value {
        font-size: 18px;
        color: #04c877 !important;
        margin-right: 15px;
      }
    }

    &.user-count {
      color: #999999;
      font-weight: 400;
      font-size: 14px;

      text {
        margin-left: 5px;
      }
    }
  }
}

.line {
  width: 100%;
  height: 10px;
  float: left;
  background-color: #f6f6f6;
  box-sizing: border-box;
}

.body {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding-bottom: 53px;
  .swiper-box {
    width: 100%;
    height: auto;
    float: left;

    .swiper-box-container {
      height: 100vh;

      .swiper-item {
        position: relative;

        scroll-view {
          height: 100% !important;
        }
      }
    }
  }
}

.tabs {
  width: 100%;
  height: 55px;
  float: left;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  padding-top: 10px;
  z-index: 999;
  background: rgb(255, 255, 255);
  box-shadow: 0px 2px 4px 0px rgba(204, 204, 204, 0.2);
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: space-between;
  padding: 20px 30px;
  .item-tab {
    display: inline-block;
    width: auto;
    height: 15px;
    font-size: 15px;
    font-weight: 400;
    color: #333333;
    line-height: 15px;
    cursor: pointer;
    position: relative;

    &.active {
      font-weight: 600;
      color: #3ca7fa;
    }
    .actline {
      width: 20px;
      height: 3px;
      background: #3ca7fa;
      border-radius: 3px;
      position: absolute;
      left: 5px;
      top: 25px;
    }
  }
}

.coursr-desc,
.course-chapter-box,
.course-comments-box {
  width: 100%;
  height: auto;
  float: left;
  color: #333333;
  line-height: 21px;
  box-sizing: border-box;
  padding: 20px 15px 15px 15px;
}
.coursr-desc {
  .desc {
    width: 100%;
  }
}
.course-chapter-box {
  padding: 10px 15px 15px 15px;

  .chapter-item {
    width: 100%;
    height: auto;
    float: left;

    .chapter-name {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      color: #333333;
      font-weight: bold;
      margin-bottom: 20px;
      margin-top: 10px;

      .normaltran {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
      }

      .trans {
        -webkit-transform: rotate(270deg);
        -moz-transform: rotate(270deg);
        -o-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
        transform: rotate(270deg);
      }
    }

    .chapter-videos-box {
      display: block;
      width: 100%;
      height: auto;
      float: left;
    }
  }

  .video-item {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    line-height: 36px;
    box-sizing: border-box;
    padding: 0 10px 0 10px;
    background: #f6f6f6;
    border-radius: 4px;

    .video-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: #333;

      .free {
        padding: 2px 4px;
        background-color: #04c877;
        border-radius: 2px;
        color: white;
        font-size: 12px;
        margin-right: 10px;
      }
    }

    .video-duration {
      width: auto;
      height: auto;
      font-size: 12px;
      margin-left: 10px;
      color: #999999;
    }
  }
}

.course-comments-box {
  .comment-item {
    width: 100%;
    height: auto;
    float: left;
    margin-top: 0px;
    margin-bottom: 30px;
    display: flex;

    .avatar {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
    }

    .content {
      flex: 1;
      position: relative;

      .nickname {
        width: 100%;
        height: auto;
        float: left;
        font-size: 12px;
        box-sizing: border-box;
        color: #999999;
        margin-top: 5px;
        margin-bottom: 13px;
      }

      .time {
        position: absolute;
        font-size: 10px;
        color: #999999;
        right: 15px;
        top: 6px;
      }

      .text {
        width: 100%;
        height: auto;
        float: left;
        font-size: 14px;
        line-height: 1.2;
        color: #333;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 11;
  width: 100%;
  height: 53px;
  box-sizing: border-box;
  background-color: white;
  border-top: 1px solid rgba(#000, 0.1);
  display: flex;
  box-sizing: border-box;
  padding-left: 15px;
  padding-right: 15px;

  .collect-button {
    width: 25px;
    height: auto;
    margin-right: 15px;

    .icon {
      width: 100%;
      height: 25px;
      box-sizing: border-box;
      padding-top: 5px;
      text-align: center;
      margin-bottom: 1px;

      .like-icon {
        display: inline-block;
      }
    }

    .text {
      width: 100%;
      height: 25px;
      float: left;
      line-height: 25px;
      font-size: 10px;
      font-weight: 400;
      color: #666666;
      text-align: center;
      -ms-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    &.active {
      .icon {
        color: #ffc219;
      }
    }
  }

  .button-item {
    flex: 1;
    display: block;
    text-align: center;
    margin: 4px 0px;
    line-height: 40px;
    font-size: 15px;
    font-weight: 500;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .buy-button {
    border-radius: 0px 4px 4px 0px;
    background-color: #ff5068;
    color: white;
    -ms-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .see-button {
    border-radius: 3px;
    background-color: #3ca7fa;
    color: white;
    -ms-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .role-button2 {
    border-radius: 3px;
    background-color: #e2a500;
    color: white;
    -ms-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .role-button {
    border-radius: 3px 0px 0px 3px;
    background-color: #e2a500;
    color: white;
    -ms-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .input {
    flex: 1;
    padding-top: 10px;

    input {
      width: 100%;
      height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      box-sizing: border-box;
      margin-top: 8px;
      border: none;

      &:focus {
        outline: none;
      }
    }
  }

  .comment-button {
    width: auto;
    height: 33px;
    font-size: 14px;
    font-weight: 400;
    color: #666;
    line-height: 33px;
    -ms-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    padding-left: 15px;
    padding-top: 10px;

    &.active {
      color: #1784ed;
    }
  }
}
</style>

<style>
#page {
  background-color: white;
}
</style>
