<template>
  <div id="content" class="container">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">我的订单</div>
    </div>
    <div class="order-item" v-for="order in list" :key="order.id">
      <div class="title">
        <div class="date">{{ order.created_at | changeTime }}</div>
        <div class="status">{{ order.status_text }}</div>
      </div>

      <div class="body">
        <div class="goods">
          <div class="name">
            {{ order.goods[0].goods_name }}
          </div>
          <div class="payment">{{ order.payment_text }}</div>
        </div>
        <div class="charge"><span class="unit">￥</span>{{ order.charge }}</div>
      </div>
    </div>

    <div class="drop">
      <img v-show="loading && !over" src="../../assets/img/Spinload.gif" />
      <span v-if="over">已经到底了</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      list: [],
      pagination: {
        page: 0,
        page_size: 10,
      },
      over: false,
      loading: false,
    };
  },
  computed: {
    ...mapState(["config"]),
  },
  mounted() {
    window.addEventListener("scroll", this.ScrollToBottomEvt, true);
    this.getData(true);
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
      this.$api.Member.Orders(this.pagination).then((res) => {
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
.container {
  box-sizing: border-box;
  padding-top: 50px;
  background: #f6f6f6;
}
.drop {
  width: 100%;
  text-align: center;
  color: #cccccc;
  font-size: 14px;
  margin-bottom: 30px;
}
.order-item {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .title {
    width: 100%;
    height: auto;
    float: left;
    display: flex;
    padding-bottom: 15px;

    .date {
      flex: 1;
      font-size: 10px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 10px;
    }

    .status {
      flex: 1;
      text-align: right;
      font-size: 13px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 13px;
    }
  }

  .body {
    width: 100%;
    height: auto;
    float: left;
    display: flex;

    .goods {
      flex: 1;

      .name {
        width: 100%;
        height: auto;
        float: left;
        font-size: 15px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 15px;
        padding-bottom: 15px;
      }
    }

    .payment {
      width: 100%;
      height: auto;
      float: left;
      font-size: 10px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 10px;
    }
  }

  .charge {
    width: 120px;
    height: auto;
    text-align: right;
    font-size: 20px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    padding-top: 10px;

    .unit {
      font-size: 10px;
    }
  }
}
</style>