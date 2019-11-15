<style lang="less" scoped>
.bg1 {
  background-color: #f7f7f7;
}
.bg2 {
  background-color: #e7faef;
}
.bg3 {
  background-color: #d1f5e0;
}
.bg4 {
  background-color: #bcf1d3;
}
.bg5 {
  background-color: #e8f3fe;
}
.p-r {
  position: relative;
}
.p-a-b {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
}
.bisects {
  font-size: 0;
  .item {
    width: 50%;
    display: inline-block;
  }
}
.title {
  box-sizing: border-box;
  font-size: 14px;
  line-height: 36px;
  height: 36px;
  padding: 0 15px;
}
.list1 {
  font-size: 0;
  padding: 5px 15px;
  li {
    line-height: 30px;
    height: 30px;
    // padding: 4px 0;
  }
}
.list2 {
  li {
    padding: 10px;
    &:extend(.bg1);
    border-radius: 4px;
    margin-top: 10px;
  }
}
.money1 {
  font-size: 15px;
  color: #4a4a4a;
}
.money2 {
  color: #008fff;
}
.rankings {
  overflow-y: scroll;
}
.ranking {
  height: 35px;
  position: relative;
  margin-top: 10px;
  .bg {
    background-color: #ffe4b7;
  }
  .content {
    padding: 0 15px;
    line-height: 35px;
    position: relative;
  }
  &:before {
    content: "";
    width: 100%;
    background-color: #fff5e5;
  }
  .bg,
  &:before {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
  }
}
.bottom-h {
  height: 320px;
}
</style>
<template>
  <div>
    <div class="clearfix m-b-lg">
      <span>所属门店：</span>
      <div class="thumb-xl w-sm  m-l-sm">
        <el-select v-model="search.store" placeholder="请选择">
          <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span class="text-right thumb-md m-l-lg">类型：</span>
      <div class="thumb-lg m-l-sm">
        <el-select v-model="search.type" placeholder="请选择">
          <el-option v-for="item in dateTpye" :key="item.type" :label="item.label" :value="item.type">
          </el-option>
        </el-select>
      </div>
      <el-date-picker :picker-options="banDate" class="m-r-md m-l" v-model="search.date" :type="search.type == 1 ? 'date':'month'" placeholder="请选择时间">
      </el-date-picker>
      <el-button type="primary" @click.native="getAllData">筛 选</el-button>
      <div class="pull-right">
        <span class="m-r-sm text-danger">注：统计数据不包括商城订单数据</span>
        <span class="m-r-sm">{{refreshTime | getDate}}&nbsp; {{refreshTime | getTime}}</span>
        <el-button type="text" @click="getAllData">刷新</el-button>
        <el-button size="small" @click.native="printPage" v-show="!loadRanking">打印</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="m-b-md">
      <el-col :span="6">
        <div class="bg3 title">汇总统计</div>
        <div class="bg2 p-r" :style="{'height':topH}">
          <ul class="list1">
            <li class="bisects" v-for="(item,index) in revenueSum" :key="index"><span class="item text-sm">{{item.payMethodText}}</span><span class="item money1 text-right">￥{{item.amount || 0 | amtFormat}}</span></li>
            <li class="bisects"><span class="item text-sm">手续费</span><span class="item money1 text-right">￥{{ revenueSumObj.fee || 0 | amtFormat}}</span></li>
            <li class="bisects"><span class="item text-sm">退款</span><span class="item money1 text-right">￥{{ revenueSumObj.refundAmt || 0 | amtFormat}}</span></li>
          </ul>
          <div class="padder wrapper-sm bisects bg4 text-black p-a-b">
            <div class="item text-md">收入合计</div>
            <div class="item text-sm text-right">
              <span>￥</span><span class="text-lg">{{revenueSumObj.totalAmt || 0 | amtFormat}}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="b-a">
          <div class="bg1 title b-b">订单营业数据</div>
          <el-row :style="{'height':topH}">
            <el-col :span="7" class="h-full">
              <ul class="list2 padder">
                <li class="bisects">
                  <div class="item text-sm">支付订单数</div>
                  <div class="item text-right money2 text-sm"><span class="text-lg m-r-xs">{{revenueCnt.orderCnt || 0}}</span><span>单</span></div>
                </li>
                <li class="bisects">
                  <div class="item text-sm">新增客户</div>
                  <div class="item text-right money2 text-sm"><span class="text-lg m-r-xs">{{revenueCnt.userCnt || 0}}</span><span>人</span></div>
                </li>
                <li class="bisects">
                  <div class="item text-sm">收衣入库（不含附件）</div>
                  <div class="item text-right money2 text-sm"><span class="text-lg m-r-xs">{{revenueCnt.takeProCnt || 0}}</span><span>件</span></div>
                </li>
                <li class="bisects">
                  <div class="item text-sm">取衣（不含附件）</div>
                  <div class="item text-right money2 text-sm"><span class="text-lg m-r-xs">{{revenueCnt.sendProCnt || 0}}</span><span>件</span></div>
                </li>
              </ul>
            </el-col>
            <el-col :span="8" class="h-full b-l b-r p-r">
              <ul class="list1">
                <li class="bisects">
                  <div class="item text-sm">订单总额</div>
                  <div class="item money1 text-right">￥{{orderMoney.orderAmt || 0 | amtFormat}}</div>
                </li>
                <li class="bisects">
                  <div class="item text-sm">优惠券抵扣</div>
                  <div class="item money1 text-right">￥{{orderMoney.couponAmt || 0 | amtFormat}}</div>
                </li>
                <li class="bisects">
                  <div class="item text-sm">订单退款</div>
                  <div class="item money1 text-right">￥{{orderMoney.refundAmt || 0 | amtFormat}}</div>
                </li>
                <!--<li class="bisects">-->
                  <!--<div class="item text-sm">未付欠款</div>-->
                  <!--<div class="item money1 text-right">￥{{orderMoney.unpaidDebtAmt || 0 | amtFormat}}</div>-->
                <!--</li>-->
                <li class="bisects">
                  <div class="item text-sm">订单实收金额</div>
                  <div class="item money1 text-right">￥{{orderMoney.paymentAmt || 0 | amtFormat}}</div>
                </li>
                <!--<li class="bisects">-->
                  <!--<div class="item text-sm">回收欠款</div>-->
                  <!--<div class="item money1 text-right">￥{{orderMoney.paidDebtAmt || 0 | amtFormat}}</div>-->
                <!--</li>-->
                <li class="bisects">
                  <div class="item text-sm">退至余额</div>
                  <div class="item money1 text-right">￥{{orderMoney.refBalanceAmt || 0 | amtFormat}}</div>
                </li>
              </ul>
              <div class="p-a-b">
                <div class="padder wrapper-sm bisects bg5 text-black">
                  <div class="item text-md">订单营收总额</div>
                  <div class="item text-sm text-right">
                    <span>￥</span><span class="text-lg">{{orderMoney.totalAmt || 0 | amtFormat}}</span>
                  </div>
                </div>
                <div class="padder wrapper-sm bisects bg2 text-black">
                  <div class="item"><p class="text-base">订单实际营收</p><p class="text-xs">(减去余额支付{{orderMoney.balanceAmt || 0 | amtFormat}}元)</p></div>
                  <div class="item text-sm text-right">
                    <span>￥</span><span class="text-lg">{{orderMoney.actualAmt || 0 | amtFormat}}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="9" class="h-full" v-loading="loadPie1">
              <IEcharts v-if="orderPie && orderPie.legend && orderPie.legend.data.length" :option="orderPie"></IEcharts>
              <p v-else class=" text-center text-md" style="line-height:260px;">暂无数据</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="b-a" v-loading="loadRanking">
          <div class="bg1 title b-b clearfix">
            <span class="thumb-sm">排名</span>
            <span>门店</span>
            <span class="pull-right">金额(元)</span>
          </div>
          <div class="rankings bottom-h"  v-if="storeRanking.length">
             <ul class="">
              <li class="ranking" v-for="(item,index) in storeRanking" :key="index">
                <div class="bg" :style="{width:percentage(item.amt,storeRanking[0].amt)+'%'}"></div>
                <div class="content">
                  <span class="thumb-sm">{{index+1}}</span>
                  <span>{{item.storeName}}</span>
                  <span class="pull-right">￥{{item.amt || 0 | amtFormat}}</span>
                </div>
              </li>
            </ul>
          </div>
          <p v-else class="bottom-h text-center text-md" style="line-height:260px;">暂无数据</p>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="b-a">
          <div class="bg1 title b-b">储值营收数据</div>
          <el-row class="bottom-h">
            <el-col :span="7" class="h-full">
              <ul class="list2 padder">
                <li class="bisects">
                  <div class="item text-sm">储值笔数</div>
                  <div class="item text-right money2 text-sm"><span class="text-lg m-r-xs">{{revenueCnt.rechargeCnt || 0}}</span><span>笔</span></div>
                </li>
              </ul>
            </el-col>
            <el-col :span="8" class="h-full b-l b-r p-r">
              <ul class="list1">
                <li class="bisects">
                  <div class="item text-sm">储值总额</div>
                  <div class="item money1 text-right">￥{{rechargeMoney.totalAmt || 0 | amtFormat}}</div>
                </li>
                <li class="bisects">
                  <div class="item text-sm">赠送金额</div>
                  <div class="item money1 text-right">￥{{rechargeMoney.giftAmt || 0 | amtFormat}}</div>
                </li>
                <li class="bisects">
                  <div class="item text-sm">储值实收金额</div>
                  <div class="item money1 text-right">￥{{rechargeMoney.amount || 0 | amtFormat}}</div>
                </li>
                <li class="bisects">
                  <div class="item text-sm">储值退款</div>
                  <div class="item money1 text-right">￥{{rechargeMoney.refundAmt || 0 | amtFormat}}</div>
                </li>
              </ul>
              <div class="p-a-b">
                <div class="padder wrapper-sm bisects bg3 text-black">
                  <div class="item text-md">储值营收合计</div>
                  <div class="item text-sm text-right">
                    <span>￥</span><span class="text-lg">{{rechargeMoney.actualAmt || 0 | amtFormat}}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="9" class="h-full" v-loading="loadPie2">
              <IEcharts v-if="rechargePie && rechargePie.legend && rechargePie.legend.data.length" :option="rechargePie"></IEcharts>
              <p v-else class=" text-center text-md" style="line-height:260px;">暂无数据</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import time from "@/utils/helpers/timeLite";
