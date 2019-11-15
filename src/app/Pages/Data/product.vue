<template>
  <div >
    <!-- 列表 -->
    <div class="ds-table" v-loading="loading">
      <div class="m-t-md" >
        <el-date-picker :clearable="false" v-model="search.date" format="yyyy-MM-dd" type="daterange"
                        align="right" placeholder="选择日期范围" :picker-options="pickerOptions2"
        >
        </el-date-picker>
      </div>

      <!-- 报表 -->
      <div class="report">
        <IEcharts :option="line"></IEcharts>
      </div>
      <div class="m-t-xl">
        <table class="ukao-order-table w-full">
          <thead>
            <tr>
              <td width="33%">序列</td>
              <td>日期</td>
              <td>{{tab.activeName == 'add' ? tab.list[0].label:tab.list[1].label}}</td>
            </tr>
          </thead>
          <tr class="tr-content" v-if="!tableData.list || tableData.list.length == 0">
            <td colspan="3" style="text-align: center">暂无数据</td>
          </tr>
          <tbody>
            <tr class="table-content-border-bottom" v-for="(item, index) in tableData.list" :key="item.id">
              <td>{{index + 1}}</td>
              <td>{{item.date}}</td>
              <td>{{item.cnt}}</td>
            </tr>
          </tbody>
        </table>
        <div class="m-t-sm clearfix">
          <el-pagination class="pull-right"
    		      :page-size="tableData.pagination.size"
    		      layout="total, prev, pager, next"
    		      :total="tableData.pagination.total"
    					:current-page.sync = "tableData.pagination.page"
               @current-change="handleCurrentChange" >
          </el-pagination>
        </div>
      </div>
     </div>
  </div>
</template>

<script>
import consts from '@/utils/consts'
import msg from '@/utils/msg'
import time from '@/utils/helpers/timeLite'
import IEcharts from 'vue-echarts-v3';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/legend';

export default {
  data: function() {
    return {
      loading: true,
      tableData: {
        list: [],
        pagination: {
          size: consts.PAGE_SIZE20,
          total: 0
        },
        dateList:[]
      },
      search: {
        date: '',
        tabAddDate: {
          startDate: '',
          endDate: ''
        },
        tabAddUpDate: {
          startDate:'',
          endDate:''
        },
        sysDate : new Date()
      },
      pickerOptions2: {
        disabledDate(time) {
          return (
            time.getTime() >= Date.now() -  24 * 60 * 60 * 1000
          );
        },
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近7天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      tab: {
        activeName: 'addUp',
        selectedTab: 'addUp',
        list: [{
          label: '新增衣物数', name: 'add'
        }, {
          label: '累计衣物数', name: 'addUp'
        }]
      },
      line: {
        title: {
          text: '累计衣物订单数据图',
          textStyle: {
            fontWeight: 'normal'
          },
          left: 'center',
          y: 15
        },
        legend: {
          data: ['累计衣物订单数'],
          left: 'right',
          top: 15
        },
        grid: {
          width: "90%",
          left: '5%',
        },
        tooltip: {
          trigger: 'axis',
          borderColor: '#ccc',
          borderWidth: 1,
          backgroundColor: ['#fff'],
          textStyle: {
            color: ['#000']
          }
        },
        xAxis: {
          data: ['2017-08-1', '2017-08-2', '2017-08-3'],
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
          name: "全部",
          type: 'value',
        },
        series: [{
          name: '累计衣物订单数',
          type: 'line',
          symbol: 'circle',
          symbolSize: 8,
          color: ['#4AAF52'],
          data: []
        },]
      },
      customerVolume:{  //客户流量
        num:0,
        yesterdayNum:0
      }
    }
  },
  components: {
    IEcharts
  },
  watch: {
    'search.date'(val) {
      val = val || [];
      let startDate = val[0] ? time.getDate(val[0].getTime()) : ''
      let endDate = val[1] ? time.getDate(val[1].getTime()) : ''
      let text = startDate + ' 至 ' + endDate
      if (text != this.line.yAxis.name) {
        this.line.yAxis.name = text;
      }
      this.search.tabAddUpDate.startDate = startDate
      this.search.tabAddUpDate.endDate = endDate
      this.queryDateAddUpTotal()
    },

  },
  created() {
    this.initDate();
  },
  methods: {
    initDate(){
      const now = new Date();
      this.search.sysDate = now.getTime();
      let endDate = now.getTime() - 24*60*60*1000,
        startDate = now.getTime() - 7*24*60*60*1000;
      this.search.tabAddDate.startDate = time.getDate(startDate);
      this.search.tabAddDate.endDate =  time.getDate(endDate)
      this.search.tabAddUpDate.startDate = time.getDate(startDate);
      this.search.tabAddUpDate.endDate = time.getDate(endDate);
      this.search.date = [new Date(startDate),new Date(endDate)];
    },
    queryDateAddUpTotal(){
      var _this = this
      _this.loading = true
      var startDate = _this.search.tabAddUpDate.startDate
      var endDate = _this.search.tabAddUpDate.endDate
      _this.$store.dispatch('post',{
        uri:'variedCumulative/product/list',
        data:{
          startDate:  startDate,
          endDate: endDate,
        }
      }).then(res=>{
        var list = res.data.data || [];
        list.forEach(function (item) {
          item.date = time.getDate(item.date)
        })
        _this.getDatas(list)
        _this.tableData.dateList = list.reverse();
        _this.tableData.list = list.length > _this.tableData.pagination.size ? list.slice(0, _this.tableData.pagination.size) : list
        _this.tableData.pagination.total = list.length
        _this.loading = false
      })
    },
    getDayList(startDate, endDate){
      var day = time.difference(startDate, endDate)
      var dateList = []
      if(day  > 0){
        for (var i = 0; i < day; i++) {
          let date = time.getDate(time.add(startDate, i, 'days'))
          dateList.push({date: date, cnt: 0})
        }
      }else{
        dateList.push({date: startDate, cnt: 0})
      }
      return dateList
    },
    getDatas(list) {
      var datas = { xAxis: [], server: [] };
      list.forEach(function(item) {
        datas.xAxis.push(item.date);
        datas.server.push(item.cnt);
      })
      this.tableData.list = list;
      this.line.xAxis.data = datas.xAxis;
      this.line.series[0].data = datas.server;
    },
    tabClick(tab) {
      this.tab.list.forEach(item => {
        if (item.name == tab.name) {
          this.line.title.text = item.label+'据图';
          this.tab.selectedTab = item.name;
          this.line.legend.data = [item.label];
          this.line.series[0].name = item.label;
          return false
        }
      })
    },
    handleCurrentChange(val){
      let start = (val - 1 ) * this.tableData.pagination.size
      let end = val * this.tableData.pagination.size
      this.tableData.list =  this.tableData.dateList.slice(start, end)
    }
  }
}
</script>
<style lang="less" scoped>
.tab {
  margin-top: 10px;
}

.ds-tb-dt {
  float: right;
}

.report {
  border: 1px solid #f5f5f5;
  width: 100%;
  height: 400px;
  margin: 40px auto;
}

.ds-sta {
  background: #F9FAFC;
  width: 100%;
  text-align: center;
  margin: 20px 0 40px;
}

.ds-sta .ds-sta-itm {
  padding: 25px 0;
}

.grid-content .l-h {
  font-size: 40px;
}
</style>
