<template>
  <div class="gzh-box mt-20" v-if="items">
    <transition name="fade">
      <div class="mask" @click="cancel()" v-if="dialogStatus">
        <div class="modal" @click.stop="follow()">
          <img class="top-right" src="@/assets/img/topright.png" />
          <div class="title">关注公众号</div>
          <div class="body">
            <div class="qrcode">
              <img v-if="items.qrcode" :src="items.qrcode" />
            </div>
          </div>
          <div class="tip">长按二维码识别或截图保存</div>
        </div>
      </div>
    </transition>
    <div class="gzh-left">
      <div class="avatar">
        <img v-if="items.logo" :src="items.logo" />
      </div>
      <div class="info">
        <span class="name">
          {{ items.name }}
        </span>
        <span class="desc">
          {{ items.desc }}
        </span>
      </div>
    </div>
    <div class="gzh-right">
      <div class="btn" @click="follow">关注</div>
    </div>
  </div>
</template>
<script>
let settingWritePhotosAlbum = false;

export default {
  props: ["items"],
  data() {
    return {
      dialogStatus: false,
    };
  },
  methods: {
    cancel() {
      this.dialogStatus = false;
    },
    follow() {
      this.dialogStatus = true;
    },
  },
};
</script>
<style lang="less" scoped>
.mask {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  .modal {
    position: fixed;
    z-index: 999;
    width: 200px;
    height: 236px;
    top: calc(50% - 118px);
    left: calc(50% - 100px);
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    animation: window-open 0.3s;
    display: flex;
    flex-direction: column;
    .top-right {
      position: absolute;
      top: 3px;
      right: 0;
      width: 64px;
      height: 67px;
    }
    .title {
      width: 100%;
      margin-top: 20px;
      height: 14px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      line-height: 14px;
      text-align: center;
    }
    .body {
      width: 100%;
      margin-top: 20px;
      height: 120px;
      display: flex;
      justify-content: center;
      .qrcode {
        width: 120px;
        height: 120px;
        img {
          width: 120px;
          height: 120px;
        }
      }
    }
    .tip {
      width: 100%;
      margin-top: 20px;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 12px;
      text-align: center;
    }
  }
}
.gzh-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 15px;
  background-color: white;
  display: flex;
  flex-direction: row;
  .gzh-left {
    flex: 1;
    display: flex;
    flex-direction: row;
    .avatar {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      .name {
        width: 100%;
        height: 20px;
        font-size: 15px;
        font-weight: 500;
        color: #171923;
        line-height: 20px;
        margin-top: 5px;
        overflow: hidden;
      }
      .desc {
        width: 100%;
        height: 12px;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
        margin-top: 8px;
        overflow: hidden;
      }
    }
  }
  .gzh-right {
    width: 58px;
    display: flex;
    align-items: center;
    .btn {
      width: 58px;
      height: 24px;
      background: #3ca7fa;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
