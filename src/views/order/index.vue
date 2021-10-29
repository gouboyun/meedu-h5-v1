<template>
  <div class="container">
    <div class="mask" v-if="openmask">
      <div class="popup borderbox">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="input-box">
          <input
            type="text"
            class="input-item"
            v-model="promoCode"
            placeholder="请输入优惠码"
          />
        </div>
        <div class="confirm" @click="checkPromoCode()">验证</div>
      </div>
    </div>
    <div class="navheader borderbox">
      <img
        class="back"
        @click="$router.back()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">收银台</div>
    </div>
    <div class="goods-box borderbox">
      <div class="tit">商品信息</div>
      <div class="goods-item">
        <div class="goods-thumb">
          <img v-if="goods.icon" :src="goods.icon" />
          <img v-else src="../../assets/img/default-vip.png" />
        </div>
        <div class="goods-info">
          <div class="goods-name">{{ goods.name }}</div>
          <div class="goods-label">{{ goods.label }}</div>
          <div class="goods-charge">￥{{ total }}</div>
        </div>
      </div>
    </div>
    <div class="promocode-box borderbox" @click="openPromo()">
      <div v-if="!isUsed" class="info">使用优惠码</div>
      <div class="tip" v-if="isUsed && configTip === 0">
        此优惠码无效，请重新输入验证
      </div>
      <div class="tip" v-if="isUsed && configTip === 1">
        优惠码已抵扣10元{{ discount }}元
      </div>
      <img src="../../assets/img/icon-prev.png" />
    </div>
    <div class="credit2-box borderbox">
      <div
        class="payment-item"
        @click="setPayment(item.sign)"
        v-for="item in payments"
        :key="item.sign"
        :class="{ active: item.sign === payment }"
      >
        <img
          class="icon"
          src="../../assets/img/payali.png"
          v-if="item.sign === 'alipay'"
        />
        <img
          class="icon"
          src="../../assets/img/paywechat.png"
          v-if="item.sign === 'wechat-jsapi'"
        />
        <img
          class="icon"
          src="../../assets/img/payhand.png"
          v-if="item.sign === 'handPay'"
        />
        <span>{{ item.name }}</span>
        <div class="sel">
          <img
            v-if="item.sign === payment"
            src="../../assets/img/selected.png"
          />
          <img v-else src="../../assets/img/unselected.png" />
        </div>
      </div>
    </div>
    <div class="box-footer borderbox">
      <div class="price-box">
        总计￥<span class="big">{{ totalVal }}</span>
      </div>
      <div class="btn-submit" @click="payHandler()">立即支付</div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      loading: false,
      goods_type: this.$route.query.goods_type,
      goods: {
        id: this.$route.query.goods_id,
        icon: this.$route.query.goods_thumb,
        name: this.$route.query.goods_name,
        charge: this.$route.query.goods_charge,
        label: this.$route.query.goods_label,
        type: this.$route.query.goods_type,
        tgGid: this.$route.query.tg_gid || 0,
      },
      configTip: false,
      openmask: false,
      discount: 0,
      payments: [
        {
          name: "支付宝支付",
          sign: "alipay",
        },
        {
          name: "微信支付",
          sign: "wechat-jsapi",
        },
        {
          name: "手动支付",
          sign: "handPay",
        },
      ],
      isUsed: false,
      payment: "alipay",
      total: parseInt(this.$route.query.goods_charge),
      promoCode: null,
      promoCodeBoxStatus: false,
      promoCodeModel: null,
      paymentScene: "h5",
    };
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  computed: {
    ...mapState(["isLogin", "user", "config"]),
    totalVal() {
      let val = this.total - this.discount;
      val = val < 0 ? 0 : val;

      return val;
    },
  },
  mounted() {},
  methods: {
    setPayment(sign) {
      this.payment = sign;
    },
    checkPromoCode() {
      if (this.loading) {
        return;
      }
      if (!this.promoCode) {
        return;
      }
      this.loading = true;
      this.$api.Order.PromoCodeCheck(this.promoCode)
        .then((res) => {
          this.loading = false;
          if (res.data.can_use !== 1) {
            this.configTip = 0;
            this.$message.error("优惠码无效");
            this.cancel();
          } else {
            this.configTip = 1;
            this.promoCodeModel = res.data.promo_code;
            this.discount = parseInt(this.promoCodeModel.invited_user_reward);
            this.$message.success("优惠码有效，抵扣" + this.discount + "元");
            this.cancel();
          }
        })
        .catch((e) => {
          this.loading = false;
          this.configTip = false;
          this.$message.error(e.message);
          this.cancel();
        });
    },
    cancel() {
      this.promoCode = null;
      this.openmask = false;
    },
    openPromo() {
      this.promoCode = null;
      this.openmask = true;
    },
    payHandler() {
      if (!this.payment) {
        this.$message.error("请选择支付方式");
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (this.goods.type === "vod") {
        // 点播课程
        this.$api.Order.CreateCourseOrder({
          course_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "video") {
        // 视频
        this.$api.Order.CreateVideoOrder({
          video_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      } else if (this.goods.type === "role") {
        this.$api.Order.CreateRoleOrder({
          role_id: this.goods.id,
          promo_code: this.promoCode,
        })
          .then((res) => {
            this.orderCreatedHandler(res.data);
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      }
    },
    orderCreatedHandler(order) {
      this.loading = false;
      // 判断是否继续走支付平台支付
      if (order.status_text === "已支付") {
        // 优惠全部抵扣
        this.$message.success("支付成功");

        setTimeout(() => {
          this.$router.back();
        }, 1000);
      } else {
        if (this.payment === "alipay" || this.payment === "wechat-jsapi") {
          if (this.payment === "wechat-jsapi") {
            this.paymentScene = "wechat";
          } else {
            this.paymentScene === "h5";
          }
          let host = window.location.host;
          let redirect = encodeURIComponent(host + "/order/success");
          let indexUrl = encodeURIComponent(host);
          window.location.href =
            this.config.url +
            "/api/v2/order/pay/redirect?order_id=" +
            order.order_id +
            "&payment_scene=" +
            this.paymentScene +
            "&scene=" +
            this.paymentScene +
            "&payment=" +
            this.payment +
            "&token=" +
            window.localStorage.getItem("token") +
            "&redirect=" +
            redirect +
            "&cancel_redirect=" +
            indexUrl;
        } else if (this.payment === "handPay") {
          this.$router.push({
            name: "OrderPay",
            query: {
              orderId: order.order_id,
              price: this.totalVal,
              payment: this.payment,
              type: this.goods.type,
              id: this.goods.id,
            },
          });
        } else {
          this.payFailure();
        }
      }
    },
    payFailure(e) {
      this.$message.error("无法支付");
      this.loading = false;
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
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  .popup {
    width: 325px;
    height: 204px;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    position: relative;
    .cancel {
      position: absolute;
      top: -42px;
      right: 0px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .input-box {
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: center;
      margin-top: 35px;
      .input-item {
        width: 255px;
        height: 45px;
        display: flex;
        align-items: center;
        border: none;
        border-bottom: 1px solid #d8d8d8;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        outline: none;
      }
    }

    .confirm {
      width: 255px;
      height: 44px;
      background: #1784ed;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      font-weight: 500;
      color: #ffffff;
      margin: 0 auto;
      margin-top: 50px;
    }
  }
}
.goods-box {
  width: 100%;
  height: 164px;
  float: left;
  background: #ffffff;
  margin-top: 10px;
  padding: 15px;
  .tit {
    width: 100%;
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 14px;
    margin-bottom: 30px;
  }
  .goods-item {
    width: 100%;
    height: 75px;
    display: flex;
    flex-direction: row;
    .goods-thumb {
      width: 100px;
      height: 75px;
      border-radius: 2px;
      margin-right: 15px;
      img {
        width: 100px;
        height: 75px;
        border-radius: 2px;
      }
    }
    .goods-info {
      width: 66%;
      height: 75px;
      display: flex;
      flex-direction: column;
      .goods-name {
        width: 100%;
        height: 15px;
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        line-height: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 2px;
        margin-bottom: 10px;
      }
      .goods-label {
        height: 13px;
        font-size: 13px;
        font-weight: 400;
        color: #ff4d4f;
        line-height: 13px;
        margin-bottom: 18px;
      }
      .goods-charge {
        height: 15px;
        font-size: 15px;
        font-weight: 600;
        color: #fd3968;
        line-height: 15px;
      }
    }
  }
}
.promocode-box {
  width: 100%;
  height: 57px;
  float: left;
  background: #ffffff;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  cursor: pointer;
  .info {
    width: 75px;
    height: 15px;
    font-size: 15px;
    font-weight: 400;
    color: #333333;
    line-height: 15px;
  }
  img {
    width: 19px;
    height: 19px;
  }
}
.credit2-box {
  width: 100%;
  float: left;
  height: 210px;
  background: #ffffff;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px 15px;
  .payment-item {
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    .icon {
      width: 30px;
      height: 30px;
      margin-right: 15px;
    }
    span {
      height: 18px;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
    }
    .sel {
      width: 24px;
      height: 24px;
      position: absolute;
      right: 0px;
      top: 3px;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
.box-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 49px;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .price-box {
    height: 24px;
    font-size: 16px;
    font-weight: 500;
    color: #ff4d4f;
    line-height: 24px;
    margin-left: 15px;
    .big {
      font-size: 24px;
    }
  }
  .btn-submit {
    width: 144px;
    height: 49px;
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>