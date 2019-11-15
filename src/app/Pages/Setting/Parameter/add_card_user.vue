<template>
  <div>
    <p class="m-t m-b text-black text-md font-bold">会员卡设置</p>
    <div class="b-t b-b text-left padder-v">
      <span class="pull-left" style="width: 70%">新建会员选择会员等级</span>
      <auth perm="setting.parameter.proimg">
        <el-switch
          v-model="open"
          active-color="#13ce66" inactive-color="#ff4949"
          active-text="允许" inactive-text="不允许" @change="setStatus" >
        </el-switch>
        <template slot="noPerm">
          <el-switch
            v-model="open" :width="74"
            active-color="#13ce66" inactive-color="#ff4949"
            active-text="允许" inactive-text="不允许" disabled>
          </el-switch>
        </template>
      </auth>
    </div>
    <div class="b-b text-left padder-v" >
      <span class="pull-left" style="width: 70%">客户余额为零时是否将会员卡变更默认会员卡</span>
      <auth perm="setting.parameter.proimg" >
        <el-switch
          v-model="agioConfig"
          active-color="#13ce66" inactive-color="#ff4949"
          active-text="允许" inactive-text="不允许" @change="setAgioConfig">
        </el-switch>
        <template slot="noPerm">
          <el-switch
            v-model="agioConfig" :width="74"
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
      status: 0,
      agioConfig: false
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
          this.status = res.data.data.addCardUser;
          this.open = this.status === 1;
          this.agioConfig = res.data.data.agioConfig == 1;
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
    setAgioConfig(){
      this.$store
        .dispatch("post", {
          uri: "mercCityParam/update",
          data: {
            agioConfig: this.agioConfig? 1 : 0
          }
        })
        .then(res => {
          msg.success("修改成功！");
        });
    },
    // 保存开启状态
    saveStatus() {
      this.status = this.open ? 1 : 0;
      this.$store
        .dispatch("post", {
          uri: "mercCityParam/update",
          data: {
            addCardUser: this.status
          }
        })
        .then(res => {
          msg.success("修改成功！", 1200);
        });
    }
  }
};
</script>
<style>
  .margin_span_auto{
    margin-right: 20%;
    text-align: right;
  }
</style>
