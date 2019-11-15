<template>
  <div>
    <p class="m-t m-b text-black text-md font-bold">优付卡设置</p>
    <div class="b-t b-b text-center padder-v">
      <span class="pull-left">优付卡</span>
        <auth perm="setting.parameter.upay">
          <el-switch
            v-model="status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="已开启"
            inactive-text="已关闭"
            @change="setConfirm">
          </el-switch>
          <template slot="noPerm">
            <el-switch
              v-model="status"
              active-color="#13ce66" inactive-color="#ff4949"
              active-text="已开启" inactive-text="已关闭" disabled>
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
      status: false
    };
  },
  created() {
    this.getUcardParam();
  },
  methods: {
    // 获取开启状态
    getUcardParam() {
      this.$store
        .dispatch("get", {
          uri: "mercCityParam/detail"
        })
        .then(res => {
          this.status = res.data.data.upayEnable == 1;
        });
    },
    // 更新状态
    updateStatus() {
      let uri = this.status
        ? "mercCityParam/uPayCard/enable"
        : "mercCityParam/uPayCard/disable";
      this.$store
        .dispatch("post", {
          uri
        })
        .then(res => {
          msg.success((this.status ? "开启" : "关闭") + "优付卡成功");
        });
    },
    // 设置开启状态
    setConfirm() {
      var alertMsg = !this.status ? "确认关闭优付卡？" : "确认开启优付卡？";
      msg.confirm({
        msg: alertMsg,
        confirmFn: this.updateStatus,
        cancelFn: _ => {
          this.status = !this.status;
        }
      });
    }
  }
};
</script>
