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
    <div class="banner borderbox" v-show="sliders && sliders.length > 0">
      <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide v-for="item in sliders" :key="item.sort">
          <img :src="item.src" :name="item.href" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="box" v-for="block in blocks" :key="block.id">
      <index-blank
        :height="block.config_render.height"
        :bg-color="block.config_render.bgcolor"
        v-if="block.sign === 'blank'"
      ></index-blank>
      <index-vod-v1
        v-if="block.sign === 'h5-vod-v1'"
        :name="block.config_render.title"
        :items="block.config_render.items"
      ></index-vod-v1>
    </div>
    <tech-support></tech-support>
    <nav-footer type="index"></nav-footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import IndexBlank from "./components/blank.vue";
import IndexVodV1 from "./components/vod-v1.vue";
import TechSupport from "../../components/tech-support";
import NavFooter from "../../components/nav-footer";
var vm = null;
export default {
  components: {
    Swiper,
    SwiperSlide,
    TechSupport,
    IndexVodV1,
    IndexBlank,
    NavFooter,
  },
  data() {
    return {
      loading: false,
      sliders: [],
      blocks: [],
      keywords: null,
      swiperOptions: {
        direction: "horizontal",
        loop: true,
        autoplay: {
          disableOnInteraction: false,
          delay: 3000,
        },
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        effect: "slide",
        on: {
          click: function (e) {
            let url = e.target.name;
            if (url) {
              if (
                url.match("https:") ||
                url.match("http:") ||
                url.match("www")
              ) {
                window.location.href = url;
              } else {
                vm.$router.push({ path: url });
              }
            }
          },
        },
      },
    };
  },
  created() {
    vm = this;
  },
  computed: {
    ...mapState(["isLogin", "config"]),
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
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
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].sign === "slider") {
            this.sliders = blocks[i].config_render;
          }
        }
        this.swiper.slideTo(3, 1000, false);
      });
    },
  },
};
</script>
<style lang='less' scoped>
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
  .banner {
    width: 100%;
    margin-top: 0px;
    padding: 10px 15px;
    height: 135px;
    overflow: hidden;
    background: #ffffff;
    .swiper-container {
      width: 100%;
      height: 115px;
      border-radius: 8px;
      overflow: hidden;
      .swiper-slide {
        width: 100%;
        height: 115px;
        img {
          width: 100%;
          height: 115px;
        }
      }
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