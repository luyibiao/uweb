<template>
   <div>
    <ul class="uk-search m-b-md">
      <li class="uk-search-item">
        <span class="uk-search-label">发送状态：</span>
        <el-select class="uk-search-content w-sm" clearable v-model="search.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="成功" value="1"></el-option>
          <el-option label="失败" value="-1"></el-option>
          <el-option label="未知" value="0"></el-option>
        </el-select>
      </li>
      <li class="uk-search-item">
				<span class="uk-search-label">发送日期：</span>
				<el-date-picker
					v-model="search.time" type="daterange"
					align="right" start-placeholder="开始日期"
          end-placeholder="结束日期">
				</el-date-picker>
			</li>
      <li class="uk-search-item">
				<span class="uk-search-label">关键字：</span>
				<el-input clearable class="uk-search-content w m-r" prefix-icon="el-icon-search" v-model="search.keywords" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="searchData">筛选</el-button>
			</li>
    </ul>
    <el-table
      v-loading="loading"
      class="ukao-el-table"
      :data="tableData">
      <el-table-column label="手机号" prop="userPhone" min-width="180"></el-table-column>
      <el-table-column label="时间"  min-width="180">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="消息类型" prop="msgTypeText"  min-width="180">
      </el-table-column>
      <el-table-column label="短信内容" prop="content" min-width="250">
      </el-table-column>
      <el-table-column label="发送状态">
        <template slot-scope="scope">
          <div>
            <span :class="{'text-success':scope.row.receiveStatus == 1, 'text-danger':scope.row.receiveStatus == -1}">{{receiveStatus[scope.row.receiveStatus]}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right m-t-md">
      <el-pagination
        layout="total, prev, pager, next"
        :current-page.sync="pagination.current"
        :page-size="pagination.size"
      	@current-change='updateUrl'
        :total="pagination.total">
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
      tableData: [],
      loading: true,
      pagination: {
        //分页
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      search: {
        time: [],
        status: "",
        keywords: ""
      },
      receiveStatus: {
        "-1": "接收失败",
        "0": "未知",
        "1": "成功接收"
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
      window.scrollTo(0, 0);
    }
  },
  methods: {
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.search.status = data.status || "";
        this.search.keywords = data.keywords || "";
        this.pagination.current = parseInt(data.current) || 1;
        this.search.time = [
          time.getDate(data.startDate) || "",
          time.getDate(data.endDate) || ""
        ];
      }
    },
    updateUrl() {
      if (!this.search.time) this.search.time = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          status: this.search.status,
          keywords: this.search.keywords,
          startDate: time.getDate(this.search.time[0]) || "",
          endDate: time.getDate(this.search.time[1]) || "",
          current: this.pagination.current
        }
      });
    },
    searchData() {
      this.pagination.current = 1;
      this.updateUrl();
    },
    getList() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "pushMsgInfo/list",
          params: {
            startRow: this.pagination.size * (this.pagination.current - 1),
            pageSize: this.pagination.size,
            startDate: time.getDate(this.search.time[0]) || "",
            endDate: time.getDate(this.search.time[1]) || "",
            sendStatus: this.search.status,
            keywords: this.search.keywords
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    }
  }
};
</script>
