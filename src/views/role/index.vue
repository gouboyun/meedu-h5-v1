<template>
  <div class="container">
    <div class="navheader borderbox">
      <img
        class="back"
        @click="goBack()"
        src="../../assets/img/icon-back.png"
      />
      <div class="title">VIP会员</div>
    </div>
    <div class="line"></div>
    <div class="user-info" v-if="user">
      <div class="avatar">
        <img :src="user.avatar" />
      </div>
      <div class="role-info">
        <template v-if="user.role">
          <div class="info">
            <div>您的{{ user.role.name }}{{ user.role_expired_at }}到期</div>
            <div>购买后将会有效期顺延</div>
          </div>
        </template>
        <template v-else>
          <div class="info">
            <div>您还不是本站会员哦</div>
            <div>免费会员</div>
          </div>
        </template>
      </div>
    </div>

    <div class="role-item-box">
      <div
        class="role-item"
        v-for="item in list"
        :key="item.id"
        :class="{ active: roleId === item.id }"
        @click="roleId = item.id"
      >
        <div class="name">{{ item.name }}</div>
        <div class="price"><span class="small">￥</span>{{ item.charge }}</div>
        <div class="desc">
          <div v-for="(descItem, index) in item.desc_rows" :key="index">
            {{ descItem }}
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar" @click="goOrder()">购买会员</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      list: [],
      roleId: 0,
    };
  },
  computed: {
    ...mapState(["isLogin", "config", "user"]),
  },
  mounted() {
    this.getRoles();
  },
  methods: {
    getRoles() {
      this.$api.Role.List().then((res) => {
        this.list = res.data;
      });
    },
    goOrder() {
      if (this.roleId === 0) {
        this.$message.error("请选择需要购买的会员");
        return;
      }
      let role = {};
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id === this.roleId) {
          role = this.list[i];
          break;
        }
      }
      this.$router.push({
        name: "Order",
        query: {
          goods_id: role.id,
          goods_name: role.name,
          goods_label: "VIP会员",
          goods_charge: role.charge,
          goods_type: "role",
        },
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

.user-info {
  width: 100%;
  height: auto;
  float: left;
  display: flex;
  padding: 20px 15px;
  box-sizing: border-box;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: white;
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  }

  .role-info {
    padding-top: 4px;
    margin-left: 15px;
    flex: 1;
    font-size: 13px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
  }
}

.role-item-box {
  width: 100%;
  height: auto;
  float: left;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 15px;

  .role-item {
    width: calc(50% - 5px);
    height: auto;
    float: left;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 8px;
    margin-bottom: 15px;
    border: 1px solid white;
    background-color: white;

    &:nth-of-type(even) {
      margin-left: 10px;
    }

    &.active {
      border: 1px solid rgba(225, 165, 0, 1);
      background: rgba(255, 237, 237, 1);
    }

    .name {
      width: 100%;
      height: auto;
      float: left;
      font-size: 14px;
      font-weight: 600;
      color: rgba(225, 165, 0, 1);
      line-height: 14px;
      margin-bottom: 20px;
    }

    .price {
      width: 100%;
      height: auto;
      float: left;
      font-size: 28px;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 24px;
      margin-bottom: 15px;

      .small {
        font-size: 18px;
      }
    }

    .desc {
      width: 100%;
      height: auto;
      float: left;
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 18px;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 49px;
  background-color: #cea200;
  line-height: 49px;
  text-align: center;
  color: white;

  &:active {
    background-color: rgba(#cea200, 0.9);
  }
}
</style>

<style>
#page {
  background-color: #f8f8f8;
}
</style>