import IEcharts from "vue-echarts-v3";
// import "echarts/lib/chart/pie";
// import "echarts/lib/component/tooltip";
// import "echarts/lib/component/legend";
export default {
  data() {
    return {
      //设置搜索时间范围
      banDate: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      search: {
        //搜索内容
        store: "",
        type: 1,
        date: new Date()
      },
      dateTpye: [
        //日期类别
        { type: 1, label: "日报表" },
        { type: 2, label: "月报表" }
      ],
      storeList: [
        //门店列表
        { value: "", label: "全部" }
      ],
      // 汇总金额统计列表
      revenueSum: [],
      // 汇总金额统计 单独数据
      revenueSumObj: {
        fee: 0, //手续费,
        totalAmt: 0, //营收总和
        refundAmt: 0 //退款金额
      },
      revenueCnt: {}, // 业务数量
      // 订单金额数据
      orderMoney: {
        balanceAmt: 0,
        actualAmt: 0,
        couponAmt: 0,
        fee: 0,
        orderAmt: 0,
        paidDebtAmt: 0,
        paymentAmt: 0,
        refundAmt: 0,
        totalAmt: 0,
        unpaidDebtAmt: 0
      },
      rechargeMoney: {
        actualAmt: 0,
        amount: 0,
        totalAmt: 0,
        giftAmt: 0,
        refundAmt: 0
      }, // 储值金额数据
      storeRanking: [], // 门店排名列表
      orderPie: {}, //饼图1数据
      rechargePie: {}, //饼图2数据
      loadRanking: true, //排行加载中
      loadPie1: true, //饼图1加载中
      loadPie2: true, //饼图2加载中
      refreshTime: new Date() //页面当前更新时间
    };
  },
  created() {
    this.getStoreList();
    this.getAllData();
  },
  methods: {
    // 查询所有数据
    getAllData() {
      let d = this.getSearchDate();
      if (d) {
        this.refreshTime = new Date(); //获取更新时间
        this.getRevenueSum(this.search.store, this.search.type, d);
        this.getRevenueCnt(this.search.store, this.search.type, d);
        this.getOrderMoney(this.search.store, this.search.type, d);
        this.getRechargeMoney(this.search.store, this.search.type, d);
        this.getStoreRanking(this.search.store, this.search.type, d);
        this.getOrderPie(this.search.store, this.search.type, d);
        this.getRechargePie(this.search.store, this.search.type, d);
      } else {
        this.$message.warning("请选择时间！");
      }
    },
    // 获取汇总金额统计
    getRevenueSum(id, type, date) {
      return this.$store
        .dispatch("post", {
          uri: "revenueSum/queryReport",
          data: {
            storeId: id,
            dateType: type,
            date: date
          }
        })
        .then(res => {
          if (res.data.data) {
            this.revenueSum = res.data.data.payList || [];
            this.revenueSumObj.fee = res.data.data.fee || 0;
            this.revenueSumObj.totalAmt = res.data.data.totalAmt || 0;
            this.revenueSumObj.refundAmt = res.data.data.refundAmt || 0;
          } else {
            this.revenueSum = [];
            this.revenueSumObj.fee = 0;
            this.revenueSumObj.totalAmt = 0;
            this.revenueSumObj.refundAmt = 0;
          }
        });
    },
    // 获取业务数量统计
    getRevenueCnt(id, type, date) {
      return this.$store
        .dispatch("post", {
          uri: "revenueCnt/getReport",
          data: {
            storeId: id,
            dateType: type,
            date: date
          }
        })
        .then(res => {
          if (res.data.data) {
            this.revenueCnt = res.data.data;
          } else {
            this.revenueCnt = {};
          }
        });
    },
    //获取 订单金额数据
    getOrderMoney(id, type, date) {
      return this.$store
        .dispatch("post", {
          uri: "revenueOrder/getReport",
          data: {
            storeId: id,
            dateType: type,
            date: date
          }
        })
        .then(res => {
          if (res.data.data) {
            this.orderMoney = this.initMoney(res.data.data);
          } else {
            this.orderMoney = {
              actualAmt: 0,
              couponAmt: 0,
              balanceAmt: 0,
              refBalanceAmt: 0,
              fee: 0,
              orderAmt: 0,
              paidDebtAmt: 0,
              paymentAmt: 0,
              refundAmt: 0,
              totalAmt: 0,
              unpaidDebtAmt: 0
            };
          }
        });
    },
    //获取 储值金额数据
    getRechargeMoney(id, type, date) {
      return this.$store
        .dispatch("post", {
          uri: "revenueRecharge/getReport",
          data: {
            storeId: id,
            dateType: type,
            date: date
          }
        })
        .then(res => {
          if (res.data.data) {
            this.rechargeMoney = this.initMoney(res.data.data);
          } else {
            this.rechargeMoney = {
              actualAmt: 0,
              amount: 0,
              totalAmt: 0,
              giftAmt: 0,
              refundAmt: 0
            };
          }
        });
    },
    // 获取门店排行
    getStoreRanking(id, type, date) {
      this.loadRanking = true;
      return this.$store
        .dispatch("post", {
          uri: "revenueSum/queryStoreRanking",
          data: {
            storeId: id,
            dateType: type,
            date: date
          }
        })
        .then(res => {
          if (res.data.data) {
            this.storeRanking = res.data.data || [];
          } else {
            this.storeRanking = []; // 门店排名列表
          }
          this.loadRanking = false;
        });
    },
    // 获取订单营收饼图数据
    getOrderPie(id, type, date) {
      this.loadPie1 = true;
      return this.$store
        .dispatch("post", {
          uri: "reportTradeOrder/getReport",
          data: {
            storeId: id,
            dateType: type,
            date: date
          }
        })
        .then(res => {
          this.orderPie = this.setOptions(res.data.data || []);
          this.loadPie1 = false;
        });
    },
    // 获取储值营收饼图数据
    getRechargePie(id, type, date) {
      this.loadPie2 = true;
      return this.$store
        .dispatch("post", {
          uri: "reportTradeRecharge/getReport",
          data: {
            storeId: id,
            dateType: type,
            date: date
          }
        })
        .then(res => {
          this.rechargePie = this.setOptions(res.data.data || []);
          this.loadPie2 = false;
        });
    },
    // 获取门店列表数据
    getStoreList() {
      this.$store
        .dispatch("post", {
          uri: "storeInfo/list"
        })
        .then(res => {
          (res.data.data.list || []).forEach(item => {
            if (item) {
              this.storeList.push({ value: item.id, label: item.name });
            }
          });
        });
    },
    //获取查询日期
    getSearchDate() {
      let d = "";
      if (this.search.date) {
        d = time.getDate(this.search.date);
        if (this.search.type === 2) {
          //获取年-月
          let m = d.split("-");
          d = `${m[0]}-${m[1]}`;
        }
      }
      return d;
    },
    // 设置饼图数据
    setOptions(arr) {
      let colors = ["#62C87E", "#5D9CEC"];
      let options = {
        tooltip: {
          trigger: "item",
          formatter: "{b}({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          left: 10,
          top: 10
        },
        color: [
          "#F15755",
          "#FC863F",
          "#7053B6",
          "#FFCE54",
          "#6ED5E6",
          "#F57AC1"
        ],
        series: [
          {
            type: "pie",
            radius: ["30%", "50%"],
            center: ["70%", "50%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ]
      };
      let a = [],
        b = [];
      arr.forEach((item, index) => {
        if (item) {
          if (item.payMethod === 1) {
            options.color.splice(index, 0, colors[0]);
          } else if (item.payMethod === 4) {
            options.color.splice(index, 0, colors[1]);
          }
          let value = Number((item.payAmount || 0) / 100).toFixed(2);
          let txt = `${item.payMethodText}：￥${value}`;
          a.push({
            value: value,
            name: txt
          });
          b.push(txt);
        }
      });
      options.legend.data = b;
      options.series[0].data = a;
      return options;
    },
    //初始化金额数据 为null的转为0
    initMoney(obj) {
      Object.keys(obj).map(item => {
        if (obj[item] === null) {
          obj[item] = 0;
        }
      });
      return obj;
    },
    // 获取百分比保留2位小数
    percentage(a, b) {
      let p = parseInt(a / b * 10000) / 100;
      return p < 1 && p != 0 ? 1 : p
    },
    printPage(){
      window.print()
    }
  },
  computed: {
    topH() {
      let len = (this.revenueSum.length + 2) * 30 + 80;
      return `${len < 380 ? 380 : len}px`;
    }
  },
  components: {
    IEcharts
  }
};
</script>
