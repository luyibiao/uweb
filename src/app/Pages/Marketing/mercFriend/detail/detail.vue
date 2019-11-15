<template>
  <div>
    <el-row class="b-a">
      <el-col :span="6">
        <div class="text-center b-r m-t-sm m-b-sm padder-v">
          <p class="text-lg m-b-xs">{{detail.fansCnt || 0}}</p>
          <p>客户数</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="text-center b-r m-t-sm m-b-sm padder-v">
          <p class="text-lg m-b-xs">{{detail.fansOrderCnt || 0}}</p>
          <p>成交订单笔数</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="text-center b-r m-t-sm m-b-sm padder-v">
          <p class="text-lg m-b-xs">{{detail.fansOrderAmount || 0 | amtFormat}}</p>
          <p>成交金额（元）</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="text-center m-t-sm m-b-sm padder-v">
          <p class="text-lg m-b-xs text-danger">{{detail.profitTotal || 0 | amtFormat}}</p>
          <p>获分润（元）</p>
        </div>
      </el-col>
    </el-row>
    <div class="m-t-md title text-md text-black">友商信息</div>
		<table class="ukao-table w-full">
      <tbody>
        <tr>
					<td width="30%">头像</td>
					<td><img class="thumb-md" :src=" '/static/img/work/def.png'" alt="">	</td>
					<td width="20%"></td>
				</tr>
        <tr>
					<td>昵称</td>
					<td colspan="2">{{detail.name}}</td>
				</tr>
        <tr>
					<td>手机号</td>
					<td>{{detail.phone}}</td>
					<td>
            <auth perm="marketing.friend.update">
              <el-button @click="openDialog('telForm')">修改</el-button>
            </auth>
          </td>
				</tr>
        <tr>
					<td>加粉佣金</td>
					<td>
            <p>考验期数：{{detail.testDay}}天</p>
            <p>单粉佣金：{{detail.newFansAmt | amtFormat}}元/粉丝</p>
          </td>
					<td>
            <auth perm="marketing.friend.update">
              <el-button @click="openDialog('fansForm')">修改</el-button>
            </auth>
          </td>
				</tr>
        <tr>
					<td>粉丝分润</td>
					<td>
            <p>分润期数：{{computeProfitUnitDay(detail.profitUnit, detail.profitDay)}}{{detail.profitUnit | getValText('PROFIT_UNIT')}}</p>
            <p v-if="detail.consumeType == 1">消费提成：{{detail.consume / 100}}%</p>
            <p v-else>消费提成：{{detail.consume | amtFormat}}元</p>
            <p v-if="detail.rechargeType == 1">充值提成：{{detail.recharge / 100}}%</p>
            <p v-else>充值提成：{{detail.recharge | amtFormat}}元</p>
          </td>
					<td>
            <auth perm="marketing.friend.update">
              <el-button @click="openDialog('profitForm')">修改</el-button>
            </auth>
          </td>
				</tr>
        <tr>
					<td>加入时间</td>
					<td colspan="2">{{detail.createTime| getDate}}&nbsp;{{detail.createTime | getTime}}</td>
				</tr>
        <tr>
          <td>
            <p>推广二维码</p>
            <p>{{detail.spreadCode}}</p>
          </td>
          <td>
            <div class="qr">
              <qrcode id="qrcode" tag="img" v-if="codeUrl" class="qrcode" :value="codeUrl"  :options="{ size: 1080}"></qrcode>
            </div>
					</td>
          <td>
            <el-button v-if="!codeUrl" :loading="spreadCode.loading" @click="getQRUrl">获取</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <el-dialog class="ukao-dialog" :title="dialog.title[dialog.name]" :visible.sync="dialog.show">
      <el-form v-if="dialog.name == 'telForm'" label-width="180px" :model="dialog.telForm" ref="telForm">
        <el-form-item label="手机号" prop="phone" :rules="rules.tel">
          <el-input v-model="dialog.telForm.phone" class="w-xl"></el-input>
        </el-form-item>
      </el-form>

      <el-form  v-if="dialog.name == 'fansForm'" label-width="180px" :model="dialog.fansForm" ref="fansForm">
        <el-form-item label="考验期数" prop="testDay" :rules="rules.testDay">
          <el-input v-model="dialog.fansForm.testDay"  class="w-xs"></el-input><span class="m-l-xs">天</span>
        </el-form-item>
        <el-form-item label="单粉佣金" prop="newFansAmt" :rules="rules.newFansAmt">
          <el-input v-model="dialog.fansForm.newFansAmt" class="w-xs"></el-input><span class="m-l-xs">元/人</span>
        </el-form-item>
      </el-form>

      <el-form v-if="dialog.name == 'profitForm'" label-width="180px" :model="dialog.profitForm" ref="profitForm">
        <el-form-item label="分润期数" prop="profitUnitDay" :rules="[{required: true, message: '分润期数不能为空'},rules.profitDay[0]]">
          <el-radio-group v-model="dialog.profitForm.profitUnit">
            <el-radio :label=1 >天</el-radio><el-radio :label=2 >月</el-radio><el-radio :label=3 >年</el-radio>
          </el-radio-group>
          <div>
            分润期数
            <el-input class="w-xs" style="height: 35px" v-model="dialog.profitForm.profitUnitDay" :maxLength="4"></el-input>
            <span class="m-l-xs">{{dialog.profitForm.profitUnit | getValText('PROFIT_UNIT')}}</span>
          </div>
        </el-form-item>
        <el-form-item label="消费分润提成类型" class="m-b">
          <el-radio-group v-model="dialog.profitForm.consumeType">
            <el-radio :label="1">比例(%)</el-radio>
            <el-radio :label="2">固定金额(元)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="consume" :rules="rules.consume" label="消费分润提成" class="m-b">
          <el-input class="w-xs" v-model="dialog.profitForm.consume"></el-input>
          <span class="m-l-xs">{{dialog.profitForm.consumeType == 1 ? '%':'元'}}</span>
        </el-form-item>
        <el-form-item label="充值分润提成类型" class="m-b">
        <el-radio-group v-model="dialog.profitForm.rechargeType">
            <el-radio :label="1">比例(%)</el-radio>
            <el-radio :label="2">固定金额(元)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="recharge" :rules="rules.recharge" label="充值分润提成" class="m-b">
          <el-input class="w-xs" v-model="dialog.profitForm.recharge"></el-input>
          <span class="m-l-xs">{{dialog.profitForm.rechargeType == 1 ? '%':'元'}}</span>
        </el-form-item>
      </el-form>
      <div style="padding-left: 180px;">
        <el-button @click="dialog.show = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Qrcode from "@xkeshi/vue-qrcode";
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";

