<template>
  <div class="container">
    <div class="navTab borderbox">
      <img
        class="search-icon"
        @click="search()"
        src="../../assets/img/icon-search.png"
      />
      <input
        class="input"
        type="text"
        v-model="keywords"
        placeholder="搜索关键词"
        @keyup.enter="search()"
      />
    </div>
    <div class="box" v-for="block in blocks" :key="block.id">
      <index-blank
        :height="block.config_render.height"
        :bg-color="block.config_render.bgcolor"
        v-if="block.sign === 'blank'"
      ></index-blank>
      <index-slider
        :items="block.config_render"
        v-else-if="block.sign === 'slider'"
      ></index-slider>
      <index-grid-nav
        :line-count="block.config_render.line_count"
        :items="block.config_render.items"
        v-else-if="block.sign === 'grid-nav'"
      ></index-grid-nav>
      <index-image-group
        v-else-if="block.sign === 'image-group'"
        :items="block.config_render.items"
        :v="block.config_render.v"
      ></index-image-group>
      <index-vod-v1
        v-if="block.sign === 'h5-vod-v1'"
        :name="block.config_render.title"
        :items="block.config_render.items"
      ></index-vod-v1>
      <index-gzh-v1
        v-else-if="block.sign === 'h5-gzh-v1'"
        :name="block.config_render.title"
        :items="block.config_render"
      ></index-gzh-v1>
    </div>
    <tech-support></tech-support>
    <nav-footer type="index"></nav-footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import IndexBlank from "./components/blank.vue";
import IndexSlider from "./components/slider.vue";
import IndexGridNav from "./components/grid-nav.vue";
import IndexImageGroup from "./components/image-group.vue";
import IndexVodV1 from "./components/vod-v1.vue";
import IndexGzhV1 from "./components/gzh-v1.vue";
import TechSupport from "../../components/tech-support";
import NavFooter from "../../components/nav-footer";

var vm = null;
export default {
  components: {
    TechSupport,
    IndexVodV1,
    IndexBlank,
    IndexSlider,
    IndexGridNav,
    IndexImageGroup,
    IndexGzhV1,
    NavFooter,
  },
  data() {
    return {
      loading: false,
      blocks: [],
      keywords: null,
    };
  },
  computed: {
    ...mapState(["isLogin", "config"]),
  },
  mounted() {
    this.getPageBlocks();
  },
  methods: {
    search() {
      if (!this.keywords) {
        this.$message.error("请输入关键字后再搜索");
        return;
      }
      this.$router.push({
        name: "Search",
        query: {
          keywords: this.keywords,
        },
      });
    },
    getPageBlocks() {
      this.$api.ViewBlock.PageBlocks({
        platform: "h5",
        page_name: "h5-page-index",
      }).then((res) => {
        let blocks = res.data;
        this.blocks = blocks;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  .navTab {
    width: 100%;
    height: 50px;
    background: #ffffff;
    position: relative;
    display: flex;
    padding: 8px 15px;
    .search-icon {
      width: 16px;
      height: 16px;
      position: absolute;
      top: 17px;
      left: 37px;
      cursor: pointer;
    }
    .input {
      width: 345px;
      height: 34px;
      background: #f5f5f5;
      border-radius: 17px;
      outline: none;
      border: none;
      padding-left: 50px;
      font-size: 14px;
    }
  }

  .blocks-box {
    width: 100%;
    height: 173px;
    background: #ffffff;
    padding: 10px 25px 20px 25px;
    display: grid;
    row-gap: 15px;
    column-gap: 50px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    .item {
      width: 44px;
      height: 65px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .item-icon {
        width: 44px;
        height: 44px;
        margin-bottom: 9px;
      }
      span {
        width: 44px;
        height: 12px;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 12px;
        text-align: center;
      }
    }
  }
  .box {
    width: 100%;
  }
}
</style>
