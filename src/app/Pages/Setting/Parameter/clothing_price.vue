<template>
  <div>
    <p class="m-t m-b text-black text-md font-bold">查看衣物价格信息设置</p>
    <div class="b-t b-b text-center padder-v">
      <span class="pull-left">微信订单详情查看衣物价格信息</span>
      <auth perm="setting.parameter.proprice">
        <el-switch
          v-model="open"
          active-color="#13ce66" inactive-color="#ff4949"
          active-text="允许" inactive-text="不允许" @change="setStatus">
        </el-switch>
        <template slot="noPerm">
          <el-switch
            v-model="open"
            active-color="#13ce66" inactive-color="#ff4949"
            active-text="允许" inactive-text="不允许" disabled>
          </el-switch>
        </template>
      </auth>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
export default {
  data() {
    return {
      open: false,
      status: 0
    };
  },
  created() {
    this.getStatus();
  },
  methods: {
    // 获取开启状态
    getStatus() {
      this.$store
        .dispatch("get", {
          uri: "mercCityParam/detail"
        })
        .then(res => {
          this.status = res.data.data.showWxProPrice;
          this.open = this.status === 1;
        });
    },
    // 设置开启状态
    setStatus() {
      msg.confirm({
        msg: "确认修改当前状态？",
        confirmFn: this.saveStatus,
        cancelFn: _ => {
          this.open = !this.open;
        }
      });
    },
    // 保存开启状态
    saveStatus() {
      this.status = this.open ? 1 : 0;
      this.$store
        .dispatch("post", {
          uri: "mercCityParam/updateShowWxProPrice",
          data: {
            showWxProPrice: this.status
          }
        })
        .then(res => {
          msg.success("修改成功！", 1200);
        });
    }
  }
};
</script>
