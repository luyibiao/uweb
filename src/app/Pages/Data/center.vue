<template>
  <div class="data-center">
    <el-radio-group v-model="dataRangeRadio" @change="onDateRange">
      <el-radio-button :label="-1" >昨天</el-radio-button>
      <el-radio-button :label="-7" >近7天</el-radio-button>
      <el-radio-button :label="-30" >近30天</el-radio-button>
    </el-radio-group>
    <el-date-picker class="m-l-md" v-model="dataRange" type="daterange" align="left" placeholder="选择日期范围" @change="onDateRangeOptions">
    </el-date-picker>
    <el-row class="m-t-xl">
      <el-col :span="12">
        <div class="grid-content bg-purple text-center">
          <p class="text-danger text-vl">￥{{orderPayPriceTotal}}</p>
          <p>订单交易额</p>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple text-center">
          <p class="text-danger text-vl">￥{{rechargePayPriceTotal}}</p>
          <p>充值额</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="30" class="m-t-xl">
      <div v-loading="loading"></div>
      <div v-show="!loading">
        <el-col :span="12" v-for="(item,i) in businessOptions" :key="i">
          <div class="center-head bg-purple">
            <p class="head-title text-md font-bold m-l ">{{item.series[0].name}}</p>
          </div>
          <div class="b-a pie-chart m-b-lg">
            <IEcharts :option="item"></IEcharts>
          </div>
        </el-col>
      </div>
      <el-col :span="24">
        <div class="center-head bg-purple">
          <p class="head-title text-md font-bold m-l">订单金额时段分布</p>
        </div>
        <div class="b-a bar-chart m-b-lg">
          <IEcharts :option="lineOptions"></IEcharts>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3';
// import IEcharts from 'vue-echarts-v3/src/lite';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/pie';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/legend';
import calculation from  '@/utils/helpers/calculation'
import time from  '@/utils/helpers/timeLite'

