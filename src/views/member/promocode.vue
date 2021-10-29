<template>
  <div id="content" class="container">
    <div class="mask" v-if="dialogStatus">
      <div class="popup borderbox">
        <div class="cancel" @click="cancel()">
          <img src="../../assets/img/close.png" />
        </div>
        <div class="input-box">
          <input
            type="text"
            class="input-item"
            v-model="withdrawForm.channel_account"
            placeholder="支付宝账户"
          />
        </div>
        <div class="input-box">
          <input
            type="text"
            class="input-item"
            v-model="withdrawForm.channel_name"
            placeholder="真实姓名"
          />
        </div>
        <div class="input-box">
          <input
            type="text"
            class="input-item"
            v-model="withdrawForm.total"
            placeholder="提现金额"
          />
        </div>
        <div class="confirm" @click="withdraw()">申请提现</div>
      </div>
    </div>
    <div class="navheader borderbox">
      <img
        class="back"
        @click="$router.back()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">我的邀请码</div>
    </div>
    <div class="promocode-box borderbox">
      <div class="item-box">
        <div class="item-left">
          <div class="value" v-if="invite.code">{{ invite.code }}</div>
          <div class="value" v-else>暂无</div>
          <div class="tit">我的邀请码</div>
          <div class="btn-copy" v-if="invite.code">复制</div>
        </div>
        <div class="item-right">
          <div class="value">￥{{ invite.balance }}</div>
          <div class="tit">邀请奖励金</div>
          <div
            v-if="invite.balance !== 0"
            class="withdraw-button"
            @click="showWithdrawDialog()"
          >
            提现
          </div>
        </div>
      </div>
      <div class="info">
        <p>邀请者分享邀请链接给其他人下单成功后，将的到如下对应金额奖励：</p>
        <p>一级用户：奖励5%实际下单金额</p>
        <p>二级用户：奖励2%下单金额</p>
        <p>三级用户：奖励1%下单金额</p>
      </div>
    </div>
    <div class="type-box borderbox">
      <div
        class="item"
        :class="{ active: type === item.key }"
        @click="setType(item.key)"
        v-for="item in types"
        :key="item.key"
      >
        {{ item.name }}
        <div class="actline" v-if="type === item.key"></div>
      </div>
    </div>
    <div class="list-box borderbox">
      <template v-if="list.length > 0 || loading">
        <div class="list-item" v-for="(item, index) in list" :key="index">
          <div class="item-top">
            <div v-if="type === 2" class="title">{{ item.desc }}</div>
            <div v-if="type === 3" class="title">提现</div>
            <div v-if="type === 1" class="title">{{ item.mobile }}</div>
            <div v-if="type === 2 || type === 3" class="price">
              {{ item.total }}
            </div>
          </div>
          <div class="info">
            <span>{{ item.created_at | changeTime }}</span>
          </div>
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
  data() {
    return {
      loading: false,
      dialogStatus: false,
      noPromoCode: false,
      over: false,
      type: 1,
      list: [],
      invite: {
        code: null,
        count: 0,
        balance: 0,
      },
      pagination: {
        page: 1,
        size: 10,
      },
      withdrawForm: {
        channel: "Alipay",
        channel_name: null,
        channel_account: null,
        total: null,
      },
      types: [
        {
          key: 1,
          name: "邀请记录",
        },
        {
          key: 2,
          name: "资金明细",
        },
        {
          key: 3,
          name: "提现明细",
        },
      ],
    };
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    window.addEventListener("scroll", this.ScrollToBottomEvt, true);
    this.initData();
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
    initData() {
      this.getInviteInfo();
      this.getPromoCode();
    },
    resetDialog() {
      this.withdrawForm.channel_account = null;
      this.withdrawForm.channel_name = null;
      this.withdrawForm.total = null;
    },
    showWithdrawDialog() {
      this.dialogStatus = true;
    },
    cancel() {
      this.resetDialog();
      this.dialogStatus = false;
    },
    withdraw() {
      if (this.loading) {
        return;
      }
      if (!this.withdrawForm.channel_account) {
        this.$message.error("请输入支付宝账户");
        return;
      }
      if (!this.withdrawForm.channel_name) {
        this.$message.error("请输入真实姓名");
        return;
      }
      if (!this.withdrawForm.total) {
        this.$message.error("请输入提现金额");
        return;
      }
      if (this.withdrawForm.total > this.invite.balance) {
        this.$message.error("提现金额不得大于余额");
        return;
      }
      this.loading = true;
      this.$api.Member.Withdraw(this.withdrawForm)
        .then((res) => {
          this.loading = false;
          this.$message.success("提现成功");
          this.getInviteInfo();
          this.getData();
          this.cancel();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    resetData() {
      this.list = [];
      this.pagination.size = 10;
      this.pagination.page = 1;
    },
    setType(key) {
      this.type = key;
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
      this.loading = true;
      if (this.type == 1) {
        this.$api.Member.InviteUsers(this.pagination).then((res) => {
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
      } else if (this.type == 2) {
        this.$api.Member.InviteBalanceRecords(this.pagination).then((res) => {
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
      } else if (this.type == 3) {
        this.$api.Member.WithdrawRecords(this.pagination).then((res) => {
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
      }
    },
    getInviteInfo() {
      this.$api.Member.Detail()
        .then((res) => {
          this.invite.count = res.data.invite_people_count;
          this.invite.balance = res.data.invite_balance;
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    getPromoCode() {
      this.$api.Member.PromoCode().then((res) => {
        let code = res.data.code;
        if (code) {
          this.invite.code = res.data.code;
        } else {
          this.$message.error("邀请码不对当前用户开放");
        }
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
    height: 284px;
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
      margin-top: 15px;
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
.promocode-box {
  width: 100%;
  max-height: 355px;
  background: #1784ed;
  padding: 30px 15px 20px 15px;
  .item-box {
    width: 345px;
    background: linear-gradient(180deg, #fff6cf 0%, #ffeaa1 100%);
    border-radius: 4px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    .item-left {
      width: 50%;
      display: flex;
      flex-direction: column;
      padding-top: 30px;
      padding-bottom: 30px;
      padding-left: 15px;
      box-sizing: border-box;
      .value {
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        margin-bottom: 20px;
        text-align: center;
      }
      .tit {
        width: 65px;
        height: 13px;
        font-size: 13px;
        font-weight: 400;
        color: #666666;
        line-height: 13px;
        margin-left: 50px;
      }
      .btn-copy {
        width: 96px;
        height: 30px;
        border-radius: 15px;
        border: 1px solid #1784ed;
        cursor: pointer;
        margin-top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #1784ed;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 50px;
      }
    }
    .item-right {
      width: 50%;
      display: flex;
      flex-direction: column;
      padding-top: 30px;
      padding-bottom: 30px;
      padding-right: 15px;
      box-sizing: border-box;
      .value {
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        margin-bottom: 20px;
        text-align: center;
      }
      .tit {
        width: 65px;
        height: 13px;
        font-size: 13px;
        font-weight: 400;
        color: #666666;
        line-height: 13px;
        margin-left: 50px;
      }
      .withdraw-button {
        width: 96px;
        height: 30px;
        border-radius: 15px;
        background: #1784ed;
        cursor: pointer;
        margin-top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 50px;
      }
    }
  }
  .info {
    width: 100%;
    height: 119px;
    display: flex;
    flex-direction: column;
    margin-top: 22px;
    p {
      width: 100%;
      font-size: 13px;
      font-weight: 400;
      color: #ffffff;
      line-height: 19px;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.type-box {
  width: 100%;
  height: 54px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  .item {
    min-width: 56px;
    height: 34px;
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    margin-right: 64px;
    margin-top: 20px;
    &:last-child {
      margin-right: 0px;
    }
    &.active {
      color: #3ca7fa;
      font-weight: 600;
      .actline {
        width: 56px;
        height: 4px;
        background: #3ca7fa;
      }
    }
    &:hover {
      color: #3ca7fa;
    }
  }
}
.list-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  .list-item {
    width: 100%;
    height: 77px;
    background: #ffffff;
    margin-bottom: 1px;
    box-sizing: border-box;
    padding: 18px 15px;
    .item-top {
      width: 100%;
      height: 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 14px;
      .title {
        height: 15px;
        font-size: 15px;
        font-weight: 400;
        color: #333333;
        line-height: 15px;
      }
      .price {
        height: 15px;
        font-size: 15px;
        font-weight: 500;
        color: #ff4d4f;
        line-height: 15px;
      }
    }
    .info {
      width: 100%;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #a3a3a3;
      line-height: 12px;
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