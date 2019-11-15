<template>
  <div>
    <p class="description m-b-md">同一个员工同一个订单，上门取件后只获得取件提成、无收衣、入库提成。</p>
    <p class="m-t m-b text-black text-md font-bold">取送员、成员提成设置</p>
    <div class="b-t b-b text-center padder-v">
      <span class="pull-left">收衣提成与入库提成是否叠加</span>
      <el-switch
        v-model="cityParam.addProfits"
        :active-value="1"
        :inactive-value="0"
        active-color="#13ce66" inactive-color="#ff4949"
        active-text="叠加" inactive-text="不叠加"
        @change="update('addProfits')">
      </el-switch>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
export default {
  data() {
    return {
      cityParam:{
        addProfits:0
      },
    };
  },
  created() {
    this.getCityParam();
  },
  methods: {
    // 获取开启状态
    getCityParam() {
      let _this = this;
      this.$store
        .dispatch("get", {
          uri: "mercCityParam/detail"
        }).then(res => {
          _this.cityParam = res.data.data
        });
    },
    update(key) {
      let _this = this;
      let data = {};
      data[key] = _this.cityParam[key];
      msg.confirm({
        msg: "确认修改？",
        confirmFn: _=> {
          _this.$store
            .dispatch("post", {
              uri: "mercCityParam/update",
              data: data
            }).then(res => {
            msg.success();
          });
        },
        cancelFn: _ => {
          if (_this.cityParam[key]) {
            _this.cityParam[key] = 0;
          } else {
            _this.cityParam[key] = 1;
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .description {
    display: inline-block;
    padding: 15px 20px;
    border-radius: 8px;
    background: #f3f7ff;
  }
</style>