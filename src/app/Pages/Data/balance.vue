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
    font-weight: bold;
  }
}
.title {
  box-sizing: border-box;
  font-size: 14px;
  line-height: 36px;
  height: 36px;
  padding: 0 15px;
  font-weight: bold;
}
.list1 {
  font-size: 0;
  padding: 5px 15px;
  li {
    line-height: 100px;
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
.kehunum{
 display: inline-block;
 width: 50px;
 height: 36px;
 position: absolute;
 left: 50%;
}
.kehumunli{
  position:absolute;
  left: 50%;
}
.nonehidden{
  overflow: auto;
}
progress {  
    display: inline-block;  
    width: 100%;  
    height: 36px;  
    border: 1px solid #FFE5B7;    
    background-color:#fff5e5;  
    color: #FFE5B7; /*IE10*/
   z-index: 1;
   position: absolute;
   left: 0;
   right: 0;
}  
/*ie6-ie9*/
progress ie {  
    display:block;  
    height: 100%;  
    background: #FFE5B7;  
}  
progress::-moz-progress-bar { background: #FFE5B7; }  
progress::-webkit-progress-bar { background: #fff5e5; }  
progress::-webkit-progress-value  { background: #FFE5B7; }
.content span{
  z-index: 1000;
}
</style>
<template>
  <div>
    <div class="clearfix m-b-lg">
      <!--<span>所属城市：</span>-->
      <div class="thumb-xl w-sm  m-l-sm">
        <!--<el-select v-model="search.cityId" placeholder="请选择">-->
          <!--<el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <citySelect v-model="search.cityId" ></citySelect>
      </div>

      <span class="m-l-lg">日期：</span>
      <el-date-picker :picker-options="banDate" class="m-r-md m-l" :clearable="false" :editable="false" v-model="search.date" type="date" placeholder="请选择时间">
      </el-date-picker>
      <el-button type="primary" @click.native="getAllData">筛 选</el-button>

      <div class="pull-right">
        <span class="m-r-sm">{{refreshTime | getDate}}&nbsp; {{refreshTime | getTime}}</span>
        <el-button type="text" @click="getAllData">刷新</el-button>
        <el-button size="small" @click.native="printPage" v-show="!loadRanking">打印</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="m-b-md">
      <el-col :span="6">
        <div class="bg3 title">门店余额统计</div>
        <div class="bg2 p-r" :style="{'height':'140px'}">
          <ul class="list1">
            <li class="bisects"><span class="item text-sm">合计</span><span class="item money1 text-right">￥<strong style="font-size:22px;">{{ revenueSumObj.totalAmt || 0 | amtFormat}}</strong></span></li>
          </ul>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="b-a">
          <div  v-loading="loadRanking" >
            <div class="bg1 title b-b clearfix" style="position:relative;">
              <span style="position:absolute;left:2%;">排名</span>
              <span style="position:absolute;left:5%;">门店名称</span>
              <span class="kehunum">客户数</span>
              <span class="pull-right" style="position:absolute;right:11%;">金额(元)</span>
            </div>
            <div class="rankings bottom-h nonehidden"  v-if="storeRanking.length" :style="{'height':topH}">
               <ul class="">
                <li class="ranking" v-for="(item,index) in storeRanking" :key="index">
                  <div class="bg" :style="{width:percentage(item.balance,storeRanking[0].balance)+'%'}"></div>
                  <div class="content">
                    <span style="position:absolute;left:2%;">{{index+1}}</span>
                    <span style="position:absolute;left:5%;">{{item.storeName}}</span>
                    <span class="kehumunli">{{item.cnt}}</span>
                    <span style="position:absolute;right:10%;">￥{{item.balance || 0 | amtFormat}}</span>
                  </div>
                </li>
              </ul>
            </div>
            <p v-else class="bottom-h text-center text-md" style="line-height:260px;">暂无数据</p>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import consts from "@/utils/consts";
import time from "@/utils/helpers/timeLite";
import IEcharts from "vue-echarts-v3";
import citySelect from '@/components/DropDownList/city'
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
        cityId: "",
        date: new Date()
      },
      cityList: [
        //城市列表
        { value: "", label: "全部" }
      ],
      // 汇总金额统计列表
      revenueSum: [],
      // 汇总金额统计 单独数据
      revenueSumObj: {
        totalAmt: 0, //营收总和
      },
      storeRanking: [], // 门店排名列表
      rechargePie: {}, //饼图2数据
      loadRanking: true, //排行加载中
      loadPie2: true, //饼图2加载中
      refreshTime: new Date() //页面当前更新时间
    };
  },
  watch:{
    'search.cityId'(){
      this.getAllData()
    }
  },
  created() {
    this.getAllData()
  },
  methods: {
    getAllData(){
      this.queryTotal();
    },
    // 获取门店排行
    queryTotal() {
      this.loadRanking = true;
      var _this = this
      this.revenueSumObj.totalAmt = 0;
      return this.$store
        .dispatch("post", {
          uri: "revenueUser/queryTotal",
          data: {
            cityId: this.search.cityId || '',
            date : time.getDate(this.search.date) || ''
          }
        })
        .then(res => {
          if (res.data.data) {
            this.storeRanking = res.data.data || [];
            this.rechargePie = this.setOptions(res.data.data || []);
            this.storeRanking.forEach(function (item) {
              _this.revenueSumObj.totalAmt += item.balance
            })
          } else {
            this.storeRanking = []; // 门店排名列表
          }
          this.loadRanking = false;
          this.loadPie2 = false;
        });
    },

    printPage(){
      window.print()
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
          "#F15755", "#FC863F", "#7053B6",
          "#FFCE54", "#6ED5E6",
          "#F57AC1", "#67C23A", "#E6A23C", "#F56C6C", "#909399", "#606266", "#409EFF", "#409EFF", "#409EFF"
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
          let value = Number((item.balanceTotal || 0) / 100).toFixed(2);
          let txt = `${item.storeName}：￥${value}`;
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
    }
  },
  computed: {
    topH() {
      let len = (this.revenueSum.length + 2) * 30 + 80;
      return `${len < 380 ? 380 : len}px`;
    }
  },
  components: {
    IEcharts, citySelect
  }
};
</script>
