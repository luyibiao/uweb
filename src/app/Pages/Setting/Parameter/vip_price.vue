<template>
  <div>
    <p class="m-t m-b text-black text-md font-bold">会员价设置</p>
    <div class="b-t b-b">
      <div class="pull-left" style="margin-top:7px;">是否开通会员价
       <div class="text-muted text-xs">客户参与储值活动享受会员价（零散充值除外），当余额小于零时则不享受会员价</div>
      </div>
      <div class="text-center padder-v">
        <el-switch
          v-model="isOpenVipPrice"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="开启"
          inactive-text="关闭"
          @change="changeIsVip">
        </el-switch>
      </div>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";

export default {
  data() {
    return {
      isOpenVipPrice: 0,
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
          uri: "mercParam/detail"
        })
        .then(res => {
          this.isOpenVipPrice = res.data.data.isOpenVipPrice;
        });
    },
    // 设置开启状态
    changeIsVip() {
      let _this = this;
      msg.confirm({
        msg: "确认修改当前状态？",
        confirmFn: this.update,
        cancelFn: _ => {
          if (_this.isOpenVipPrice) {
            _this.isOpenVipPrice = 0;
          } else {
            _this.isOpenVipPrice = 1;
          }
        }
      });
    },
    update(){
      this.$store
        .dispatch("post", {
          uri: "mercParam/update",
          data: {
            isOpenVipPrice: this.isOpenVipPrice
          }
        })
        .then(res => {
          msg.success("修改成功！");
        });
    }
  }
};
</script>
