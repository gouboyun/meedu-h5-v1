<template>
  <div class="box" v-if="video && course">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">{{ video.title }}</div>
    </div>
    <div class="play-box">
      <div
        class="playing"
        v-if="!playendedStatus && (isWatch || video.free_seconds > 0)"
      >
        <div class="iframe-player-box" v-if="isIframe" v-html="playUrl"></div>
        <div
          v-else
          class="meedu-player-container"
          id="meedu-player-container"
        ></div>
      </div>

      <template v-else>
        <div class="alert-message" v-if="isLogin">
          <div v-if="playendedStatus">
            <div class="subscribe-info" v-if="isTrySee">
              试看结束，购买课程观看所有视频
            </div>
            <div
              class="next-page"
              @click="goNextVideo(lastVideoid)"
              v-else-if="!isLastpage"
            >
              下一节
            </div>
            <div class="last-video" v-else>恭喜您已经学完本套课程！</div>
          </div>
          <div
            class="subscribe-button"
            v-if="course.charge > 0 && isWatch === false"
            @click="buyCourse"
          >
            <span>订阅课程 ￥{{ course.charge }}</span>
          </div>
          <!--<div
            class="subscribe-button2"
            v-if="
              video.charge > 0 && video.is_ban_sell === 0 && isWatch === false
            "
            @click="buyVideo"
          >
            <span>或点击此处单独购买本节视频￥{{ video.charge }}</span>
          </div>-->
        </div>
        <div class="alert-message" v-else>请登录后观看</div>
      </template>
    </div>

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

      <div class="course-chapter-box" v-show="currentTab === 0">
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
                :class="{ active: video.id === videoItem.id }"
                @click="goVideo(videoItem)"
                v-for="videoItem in videos[chapter.id]"
                :key="videoItem.id"
              >
                <div class="video-title">
                  <span
                    class="free"
                    v-if="course.is_free !== 1 && videoItem.free_seconds > 0"
                    >试看</span
                  >
                  <span class="text">{{ videoItem.title }}</span>
                </div>
                <div v-if="video.id === videoItem.id" class="video-duration">
                  <img
                    width="24"
                    height="24"
                    class="play-icon"
                    src="../../assets/img/play.gif"
                  />
                </div>
                <div v-else class="video-duration">
                  <duration :seconds="videoItem.duration"></duration>
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
                  :class="{ active: video.id === videoItem.id }"
                  @click="goVideo(videoItem)"
                  v-for="videoItem in videos[0]"
                  :key="videoItem.id"
                >
                  <div class="video-title">
                    <span
                      class="free"
                      v-if="course.is_free !== 1 && videoItem.free_seconds > 0"
                      >试看</span
                    >
                    <span class="text">{{ videoItem.title }}</span>
                  </div>
                  <div v-if="video.id === videoItem.id" class="video-duration">
                    <img
                      width="24"
                      height="24"
                      class="play-icon"
                      src="../../assets/img/play.gif"
                    />
                  </div>
                  <div v-else class="video-duration">
                    <duration :seconds="videoItem.duration"></duration>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <div
            class="video-item"
            :class="{ active: video.id === videoItem.id }"
            @click="goVideo(videoItem)"
            v-for="videoItem in videos[0]"
            :key="videoItem.id"
          >
            <div class="video-title">
              <span
                class="free"
                v-if="course.is_free !== 1 && videoItem.free_seconds > 0"
                >试看</span
              >
              <span class="text">{{ videoItem.title }}</span>
            </div>
            <div v-if="video.id === videoItem.id" class="video-duration">
              <img
                width="24"
                height="24"
                class="play-icon"
                src="../../assets/img/play.gif"
              />
            </div>
            <div v-else class="video-duration">
              <duration :seconds="videoItem.duration"></duration>
            </div>
          </div>
        </template>
      </div>

      <div class="course-comments-box" v-show="currentTab === 1">
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
    </div>

    <template v-if="currentTab === 0 && !isWatch">
      <div class="block"></div>
      <div class="bottom-bar">
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
      </div>
    </template>

    <!-- 评论框 -->
    <template v-if="currentTab === 1 && isWatch">
      <div class="block"></div>
      <div class="bottom-bar">
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
          :class="{ active: comment.content }"
        >
          评论
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Duration from "../../components/duration";
import None from "../../components/none";

