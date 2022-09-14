<template>
  <div class="slider-box">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="item in items" :key="item.sort">
        <img :src="item.src" :name="item.href" />
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

var vm = null;
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: ["items"],
  data() {
    return {
      loading: false,
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
          click: function(e) {
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
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  created() {
    vm = this;
  },
  mounted() {
    this.swiper.slideTo(3, 1000, false);
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.slider-box {
  width: 100%;
  margin-top: 0px;
  box-sizing: border-box;
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
</style>
