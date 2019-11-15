<style lang="less" scoped>
.datas {
  background-color: #f8f8f8;
  .data-item {
    padding: 18px 0;
    text-align: center;
    line-height: 2;
  }
  .data-amount {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>

<template>
  <div>
    <ul class="uk-search m-b">
      <li class="uk-search-item">
        <div class="uk-search-label">类型</div>
        <el-date-picker class="uk-search-content"
                        v-model="search.time"
                        type="daterange"
                        placeholder="请选择时间"
                        :picker-options="timeOptions"></el-date-picker>
      </li>
      <li class="uk-search-item">
        <el-button type="primary"
                   @click="searchData">筛选</el-button>
      </li>
    </ul>
   
    <el-row class="datas m-b">
      <el-col :span="6">
        <div class="data-item">
          <div class="data-title">实付汇总</div>
          <div class="data-amount">{{summary.sumPaidPrice | amtFormat}}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-item">
          <div class="data-title">应付汇总</div>
          <div class="data-amount">{{summary.sunPayablePrice | amtFormat}}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-item">
          <div class="data-title">优惠汇总</div>
          <div class="data-amount">{{summary.sunPayablePrice-summary.sumPaidPrice | amtFormat}}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="data-item">
          <div class="data-title">付款笔数</div>
          <div class="data-amount">{{summary.sumPayCnt}}</div>
        </div>
      </el-col>
    </el-row>
   
    <el-tabs v-model="search.tab"
             type="card"
             @tab-click="getData">
      <el-tab-pane label="按收款码统计"
                   name="code">
        <el-table :data="codeDataList"
                  v-loading="loading">
          <el-table-column label="收款码名称" prop="name"></el-table-column>
          <el-table-column label="收款码类型">
            <template slot-scope="scope">
              <p v-if="scope.row.ccType===1">自助收款码</p>
              <p v-else>指定金额收款</p>
            </template>
          </el-table-column>
          <el-table-column label="实付金额">
             <template slot-scope="scope">
              <p>{{scope.row.paid_price | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="应付金额">
              <template slot-scope="scope">
              <p>{{scope.row.payable_price | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额">
            <template slot-scope="scope">
              <p>{{scope.row.payable_price-scope.row.paid_price | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="付款笔数" prop="pay_cnt"></el-table-column>
          <el-table-column label="退款金额">
            <template slot-scope="scope">
              <p>{{scope.row.refund_price  | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="退款笔数" prop="refund_cnt"></el-table-column>
        </el-table>
        <div class="text-right">
          <el-pagination :current-page.sync="pagination.codeCurrent"
                         :page-size="pagination.size"
                         layout="total, prev, pager, next"
                         :total="pagination.codeTotal"
                         @current-change="codeCurrentChange"> </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按标签统计"
                   name="label">
        <el-table :data="labelDataList"
                  v-loading="loading">
          <el-table-column label="标签名称" prop="name"></el-table-column>
          <el-table-column label="实付金额">
            <template slot-scope="scope">
              <p>{{scope.row.paid_price | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="应付金额">
            <template slot-scope="scope">
              <p>{{scope.row.payable_price | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额">
            <template slot-scope="scope">
              <p>{{scope.row.payable_price-scope.row.paid_price | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="付款笔数" prop="pay_cnt"></el-table-column>
          <el-table-column label="退款金额">
             <template slot-scope="scope">
              <p>{{scope.row.refund_price  | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="退款笔数" prop="refund_cnt"></el-table-column>
        </el-table>
        <div class="text-right">
          <el-pagination :current-page.sync="pagination.labelCurrent"
                         :page-size="pagination.size"
                         layout="total, prev, pager, next"
                         :total="pagination.labelTotal"
                         @current-change="labeCurrentChange"> </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import timeLite from "@/utils/helpers/timeLite";

export default {
  data() {
    return {
      loading: false, 
      timeOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const date = new Date();
              picker.$emit("pick", [date, date]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [date, date]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      search: {
        tab: "code",
        time: []
      },
      codeDataList: [{}],
      labelDataList: [{}],
      pagination: {
        size: consts.PAGE_SIZE20,
        codeTotal: 0,
        codeCurrent: 1,
        labelTotal: 0,
        labelCurrent: 1
      },
      summary:{},
    };
  },
  created() {
    this.init();
    this.getData();
    this.getSummary();
  },
  watch: {
    $route() {
      this.init();
      this.getData();
    }
  },
  methods: {
    getSummary(){
      this.$store.dispatch('post',{
        uri:'reportCashier/queryCount'
      }).then(res=>{
        this.summary=res.data.data || {};
      })
    },
    // 初始化
    init() {
      let data = this.$route.query;
      if (JSON.stringify(data) != "{}") {
        this.pagination.codeCurrent = parseInt(data.codeCurrent) || 1;
        this.pagination.labelCurrent = parseInt(data.labelCurrent) || 1;
        this.search.tab = data.tab == "code" ? "code" : "label";
        this.search.time = [
          timeLite.getDate(data.startTime) || "",
          timeLite.getDate(data.endTime) || ""
        ];
      }
    },
     
    updateUrl() {
      if (!this.search.time) this.search.time = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          codeCurrent: this.pagination.codeCurrent,
          labelCurrent: this.pagination.labelCurrent,
          tab: this.search.tab,
          startTime: timeLite.getDate(this.search.time[0]) || "",
          endTime: timeLite.getDate(this.search.time[1]) || ""
        }
      });
    },
    // 筛选 
    searchData() {
      if (this.search.tab === "code") {
        this.pagination.codeCurrent > 1
          ? (this.pagination.codeCurrent = 1)
          : this.updateUrl();
          this.getCodeData();
      } else {
        this.pagination.labelCurrent > 1
          ? (this.pagination.labelCurrent = 1)
          : this.updateUrl();
          this.getLabelData();
      }
    },
    // 
    codeCurrentChange() {
      if (this.search.tab === "code") this.updateUrl();
    },
    // 
    labeCurrentChange() {
      if (this.search.tab === "label") this.updateUrl();
    },
    // 得到收款码数据  
    getCodeData() {
      console.log(this.search.time[0])
      
       this.$store
        .dispatch("post", {
          uri: "reportCashier/list",
          data:{
            bizType:1,
            startTime: this.search.time[0] || '',
            endTime: this.search.time[1] || ''
          },
          params: {
            startRow: (this.pagination.codeTotal - 1) * this.pagination.size,
            pageSize: this.pagination.size,
          }
        })
        .then(res => {
           this.loading = false;
          let item=res.data.data.list;
          this.codeDataList=item;
          this.pagination.codeTotal = res.data.data.total;
        });
    },
    //  得到标签数据
    getLabelData() {
       this.$store
        .dispatch("post", {
          uri: "reportCashier/list",
           data:{
            bizType:2,
            startTime: timeLite.getDate(this.search.time[0]) || "",
            endTime: timeLite.getDate(this.search.time[1]) || ""
          },
          params: {
            startRow: (this.pagination.labelCurrent - 1) * this.pagination.size,
            pageSize: this.pagination.size,
          }
        })
        .then(res => {
           this.loading = false;
          let item=res.data.data.list;
           this.labelDataList = item;
           this.pagination.labelTotal = res.data.data.total;
        });
    },
    // 请求数据
    async getData() {
      this.loading = true;
      await (this.search.tab === "code"
        ? this.getCodeData()
        : this.getLabelData());
    }
  }
};
</script>