export default {
  // 友商信息详情
  props: {
    detail: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      // 弹窗
      dialog: {
        show: false,
        // 当前弹窗name
        name: "telForm",
        // 标题
        title: {
          telForm: "修改手机号",
          fansForm: "修改加粉佣金",
          profitForm: "修改粉丝分润"
        },
        // 手机号表单
        telForm: {
          phone: ""
        },
        // 粉丝佣金表单
        fansForm: {
          testDay: "",
          newFansAmt: ""
        },
        // 分润表单
        profitForm: {
          profitUnit: '',
          profitUnitDay: '',
          profitDay: "",
          consumeType: 1,
          consume: "",
          rechargeType: 1,
          recharge: ""
        }
      },
      // 表单验证规则
      rules: {
        tel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (validate.tel(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的手机号"));
              }
            },
            trigger: "blur"
          }
        ],
        testDay: [
          { required: true, message: "请输入考验期数" },
          {
            validator: (rule, value, callback) => {
              if (validate.amount(value, 0, 0, 3650)) {
                callback();
              } else {
                callback(new Error("考验期数应是0-3650的整数"));
              }
            },
            trigger: "blur"
          }
        ],
        newFansAmt: [
          { required: true, message: "请输入佣金" },
          {
            validator: (rule, value, callback) => {
              if (validate.amount(value, 2, 0, 1000)) {
                callback();
              } else {
                callback(new Error("佣金应在0-1000之间，最多保留2位小数"));
              }
            },
            trigger: "blur"
          }
        ],
        profitDay: [
          {
            validator: (rule, value, callback) => {
              if (this.dialog.profitForm.profitDay) {
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
                this.dialog.profitForm.consumeType == 1
                  ? "请输入0-100的数字，最多保留2位小数"
                  : "请输入0-99999的数字，最多保留2位小数";
              let max = this.dialog.profitForm.consumeType == 1 ? 100 : 99999;
              if (validate.amount(value, 2, 0, max)) {
                callback();
              } else {
                callback(new Error(err));
              }
            },
            trigger: "blur"
          }
        ],
        recharge: [
          { required: true, message: "请输入充值分润提成" },
          {
            validator: (rule, value, callback) => {
              let err =
                this.dialog.profitForm.consumeType == 1
                  ? "请输入0-100的数字，最多保留2位小数"
                  : "请输入0-99999的数字，最多保留2位小数";
              let max = this.dialog.profitForm.consumeType == 1 ? 100 : 99999;
              if (validate.amount(value, 2, 0, max)) {
                callback();
              } else {
                callback(new Error(err));
              }
            },
            trigger: "blur"
          }
        ]
      },
      spreadCode: {
        url: "",
        loading: false
      }
    };
  },
  methods: {
    // 更新详情
    updateDetail(data, fn) {
      this.$store
        .dispatch("post", {
          uri: "friendInfo/update",
          data: {
            id: this.detail.id,
            ...data
          }
        })
        .then(res => {
          fn && fn(res);
        });
    },
    // 打开弹窗
    openDialog(name) {
      this.dialog.name = name;
      this.dialog.show = true;
      Object.keys(this.dialog[name]).forEach(item => {
        this.dialog[name][item] = /^(consume|recharge|newFansAmt)$/.test(item)
          ? calculation.accDiv(this.detail[item], 100)
          : this.detail[item];
      });
      this.dialog.profitForm.profitUnitDay = this.computeProfitUnitDay(this.detail.profitUnit, this.detail.profitDay);
    },
    // 提交修改表单
    submitForm() {
      let name = this.dialog.name;
      this.$refs[name].validate(valid => {
        if (valid) {
          // 格式化提交数据
          let items = Object.keys(this.dialog[name]),
            data = {};
          items.forEach(item => {
            data[item] = /^(consume|recharge|newFansAmt)$/.test(item)
              ? calculation.accMul(this.dialog[name][item], 100)
              : this.dialog[name][item];
          });
          data.profitDay = this.computeProfitDay(data.profitUnit, data.profitUnitDay);
          // 更新数据
          this.updateDetail(data, _ => {
            // 提交成功更新detail
            this.$emit("updateDetail");
            this.dialog.show = false;
            msg.success("修改成功!");
          });
        }
      });
    },
    computeProfitUnitDay(profitUnit, profitDay) {
      let pud = 0;
      if (profitUnit == 1) {
        pud = Number(profitDay).toFixed(0);
      } else if (profitUnit == 2) {
        pud = Number(profitDay / 30).toFixed(0);
      } else if (profitUnit == 3) {
        pud = Number(profitDay / 365).toFixed(0);
      }

      return pud;
    },
    computeProfitDay(profitUnit, profitUnitDay) {
      let profitDay = 0;
      if (profitUnit == 1) {
        profitDay = Number(profitUnitDay).toFixed(0);
      } else if (profitUnit == 2) {
        profitDay = Number(profitUnitDay * 30).toFixed(0);
      } else if (profitUnit == 3) {
        profitDay = Number(profitUnitDay * 365).toFixed(0);
      }
      return profitDay;
    },
    // 获取推广码url
    getQRUrl(id) {
      this.spreadCode.loading = true;
      this.$store
        .dispatch("get", {
          uri: "friendInfo/spreadCodeUrl",
          params: {
            id: this.detail.id
          }
        })
        .then(res => {
          res.data.data
            ? (this.spreadCode.url = res.data.data)
            : msg.warning("获取失败，请重试！");
          this.spreadCode.loading = false;
        });
    },
    numberValidator(value, pos, min, max, callback, err) {
      return validate.amount(value, pos, min, max)
        ? callback()
        : callback(new Error(err));
    }
    // 下载二维码(待)
    // downloadQrcode() {
    // let imgPathURL = document.getElementById("qrcode").src;
    // oDownLoad(imgPathURL);
    // function myBrowser() {
    //   var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    //   var isOpera = userAgent.indexOf("Opera") > -1;
    //   if (isOpera) {
    //     return "Opera";
    //   } //判断是否Opera浏览器
    //   if (userAgent.indexOf("Firefox") > -1) {
    //     return "FF";
    //   } //判断是否Firefox浏览器
    //   if (userAgent.indexOf("Chrome") > -1) {
    //     return "Chrome";
    //   }
    //   if (userAgent.indexOf("Safari") > -1) {
    //     return "Safari";
    //   } //判断是否Safari浏览器
    //   if (
    //     userAgent.indexOf("compatible") > -1 &&
    //     userAgent.indexOf("MSIE") > -1 &&
    //     !isOpera
    //   ) {
    //     return "IE";
    //   } //判断是否IE浏览器
    //   if (userAgent.indexOf("Trident") > -1) {
    //     return "Edge";
    //   } //判断是否Edge浏览器
    // }
    // function SaveAs5(imgURL) {
    //   var oPop = window.open(
    //     imgURL,
    //     "",
    //     "width=1, height=1, top=10000, left=10000"
    //   );
    //   for (; oPop.document.readyState != "complete"; ) {
    //     if (oPop.document.readyState == "complete") break;
    //   }
    //   oPop.document.execCommand("SaveAs");
    //   oPop.close();
    // }
    // function oDownLoad(url) {
    //   if (myBrowser() === "IE" || myBrowser() === "Edge") {
    //     SaveAs5(url);
    //   } else {
    //     download(url);
    //   }
    // }
    // //谷歌，360极速等浏览器下载
    // function download(src) {
    //   var $a = document.createElement("a");
    //   $a.setAttribute("href", src);
    //   $a.setAttribute("download", "");
    //   var evObj = document.createEvent("MouseEvents");
    //   evObj.initMouseEvent(
    //     "click",
    //     true,
    //     true,
    //     window,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     false,
    //     false,
    //     true,
    //     false,
    //     0,
    //     null
    //   );
    //   $a.dispatchEvent(evObj);
    // }
    // }
  },
  computed: {
    codeUrl() {
      return this.detail.spreadCodeUrl || this.spreadCode.url || "";
    }
  },
  components: {
    Qrcode
  }
};
</script>
<style lang="less" scoped>
.title {
  padding: 10px;
  background-color: #eff2f7;
  margin-bottom: 15px;
}
.qr {
  width: 80px;
  height: 80px;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
/*
  友商基本资料
    props
      name|type|default|说明
      detail|Object|{}|友商基本资料
    events
      name|params|说明
      updateDetail|无|更新友商基本资料
 */
