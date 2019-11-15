<style lang="less" scoped>
.recharge {
  .title {
    line-height: 36px;
    padding: 0 20px;
    background-color: #eff2f7;
  }
  .box {
    padding: 25px 10px;
  }
}
.recharge-item {
  width: 158px;
  height: 158px;
  margin: 8px;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #dee5e7;
  }
  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .btn {
    border: 1px solid #1fa0ff;
    display: inline-block;
    cursor: pointer;
    padding: 6px 12px;
    color: #1fa0ff;
    &:hover {
      background-color: #1fa0ff;
      color: #fff;
    }
  }
  .bage {
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
    text-align: center;
    transform: rotate(45deg) translate(25%, -50%);
    transform-origin: center;
    line-height: 24px;
    color: #fff;
    background-color: #f75528;
    font-size: 12px;
  }
}
.form-label {
  float: left;
  width: 90px;
}
.form-rt {
  margin-left: 100px;
}
.qcode-styl{
  width: 151px;
  margin: 0 auto;
  text-align:center;
  &>:first-child{
    margin-bottom: 10px;
  }
}
.code_pay-way{
  img{
      width: 25px;
      vertical-align: middle;
    }
    span{
      cursor: pointer;
    }
}
</style>

<template>
  <div>
    <!-- 手动充值 -->
    <div class="b-a recharge">
      <p class="title font-bold text-md">短信套餐</p>
      <div class="box clearfix">
        <div class="recharge-item text-center pull-left" v-for="item in rechargeRules" :key="item.id">
          <div class="content">
            <div class="text-lg m-b-sm">
              {{item.cnt}}条
            </div>
            <div class="m-b-sm">
              单价 {{item.price | unitPrice(item.cnt)}} 元/条
            </div>
            <div>
              <span class="btn"  @click="startRecharge(item)">￥{{item.price | amtFormat}}</span>
            </div>
          </div>
          <div class="bage" v-if="item.discount && item.discount < 100">
            {{item.discount/10}}折
          </div>
        </div>
      </div>
    </div>
    <!-- 充值记录 -->
    <div class="m-t-xl">
      <p class="font-bold text-md m-b">充值记录</p>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="time"
          label="购买时间">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | getDate}} {{scope.row.createTime | getTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="充值条数">
          <template slot-scope="scope">
            <p>{{scope.row.ruleData.cnt}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="充值金额（元）">
          <template slot-scope="scope">
            <p>{{scope.row.amount | amtFormat}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="购买状态">
          <template slot-scope="scope">
            <p :class="{
              'text-success':scope.row.status === 1,
              'text-muted':scope.row.status === 2,
              'text-danger':scope.row.status === -1}">
            {{status[scope.row.status]}}
          </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.status === 0" @click="paymentOrder(scope.row)">立即付款</el-button>
            <span>-</span>
            <el-button type="text" size="small" v-if="scope.row.status === 0" @click="paymentCancel(scope.row.id)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right m-t-md">
        <el-pagination
					layout="total, prev, pager, next"
          :current-page.sync="pagination.current"
          :page-size="pagination.size"
          @current-change="updateUrl"
          :total="pagination.total">
        </el-pagination>
      </div>
    </div>
    <!-- 充值弹出 -->
    <el-dialog title="确认购买短信" class="ukao-dialog" :visible.sync="dialogVisible" @close="close">
      <div>
        <div class="m-b-md clearfix">
          <p class="form-label text-right">购买短信：</p>
          <p class="form-rt">{{order.cnt}}条</p>
        </div>
        <div class="m-b-md clearfix">
          <p class="form-label text-right">生效时间：</p>
          <p class="form-rt">立即生效</p>
        </div>
        <div class="m-b-md clearfix">
          <p class="form-label text-right">应付金额：</p>
          <p class="form-rt">{{order.price | amtFormat}}元</p>
        </div>
        <div v-if="order.status === null">
          <el-button class="form-rt" type="danger" @click="tradeCreate">立即付款</el-button>
        </div>
        <div v-else>
          <el-radio-group v-model="order.type" >
            <el-radio-button :label="1">微信支付</el-radio-button>
            <el-radio-button :label="2">支付宝支付</el-radio-button>
          </el-radio-group>
          <div class="wrapper-md qcode-styl">
            <div class="v-middle dis-inline" v-loading="order.loading" style="width:150px;height:150px;">
              <Qrcode v-if="!order.loading" v-show="order.type === 1" :value="order.wxValue" :options="{ size: 150 }"></Qrcode>
              <Qrcode v-if="!order.loading" v-show="order.type === 2" :value="order.zfbValue" :options="{ size: 150 }"></Qrcode>
            </div>
            <div class="code_pay-way">
              <img :src="order.type===1 ? '/static/img/finance/charge/wePay.png':'/static/img/finance/charge/zhiPay.png'">
              <span>{{order.type ===1 ?'微信支付':'支付宝支付'}}</span>
            </div>
          </div>
          <div class="m-b-md clearfix">
            <p class="text-right">
              <el-button type="primary" @click="paymentSuccess">我已成功支付</el-button>
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import calculation from "@/utils/helpers/calculation";

import Qrcode from "@xkeshi/vue-qrcode";
export default {
  data() {
    return {
      loading: false, //加载中
      dialogVisible: false, //充值弹窗
      pagination: {
        //分页
        size: consts.PAGE_SIZE20,
        total: 1300,
        current: 1
      },
      // 短信订单
      order: {
        loading: true, //开启支付状态
        type: 1, //支付类型
        status: null, //支付状态 (null:没有交易，-1：交易失败,0:交易中，1：交易成功，2：交易取消，)
        wxValue: "", //付款码值
        zfbValue: "", //付款码值
        incrementSeq: "", //订单id
        ruleId: "", //套餐id
        cnt: 0, //短信数量
        price: 0, //短信金额
        wxTradeSeq:"",
        zfbTradeSeq:"",
      },
      // 充值规则
      rechargeRules: [],
      tableData: [], //充值记录
      timer: null,
      status: {
        "-1": "交易失败",
        "0": "待付款",
        "-1": "交易失败",
        "1": "交易成功",
        "2": "交易取消"
      },
    };
  },
  created() {
    this.getRechargeRules();
    this.initParams();
    this.getList();
  },
  watch: {
    $route() {
      this.initParams();
      this.getList();
    }
  },
  methods: {
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current) || 1;
      }
    },
    // 更新路由
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current
        }
      });
    },
    // 充值规则
    getRechargeRules() {
      this.$store
        .dispatch("get", {
          uri: "incrementItem/sms/list"
        })
        .then(res => {
          this.rechargeRules = res.data.data.list;
        });
    },
    // 充值记录列表
    getList() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "tradeIncrement/sms/recharge/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          res.data.data.list.forEach(item => {
            item.ruleData = JSON.parse(item.ruleData);
          });
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    // 获取二维码
    getQRValue(incrementSeq) {
      // wx
      this.$store
        .dispatch("post", {
          uri: "tradePay/increment/wxPay",
          data: {
            incrementSeq
          }
        })
        .then(res => {
          this.order.loading = false;
          this.order.wxValue = res.data.data.codeUrl;
          this.order.wxTradeSeq=res.data.data.tradeSeq
        });
      // 支付宝
      this.$store
        .dispatch("post", {
          uri: "tradePay/increment/aliPay",
          data: {
            incrementSeq
          }
        })
        .then(res => {
          this.order.zfbValue = res.data.data.codeUrl;
          this.order.zfbTradeSeq=res.data.data.tradeSeq
        });
    },
    // 创建短信充值订单
    tradeCreate() {
      this.order.loading = true;
      this.order.status = 0;
      this.$store
        .dispatch("post", {
          uri: "tradeIncrement/sms/recharge/add",
          data: {
            ruleId: this.order.ruleId
          }
        })
        .then(res => {
          this.order.incrementSeq = res.data.data.seq;
          this.getQRValue(this.order.incrementSeq);
          this.setTimer();
        });
    },

     codePayFun(){
      this.order.type=this.dialogData.codePay;
    },
    // 查询订单状态
    tradeStatus(incrementSeq, fn) {
      this.$store
        .dispatch("post", {
          uri: "tradePay/queryStatusBySeq",
          data: {
            seq:incrementSeq
          }
        })
        .then(res => {
          // 如果是交易中 更新订单状态数据
          if (this.order.status === 0) {
            this.order.status = res.data.data.status;
            // 状态不是付款中 则提示并且关闭弹窗
            if (this.order.status !== 0) {
              this.tips(this.order.status);
              this.dialogVisible = false;
            }
          }
          fn && fn();
        });
    },
    // 取消订单
    tradeCancel(id) {
      this.$store
        .dispatch("post", {
          uri: "tradeIncrement/cancel",
          data: {
            id
          }
        })
        .then(res => {
          this.getList();
          msg.success("取消成功");
        });
    },
    // 设置查询订单支付状态定时器
    setTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(_ => {
        this.tradeStatus(this.order.type===1 ? this.order.wxTradeSeq : this.order.zfbTradeSeq);
      }, 3000);
    },
    // 开始充值 初始化订单数据
    startRecharge(item) {
      this.order.status = null;
      this.order.incrementSeq = "";
      this.order.wxValue = "";
      this.order.zfbValue = "";
      this.order.type = 1;
      this.order.ruleId = item.id;
      this.order.cnt = item.cnt;
      this.order.price = item.price;
      this.dialogVisible = true;
    },
    // 主动点击已经支付
    paymentSuccess() {
      if (this.timer) clearInterval(this.timer);
      // 查询是否支付，未支付则提示支付并继续开启定时器查询
      this.tradeStatus(this.order.type===1 ? this.order.wxTradeSeq : this.order.zfbTradeSeq, _ => {
        if (this.order.status === 0) {
          this.tips(this.order.status);
          this.setTimer();
        }
      });
    },
    // 立即付款已创建订单
    paymentOrder(data) {
      this.order.loading = true;
      this.order.status = 0;
      this.order.type = 1;
      this.order.incrementSeq = data.seq;
      this.order.ruleId = data.id;
      this.order.cnt = data.ruleData.cnt;
      this.order.price = data.amount;
      this.getQRValue(data.seq);
      this.setTimer();
      this.dialogVisible = true;
    },
    // 取消订单
    paymentCancel(id) {
      msg.confirm({
        title: "取消短信订单",
        msg: "取消后短信订单不可恢复，确定取消？",
        confirmFn: _ => {
          this.tradeCancel(id);
        }
      });
    },
    // 关闭充值窗口
    close() {
      // 关闭定时器
      if (this.timer) clearInterval(this.timer);
      // 如果创建新订单  获取充值列表数据
      if (this.order.status !== null) {
        // 获取充值列表数据(待完成)
        this.pagination.current === 1 ? this.getList() : this.updateUrl();
      }
    },
    // 状态提示
    tips(status) {
      switch (status) {
        case 0:
          msg.warning("请扫码支付");
          break;
        case -1:
          msg.error("付款失败");
          break;
        case 1:
          msg.success("付款成功");
          break;
        case 2:
          msg.warning("付款取消");
          break;
      }
    }
  },
  components: {
    Qrcode
  },
  filters: {
    // 短信单价
    unitPrice(price, cnt) {
      return calculation.accDiv(price, cnt * 100).toFixed(3);
    }
  }
};
</script>
