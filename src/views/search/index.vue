<template>
  <div id="content" class="container">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="$router.back()"
        src="../../assets/img/icon-back.png"
      />
      <input
        class="input"
        type="text"
        v-model="pagination.keywords"
        @keyup.enter="goSearch"
        placeholder="搜索关键词"
      />
      <div class="btn-search" @click="goSearch">搜索</div>
    </div>
    <div class="type-box borderbox">
      <div
        class="item"
        :class="{ active: pagination.type === item.key }"
        @click="setType(item.key)"
        v-for="item in types"
        :key="item.key"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="list-box borderbox">
      <template v-if="list.length > 0 || loading">
        <div
          class="list-item"
          v-for="item in list"
          :key="item.id"
          @click="goDetail(item.resource_type, item.id)"
        >
          <div class="item-top">
            <div class="item-type">{{ change(item.resource_type) }}</div>
            <div
              class="item-tit"
              v-highlight="{ keyword: pagination.keywords, separator: ' ' }"
            >
              {{ item.title }}
            </div>
          </div>

          <div
            class="item-content"
            v-if="item.short_desc"
            v-html="item.short_desc"
          ></div>
        </div>
        <div class="drop">
          <img v-show="loading && !over" src="../../assets/img/Spinload.gif" />
          <span v-if="over">已经到底了</span>
        </div>
      </template>

      <none type="gray" v-else></none>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import None from "../../components/none.vue";
export default {
  components: {
    None,
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  data() {
    return {
      list: [],
      loading: false,
      over: false,
      pagination: {
        page: 1,
        size: 10,
        type: 0,
        keywords: this.$route.query.keywords,
      },
      types: [
        {
          key: 0,
          name: "全部",
        },
        {
          key: "vod",
          name: "录播课",
        },
        {
          key: "video",
          name: "录播视频",
        },
      ],
    };
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.ScrollToBottomEvt, true);
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
    change(val) {
      if (val === "video") {
        return "录播视频";
      } else if (val === "vod") {
        return "录播课";
      } else if (val === "live") {
        return "直播课";
      } else if (val === "topic") {
        return "图文";
      } else if (val === "book") {
        return "电子书";
      } else if (val === "paper") {
        return "试卷";
      } else if (val === "practice") {
        return "练习";
      } else {
        return "其它";
      }
    },
    resetData() {
      this.pagination.page = 1;
      this.list = [];
    },
    setType(key) {
      this.pagination.type = key;
      this.resetData();
      this.getData();
    },
    goSearch() {
      this.resetData();
      this.getData();
    },
    getData(more = false) {
      if (this.loading) {
        return;
      }
      if (more) {
        this.pagination.page++;
      }
      if (!this.pagination.keywords) {
        return;
      }
      this.loading = true;
      this.$api.Search.Index(this.pagination).then((res) => {
        let list = res.data.data;
        if (list.length > 0) {
          this.list.push(...list);
        }
        setTimeout(() => {
          this.loading = false;
          if (list.length < this.pagination.size) {
            this.over = true;
          }
        }, 200);
      });
    },
    goDetail(val, id) {
      if (val === "video") {
        this.$router.push({
          name: "VodVideo",
          query: {
            id: id,
          },
        });
      } else if (val === "vod") {
        this.$router.push({
          name: "VodDetail",
          query: {
            id: id,
          },
        });
      } else {
        return;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  box-sizing: border-box;
  padding-top: 50px;
  background: #f6f6f6;
}
.type-box {
  width: 100%;
  height: 44px;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: auto;
  padding-left: 15px;
  .item {
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 14px;
    margin-right: 30px;
    &.active {
      font-weight: 600;
      color: #3ca7fa;
    }
  }
}
.list-box {
  width: 100%;
  float: left;
  height: auto;
  display: flex;
  flex-direction: column;
  .list-item {
    width: 100%;
    height: auto;
    cursor: pointer;
    margin-top: 10px;
    padding: 20px 15px;
    box-sizing: border-box;
    background-color: #fff;
    .item-top {
      width: 100%;
      height: 22px;
      display: flex;
      flex-direction: row;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .item-type {
        background: #04c877;
        border-radius: 2px;
        padding: 5px;
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        margin-right: 10px;
      }
      .item-tit {
        height: 22px;
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
      }
    }
    .item-content {
      margin-top: 20px;
      width: 100%;
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.drop {
  width: 100%;
  text-align: center;
  color: #cccccc;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>