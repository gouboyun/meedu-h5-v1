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

      <div class="courses-box">
        <template v-if="page.list.length > 0">
          <course-item
            v-if="form.courseType === 'vod'"
            :list="page.list"
            :currenStatus="form.nav"
          ></course-item>
        </template>
        <template v-else>
          <empty-comp></empty-comp>
        </template>
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
        <div
          class="btn-login"
          @click="
            $router.push({
              name: 'Login',
              query: {
                url: url,
              },
            })
          "
        >
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
import CourseItem from "./components/course-item.vue";

export default {
  components: {
    EmptyComp,
    NavFooter,
    CourseItem,
  },
  data() {
    return {
      url: window.location.href,
      navs: [
        {
          name: "在学",
          key: "study",
        },
        {
          name: "订阅",
          key: "course",
        },
        {
          name: "收藏",
          key: "collect",
        },
      ],
      form: {
        nav: "study",
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
          name: "录播课",
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
    isLogin(val) {
      if (val) {
        this.getData();
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.ScrollToBottomEvt, true);
    if (this.isLogin) {
      this.getData();
    }
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
      } else if (this.form.nav === "study") {
        this.getViewStudy();
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

      this.$api.Member.NewCourses(filter).then((res) => {
        this.page.total = res.data.total;
        this.page.list.push(...res.data.data);

        // 计算
        if (this.pagination.size !== res.data.data.length) {
          this.page.over = true;
        }
        this.page.loading = false;
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

      this.$api.Member.CoursesCollects(filter).then((res) => {
        this.page.total = res.data.total;
        this.page.list.push(...res.data.data);

        // 计算
        if (this.pagination.size !== res.data.data.length) {
          this.page.over = true;
        }
        this.page.loading = false;
      });
    },
    getViewStudy() {
      if (this.page.loading || this.page.over) {
        return;
      }
      this.pagination.loading = true;

      let filter = {
        type: this.form.courseType,
      };
      Object.assign(filter, this.pagination);

      this.$api.Member.Learned.Courses(filter).then((res) => {
        this.page.total = res.data.total;
        this.page.list.push(...res.data.data);

        // 计算
        if (this.pagination.size !== res.data.data.length) {
          this.page.over = true;
        }
        this.page.loading = false;
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
  position: fixed;
  z-index: 400;
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  display: flex;
  padding: 15px 20px 4px 20px;
  background-color: white;

  .nav-item {
    position: relative;
    width: auto;
    height: auto;
    margin-right: 40px;
    &:last-child {
      margin-right: 0px;
    }
    .item-text {
      width: 100%;
      height: auto;
      float: left;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
      text-align: center;
      padding-bottom: 9px;
    }

    .item-dot {
      position: absolute;
      bottom: 0;
      width: 28px;
      height: 3px;
      background: white;
      border-radius: 2px;
    }

    &.active {
      .item-text {
        color: #3ca7fa;
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

.courses-box {
  width: 100%;
  height: auto;
  float: left;
  background-color: white;
  box-sizing: border-box;
  margin-top: 42px;
  padding: 15px;
}

.loadmore-box {
  width: 100%;
  height: auto;
  float: left;
  padding-top: 25px;
  padding-bottom: 25px;
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
  display: inline-block;
  width: 100%;
  float: left;
  text-align: center;
  color: #cccccc;
  font-size: 14px;
  margin-top: 30px;
  margin-bottom: 60px;
}
</style>

<style>
#page {
  background-color: #f3f6f9;
}
</style>
