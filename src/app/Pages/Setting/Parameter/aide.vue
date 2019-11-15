<template>
  <div>
    <p class="m-t m-b text-black text-md font-bold">通洗管家</p>
    <div class="b-t b-b text-center padder-v">
      <span class="pull-left">订单计价方式</span>
      <div>
        <auth perm="setting.parameter.assistant">
          <el-radio-group v-model="valuation.type" @change="setConfirm">
            <el-radio class="radio" :label="1">快速计价</el-radio>
            <el-radio class="radio" :label="2">精准计价</el-radio>
          </el-radio-group>
          <template slot="noPerm">
            <el-radio-group disabled v-model="valuation.type">
              <el-radio class="radio" :label="1">快速计价</el-radio>
              <el-radio class="radio" :label="2">精准计价</el-radio>
            </el-radio-group>
          </template>
        </auth>
      </div>
    </div>
    <div class="b-b text-center padder-v">
      <span class="pull-left">送件未取件是否显示接收按钮</span>
      <el-switch
        style="margin-right:9%"
        v-model="cityParam.wkSendOrder"
        :active-value="1"
        :inactive-value="0"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="显示"
        inactive-text="隐藏"
        @change="changeStatus('wkSendOrder')">
      </el-switch>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
export default {
  data() {
    return {
      valuation:{
        save:false,
        type: 1,
      },
      cityParam:{
        valuationType: 1,
        wkSendOrder: 1,
      },
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
          uri: "mercCityParam/detail"
        })
        .then(res => {
          _this.cityParam = res.data.data
          _this.valuation.type = _this.cityParam.valuationType
          setTimeout(function(){
            _this.valuation.save = true
          }, 800)
        });
    },
    setConfirm() {
      if(!this.valuation.save){
        return
      }
      var _this = this;
      msg.confirm({
        msg: "确认修改订单计价方式？",
        confirmFn: this.saveValuation,
        cancelFn: _ => {
          _this.valuation.save = false
          _this.valuation.type = _this.cityParam.valuationType
          setTimeout(function(){
            _this.valuation.save = true
          }, 800)
        }
      });
    },
    // 保存开启状态
    saveValuation() {
      var uri = this.valuation.type === 1 ? "mercCityParam/updateValuationSimple" : "mercCityParam/updateValuationAccurate";
      this.$store
        .dispatch("post", {
          uri: uri,
          data: {}
        })
        .then(res => {
          msg.success("设置成功！", 1200);
          this.getCityParam();
        });
    },
    changeStatus(key) {
      let _this = this;
      let data = {};
      data[key] = _this.cityParam[key];
      msg.confirm({
        msg: "确认修改当前状态？",
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
    },
  }
};
</script>