export default {
  data() {
    return {
      loading: true,
      dataRangeRadio: '-7',
      dataRange: null,
      lineOptions:{},
      // 扇形图基础配置
      options: {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c}元 ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          left: 10,
          top: 10,
        },
        color: ['#EB544C', '#6ACA80', '#F78530', '#704DB7', '#6599EE'],
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ]
      },
      businessOptions: [],  //六种扇形图相关配置
      datas: [],
      startDate: '2017-01-01',
      endDate: '',
      orderPayPriceTotal: 0.00, //订单交易额
      rechargePayPriceTotal: 0.00,  //充值额
      orderPayTotal:{
        nameList:[],
        dataList:[]
      },
      hoursList:[],
      orderPayHoursList:[],
      rechargeHoursList:[]
    }
  },
  created() {
    let date = new Date()
    this.startDate = time.getDate(time.add(date, this.dataRangeRadio, 'days'))
    this.endDate = this.dataRangeRadio == '-1' ? this.startDate : time.getDate(date)
    this.orderList()
    this.rechargeList()
    for(var i = 1; i <= 24; i++){
      this.hoursList.push(i)
    }
  },
  mounted(){
    this.reportDataList()
  },
  methods: {
    //创建扇形图
    createFanChart(name, dataList){
      let tmpData =[]
      dataList.forEach(function (item) {
        tmpData.push(item.name)
      })
      return {
        legend: {
          data: tmpData
        },
        series: [{
          name: name,
          data: dataList
        }]
      }
    },
    //订单额支付方式
    orderList(){
      this.$store.dispatch('post', {
        uri: 'reportTradeOrder/list',
        data: {
          startDate:  this.startDate,
          endDate:  this.endDate
        }
      }).then((res) => {
        //统计数据
        var list = res.data.data || []
        let orderPayTotalList = []
        list.forEach(function (item) {
          orderPayTotalList.push({value: calculation.accDiv(item.payAmount, 100), name: item.payMethodText})
        })
        //订单交易额
        this.orderPayPriceTotal = calculation.accDiv(this.payPriceTotal(list), 100)
        this.datas[0] = this.createFanChart("订单额支付方式", orderPayTotalList)
      })
    },
    //充值额支付方式
    rechargeList(){
      this.$store.dispatch('post', {
        uri : 'reportTradeRecharge/list',
        data: {
          startDate:  this.startDate,
          endDate:  this.endDate
        }
      }).then((res) =>{
        //统计数据
        var list = res.data.data || []
        let rechargePayPriceTotalList = []
        list.forEach(function (item) {
          rechargePayPriceTotalList.push({value: calculation.accDiv(item.payAmount, 100), name: item.payMethodText})
        })
        //充值额
        this.rechargePayPriceTotal = calculation.accDiv(this.payPriceTotal(list), 100)
        this.datas[1] = this.createFanChart("充值额支付方式", rechargePayPriceTotalList)
      })
    },
    //报表数据综合方法
    reportDataList(){
      var _this = this
      this.$store.dispatch('post', {
        uri : 'reportData/list',
        data: {
          startDate:  this.startDate,
          endDate:  this.endDate
        }
      }).then((res) =>{
        // 订单下单渠道
        var orderSceneList = res.data.data.orderSceneList || []
        let tmpOrderSceneList = []
        orderSceneList.forEach(function (item) {
          tmpOrderSceneList.push({value: item.cnt, name: item.sceneName})
        })
        this.datas[2] = this.createFanChart("下单渠道", tmpOrderSceneList)

        // 充值下单渠道
        var rechargeSceneList = res.data.data.rechargeSceneList || []
        let tmpRechargeSceneList = []
        rechargeSceneList.forEach(function (item) {
          tmpRechargeSceneList.push({value: item.cnt, name: item.sceneName})
        })
        this.datas[3] = this.createFanChart("充值渠道", tmpRechargeSceneList)
        this.setBusinessOptions()

        // 订单金额时段分布
        var tmpOrderPayHoursList = res.data.data.orderPayHoursList || []
        _this.orderPayHoursList = this.hoursFill(tmpOrderPayHoursList)

        // 充值金额时段分布
        var tmpRechargeHoursList = res.data.data.rechargeHoursList || []
        _this.rechargeHoursList = this.hoursFill(tmpRechargeHoursList)
        this.lineOptions = _this.initLineOptions()
      })
    },
    // 按照小时填充
    hoursFill(dataList){
      var _this = this
      var tmpList = []
      _this.hoursList.forEach(function (hours) {
        var amount = 0
        dataList.forEach(function (item) {
          if(item.hours == hours){
            amount = calculation.accDiv(item.amount, 100)
            return
          }
        })
        tmpList.push(amount)
      })
      return tmpList
    },
    payPriceTotal(list){
      var total = 0
      list.forEach(function (item) {
        total += item.payAmount
      })
     return total
    },
    search(){
      this.datas.length = 0
      this.businessOptions.length = 0
      this.loading = true
      this.orderList()
      this.rechargeList()
      this.reportDataList()
    },
    onDateRange(){
      let date = new Date()
      this.startDate = time.getDate(time.add(date, this.dataRangeRadio, 'days'))
      this.endDate = this.dataRangeRadio == '-1' ? this.startDate : time.getDate(date)
      this.search()
    },
    onDateRangeOptions(){
      this.startDate = time.getDate(this.dataRange[0])
      this.endDate =  time.getDate(this.dataRange[1])
      this.search()
    },
    initLineOptions(){
      return {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let arr = '';
            params.forEach((item, index) => {
              if (index === 0) arr += `时间：${item.name}点<br/>`;
              arr += `${item.marker} ${item.seriesName}: ${item.data} <br />`;
            })
            return arr;
          }
        },
        color: ['#f25a5c', "#8689f0"],
        legend: {
          data: ['订单金额', '充值金额']
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: [].fill.call(new Array(24), 0).map((item, index) => {
            return index + 1
          }),
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '订单金额',
          type: 'line',
          smooth: true,
          symbol: false,
          symbolSize: 6,
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default',
                color: 'rgba(242, 60, 92,.9)'
              }
            }
          },
          data: this.orderPayHoursList
        }, {
          name: '充值金额',
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          smooth: true,
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default',
                color: 'rgba(134, 137, 240,.9)'
              }
            }
          },
          data: this.rechargeHoursList
        }]
      }
    },
    setBusinessOptions() {
      var _this = this
      this.datas.forEach(item => {
        _this.setOptions(item);
      })
      this.loading = this.datas.length < 4
    },
    setOptions(obj) {
      let a = JSON.parse(JSON.stringify(this.options));
      a.legend.data = obj.legend.data;
      a.series[0].name = obj.series[0].name;
      a.series[0].data = obj.series[0].data;
      this.businessOptions.push(a);
    }
  },
  components: {
    IEcharts
  }
}
</script>
<style lang="less" scoped>

.grid-content {

  padding: 20px 0;
}

.bg-purple {
  background-color: #F7F7F7;
}

.center-head {
  padding: 10px 0;
  .head-title {
    padding-left: 10px;
    border-left: 4px solid #F78530;
  }
}

.pie-chart {
  widows: 100%;
  box-sizing: border-box;
  height: 300px;
}

.bar-chart {
  height: 400px;
}
</style>

