<template>
  <div>
    <div class=" padder-v bg-subnav" style="padding-left: 10px">
      <p class="text-black text-md font-bold text-left" style="font-size: 16px;margin-bottom: 5px">微信客户下单设置</p>
      <span class="pull-left text-muted" style="font-size: 12px">停用后，客户不能在微信公众号下单，并且会出现以下文字提醒客户。</span>
      <div class="text-right" style="margin-right: 15%">
        <auth perm="setting.parameter.wxshop">
          <el-switch
            v-model="valuation.openCreateOrderEnable"
            active-color="#13ce66" inactive-color="#ff4949"
            active-text="已开启" inactive-text="已关闭" @change="setConfirm">
          </el-switch>
          <template slot="noPerm">
            <el-switch
              v-model="valuation.openCreateOrderEnable"
              active-color="#13ce66" inactive-color="#ff4949"
              active-text="已开启" inactive-text="已关闭" disabled>
            </el-switch>
          </template>
        </auth>
      </div>
    </div>
    <div class="m-t" >
      <!--<div class="clearfix">-->
        <!--<p class="pull-left text-black text-md font-bold"-->
           <!--style="line-height:36px; font-size: 14px">关单提示内容</p>-->
      <!--</div>-->
      <div v-if="!valuation.openCreateOrderEnable" class="b-t text-center padder-v printbox">
        <span class="pull-left text-muted">关单提示内容</span>
        <span class="printcontent">{{cityParam.closedTip}}</span>
        <span class="pull-right printbtn" style="margin-right:15%">
          <auth perm="setting.parameter.wxshop">
            <el-button size="medium" @click="updatedialog(cityParam.closedTip)">修改</el-button>
          </auth>
        </span>
      </div>
      <div class="b-t b-b text-center padder-v">
        <span class="pull-left text-muted">微信端显示门店列表</span>
        <span class="printcontent"> </span>
        <auth perm="setting.parameter.wxshop">
          <span class="pull-right printbtn" style="margin-right:15%">
            <el-switch
              v-model="cityParam.storeOrderEnable"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66" inactive-color="#ff4949"
              active-text="显示" inactive-text="不显示" @change="changeStatus('storeOrderEnable')">
            </el-switch>
          </span>
        </auth>
      </div>
      <div v-if="cityParam.storeOrderEnable" class="b-b text-center padder-v">
        <span class="pull-left text-muted">允许在微信端选择自送门店下单</span>
        <span class="printcontent"> </span>
        <auth perm="setting.parameter.wxshop">
          <span class="pull-right printbtn" style="margin-right:15%">
            <el-switch
              v-model="cityParam.createStoreOrder"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66" inactive-color="#ff4949"
              active-text="允许" inactive-text="不允许" @change="changeStatus('createStoreOrder')">
            </el-switch>
          </span>
        </auth>
      </div>
    </div>

    <!--弹出框-->
    <el-dialog class="ukao-dialog"
               size="small"
               :visible.sync="dialog.visible"
               title="修改提示内容">
      <div>
        <el-form :model="ruleForm"
                 ref="ruleForm"
                 label-width="150px">
          <el-form-item label="提示内容"
                        prop="closedTip"
                        :rules="[
               { min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur' }
             ]">
            <div>
              <el-input type="textarea"
                        :rows="5"
                        placeholder="请输入内容"
                        v-model="ruleForm.closedTip"
                        class="el-input-t"
              >
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary"
                   @click="update('ruleForm')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import msg from "@/utils/msg";
export default {
  data() {
    return {
      ruleForm:{
        closedTip:""
      },
      valuation:{
        openCreateOrderEnable: false,
      },
      cityParam:{
        createOrderEnable:1,
        storeOrderEnable:1,
        createStoreOrder:1
      },
      dialog: {
        visible: false
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
          _this.valuation.openCreateOrderEnable = _this.cityParam.createOrderEnable == 1;
          _this.cityParam.closedTip = _this.cityParam.closedTip || "预约已满，请改日下单";
        });
    },
    update(){
      this.$store
        .dispatch("post", {
          uri: "mercCityParam/update",
          data:{...this.ruleForm}
        })
        .then(res => {
          this.dialog.visible = false;
          msg.success();
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
    // 设置开启状态
    setConfirm() {
      var alertMsg = this.cityParam.createOrderEnable == 1 ? "确认停用微信端下单？" : "确认开启微信端下单？";
      msg.confirm({
        msg: alertMsg,
        confirmFn: this.modifyCityParam,
        cancelFn: _ => {
          this.valuation.openCreateOrderEnable = !this.valuation.openCreateOrderEnable;
        }
      });
    },
    // 保存开启状态
    modifyCityParam() {
      var uri = this.valuation.openCreateOrderEnable ? "mercCityParam/createOrder/enable" : "mercCityParam/createOrder/disable";
      this.$store
        .dispatch("post", {
          uri: uri,
          data: {}
        })
        .then(res => {
          msg.success("保存成功，去微信端查看。", 1200);
          this.getCityParam();
        });
    },
    updatedialog(closedTip) {
      this.ruleForm.closedTip = closedTip
      this.dialog.visible = true;
    },
  }
};
</script>

<style>
  .printcontent {
    display: inline-block;
    width: 300px;
    word-wrap: break-word;
    text-align: left;
  }
  .printbtn {
    margin-top: -5px;
  }
</style>
