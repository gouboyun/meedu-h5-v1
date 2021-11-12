<template>
  <div class="container">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">手动打款支付</div>
    </div>
    <div class="normal-box">
      <div class="orderNum">
        订单号：<span>{{ orderId }}</span>
      </div>
      <div class="price">
        需支付：<span class="red"
          >￥<strong>{{ price }}</strong></span
        >
      </div>
    </div>
    <div class="pay-box">
      <div class="tit">
        收款信息<span>（手动打款需后台验证后交付订单，请耐心等待）</span>
      </div>
      <div class="text" v-html="text"></div>
    </div>
    <div class="btns">
      <div class="btn-confirm" @click="confirm()">我已完成支付</div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      orderId: this.$route.query.orderId,
      price: this.$route.query.price,
      payment: this.$route.query.payment,
      text: null,
      goods_type: this.$route.query.type,
      id: this.$route.query.id,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.initData();
  },
  methods: {
    goLogin() {
      this.$router.push({ name: "Login" });
    },
    initData() {
      this.$api.Order.HandPay()
        .then((res) => {
          this.text = res.data.text;
        })
        .catch((e) => {
          this.$message.error(e.message);
          this.$router.push({ name: "index" });
        });
    },
    goBack() {
      if (this.goods_type === "role") {
        this.$router.push({
          name: "Role",
        });
      } else if (this.goods_type === "vod") {
        this.$router.push({
          name: "VodDetail",
          query: {
            id: this.id,
          },
        });
      } else if (this.goods_type === "video") {
        this.$router.push({
          name: "VodVideo",
          query: {
            id: this.id,
          },
        });
      }
    },
    confirm() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "Index",
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
.normal-box {
  width: 100%;
  height: 105px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px 15px;
  margin-top: 10px;
  .orderNum {
    width: 100%;
    height: 15px;
    font-size: 15px;
    font-weight: 600;
    color: #333333;
    line-height: 15px;
    margin-bottom: 33px;
    span {
      margin-left: 10px;
      font-weight: 400;
      color: #666666;
    }
  }
  .price {
    width: 100%;
    height: 20px;
    font-size: 15px;
    font-weight: 600;
    color: #333333;
    line-height: 20px;
    .red {
      height: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #ff5858;
      line-height: 20px;
      strong {
        font-size: 18px;
      }
    }
  }
}
.pay-box {
  width: 100%;
  height: auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px 15px;
  margin-top: 10px;
  .tit {
    width: 100%;
    height: 15px;
    font-size: 15px;
    font-weight: 600;
    color: #333333;
    line-height: 15px;
    span {
      font-size: 12px;
      line-height: 15px;
      font-weight: 400;
    }
  }
  .text {
    width: 100%;
    height: auto;
    font-size: 15px;
    font-weight: 400;
    color: #666666;
    line-height: 24px;
    margin-top: 20px;
  }
}
.btns {
  width: 100%;
  box-sizing: border-box;
  height: 46px;
  padding: 0px 15px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  .btn-confirm {
    width: 100%;
    height: 46px;
    background: #3ca7fa;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>