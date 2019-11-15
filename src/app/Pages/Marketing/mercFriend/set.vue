<style lang="less" scoped>
.title {
  padding: 10px;
  background-color: #eff2f7;
  margin-bottom: 15px;
}
.el-form-item .el-form-item:not(:last-child) {
  margin-bottom: 20px;
}

  .td-left{
    padding-left: 40px;
  }
.radioContent {
  display: inline-block;
  position: relative;
}
.radioContent p {
  position: absolute;
  top: 20px;
}
</style>
<template>
  <div>
    <el-form :model="fbForm" label-width="150px" ref="fbForm">
      <div class="title text-md text-black">友商招募与管理</div>
      <el-form-item label="友商招募：">
        <el-radio-group v-model="fbForm.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="友商获取分润方式：" style="margin-bottom: 33px;">
        <el-radio-group v-model="fbForm.profitType"  >
          <el-radio :label=1 >
            <span class="radioContent" style=" font-size: 14px;">按友商有效期来计算分润
              <p style="color: #909399; margin-top: 5px;font-size: 12px;">友商有效期内，友商获得所有粉丝消费、充值提成</p>
            </span>
          </el-radio>
          <el-radio :label=0 style="margin-left: 130px;">
            <span style="font-size: 14px;">按粉丝关注时间计算分润</span>
          </el-radio>

        </el-radio-group>

      </el-form-item>
      <!--<el-form-item label="有效期设置：">
        <el-radio-group v-model="fbForm.enableDay">
          <el-radio :label="15">短期15天</el-radio>
          <el-radio :label="-1">永久</el-radio>
        </el-radio-group>
      </el-form-item>-->
      <!--<el-form-item label="友商建立客户关系：">-->
        <!--<el-radio-group v-model="fbForm.isRelation">-->
          <!--<el-radio :label="1">允许</el-radio>-->
          <!--<el-radio :label="0">不允许</el-radio>-->
        <!--</el-radio-group>-->
        <!--<p class="text-muted text-sm">设置允许后，商家允许友商之间建立客户关系</p>-->
      <!--</el-form-item>-->
      <div class="title text-md text-black">佣金结算与发放</div>
      <el-form-item label="加粉佣金：">
        <el-form-item label-width="150px" prop="newFansAmt" :rules="rules.newFansAmt" label="单粉佣金" class="m-b">
          <el-input class="w-xs" v-model="fbForm.newFansAmt"></el-input>
          <span class="m-l-xs">元/粉丝</span>
        </el-form-item>
        <el-form-item label-width="150px" prop="testDay" :rules="rules.testDay" label="考验期数">
          <el-input class="w-xs" v-model="fbForm.testDay"></el-input>
          <span class="m-l-xs">天</span>
          <p class="text-muted text-xs">粉丝在考验天数内取消关注公众号，友商无法获得单粉佣金</p>
        </el-form-item>
      </el-form-item>
      <el-form-item label="粉丝分润：">
        <el-form-item prop="profitUnitDay" label="分润有效期：" :rules="[{required: true, message: '分润期数不能为空'},rules.profitDay[0]]">
          <el-radio-group v-model="fbForm.profitUnit">
            <el-radio :label=1 >天</el-radio><el-radio :label=2 >月</el-radio><el-radio :label=3 >年</el-radio>
          </el-radio-group>
          <div>
            分润期数
            <el-input class="w-xs" style="height: 35px" v-model="fbForm.profitUnitDay" :maxLength="4"></el-input>
            <span class="m-l-xs">{{fbForm.profitUnit | getValText('PROFIT_UNIT')}}</span>
          </div>
        </el-form-item>
        <el-form-item label-width="150px" label="消费分润提成类型" class="m-b">
         <el-radio-group v-model="fbForm.consumeType">
            <el-radio :label="1">比例(%)</el-radio>
            <el-radio :label="2">固定金额(元)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-width="150px" prop="consume" :rules="rules.consume" label="消费分润提成" class="m-b">
          <el-input class="w-xs" v-model="fbForm.consume"></el-input>
          <span class="m-l-xs">{{fbForm.consumeType == 1 ? '%':'元'}}</span>
          <p class="text-muted text-xs">余额支付友商没有消费提成</p>
        </el-form-item>
        <el-form-item label-width="150px" label="充值分润提成类型" class="m-b">
         <el-radio-group v-model="fbForm.rechargeType">
            <el-radio :label="1">比例(%)</el-radio>
            <el-radio :label="2">固定金额(元)</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label-width="150px" prop="recharge" :rules="rules.recharge" label="充值分润提成" class="m-b">
          <el-input class="w-xs" v-model="fbForm.recharge"></el-input>
          <span class="m-l-xs">{{fbForm.rechargeType == 1 ? '%':'元'}}</span>
        </el-form-item>
        <el-form-item label-width="150px" label="友商获得充值分润的方式" class="m-b">
          <el-checkbox-group v-model="originList">
            <tr>
              <td>
                <el-checkbox label="微信支付"></el-checkbox>
              </td>
              <td class="td-left">
                <el-checkbox label="现金支付（包含后台充值）"></el-checkbox>
              </td>
            </tr>
            <tr>
              <td><el-checkbox label="支付宝支付" ></el-checkbox></td>
              <td class="td-left"><el-checkbox label="充值卡"></el-checkbox></td>
            </tr>
            <tr>
              <!--<td><el-checkbox label="绑卡充值(有金额的实体会员卡)"></el-checkbox></td>-->
              <td><el-checkbox label="其他支付"></el-checkbox></td>
            </tr>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <auth perm="marketing.friend.param.update">
          <el-button type="primary" @click="submit">保存</el-button>
        </auth>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";

