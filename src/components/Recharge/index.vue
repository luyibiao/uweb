// 充值弹窗
<template>
  <div class="recharge">
    <p class="text-muted">充值客户</p>
    <p class="m-t text-md">
      <span>{{phone}}</span>
      <span v-if="name">({{name}})</span>
    </p>
    <div class="clearfix">
      <div class="pull-left w-lg">
        <p class="m-t text-muted">充值方式</p>
        <div class="m-t">
          <el-radio-group v-model="way">
            <el-radio-button :label="1" v-if="type !== 2">活动方案充值</el-radio-button>
            <el-radio-button :label="0">零散充值</el-radio-button>
          </el-radio-group>
        </div>
        <div class="m-t"
             v-if="!way">
          <p class="text-muted">零散现金充值（元）</p>
          <div class="m-t">
            <el-radio-group v-model="amountType">
           <!--   <el-radio-button :label="0">现金充值</el-radio-button>
              <el-radio-button :label="1" >赠送金额</el-radio-button>-->
              <el-radio  :label="0">实付金额</el-radio>
              <el-radio :label="1">赠送金额</el-radio>
            </el-radio-group>
          </div>
          <div class="w m-t-sm">
            <el-input type="number"
                      :min="-50000"
                      :max="50000"
                      v-model="money"
                      placeholder="请输入充值金额">
              <template slot="append">元</template>

            </el-input>
          </div>
        </div>
        <div class="m-t"
             v-else>
          <div v-if="activeList.length > 0">
            <p class="text-muted">请选择活动充值方案</p>
            <el-radio-group v-model="wayValue">
              <p class="m-t-sm"
                 v-for="(item,index) in activeList"
                 :key="index">
                <el-radio :label="item.amount">{{item.name}}</el-radio>
              </p>
            </el-radio-group>
          </div>
          <p v-else>暂无活动方案！</p>
        </div>
      </div>
      <div class="pull-left w-md">
        <p class="m-t text-muted">备注</p>
        <el-input class="m-t"
                  placeholder="请输入备注"
                  type="textarea"
                  v-model.trim="remark"></el-input>
        <div class="m-t" v-if="type !== 2">
          <el-checkbox v-model="toNotice">发送消息通知</el-checkbox>
        </div>
      </div>
    </div>
    <div class="m-t-lg">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary"
                 @click="submit">确 定</el-button>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import calculation from "@/utils/helpers/calculation";
export default {
  props: {
    phone: {
      //客户电话
      type: String
    },
    name: {
      //客户姓名
      type: String,
      default: null
    },
    id: {
      //客户id
      type: Number
    },
    type:{  //充值类型 1余额、2通付卡余额
      type: Number
    }
  },
  data() {
    return {
      way: 1, //充值方式 1：活动 0：现金
      wayValue: 0, //活动方案充值金额
      money: 0, //现金方案金额
      activeList: [], //活动方案充值列表,
      remark: "", //备注
      toNotice: true,
      amountType: 0 // 1.赠送金额 0.实充金额
    };
  },
  created() {
    this.initParams();
  },
  watch:{
    'type'(){
      this.initParams()
    }
  },
  methods: {
    initParams(){
      this.activeList.length = 0;
      if(this.type === 1) {
        this.way = 1
        this.getActiveList();
      }else{
        this.way = 0
      }
    },
    getActiveList() {
      //获取活动方案充值列表
      this.$store
        .dispatch("get", {
          uri: "userRechargeRule/queryRechargeList"
        })
        .then(res => {
          this.activeList = res.data.data;
        });
    },
    submit() {
      //提交充值
      let amount = this.way
        ? this.wayValue
        : calculation.accMul(this.money, 100);
      if (amount == 0) {
        msg.error(this.way ? "请选择充值方案！" : "请输入充值金额", 1500);
      } else if (amount >= -5000000 && amount <= 5000000) {
        this.recharge(amount, _ => {
          this.$emit("success"); //触发成功事件
          msg.success("充值成功！", 1500);
        });
      } else {
        msg.error("金额应在 -5000000 ~ 5000000 元之间！", 1500);
      }
    },
    recharge(amount, fn) {
      //充值
      this.$store
        .dispatch("post", {
          uri: this.type && this.type === 2 ? "tradeUserOther/confirmRecharge" : "userRecharge/confirmRecharge",
          data: {
            userId: this.id,
            amount: amount,
            withActive: this.way,
            remark: this.remark,
            amountType: this.way == 0 ? this.amountType : undefined,
            toNotice: this.toNotice
          }
        })
        .then(res => {
          fn && fn();
        });
    }
  }
};
</script>

/**  
 参数:
  props : [phone,name,id]  客户名|String，手机号| Number，id | Number
 事件：
  events:[cancel,success]  取消事件 , 修改成功回调
**/