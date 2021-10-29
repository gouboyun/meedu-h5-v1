<template>
  <div id="content" class="container">
    <template v-if="isLogin">
      <div class="top-nav">
        <div
          class="nav-item"
          @click="setNav(item.key)"
          :class="{ active: item.key === form.nav }"
          v-for="item in navs"
          :key="item.key"
        >
          <div class="item-text">{{ item.name }}</div>
          <div class="item-dot"></div>
        </div>
      </div>

      <div
        class="course-type-nav"
        v-if="form.nav !== 'history' && courseTypes.length > 1"
      >
        <div
          class="nav-item"
          @click="setCourseType(item.key)"
          :class="{ active: item.key === form.courseType }"
          v-for="item in courseTypes"
          :key="item.key"
        >
          <div class="item-text">{{ item.name }}</div>
        </div>
      </div>
      <div class="gray"></div>
      <div
        class="courses-box"
        v-if="form.nav === 'course' || form.nav === 'collect'"
      >
        <template v-if="page.list.length > 0">
          <div
            class="course-item"
            v-for="(item, index) in page.list"
            :key="index"
            @click="goDetail(item)"
          >
            <div class="course-thumb">
              <img :src="item.thumb" />
            </div>
            <div class="course-body">
              <div class="course-title">{{ item.title }}</div>
              <div class="at" v-if="item.published_at">
                订阅时间&nbsp;{{ item.published_at | changeTime }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <empty-comp></empty-comp>
        </template>
      </div>

      <div class="history-box" v-if="form.nav === 'history'">
        <div
          class="history-item"
          v-for="(item, index1) in page.list"
          :key="index1"
        >
          <div class="name">
            <div class="icon">
              <img class="icon-text" src="../../assets/img/circle.png" />
            </div>
            <div class="text">{{ index1 }}</div>
          </div>
          <div class="history-courses-box">
            <div
              class="history-course-item"
              v-for="(item2, index2) in item"
              :key="index2"
              @click="goDetail({ type: item2.other_type, id: item2.other_id })"
            >
              <div class="at">{{ item2.hour }}&nbsp;学习了</div>
              <div class="course-title">{{ item2.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="drop">
        <img
          v-show="page.loading && !page.over"
          src="../../assets/img/Spinload.gif"
        />
        <span v-if="page.over">已经到底了</span>
      </div>
    </template>

    <template v-else>
      <empty-comp></empty-comp>

      <div class="btn-login-box">
        <div class="btn-login" @click="$router.push({ name: 'Login' })">
          登录查看
        </div>
      </div>
    </template>
    <nav-footer type="study"></nav-footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EmptyComp from "../../components/empty.vue";
import NavFooter from "../../components/nav-footer";

export default {
  components: {
    EmptyComp,
    NavFooter,
  },
  data() {
    return {
      navs: [
        {
          name: "订阅课程",
          key: "course",
        },
        {
          name: "收藏课程",
          key: "collect",
        },
      ],
      form: {
        nav: "course",
        courseType: "vod",
      },
      pagination: {
        page: 1,
        size: 10,
      },
      page: {
        list: [],
        over: false,
        loading: false,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState(["isLogin", "config"]),
    courseTypes() {
      let types = [
        {
          name: "点播",
          key: "vod",
        },
      ];

      return types;
    },
  },
  watch: {
    "form.courseType"() {
      this.getData();
    },
    "form.nav"() {
      this.getData();
    },
  },
  mounted() {
    window.addEventListener("scroll", this.ScrollToBottomEvt, true);
    document.title = "我的课程";
    this.getData();
  },
  beforeDestroy() {
    // 记得销毁event
    window.removeEventListener("scroll", this.ScrollToBottomEvt, true);
  },
  methods: {
    ScrollToBottomEvt() {
      const el = document.getElementById("content");
      const toBottom = el.scrollHeight - window.screen.height - el.scrollTop;
      if (toBottom < 10) {
        this.getData(true);
      }
    },
    setNav(key) {
      this.form.nav = key;
    },
    setCourseType(key) {
      this.form.courseType = key;
    },
    resetPagination() {
      this.pagination.page = 1;
      this.pagination.size = 10;

      this.page.list = [];
      this.page.over = false;
      this.page.loading = false;
      this.page.total = 0;
    },
    getData(more = false) {
      if (more === false) {
        this.resetPagination();
      } else {
        this.pagination.page++;
      }

      if (this.form.nav === "course") {
        this.getUserCourses();
      } else if (this.form.nav === "collect") {
        this.getLikeCourses();
      }
    },
    getUserCourses() {
      if (this.page.loading || this.page.over) {
        return;
      }
      this.pagination.loading = true;

      let filter = {
        type: this.form.courseType,
      };
      Object.assign(filter, this.pagination);

      this.$api.User.Courses(filter).then((res) => {
        this.page.total = res.data.total;
        this.page.list.push(...res.data.data);

        // 计算
        if (
          Math.ceil(this.page.total / this.pagination.size) <=
          this.pagination.page
        ) {
          this.page.over = true;
        }
      });
    },
    getLikeCourses() {
      if (this.page.loading || this.page.over) {
        return;
      }
      this.pagination.loading = true;

      let filter = {
        type: this.form.courseType,
      };
      Object.assign(filter, this.pagination);

      this.$api.User.LikeCourses(filter).then((res) => {
        (this.page.total = res), res.data.total;
        this.page.list.push(...res.data.data);

        // 计算
        if (
          Math.ceil(this.page.total / this.pagination.size) >=
          this.pagination.page
        ) {
          this.page.over = true;
        }
      });
    },
    goDetail(item) {
      this.$router.push({ name: "VodDetail", query: { id: item.id } });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin-bottom: 53px;
}

.top-nav {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 999;
  display: flex;
  padding-top: 17px;
  padding-bottom: 8px;
  background-color: white;

  .nav-item {
    flex: 1;
    position: relative;

    .item-text {
      width: 100%;
      height: auto;
      float: left;
      font-size: 16px;
      font-weight: 400;
      color: #666666;
      line-height: 16px;
      text-align: center;
      padding-bottom: 9px;
    }

    .item-dot {
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -5px;
      width: 10px;
      height: 3px;
      background: white;
      border-radius: 2px;
    }

    &.active {
      .item-text {
        color: #333333;
        font-weight: 600;
      }

      .item-dot {
        background-color: #3ca7fa;
      }
    }
  }
}
.gray {
  float: left;
  width: 100%;
  height: 10px;
  background: #f3f6f9;
}
.course-type-nav {
  width: 100%;
  height: auto;
  float: left;
  background-color: white;
  margin-top: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f3f6f9;

  .nav-item {
    flex: 1;
    text-align: center;

    .item-text {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 14px;
    }

    &.active {
      .item-text {
        font-weight: 600;
        color: #3ca7fa;
      }
    }
  }
}

.courses-box {
  width: 100%;
  height: auto;
  float: left;
  background-color: white;
  box-sizing: border-box;
  padding: 15px;

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
      margin-right: 10px;
      img {
        width: 120px;
        height: 90px;
        border-radius: 4px;
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
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 22px;
      }

      .at {
        width: 100%;
        height: auto;
        float: left;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
      }
    }
  }
}

.loadmore-box {
  width: 100%;
  height: auto;
  float: left;
  padding-top: 25px;
  padding-bottom: 25px;
}

.history-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  background-color: white;
  margin-top: 10px;
  padding: 0 15px;

  .history-item {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 30px 0;
    border-bottom: 1px solid #f3f6f9;

    .name {
      width: 100%;
      height: auto;
      float: left;
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .icon {
        display: block;
        box-sizing: border-box;
        margin-right: 10px;
        .icon-text {
          display: inline-block;
          width: 13px;
          height: 13px;
        }
      }

      .text {
        flex: 1;
        font-size: 15px;
        font-weight: 600;
        color: #666666;
        line-height: 15px;
      }
    }

    .history-courses-box {
      width: 100%;
      height: auto;
      float: left;
      box-sizing: border-box;
      padding-left: 20px;
      padding-right: 20px;

      .history-course-item {
        width: 100%;
        height: auto;
        float: left;
        box-sizing: border-box;
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        .at {
          width: 100%;
          height: auto;
          float: left;
          font-size: 12px;
          color: #999999;
          line-height: 12px;
          margin-bottom: 10px;
        }

        .course-title {
          width: 100%;
          height: auto;
          float: left;
          font-size: 15px;
          font-weight: 500;
          color: #333333;
          line-height: 15px;
          word-break: break-all;
        }
      }
    }
  }
}

.btn-login-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding-left: 15px;
  padding-right: 15px;

  .btn-login {
    width: 100%;
    height: 46px;
    box-sizing: border-box;
    line-height: 46px;
    background: #3ca7fa;
    border-radius: 4px;
    float: left;
    text-align: center;
    color: white;
    font-size: 16px;
    font-weight: 500;
  }
}
.drop {
  width: 100%;
  text-align: center;
  color: #cccccc;
  font-size: 14px;
  margin-bottom: 30px;
}
</style>

<style>
#page {
  background-color: #f3f6f9;
}
</style>