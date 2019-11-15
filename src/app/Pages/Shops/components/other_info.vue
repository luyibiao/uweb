<template>
  <div class="info-group">
    <div class="info-group-title relase-bg">物流/其他</div>
    <div class="info-group-cont relase-bg">
      <el-form ref="otherForm"
               label-width="120px"
               :model="form">
        <el-form-item label="运费设置：" v-if="needSend == 1"
                      prop="carriage"
                      :rules="[
          { required: true, message: '请输入运费'},
          {validator:checkAmount, trigger: 'blur'}
        ]">
          <el-input v-model.number="form.carriage"
                    class="w-sm m-b-sm"
                    placeholder="运费"></el-input>
          <span class="m-l-sm">元</span>
          <p class="text-muted l-h text-xs">0代表免运费</p>
        </el-form-item>
        <el-form-item label="每人限购："
                      prop="buyNum"
                      :rules="[
          { required: true, message: '请输入限购数量'},
          {validator:checkNum, trigger: 'blur'}
        ]">
          <el-input v-model.number="form.buyNum"
                    class="w-sm m-b-sm"
                    placeholder="每人限购"></el-input>
          <p class="text-muted l-h text-xs">0代表不限购</p>
        </el-form-item>
        <el-form-item label="支付方式：">
          <div>
            <el-checkbox :true-label="1"
                         :false-label="0"
                         :checked="true"
                         :disabled="true">微信支付</el-checkbox>
          </div>
          <div v-for="item in payMethod">
            <el-checkbox v-model="item.enable"
                         :true-label="1"
                         :false-label="0">{{item.name}}</el-checkbox>
            <div class="dis-inline m-l-md">
              <span>不能使用余额支付的客户</span>
              <el-select v-model="item.userGroupId"
                         :disabled="!item.enable"
                         multiple
                         placeholder="选择分组客户">
                <el-option v-for="value in groupList"
                           :key="value.id"
                           :label="value.name"
                           :value="value.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="type == 2" label="发优惠券："
                      prop="couponId"
        >
          <!--:rules="[{validator:checkCoupon, trigger: 'blur'}]"-->
          <el-select v-model="form.couponId" :clearable="true" placeholder="请选择">
            <el-option
              v-for="item in couponList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="queryCouponList" type="text">刷新</el-button>
          <p class="text-muted l-h text-xs">优惠券过期、被删除、或库存为0时，系统不再送券</p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import calculation from "@/utils/helpers/calculation";
import validate from "@/utils/helpers/validate";
import BIZ_CST from '@/utils/bizconsts';
import time from '@/utils/helpers/timeLite';
export default {
  props: {
    type: 0,
    couponId: '',
    needSend: 0,
    // 限购数量
    buyNum: 0,
    // 运费
    carriage: 0,
    //支付配置
    paymentConfig: {
      default: "100",
      type: String
    },
    //支付限制列表
    payLimitList: {
      default: _ => [],
      type: Array
    }
  },
  data() {
    return {
      groupList: [],
      couponList:[],
      form: {
        buyNum: 0,
        carriage: 0,
        paymentCfg: "100",
        couponId: ''
      },
      payMethod: [
        {
          enable: 0,
          payMethod: 3,
          userGroupId: [],
          name: "余额支付"
        }
      ]
    };
  },
  watch: {
    carriage(n) {
      this.form.carriage = n;
    },
    buyNum(n) {
      this.form.buyNum = n;
    },
    couponId(n) {
      this.form.couponId = n;
    },
    paymentConfig(n) {
      n.split("").forEach((item, index) => {
        if (index >= 2) {
          this.payMethod[index - 2].enable = item == "1" ? 1 : 0;
        }
      });
    },
    payLimitList(n) {
      let obj = {};
      n.forEach(item => {
        obj[item.payMethod]
          ? obj[item.payMethod].push(item.groupId)
          : (obj[item.payMethod] = [item.groupId]);
      });
      this.payMethod.forEach(item => {
        item.userGroupId = obj[item.payMethod] || [];
      });
    }
  },
  created() {
    this.getClientGroup();
    this.queryCouponList();
  },
  methods: {
    // 获取客户分组
    getClientGroup() {
      this.$store
        .dispatch("get", {
          uri: "userGroup/list"
        })
        .then(res => {
          this.groupList = [{id:-1,name:"默认"}];
          for(let item in res.data.data.list){
            this.groupList.push(res.data.data.list[item])
          }
        });
    },
    queryCouponList(){
      this.$store.dispatch('post', {
        uri : 'couponInfo/list',
        data: {type: BIZ_CST.TOOL.COUPON_OBTAIN_RECEIVE, status: BIZ_CST.COMMON.ENABLE, timeEnd :time.getDate(new Date())}
      }).then((res) =>{
        this.couponList = res.data.data.list;
      })
    },
    // 检查金额
    checkAmount(rule, value, callback) {
      validate.amount(value, 2, 0, 999999, true)
        ? callback()
        : callback(new Error("金额格式错误"));
    },
    // 检查限购数量
    checkNum(rule, value, callback) {
      validate.amount(value, 0, 0, 999999, true)
        ? callback()
        : callback(new Error("请输入不小于0的整数"));
    },
    checkCoupon(rule, value, callback) {
      if (!validate.notEmpty(value.couponId)) {
        callback(new Error('请选择优惠券'));
      } else if (!validate.notEmpty(value.cnt)){
        callback(new Error('请输入优惠券数量'));
      } else if (!validate.number(value.cnt, 1, 20)) {
        callback(new Error('优惠券数量在1~20之间'));
      } else {
        let repeat = 0;
        let cpList = this.ruleForm.couponList;

        let citem = value;
        for (let i = 0; i < cpList.length; i ++) {
          let item = cpList[i];
          if (citem.couponId == item.couponId) {
            repeat++;
          }
        }

        if (repeat > 1) {
          callback(new Error('不能选择重复的优惠券'));
        } else {
          callback();
        }
      }
    },
    validate() {
      let flag = false;
      this.$refs.otherForm.validate(valid => {
        flag = valid;
      });
      return flag;
    },
    getData() {
      let paymentCfg = "10";
      let payLimit = [];
      this.payMethod.forEach(item => {
        paymentCfg += item.enable;
        if (item.enable && item.userGroupId.length) {
          payLimit.push({
            payMethod: item.payMethod,
            userGroupIds: item.userGroupId.join(",")
          });
        }
      });
      return {
        paymentCfg,
        payLimit: JSON.stringify(payLimit),
        carriage: calculation.accMul(this.form.carriage, 100), //运费
        buyNum: this.form.buyNum, //每人限购(0 代表不限购)
        couponList: this.form.couponId ?'[{"couponId":'+this.form.couponId+',"cnt":1}]':''
      };
    }
  }
};
</script>