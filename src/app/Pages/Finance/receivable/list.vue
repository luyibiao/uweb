<template>
  <div class="ukao-pt-lg">
    <div class="m-b-md">
      <div class="dis-inline m-r-md">
        <span>时间：</span>
        <el-date-picker
          v-model="search.time"
          type="daterange"
          :picker-options="timeOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="dis-inline m-r m-b-sm">
        类型：
        <el-select clearable v-model="search.tradeType" placeholder="请选择">
          <el-option
            v-for="item in tradeTypes"
            :key="item.val"
            :label="item.text"
            :value="item.val">
          </el-option>
        </el-select>
      </div>
      <div class="dis-inline m-r m-b-sm">
        <el-input v-model="search.keywords" prefix-icon="el-icon-search" placeholder="关键字"></el-input>
      </div>
      <div class="dis-inline">
        <el-button type="primary" @click="updateUrl(1)">查询</el-button>
      </div>
    </div>
    <el-table class="ukao-el-table m-b"
      v-loading="loading"
      :data="tableData">
      <el-table-column
        label="流水号">
        <template slot-scope="scope">
          <div>{{ scope.row.seq }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="客户">
        <template slot-scope="scope">
          <div>{{ scope.row.userName }}</div>
          <div>{{ scope.row.userPhone }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="类型">
        <template slot-scope="scope">
          <div>{{ scope.row.tradeTypeText }}</div>
          <div><router-link target="_blank" :to="(scope.row.orderType == 2?'/shops/order/detail/':'/order/list/detail/') + scope.row.orderId" class="text-primary">{{scope.row.orderNo}}</router-link></div>
        </template>
      </el-table-column>
      <el-table-column
        label="交易时间">
        <template slot-scope="scope">
          <div>{{ scope.row.tradeTime | getDate }}</div>
          <div>{{ scope.row.tradeTime | getTime }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="支付方式">
        <template slot-scope="scope">
          <div>{{ scope.row.payMethodText }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="交易金额">
        <template slot-scope="scope">
          <div class="text-success">{{ scope.row.amount | amtFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="手续费">
        <template slot-scope="scope">
          <div class="text-danger" v-if="scope.row.fee > 0">-{{ scope.row.fee | amtFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="应收金额">
        <template slot-scope="scope">
          <div class="text-success">{{ scope.row.amount - (scope.row.fee||0) | amtFormat }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right">
      <div class="pull-left">
        <auth perm="finance.receivable.list.export">
          <el-button size="small" @click="exportXls">导出</el-button>
        </auth>
      </div>
      <el-pagination
	      :page-size="pagination.size"
	      layout="total, prev, pager, next"
	      :total="pagination.total"
	      :current-page.sync="pagination.page"
				@current-change="updateUrl">
	    </el-pagination>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import time from "@/utils/helpers/timeLite";
import keyval from '@/utils/dickeyval'

export default {
  data() {
    return {
      loading: false,
      search: {
        tradeType: '',
        keywords: '',
        status: "",
        time: [new Date() - 3600 * 1000 * 24 * 30, new Date()]
      },
      tradeTypes: keyval['RECEIVABLE_TRADE_TYPE'],
      timeOptions: {
        shortcuts: [{
          text: '近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableData: [],
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        page: 1
      }
    };
  },
  created() {
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
        this.pagination.page = parseInt(data.page) || 1;
        this.search.keywords = data.keywords || '';
        this.search.tradeType = data.tradeType || '';
        this.search.time = [
          time.getDate(data.startDate) || "",
          time.getDate(data.endDate) || ""
        ];
      }
    },
    updateUrl(page) {
      if (!this.search.time) this.search.time = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          page: page,
          tradeType: this.search.tradeType,
          keywords: this.search.keywords,
          startDate: time.getDate(this.search.time[0]) || "",
          endDate: time.getDate(this.search.time[1]) || ""
        }
      });
    },
    getList() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "tradePay/partnerList",
          params: {
            tradeType: this.search.tradeType,
            keywords: this.search.keywords,
            startRow: (this.pagination.page - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            paymentPartner: 'AllInPay',
            startTradeTime: time.getDate(this.search.time[0]) || "",
            endTradeTime: time.getDate(this.search.time[1]) || ""
          }
        })
        .then(res => {
          this.tableData = res.data.data.list || [];
          this.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    },
    exportXls(){
      var params = "tradeType="+(this.search.tradeType ||'');
      params += "&keywords="+(this.search.keywords ||'');
      params += "&paymentPartner=AllInPay";
      params += "&startTradeTime="+time.getDate(this.search.time[0]);
      params += "&endTradeTime="+time.getDate(this.search.time[1]);
      window.open(consts.BASE_URL +"/export/tradePay/partnerList?" + params)
    }
  }
};
</script>
