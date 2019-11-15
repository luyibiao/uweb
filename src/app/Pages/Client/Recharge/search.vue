<template>
  <div>
    <el-row>
      <el-col :lg="12"
              :md="12">
        <el-form :model="ruleForm"
                 ref="ruleForm"
                 :inline="true"
                 onkeydown="if(event.keyCode==13)return false;">
          <el-form-item label="手机号"
                        prop="wkPhone"
                        :rules="[
						{ required: true, message: '请填写手机号'},
						{ min: 11, max: 11, message: '请输入手机号格式错误', trigger: 'blur'},
            { validator: checkPhone, message: '请输入正确的手机号', trigger: 'blur' }
					]">
            <div class="dis-inline w-lg">
              <el-input v-model="ruleForm.wkPhone"
                        placeholder="请输入手机号"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <auth perm="client.recharge.read">
              <el-button type="primary"
                       @click="submitForm('ruleForm')"
                       :loading="findbtnstatu">查询</el-button>
            </auth>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;"
            v-if="visible===1">
      <el-col :lg="8"
              :md="8">
        <div>
          <div class="clearfix">
            <span class="pull-left"><img class="thumb"
                   :src="'/static/img/user/def.png'"
                   alt="" /></span>
            <span class="pull-left"
                  style="margin-left:20px;">
              <router-link class="text-primary"
                           :to="'/client/list/'+rechargeUser.id+'/basic'"
                           target="_blank">
                {{rechargeUser.name}}
              </router-link>
              <p>
                <router-link class="text-primary"
                             :to="'/client/list/'+rechargeUser.id+'/basic'"
                             target="_blank">{{rechargeUser.phone}}</router-link>
              </P>
            </span>
          </div>
          <p style="margin-top:30px;">余额：
            <font class="text-danger">￥{{rechargeUser.balance| amtFormat}}</font>
          </p>
          <p style="margin-top:30px">会员等级:
            <font class="text-success">{{rechargeUser.grade}}</font>
          </p>
        </div>
      </el-col>
      <el-col :lg="12"
              :md="12"
              :offset="2">
        <div>
          <div class="recharge">
            <div class="clearfix">
              <div class="pull-left w-lg">
                <p class="m-t text-muted">充值方式</p>
                <div class="m-t">
                  <el-radio-group v-model="way">
                    <el-radio-button :label="1">活动方案充值</el-radio-button>
                    <el-radio-button :label="0">零散现金充值</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="m-t"
                     v-if="!way">
                  <p class="text-muted">零散现金充值（元）</p>
                  <div class="w m-t-sm">
                    <el-input type="number"
                              :min="-50000"
                              :max="50000"
                              v-model="money"
                              placeholder="请输入充值金额"></el-input>
                  </div>
                </div>
                <div class="m-t"
                     v-else>
                  <div v-if="activeList.length>0">
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
              </div>
            </div>
            <div class="m-t-lg">
              <el-button @click="visible=0">取 消</el-button>
              <el-button type="primary"
                         @click="submit"
                         :loading="btnstatu">确 定</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--弹出框-->
  </div>
</template>
<script>
import msg from "@/utils/msg";
import consts from "@/utils/consts";
import base from "@/utils/helpers/base";
import recharge from "@/components/Recharge/index";
import auth from "@/utils/auth";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";
export default {
  props: {
    phone: {
      //客户电话
      type: String
    }
  },

  data: function() {
    return {
      addphone: this.$route.query.n,
      visible: 0,
      btnstatu: false,
      findbtnstatu: false,
      ruleForm: {
        wkPhone: ""
      },
      rechargeUser: {
        name: "",
        phone: "",
        id: "",
        balance: "",
        grade: ""
      }, //待充值客户信息
      way: 1, //充值方式 1：活动 0：现金
      wayValue: 0, //活动方案充值金额
      money: 0, //现金方案金额
      activeList: [], //活动方案充值列表,
      remark: "" //备注
    };
  },
  created() {
    this.getActiveList();
    if (this.addphone != null) {
      this.getAddrechargedata();
      this.ruleForm.wkPhone = this.addphone;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.findbtnstatu = true;
          this.$store
            .dispatch("post", {
              uri: "userInfo/queryByKey",
              data: {
                key: this.ruleForm.wkPhone
              }
            })
            .then(res => {
              if (res.data.data == null) {
                this.$router.push({
                  path: "/client/recharge/add/" + this.ruleForm.wkPhone
                });
              } else {
                this.findbtnstatu = false;
                this.visible = 1;
                this.rechargeUser.name = res.data.data.user.name;
                this.rechargeUser.phone = res.data.data.user.phone;
                (this.rechargeUser.balance = res.data.data.user.balance),
                  (this.rechargeUser.grade = res.data.data.user.cardName),
                  (this.rechargeUser.id = res.data.data.user.id);
              }
            });
        }
      });
    },
    checkPhone(rule, value, callback) {
      if (!validate.tel(value)) {
        callback(new Error());
      } else {
        callback();
      }
    },
    getrechargedata() {
      this.$store
        .dispatch("post", {
          uri: "userInfo/queryByKey",
          data: {
            key: this.ruleForm.wkPhone
          }
        })
        .then(res => {
          this.visible = 1;
          this.rechargeUser.name = res.data.data.user.name;
          this.rechargeUser.phone = res.data.data.user.phone;
          (this.rechargeUser.balance = res.data.data.user.balance),
            (this.rechargeUser.grade = res.data.data.user.cardName),
            (this.rechargeUser.id = res.data.data.user.id);
        });
    },
    getAddrechargedata() {
      this.$store
        .dispatch("post", {
          uri: "userInfo/queryByKey",
          data: {
            key: this.addphone
          }
        })
        .then(res => {
          if (res.data.data == null) {
            this.$router.push({
              path: "/client/recharge/add/" + this.ruleForm.wkPhone
            });
          } else {
            this.visible = 1;
            this.rechargeUser.name = res.data.data.user.name;
            this.rechargeUser.phone = res.data.data.user.phone;
            (this.rechargeUser.balance = res.data.data.user.balance),
              (this.rechargeUser.grade = res.data.data.user.cardName),
              (this.rechargeUser.id = res.data.data.user.id);
          }
        });
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
        this.btnstatu = true;
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
          uri: "userRecharge/confirmRecharge",
          data: {
            userId: this.rechargeUser.id,
            amount: amount,
            withActive: this.way,
            remark: this.remark
          }
        })
        .then(res => {
          fn && fn();
          this.ruleForm.wkPhone = "";
          this.visible = 0;
          this.btnstatu = false;
          (this.wayValue = ""), (this.money = "");
        });
    }
  }
};
</script>