export default {
  data() {
    return {
      // 友商form
      fbForm: {
        status: 1,
        enableDay: 15,
        isRelation: 1,
        newFansAmt: "",
        testDay: "",
        profitDay: "",
        profitUnitDay: '',
        profitType: 0,
        consumeType: 1,
        consume: "",
        rechargeType: 1,
        recharge:"",
        profitUnit: 1,
        originConfig:'',
      },
      originList:[],
      origin:["微信支付",
              "现金支付（包含后台充值）",
              "支付宝支付",
              "充值卡",
              "绑卡充值(有金额的实体会员卡)",
              "其他支付"],
      // form校验规则
      rules: {
        newFansAmt: [
          { required: true, message: "请输入佣金" },
          {
            validator: (rule, value, callback) => {
              this.numberValidator(
                value,
                2,
                0,
                1000,
                callback,
                "佣金应在0-1000之间，最多保留2位小数"
              );
            },
            trigger: "blur"
          }
        ],
        testDay: [
          { required: true, message: "请输入考验期数" },
          {
            validator: (rule, value, callback) => {
              this.numberValidator(
                value,
                0,
                0,
                3650,
                callback,
                "考验期数应是0-3650的整数"
              );
            },
            trigger: "blur"
          }
        ],
        profitDay: [
          {
            validator: (rule, value, callback) => {
              if (this.fbForm.profitDay) {
                this.numberValidator(
                  value,
                  0,
                  0,
                  3650,
                  callback,
                  "分润期数应是0-3650的整数"
                );
              }else{
                callback();
              }
            },
            trigger: ['blur', 'change']
          }
        ],
        consume: [
          { required: true, message: "请输入消费分润提成" },
          {
            validator: (rule, value, callback) => {
              let err =
                this.fbForm.consumeType == 1
                  ? "请输入0-100的数字，最多保留2位小数"
                  : "请输入0-99999的数字，最多保留2位小数";
              let max = this.fbForm.consumeType == 1 ? 100 : 99999;
              this.numberValidator(value, 2, 0, max, callback, err);
            },
            trigger: "blur"
          }
        ],
        recharge: [
          { required: true, message: "请输入充值分润提成" },
          {
            validator: (rule, value, callback) => {
              let err =
                this.fbForm.rechargeType == 1
                  ? "请输入0-100的数字，最多保留2位小数"
                  : "请输入0-99999的数字，最多保留2位小数";
              let max = this.fbForm.rechargeType == 1 ? 100 : 99999;
              this.numberValidator(value, 2, 0, max, callback, err);
            },
            trigger: "blur"
          }
        ]
      },
      // 设置详情
      detail: null
    };
  },
  created() {
    this.getMercFriendDetail();
  },
  methods: {
    // 获取设置详情
    getMercFriendDetail() {
      this.$store
        .dispatch("get", {
          uri: "mercFriend/detail"
        })
        .then(res => {
          if (res.data.data) {
            this.detail = res.data.data;
            this.initFbForm(res.data.data);
            this.selectOriginList();
            this.computeProfitUnitDay();
          }
        });
    },
    // 初始化表单数据
    initFbForm(obj) {
      Object.keys(this.fbForm).forEach(item => {
        if (item == "newFansAmt" || item == "consume" || item == "recharge") {
          this.fbForm[item] = calculation.accDiv(obj[item], 100);
        } else {
          this.fbForm[item] = obj[item];
        }
      });
      this.fbForm.profitType = obj.profitType ? parseInt(obj.profitType) : 0;
      this.fbForm.profitUnit = obj.profitUnit ? parseInt(obj.profitUnit) : 1;
    },
    // 提交表单
    submit() {
      this.$refs.fbForm.validate(valid => {
        if (valid) {
          this.setMercFriend();
        }
      });
    },
    // 上传表单数据
    setMercFriend() {
      this.selectOriginConfig();
      this.computeProfitDay();
      let uri = this.detail ? "mercFriend/update" : "mercFriend/add",
        data = {
          status: this.fbForm.status,
          enableDay: this.fbForm.enableDay,
          isRelation: this.fbForm.isRelation,
          newFansAmt: calculation.accMul(this.fbForm.newFansAmt, 100),
          testDay: this.fbForm.testDay,
          profitUnit: this.fbForm.profitUnit,
          profitDay: this.fbForm.profitUnit == -1 ? -1 : this.fbForm.profitDay,
          consumeType: this.fbForm.consumeType,
          consume: calculation.accMul(this.fbForm.consume, 100),
          rechargeType: this.fbForm.rechargeType,
          recharge: calculation.accMul(this.fbForm.recharge, 100),
          originConfig: this.fbForm.originConfig,
          profitType: this.fbForm.profitType
        };
      if (this.detail) data.id = this.detail.id;
      this.$store
        .dispatch("post", {
          uri,
          data
        })
        .then(res => {
          msg.success("设置成功！");
          this.detail = res.data.data;
        });
    },
    // 表单数字校验
    numberValidator(value, pos, min, max, callback, err) {
      return validate.amount(value, pos, min, max)
        ? callback()
        : callback(new Error(err));
    },
    selectOriginConfig(){
      let config = "";
      let flag;
      for(let i in this.origin){
        flag = true;
        for(let item in this.originList){
          if(this.originList[item] == this.origin[i]){
            config += "1";
            flag = false;
            break;
          }
        }
        if(flag){
          config += "0";
        }
      }
      this.fbForm.originConfig = config;
    },
    selectOriginList(){
      let arr = this.fbForm.originConfig ? this.fbForm.originConfig.split("") : [];
      for(let i in arr){
        if(arr[i] == 1){
          this.originList.push(this.origin[i]);
        }
      }
    },
    computeProfitUnitDay() {
      let profitUnitDay = 0;
      if (this.fbForm.profitUnit == 1) {
        profitUnitDay = Number(this.fbForm.profitDay).toFixed(0);
      } else if (this.fbForm.profitUnit == 2) {
        profitUnitDay = Number(this.fbForm.profitDay / 30).toFixed(0);
      } else if (this.fbForm.profitUnit == 3) {
        profitUnitDay = Number(this.fbForm.profitDay / 365).toFixed(0);
      }
      this.fbForm.profitUnitDay = profitUnitDay;
    },
    computeProfitDay() {
      let profitDay = 0;
      if (this.fbForm.profitUnit == 1) {
        profitDay = Number(this.fbForm.profitUnitDay).toFixed(0);
      } else if (this.fbForm.profitUnit == 2) {
        profitDay = Number(this.fbForm.profitUnitDay * 30).toFixed(0);
      } else if (this.fbForm.profitUnit == 3) {
        profitDay = Number(this.fbForm.profitUnitDay * 365).toFixed(0);
      }
      this.fbForm.profitDay = profitDay;
    }
  }
};
</script>
