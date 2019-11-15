<style scoped>
.membership-container {
  position: relative;
}
.membership-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 505px;
}
.membership-sidebar .img {
  width: 350px;
  height: auto;
}
.membership-sidebar .content2 {
  position: absolute;
  top: 190px;
  left: 1px;
  right: 1px;
  height: 314px;
}
.membership-sidebar .content2 .text-box {
  padding-bottom: 10px;
  background: #f66400;
  background: linear-gradient(#f66400, #f7882a);
}
.b-box {
  height: 20px;
  background: linear-gradient(rgba(255, 255, 255, 0) 50%, #f9f9f9 0) 0 0,
    radial-gradient(circle closest-corner, #f9f9f9 50%, #f7882a 0) 0 0;
  background-size: 20px 20px;
  background-repeat: repeat-x;
}
.b-text {
  background: #f9f9f9;
  padding: 0 15px 6px 15px;
}
.membership-sidebar .card {
  background: #60be4e;
  padding: 20px;
  border-radius: 8px;
  margin: 0 20px;
}
.membership-content {
  margin-left: 440px;
}
.text {
  margin: 0 80px;
  height: 50px;
  line-height: 25px;
}
.tip {
  padding: 10px 0;
}
.input-new-tag {
  width: 80px;
}
.text-vlg {
  font-size: 28px;
}
.headdiv {
  position: relative;
  height: 73px;
}
.text-white-transp-card {
  position: absolute;
  left: 40px;
}
.text-white-transp-money {
  position: absolute;
  left: 55px;
  top: 40px;
}
.text-white-transp-effective {
  position: absolute;
  right: 35px;
  font-size: 10px;
}
.effectiveNum {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
}
.effectiveNum span {
  font-size: 20px;
}
.fotter {
  position: absolute;
  bottom: 30px;
  width: 100%;
}
.fotter p {
  text-align: center;
  color: white;
  font-size: 12px;
}
.fotter p:first-child span {
  font-size: 40px;
}
</style>
<template>
  <div>
    <div class="membership-container clearfix">
      <div class="membership-sidebar">
        <img class="img b-a"
             src="/static/img/marketing/bg_gift_2x.png"
             alt="">
        <div class="content2">
          <div class="text-white">
            <div class="headdiv">
              <p class="wrapper text-white-transp-card">{{ ruleForm.couponName || '优惠券'}}</p>
              <p class="text-white-transp-money">
                <span style="font-size:20px;">{{ruleForm.amount || 0}}</span>
                <span>元</span>
              </p>
              <p class="text-white-transp-effective wrapper"
                 v-show="ruleForm.dateType == 1">{{ruleForm.timeStart || '-'}} 至 {{ruleForm.timeEnd || '-'}} 有效</p>
              <p class="text-white-transp-effective wrapper"
                 v-show="ruleForm.dateType == 2">领取后{{ruleForm.term}}天内有效</p>
            </div>
            <p class="effectiveNum">该礼包内有
              <span>{{ruleForm.couponCnt|| 0}}</span>张优惠券</p>
          </div>
          <div class="fotter">
            <p>
              <span>{{ruleForm.amount * ruleForm.couponCnt || 0}}</span>元</p>
            <p>礼包总额</p>
          </div>
        </div>
      </div>
      <div class="membership-content">
        <el-form :model="ruleForm"
                 ref="ruleForm"
                 label-width="300px">
          <el-form-item label="优惠券礼包名称"
                        prop="name"
                        :rules="[
              { required: true, message: '请输优惠券礼包名称', trigger: 'blur' },
              { min: 2, max: 30, message: '长度在2到30个长度', trigger: 'blur' }
            ]">
            <div class="w-lg">
              <el-input v-model="ruleForm.name"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="优惠券名称"
                        prop="couponName"
                        :rules="[
					  { required: true, message: '请输优惠券名称', trigger: 'blur' },
						{ min: 2, max: 30, message: '长度在2到30个长度', trigger: 'blur' }
					]">
            <div class="w-lg">
              <el-input v-model="ruleForm.couponName"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="每张优惠券面额"
                        required>
            <div class="dis-inline">
              <div class="w-lg m-r-sm dis-inline">
                <el-form-item prop="amount"
                              :rules="[
								     { required: true, message: '请输入券面值', trigger: 'blur' },
								     {validator: checkAmount, min:1, max:99999, message: '面值1至99999之间,保留2位小数', trigger: 'blur'}
								]">
                  <el-input v-model="ruleForm.amount"
                            type="number"></el-input>
                </el-form-item>
              </div>元
            </div>
          </el-form-item>

          <el-form-item label="使用限制"
                        prop="fullAmount"
                        :rules="[
				    { required: true, message: '请填写使用限制金额', trigger: 'blur' },
				    {validator: checkAmount, min:0, max:99999, message: '金额有效数0至99999之间的正数', trigger: 'blur'}
				  ]">
            <div>
              <el-checkbox label="不限制"
                           v-model="eventForm.fullAmountCheckbox1"
                           @change="fullAmountCheckbox1"></el-checkbox>
            </div>
            <div class="m-t-sm">
              <el-checkbox v-model="eventForm.fullAmountCheckbox2"
                           @change="fullAmountCheckbox2">
                <span>满
                  <span class="w-sm dis-inline m-l-sm m-r-sm">
                    <el-input type="number"
                              v-model="ruleForm.fullAmount"
                              :disabled="eventForm.fullAmountDisabled"></el-input>
                  </span>元可用
                </span>
              </el-checkbox>
            </div>
          </el-form-item>

          <el-form-item label="日期类型"
                        prop="dateType"
                        :rules="[
					  { required: true, message: '请选择日期类型', trigger: 'change' }
					]">
            <el-radio-group v-model="ruleForm.dateType">
              <el-radio-button label="1">固定时间</el-radio-button>
              <el-radio-button label="2">领取后有效期</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="ruleForm.dateType==1"
                        label="有效日期"
                        prop="timeStart"
                        :rules="[
				    { required: true, message: '请选择有效日期', trigger: 'change' },
				  ]">
            <el-date-picker v-model="timeStartObj"
                            type="daterange"
                            placeholder="选择有效日期"
                            @change="changeTimeStart"
                            :picker-options="pickerOptions0">
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="ruleForm.dateType==2"
                        label="有效天数"
                        prop="term"
                        :rules="[
							{ required: true, message: '请输入有效天数', trigger: 'blur' },
						{ validator: checkNumber, min: 1, max: 1000, message: '有效天数1至1000天', trigger: 'blur' }
					]">
            <div>
              <span class="dis-inline m-r-sm">
                <el-input type="number"
                          v-model="ruleForm.term"
                          placeholder="领取后n天内有效"></el-input>
              </span>天
            </div>
          </el-form-item>

          <el-form-item label="礼包内的优惠券数量"
                        prop="couponCnt"
                        :rules="[
				    {required: true, message: '请输入有效数量', trigger: 'blur'},
            {validator: checkNumber, min:1, max:10, message: '优惠券数量为1至10张', trigger: 'blur'},
				  ]">
            <div class="w-lg m-r-sm dis-inline">
              <el-input v-model="ruleForm.couponCnt"
                        type="number"></el-input>
            </div>张
          </el-form-item>

          <el-form-item label="制作多少个这样的礼包"
                        prop="cnt"
                        :rules="[
				    { validator: checkNumber,required: true, message: '请输入有效数量', trigger: 'blur' },
				    {validator: checkNumber, min:1, max:10000, message: '最多只能有10000个礼包', trigger: 'blur'},
				  ]">
            <div class="w-lg m-r-sm dis-inline">
              <el-input v-model="ruleForm.cnt"
                        type="number"></el-input>
            </div>个
          </el-form-item>

          <el-form-item label="会员卡等级"
                        prop="level"
                        :rules="[
					   { required: true, message: '请选择使用限制' },
					  {validator: checkSelect, message: '请选择等级', trigger: 'change'}]">
            <el-select v-model="ruleForm.level"
                       placeholder="会员卡等级">
              <el-option :label="item.text"
                         :value="item.level"
                         :key="item.level"
                         v-for="item in levelList"></el-option>
            </el-select>
            <!--<p class="text-muted">当会员满足条件时会自动发放上一等级对应的会员卡</p>-->
          </el-form-item>

          <el-form-item label="使用规则"
                        prop="couponRuleId"
                        :rules="[
				    { required: true, message: '请选择使用规则' },
				    { message: '请选择使用规则', trigger: 'blur'}]">
            <couponUseRule :callback="onCouponUseRuleCallback"></couponUseRule>
            <!--<p class="text-muted">当会员满足条件时会自动发放上一等级对应的会员卡</p>-->
            <el-input style="display: none"
                      v-model="ruleForm.couponRuleId"></el-input>
          </el-form-item>

          <el-form-item label="提醒设置"
                        prop="remindDay"
                        :rules="[
				    { required: eventForm.remindDateCheckbox2, message: '请选择提醒天数' },
				    { message: '请选择提醒天数', trigger: 'change'}]">
            <div>
              <el-checkbox label="不提醒"
                           v-model="eventForm.remindDateCheckbox1"
                           @change="remindDateCheckbox1"></el-checkbox>
            </div>
            <div class="m-t-sm">
              <el-checkbox v-model="eventForm.remindDateCheckbox2"
                           @change="remindDateCheckbox2">
                <span>到期前
                  <span class="w-sm dis-inline m-l-sm m-r-sm">
                    <el-select v-model="ruleForm.remindDay"
                               :disabled="eventForm.remindDateDisabled"
                               placeholder="请选择">
                      <el-option :label="item.name"
                                 :value="item.level"
                                 :key="item.level"
                                 v-for="item in remindDateList"></el-option>
                    </el-select>
                  </span>天提醒一次
                </span>
              </el-checkbox>
            </div>
          </el-form-item>

          <el-form-item label="其他设置"
                        prop="useBalance">
            <div>
              <el-checkbox label="优惠券与余额不能同时使用"
                           v-model="eventForm.useBalance"></el-checkbox>
            </div>
          </el-form-item>

          <el-form-item label="使用说明"
                        prop="detail"
                        :rules="[
					  { required: false, max: 200, message: '内容长度在200个字内容', trigger: 'blur' }
					]">
            <div class="w-lg">
              <el-input type="textarea"
                        v-model="ruleForm.detail"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        placeholder="填写活动的详细说明，支持换行。"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="备注"
                        prop="remark"
                        :rules="[
								{ required: false, max: 200, message: '内容长度在200个字内容', trigger: 'blur' }
							]">
            <div class="w-lg">
              <el-input type="textarea"
                        v-model="ruleForm.remark"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        placeholder="备注，支持换行。"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <auth perm="marketing.couponGift.update">
              <el-button type="primary"
                       :loading="saveBtnLoading"
                       @click="submitForm('ruleForm')">{{saveBtnLoadingText}}</el-button>
            </auth>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
