<template>
  <div id="content" class="container">
    <filter-box1
      :categories1="scenes"
      :categories2="categories"
      :cid1="pagination.scene"
      :cid2="pagination.category_id"
      @change="filterChange"
    ></filter-box1>
    <template v-if="list.length > 0 || loading">
      <div class="gray"></div>
      <div class="vod-course-item" v-for="course in list" :key="course.id">
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
      <div class="drop">
        <img v-show="loading && !over" src="../../assets/img/Spinload.gif" />
        <span v-if="over">已经到底了</span>
      </div>
    </template>

    <none v-else></none>
  </div>
</template>

<script>
import None from "../../components/none.vue";
import VodCourseItem from "../../components/vod-course-item.vue";
import FilterBox1 from "../../components/filter-box1.vue";

export default {
  components: {
    None,
    VodCourseItem,
    FilterBox1,
  },
  data() {
    return {
      scenes: [
        {
          id: "",
          name: "全部",
        },
        {
          id: "free",
          name: "免费",
        },
      ],
      list: [],
      pagination: {
        page: 1,
        page_size: 10,
        scene: "",
        category_id: 0,
      },
      categories: [],
      filterShowStatus: false,
      over: false,
      loading: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.ScrollToBottomEvt, true);
    this.getData();
    this.getCategories();
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
    filterChange(scene, cid) {
      this.pagination.scene = scene;
      this.pagination.category_id = cid;
      this.resetData();
      this.getData();
    },
    resetData() {
      this.list = [];
      this.pagination.page = 1;
      this.over = false;
    },
    getCategories() {
      this.$api.Course.Categories().then((res) => {
        let categories = res.data;
        let box = [];
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].children.length > 0) {
            box.push(categories[i]);
            let children = categories[i].children;
            for (let j = 0; j < children.length; j++) {
              children[j].name = "|----" + children[j].name;
              box.push(children[j]);
            }
          } else {
            box.push(categories[i]);
          }
        }
        this.categories = box;
      });
    },
    getData(more = false) {
      if (this.over) {
        return;
      }
      if (this.loading) {
        return;
      }
      if (more) {
        this.pagination.page++;
      }
      this.loading = true;
      this.$api.Course.List(this.pagination).then((res) => {
        let list = res.data.data;
        if (list.length > 0) {
          this.list.push(...list);
        }
        setTimeout(() => {
          this.loading = false;
          if (list.length < this.pagination.page_size) {
            this.over = true;
          }
        }, 200);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.vod-course-item {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 15px;
}
.gray {
  float: left;
  width: 100%;
  height: 10px;
  background: #f3f6f9;
}
.drop {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: #cccccc;
  font-size: 14px;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>

<style lang="less">
#page {
  background-color: white;
}
</style>