export default {
  components: {
    Duration,
    None,
  },
  data() {
    return {
      videoContext: null,
      id: this.$route.query.id,
      video: null,
      course: null,
      chapters: [],
      videos: {},
      isWatch: false,
      isIframe: false,
      comments: [],
      commentUsers: {},
      playUrl: "",
      tab: "chapter",
      tabs: [
        {
          name: "目录",
          key: "chapter",
          id: 0,
        },
        {
          name: "评论",
          key: "comment",
          id: 1,
        },
      ],
      comment: {
        content: "",
      },
      configkey: [],
      isLastpage: false,
      lastVideoid: null,
      playendedStatus: false,
      playDuration: 0,
      currentTab: 0,
      swiperIndex: 0,
      playingTime: 0,
      last_see_value: null,
      watchedSeconds: 0,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "config"]),
    isTrySee() {
      if (!this.video) {
        return false;
      }
      return this.isWatch === false && this.video.free_seconds > 0;
    },
    isBanDrag() {
      return parseInt(this.video.ban_drag) === 1;
    },
  },
  mounted() {
    this.getVideo();
    this.getVideoComments();
  },
  beforeDestroy() {
    // 播放器销毁
    window.player && window.player.destroy();
  },
  watch: {
    "$route.query.id"() {
      // 播放器销毁
      window.player && window.player.destroy();
      this.resetData();
      this.getVideo();
      this.getVideoComments();
    },
  },
  methods: {
    resetData() {
      this.video = null;
      this.course = null;
      this.currentTab = 0;
      this.swiperIndex = 0;
      this.playendedStatus = false;
      this.playDuration = 0;
      this.isWatch = false;
      this.isIframe = false;
    },
    tabChange(index) {
      this.currentTab = index;
      this.swiperIndex = index;
    },
    playEnded() {
      this.playendedStatus = true;
    },
    animationfinish(e) {
      let current = e.detail.current;
      this.swiperIndex = current;
      this.currentTab = current;
    },
    getVideo() {
      this.$api.Course.Video(this.$route.query.id)
        .then((res) => {
          this.video = res.data.video;
          this.course = res.data.course;
          this.videos = res.data.videos;
          this.isWatch = res.data.is_watch;
          this.chapters = res.data.chapters;
          this.video_watched_progress = res.data.video_watched_progress;

          document.title = res.data.course.title;

          let chapteId = parseInt(res.data.video.chapter_id) || 0;
          let videoBox = res.data.videos[chapteId];
          for (var j = 0; j < videoBox.length; j++) {
            if (res.data.video.id === videoBox[j].id) {
              if (1 + j >= videoBox.length) {
                this.isLastpage = true;
              } else {
                this.lastVideoid = videoBox[j + 1].id;
              }
            }
          }
          let box = res.data.chapters;
          for (var i = 0; i < box.length; i++) {
            if (chapteId == box[i].id) {
              this.nowChapter = box[i];
              this.$set(this.configkey, i, true);
            }
          }

          // 当前用户已购买 || 可以试看
          if (this.isWatch || this.video.free_seconds > 0) {
            this.getPlayInfo();
          }

          //播放记录跳转
          if (
            this.video_watched_progress &&
            this.video_watched_progress[this.video.id] &&
            this.video_watched_progress[this.video.id].watch_seconds > 0
          ) {
            this.last_see_value = {
              time: 5,
              pos: this.video_watched_progress[this.video.id].watch_seconds,
            };
            this.watchedSeconds = this.video_watched_progress[
              this.video.id
            ].watch_seconds;
          }
        })
        .catch((e) => {
          this.$message.error(e.message);
          this.$router.back();
        });
    },
    getPlayInfo() {
      let isTrySee = 0;
      if (this.isWatch === false && this.video.free_seconds > 0) {
        isTrySee = 1;
      }

      this.$api.Course.PlayInfo(this.video.id, { is_try: isTrySee })
        .then((res) => {
          if (res.data.urls.length === 0) {
            this.$message.error("无播放地址");
            return;
          }

          let playUrls = res.data.urls;
          let firstPlayUrl = playUrls[0].url;

          if (firstPlayUrl.substr(1, 6) === "iframe") {
            this.isIframe = true;
            this.playUrl = firstPlayUrl.replace(
              ">",
              ' style="width:100%;height:224px" >'
            );
            return;
          }

          this.initDPlayer(playUrls, isTrySee);
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    initDPlayer(playUrls, isTrySee) {
      // 封装DPlayer的播放格式
      let dplayerUrls = [];
      playUrls.forEach((item) => {
        dplayerUrls.push({
          name: item.name,
          url: item.url,
        });
      });

      // 初始化播放器
      let bulletSecretFontSize = !this.config.player.bullet_secret.size
        ? 14
        : this.config.player.bullet_secret.size;
      window.player = new window.DPlayer({
        container: document.getElementById("meedu-player-container"),
        autoplay: false,
        playbackSpeed: [0.5, 1, 1.5, 2],
        video: {
          quality: dplayerUrls,
          defaultQuality: 0,
          pic: this.config.player.cover || "",
        },
        try: isTrySee === 1,
        bulletSecret: {
          enabled: parseInt(this.config.player.enabled_bullet_secret) === 1,
          text: this.config.player.bullet_secret.text
            .replace("${user.mobile}", this.user.mobile)
            .replace("${mobile}", this.user.mobile)
            .replace("${user.id}", this.user.id),
          size: bulletSecretFontSize + "px",
          color: !this.config.player.bullet_secret.color
            ? "red"
            : this.config.player.bullet_secret.color,
          opacity: this.config.player.bullet_secret.opacity,
        },
        ban_drag: this.isBanDrag,
        last_see_pos: this.last_see_value,
      });

      // 监听播放进度更新evt
      window.player.on("timeupdate", () => {
        let currentTime = parseInt(window.player.video.currentTime);
        if (
          this.isBanDrag &&
          currentTime - this.playingTime >= 2 &&
          currentTime > parseInt(this.watchedSeconds)
        ) {
          window.player.seek(this.playingTime);
        } else {
          this.playingTime = currentTime;
          this.playTimeUpdate(currentTime);
        }
      });
      window.player.on("ended", () => {
        let currentTime = parseInt(window.player.video.currentTime);
        if (
          this.isBanDrag &&
          window.player.video.duration - this.playingTime >= 2
        ) {
          window.player.seek(this.playingTime);
          return;
        }
        this.playingTime = 0;
        this.playTimeUpdate(currentTime, true);
        this.playendedStatus = true;
        window.player.destroy();
      });
      window.player.on("sub_course", () => {
        this.buyCourse();
      });
      // 开始微信同层播放
      setTimeout(() => {
        const dplay = document.querySelector(".dplayer-video");
        const u = navigator.userAgent;
        let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
        if (isAndroid) {
          dplay.setAttribute("x5-video-player-type", "h5-page");
          dplay.removeAttribute("playsinline");
          dplay.removeAttribute("webkit-playsinline");
        } else {
          dplay.removeAttribute("x5-video-player-type", "h5-page");
          dplay.setAttribute("playsinline", "");
          dplay.setAttribute("webkit-playsinline", "");
        }
      }, 200);
    },
    //展开目录文章详情
    showArticle(index) {
      this.$set(this.configkey, index, !this.configkey[index]);
    },
    getVideoComments() {
      this.$api.Course.VideoComments(this.$route.query.id).then((res) => {
        this.comments = res.data.comments;
        this.commentUsers = res.data.users;
      });
    },
    goVideo(video) {
      this.$router.replace({
        name: "VodVideo",
        query: {
          id: video.id,
        },
      });
    },
    goNextVideo(id) {
      this.$router.replace({
        name: "VodVideo",
        query: {
          id: id,
        },
      });
    },

    goRole() {
      this.$router.push({
        name: "Role",
      });
    },
    submitComment() {
      if (!this.comment.content.trim()) {
        return;
      }
      this.$api.Course.SubmitVideoComment(this.$route.query.id, this.comment)
        .then(() => {
          this.$message.success("成功");
          this.comment.content = "";
          this.comments = [];
          this.commentUsers = [];
          this.getVideoComments();
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    playUpdate(e) {
      let duration = e.detail.currentTime;
      this.playTimeUpdate(duration);
    },
    playTimeUpdate(duration, isEnd) {
      if (duration > parseInt(this.watchedSeconds)) {
        this.watchedSeconds = duration;
      }
      if (duration - this.playDuration >= 10 || isEnd === true) {
        this.playDuration = duration;
        this.$api.Course.VideoRecord(this.video.id, {
          duration: this.playDuration,
        }).then(() => {
          // todo
        });
      }
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
    buyVideo() {
      this.$router.push({
        name: "Order",
        query: {
          goods_id: this.video.id,
          goods_name: this.video.title,
          goods_label: "视频",
          goods_charge: this.video.charge,
          goods_type: "video",
          goods_thumb: this.course.thumb,
        },
      });
    },
    videoStop() {
      // #ifdef H5
      if (window.player) {
        window.player.pause();
      }
      // #endif

      // #ifdef MP-WEIXIN || APP-PLUS
      this.videoContext.pause();
      // #endif
    },
    videoPlay() {
      // #ifdef H5
      if (window.player) {
        window.player.play();
      }
      // #endif

      // #ifdef MP-WEIXIN || APP-PLUS
      this.videoContext.play();
      // #endif
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
.play-box {
  width: 100%;
  height: auto;
  float: left;
  background-color: #000;
  position: relative;
  .playing {
    width: 100%;
    height: auto;

    .iframe-player-box,
    .meedu-player-container {
      width: 100%;
      height: 250px;
      float: left;
    }
  }
  .alert-message {
    width: 100%;
    min-height: 250px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: white;
  }
}

.body {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding-bottom: 53px;
}

.tabs {
  width: 100%;
  height: 55px;
  float: left;
  box-sizing: border-box;
  z-index: 999;
  background: rgb(255, 255, 255);
  box-shadow: 0px 2px 4px 0px rgba(204, 204, 204, 0.2);
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: space-between;
  padding: 20px 100px;
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
  box-sizing: border-box;
  padding: 20px 15px 15px 15px;
}

.scroll-box {
  width: 100%;
  height: auto;
  float: left;

  .scroll-item {
    height: calc(100vh - 300px);
    width: 100%;
    background-color: white;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

    &.active {
      .video-title {
        .text {
          color: #3ca7fa;
        }
      }
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

.subscribe-button {
  box-sizing: border-box;
  margin: 0 auto;
  width: 200px;
  padding: 14px 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  border-radius: 4px;
  background-color: #ff5068;
  color: white;
}

.subscribe-button2 {
  margin-top: 30px;
  font-size: 15px;
  font-weight: 400;
  color: #ff5068;
  line-height: 15px;
}

.subscribe-info {
  margin-top: -30px;
  margin-bottom: 30px;
}

.next-page {
  box-sizing: border-box;
  margin: 0 auto;
  width: 85px;
  height: 45px;
  padding: 15px 20px;
  margin-bottom: 10px;
  background: #3ca7fa;
  color: white;
  border-radius: 4px;
}

.last-video {
  font-size: 15px;
  font-weight: 400;
  color: #ffffff;
  line-height: 15px;
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

  .button-item {
    flex: 1;
    margin: 4px 0px;
    line-height: 40px;
    font-size: 15px;
    font-weight: 500;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    &:last-child {
      margin-right: 0;
    }
  }

  .buy-button {
    border-radius: 0px 4px 4px 0px;
    background-color: #ff5068;
    color: white;
  }

  .buy-button2 {
    border-radius: 4px;
    background-color: #ff5068;
    color: white;
  }

  .see-button {
    border-radius: 4px;
    background-color: #3ca7fa;
    color: white;
  }

  .role-button2 {
    border-radius: 3px;
    background-color: #e2a500;
    color: white;
  }

  .role-button {
    border-radius: 3px 0px 0px 3px;
    background-color: #e2a500;
    color: white;
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

    padding-left: 15px;
    padding-top: 10px;

    &.active {
      color: #1784ed;
    }
  }
}
</style>

<style>
page {
  background-color: white;
}
</style>
