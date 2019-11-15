<template>
   <div>
    <ul class="uk-search m-b-md">
      <li class="uk-search-item">
        <span class="uk-search-label">发送状态：</span>
        <el-select class="uk-search-content w-sm" clearable v-model="search.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="成功" value="1"></el-option>
          <el-option label="失败" value="0"></el-option>
        </el-select>
      </li>
      <li class="uk-search-item">
        <span class="uk-search-label">业务类型：</span>
        <el-select class="uk-search-content w-sm" clearable v-model="search.bizType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option :label="item.text" :value="item.val" v-for="item in bizList" :key="item.val"></el-option>
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
				<el-input clearable class="uk-search-content w m-r" prefix-icon="el-icon-search" v-model="search.keywords" placeholder="手机号、短信内容"></el-input>
        <el-button type="primary" @click="searchData">筛选</el-button>
			</li>
    </ul>
     <div class="text-muted font-thin m ">
       短信计数：短信字数<=70个字数，按照70个字数一条短信计算，短信字数>70个字数，即为长短信，按照67个字数记为一条短信计算。
      <!-- 签名/模板申请规范 http://tb.cn/OKCGyWx -->
      </div>
    <el-table
      v-loading="loading"
      class="ukao-el-table"
      :data="tableData">
      <el-table-column label="ID" prop="id" min-width="30"></el-table-column>
      <el-table-column label="手机号" prop="phone" min-width="60"></el-table-column>
      <el-table-column label="时间"  min-width="60">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" prop="bizTypeText"  min-width="60">
      </el-table-column>
      <el-table-column label="计数" prop="cnt"  min-width="35">
      </el-table-column>
      <el-table-column label="短信内容" prop="content" min-width="250">
      </el-table-column>
      <el-table-column label="字数"  min-width="40">
        <template slot-scope="scope">
            <p>{{scope.row.content ? scope.row.content.length : 0}}</p>
        </template>
      </el-table-column>
      <el-table-column label="发送状态"  min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status" :class="scope.row.status ? 'text-success' : 'text-danger'">{{scope.row.status ? '成功' : '失败'}}</span>
          <div class="dis-inline" v-else>
            <el-tooltip class="item" placement="top" effect="dark">
              <div slot="content" style="max-width: 200px">{{scope.row.smsMsg || "未保存到错误信息"}}</div>
              <span :class="scope.row.status ? 'text-success' : 'text-danger'">{{scope.row.status ? '成功' : '失败'}}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="可重发数">
        <template slot-scope="scope">
          <p>{{scope.row.num}}</p>
        </template>
      </el-table-column>
      <el-table-column label="PID">
        <template slot-scope="scope">
          <p>{{scope.row.pid && scope.row.pid > 0 ? scope.row.pid : '-'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作"  >
              <template slot-scope="scope">
                <el-button v-if="scope.row.content && scope.row.num > 0" class="m-l-sm" size="small" @click="postSmsResend(scope.row.id)">重发</el-button>
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
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
import returnsVue from '../../Shops/components/returns.vue';
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
      bizList: [],
      search: {
        time: [],
        bizType: "",
        status: "",
        keywords: ""
      },
      smsIds:""
    };
  },
  created() {
    this.initParams();
    this.getList();
    this.getBizType();
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
        this.search.bizType = data.bizType || "";
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
          bizType: this.search.bizType,
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
          uri: "sms/list",
          params: {
            startRow: this.pagination.size * (this.pagination.current - 1),
            pageSize: this.pagination.size,
            startDate: time.getDate(this.search.time[0]) || "",
            endDate: time.getDate(this.search.time[1]) || "",
            bizType: this.search.bizType,
            status: this.search.status,
            keywords: this.search.keywords
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    // 业务类型列表
    getBizType() {
      this.$store
        .dispatch("get", {
          uri: "sysDicVal/sms/list"
        })
        .then(res => {
          this.bizList = res.data.data;
        });
    },
    // handleSelectionChange(val){
    //   this.smsIds = val.map(item=>item.id).join(',');
    // },
    // afreshSendBatch(){
    //   this.smsIds 
    //     ? this.postSmsResend(this.smsIds)
    //     : msg.warning('请选择需要重发的短信');
    // }, 
    // 短信重发
    postSmsResend(ids){
      msg.confirm({
        msg:'确定重新发送短信？',
        confirmFn:_=>{
          this.$store
          .dispatch("post", {
            uri: "sms/resendBatch",
            data:{
              ids
            }
          })
          .then(res=>{
            this.getList();
            msg.success();
          })
        }
      })
    },
  }
};
</script>
