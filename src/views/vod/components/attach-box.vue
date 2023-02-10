<template>
  <div class="attach-box" v-if="status">
    <div class="list-box" v-if="!loading && list.length > 0">
      <div v-for="item in list" class="item-comp" :key="item.id">
        <img class="icon" src="../../../assets/img/attach-icon.png" />
        <div class="title">
          {{ item.name }}
        </div>
        <div class="link" @click="download(item.id)">
          下载
        </div>
      </div>
    </div>
    <none type="white" v-else></none>
  </div>
</template>
<script>
import { mapState } from "vuex";
import None from "../../../components/none.vue";

export default {
  components: {
    None,
  },
  props: ["cid", "status"],
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
    };
  },
  watch: {
    status(val) {
      this.list = [];
      this.loading = false;
      this.getData();
    },
  },
  computed: {
    ...mapState(["isLogin", "user", "config"]),
  },
  mounted() {},
  methods: {
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Course.Detail(this.cid).then((res) => {
        this.loading = false;
        this.list = res.data.attach;
      });
    },
    download(id) {
      let url =
        this.config.url +
        `/api/v2/course/attach/${id}/download?token=` +
        this.$utils.getToken();

      if (this.$utils.isWechat()) {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", url);
        input.select();
        if (document.execCommand("copy")) {
          document.execCommand("copy");
          this.$message.success("链接已复制，请使用浏览器下载");
        }
        document.body.removeChild(input);
      } else {
        window.open(url);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.attach-box {
  position: relative;
  width: 100%;
  height: auto;
  float: left;
  background: #ffffff;
  box-sizing: border-box;
  .list-box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 20px 20px 30px 20px;
    .item-comp {
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 10px;
      .icon {
        width: 30px;
        height: 30px;
        display: flex;
      }
      .title {
        flex: 1;
        height: 30px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 30px;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        margin-left: 10px;
      }
      .link {
        width: 58px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #3ca7fa;
        font-size: 14px;
        font-weight: 400;
        color: #3ca7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
