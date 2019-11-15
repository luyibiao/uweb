<template>
  <div class="ukao-pt-lg">
    <div class="m-b-md">
      <div class="dis-inline m-r-md">
        <span>结算状态：</span>
        <el-select class="w-sm" clearable v-model="search.status" placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="dis-inline m-r-md">
        <span>结算时间：</span>
        <el-date-picker
          v-model="search.time"
          type="daterange"
          :picker-options="timeOptions"
          placeholder="选择日期范围">
        </el-date-picker>
      </div>
      <div class="dis-inline">
        <el-button type="primary" @click="updateUrl(1)">查询</el-button>
      </div>
    </div>
    <el-table class="ukao-el-table m-b"
      v-loading="loading"
      :data="tableData">
      <el-table-column
        label="结算批次">
        <template slot-scope="scope">
          <div>{{ scope.row.seq }}</div>
        </template>
      </el-table-column>  
      <el-table-column
        label="结算时间">
        <template slot-scope="scope">
          <div>{{ scope.row.createTime | getDate }}</div>
          <div>{{ scope.row.createTime | getTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="结算金额（元）">
        <template slot-scope="scope">
          <div class="text-success">{{ scope.row.amount || 0 | amtFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="结算状态">
        <template slot-scope="scope">
          <div :class="{'text-danger':scope.row.status === -1 , 'text-success':scope.row.status === 1 }">{{ scope.row.statusText }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right">
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

export default {
  data() {
    return {
      loading: false,
      search: {
        status: "",
        time: [new Date() - 3600 * 1000 * 24 * 30, new Date()]
      },
      statusList: [
        { value: "", label: "全部" },
        { value: 1, label: "已结算" },
        { value: 0, label: "待结算" },
        { value: -1, label: "结算失败" }
      ],
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
        this.search.status = parseInt(data.status);
        if (!this.search.status && this.search.status !== 0) this.search.status = "";
        this.search.time = [
          time.getDate(data.startCreateTime) || "",
          time.getDate(data.endCreateTime) || ""
        ];
      }
    },
    updateUrl(page) {
      if (!this.search.time) this.search.time = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          page: page,
          status: this.search.status,
          startCreateTime: time.getDate(this.search.time[0]) || "",
          endCreateTime: time.getDate(this.search.time[1]) || ""
        }
      });
    },
    getList() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "tradeSettle/list",
          params: {
            startRow: (this.pagination.page - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            status: this.search.status,
            startCreateTime: time.getDate(this.search.time[0]) || "",
            endCreateTime: time.getDate(this.search.time[1]) || ""
          }
        })
        .then(res => {
          this.tableData = res.data.data.list || [];
          this.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    }
  }
};
</script>
