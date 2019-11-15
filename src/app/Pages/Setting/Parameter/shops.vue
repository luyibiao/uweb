<style lang="less" scoped>
.shops-top {
  background-color: #f8f8f8;
  padding: 15px 20px;
  .shops-top-switch {
    min-height: 45px;
    line-height: 45px;
  }
}
</style>

<template>
  <div>
    <el-row class="shops-top m-b-md">
      <el-col :span="18">
        <p class="m-b-xs text-black text-md font-bold">商城功能</p>
        <p class="text-sm text-muted">启用后，微信公众号“我的”列表有商城入口</p>
      </el-col>
      <el-col class="shops-top-switch"
              :span="6">
        <auth perm="setting.parameter.mall">
          <el-switch v-model="valuation.openMall"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   active-text="开启"
                   inactive-text="关闭"
                   @change="setConfirm">
          </el-switch>
          <template slot="noPerm">
            <el-switch v-model="valuation.openMall"
                       disabled
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-text="开启"
                       inactive-text="关闭">
            </el-switch>
          </template>
        </auth>
      </el-col>
    </el-row>
    <el-tabs v-model="tabsName"
             type="card">
      <el-tab-pane label="配送方式设置"
                   name="send">
        <shopsSendMode></shopsSendMode>
      </el-tab-pane>
      <el-tab-pane label="支付设置"
                   name="pay">
        <shopsPayMode></shopsPayMode>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import msg from "@/utils/msg";
import shopsSendMode from "./components/shops_sendMode";
import shopsPayMode from "./components/shops_payMode";
export default {
  data() {
    return {
      tabsName: "send",
      valuation: {
        openMall: false
      },
      cityParam: {}
    };
  },
  created() {
    this.getCityParam();
  },
  methods: {
    // 获取开启状态
    getCityParam() {
      var _this = this;
      this.$store
        .dispatch("get", {
          uri: "mercCity/queryInfo"
        })
        .then(res => {
          _this.cityParam = res.data.data;
          _this.valuation.openMall = _this.cityParam.isMall == 1;
        });
    },
    // 设置开启状态
    setConfirm() {
      var alertMsg =
        this.cityParam.isMall == 1 ? "确认关闭商城？" : "确认开启商城？";
      msg.confirm({
        msg: alertMsg,
        confirmFn: this.modifyCityParam,
        cancelFn: _ => {
          this.valuation.openMall = !this.valuation.openMall;
        }
      });
    },
    // 保存开启状态
    modifyCityParam() {
      this.$store
        .dispatch("post", {
          uri: "mercCity/update",
          data: {
            id: this.cityParam.id,
            isMall: this.cityParam.isMall == 1 ? "0" : "1"
          }
        })
        .then(res => {
          msg.success("设置成功！", 1200);
          this.getCityParam();
        });
    }
  },
  components: {
    shopsSendMode,
    shopsPayMode
  }
};
</script>