import helpers from "@/utils/helpers/base";
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
import time from "@/utils/helpers/timeLite";
import calculation from "@/utils/helpers/calculation";
import couponUseRule from "@/components/Coupon/use_rule";

export default {
  components: { couponUseRule },
  data: function() {
    return {
      ruleForm: {
        /* type: 1,	//COUPON_TYPE*/
        name:'',
        couponName: "", //名称
        amount: "", //非随机-面值 （单位分）
        cnt: "", //发放包总量
        couponCnt: "", //发放优惠券总量
        fullAmount: "0", //满xx元可用
        dateType: "1", //日期类型 1.固定日期 2.激活后有效天数
        term: "", //领取后n天内有效
        timeStart: "", //生效日期
        timeEnd: "", //过期日期
        level: "", //关联的可以领取的会员等级
        detail: "", //使用说明
        remark: "", //备注
        couponRuleId: "", //优惠券使用限制关联表id
        share: 1, //是否可用分享
        isShared: 0, //是否分享过
        remindDay: "", //提醒日期
        useBalance: "" //是否可用于金额同用
      },
      eventForm: {
        randomCheckbox: false,
        fullAmountCheckbox1: true,
        fullAmountCheckbox2: false,
        fullAmountDisabled: true,
        remindDateCheckbox1: true,
        remindDateCheckbox2: false,
        remindDateDisabled: true,
        useBalance: false
      },
      pickerOptions0: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const date = new Date();
              picker.$emit("pick", [date, date]);
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", [date, date]);
            }
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30 * 3);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      levelList: [],
      timeStartObj: [],
      remindDateList: [
        { level: "1" },
        { level: "2" },
        { level: "3" },
        { level: "4" },
        { level: "5" },
        { level: "6" },
        { level: "7" },
        { level: "8" },
        { level: "9" },
        { level: "10" }
      ], //提醒日期
      /*timeEndObj:{},*/
      saveBtnLoading: false,
      saveBtnLoadingText: "保存"
    };
  },
  created() {
    this.queryLevelList();
  },
  methods: {
    //等级
    queryLevelList() {
      let list = [];
      this.$store
        .dispatch("post", {
          uri: "userLevel/list"
        })
        .then(res => {
          let levelList = res.data.data.list;
          let tmpLevelList = [];
          levelList.forEach(function(item) {
            item.text = item.name + "（" + item.level + "级）";
            tmpLevelList.push(item);
          });
          tmpLevelList.unshift({ text: "所有等级", level: -1 });
          this.levelList = tmpLevelList;
        });
    },
    //日期
    changeTimeStart(item) {
      if (item) {
        this.ruleForm.timeStart = time.getDate(item[0]);
        this.ruleForm.timeEnd = time.getDate(item[1]);
      } else {
        this.ruleForm.timeStart = "";
        this.ruleForm.timeEnd = "";
      }
    },

    checkSelect(rule, value, callback) {
      if (!validate.notEmpty(value)) {
        callback(new Error());
      } else {
        callback();
      }
    },

    fullAmountCheckbox1() {
      if (this.eventForm.fullAmountCheckbox1) {
        this.eventForm.fullAmountCheckbox2 = false;
        this.ruleForm.fullAmount = "0";
        this.eventForm.fullAmountDisabled = true;
      } else {
        this.eventForm.fullAmountCheckbox1 = true;
      }
    },
    fullAmountCheckbox2() {
      if (this.eventForm.fullAmountCheckbox2) {
        this.eventForm.fullAmountCheckbox1 = false;
        this.ruleForm.fullAmount = "";
        this.eventForm.fullAmountDisabled = false;
      } else {
        this.eventForm.fullAmountCheckbox2 = true;
      }
    },
    remindDateCheckbox1() {
      if (this.eventForm.remindDateCheckbox1) {
        this.eventForm.remindDateCheckbox2 = false;
        this.ruleForm.remindDate = "";
        this.eventForm.remindDateDisabled = true;
      } else {
        this.eventForm.remindDateCheckbox1 = true;
      }
    },
    remindDateCheckbox2() {
      if (this.eventForm.remindDateCheckbox2) {
        this.eventForm.remindDateCheckbox1 = false;
        this.ruleForm.remindDate = "";
        this.eventForm.remindDateDisabled = false;
      } else {
        this.eventForm.remindDateCheckbox2 = true;
      }
    },

    checkNumber(rule, value, callback) {
      if (
        !validate.number(value, rule.min, rule.max, rule.ignoreEmpty) ||
        value < 0
      ) {
        callback(new Error());
      } else {
        callback();
      }
    },
    checkAmount(rule, value, callback) {
      if (
        !validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)
      ) {
        callback(new Error());
      } else {
        callback();
      }
    },

    onCouponUseRuleCallback(data) {
      this.$store
        .dispatch("post", {
          uri: "couponRule/temp/add",
          data: data
        })
        .then(res => {
          this.ruleForm.couponRuleId = res.data.data.id + "";
        });
    },
    submitForm(formName) {
      this.saveBtnLoading = false;
      this.saveBtnLoadingText = "保存";
      /*this.ruleForm.tagNames = helpers.arrayToJson(this.eventForm.saveTagList)*/
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveBtnLoading = true;
          this.saveBtnLoadingText = "保存中...";
          let ruleForm = { ...this.ruleForm };
          ruleForm.amount = calculation.accMul(ruleForm.amount, 100);
          if (!this.eventForm.fullAmountDisabled) {
            ruleForm.fullAmount = calculation.accMul(ruleForm.fullAmount, 100);
          }
          ruleForm.useBalance = this.eventForm.useBalance ? 0 : 1;
          ruleForm.remindDay = ruleForm.remindDay ? ruleForm.remindDay : "-1";

          this.$store
            .dispatch("post", {
              uri: "giftPackageInfo/addGiftBag",
              data: ruleForm,
              forceResolve: true
            })
            .then(res => {
              if (res.data.httpCode == 200) {
                msg.success();
                this.$router.push({ path: "/marketing/couponGift/list" });
              } else {
                msg.error(res.data.msg);
                this.saveBtnLoading = false;
                this.saveBtnLoadingText = "保存";
              }
            });
        }
      });
    }
  }
};
</script>
