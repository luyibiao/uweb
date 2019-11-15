<template>
  <div>
    <TimeTab v-model="searchDate" @change="updateUrl"></TimeTab>
    <el-table v-loading="loading" class="ukao-el-table m-t" :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="客户" width="190">
        <template slot-scope="scope">
          <div class="dis-inline v-top m-r-xs">
            <img width="50" height="50" :src="scope.row.headimgPath || '/static/img/work/def.png'" alt="">
          </div>
          <div class="dis-inline v-top text-primary">
            <p ><router-link class="text-primary" :to="'/client/list/'+scope.row.userId+'/basic'">{{scope.row.name}}</router-link></p>
            <p><router-link class="text-primary" :to="'/client/list/'+scope.row.userId+'/basic'">{{scope.row.phone}}</router-link></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="创建时间" width="110">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="渠道">
        <template slot-scope="scope">
          <p>{{scope.row.originText || '未知'}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="考验时间" width="170">
        <template slot-scope="scope">
          <p>{{scope.row.testStartDate | getDate}}&nbsp;{{scope.row.testStartDate | getTime}}</p>
          <p>{{scope.row.testEndDate | getDate}}&nbsp;{{scope.row.testEndDate | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="佣金金额" min-width="115">
        <template slot-scope="scope">
          <p>{{scope.row.newFansAmt | amtFormat}}元/粉丝</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="分润时间" width="170">
        <template slot-scope="scope">
          <p>{{scope.row.profitStartDate | getDate}}&nbsp;{{scope.row.profitStartDate | getTime}}</p>
          <p>{{scope.row.profitEndDate | getDate}}&nbsp;{{scope.row.profitEndDate | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="分润提成"  min-width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.consumeType ===1">消费：{{scope.row.consume/100}}%</p>
          <p v-else>消费：{{scope.row.consume | amtFormat}}元</p>
          <p v-if="scope.row.rechargeType ===1">充值：{{scope.row.recharge/100}}%</p>
          <p v-else>充值：{{scope.row.recharge | amtFormat}}元</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="结算时间" width="110">
        <template slot-scope="scope">
          <p>{{scope.row.settlementDate | getDate}}</p>
          <p>{{scope.row.settlementDate | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="状态" width="90">
        <template slot-scope="scope">
          <p :class="{'text-success':scope.row.status == 1,'text-danger':scope.row.status == -1}">{{subscribeStatus[scope.row.status]}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="结算">
        <template slot-scope="scope">
          <p v-if="scope.row.settlement === 0 && scope.row.status == -1" class="text-danger">加粉失败</p>
          <p v-else-if="scope.row.settlement === 1" class="text-success">已结算</p>
          <p v-else>{{surplusTime(scope.row.testEndDate)}}</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right m-t">
      <el-pagination 
        :page-size="pagination.size" 
        layout="total, prev, pager, next" 
        :total="pagination.total" 
        @current-change="lipPages"
        :current-page.sync="pagination.page">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import time from "@/utils/helpers/timeLite";
import TimeTab from "@/components/TimeTab";
export default {
  data() {
    return {
      id: 0, //员工id
      searchDate: [time.getDate(new Date()), time.getDate(new Date())], // 搜索时间(默认今天)
      tableData: [], //数据列表
      // 分页信息
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        page: 1
      },
      subscribeStatus: {
        "-1": "已跑路",
        "0": "未关注",
        "1": "已关注"
      },
      systemTime: 0,
      // 加载中
      loading: false
    };
  },
  watch: {
    $route() {
      this.initParams();
      this.getList();
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.initParams();
    this.getList();
  },
  methods: {
    // 初始化搜索参数
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.page = parseInt(data.page || 1); //第几页
        this.searchDate = [
          time.getDate(data.startDate) || "",
          time.getDate(data.endDate) || ""
        ]; //时间内容
      }
    },
    // 获取数据列表
    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "fansInfo/friend/list",
          data: {
            startRow: (this.pagination.page - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            friendId: this.id,
            startDate: this.searchDate[0] || "",
            endDate: this.searchDate[1] || ""
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total || 0;
          this.loading = false;
          this.systemTime = this.systemTime || res.data.timestamp;
        });
    },
    // 更新页面url参数
    updateUrl(start = 1) {
      if (!this.searchDate) this.searchDate = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          page: start, //从第几页开始
          startDate: this.searchDate[0] || "",
          endDate: this.searchDate[1] || ""
        }
      });
    },
    // 翻页
    lipPages(value) {
      this.updateUrl(value);
    },
    surplusTime(value) {
      let days = parseInt((value - this.systemTime) / (24 * 60 * 60 * 1000));
      return days <= 0 ? "待结算" : "剩余" + days + "天考验期";
    }
  },
  components: {
    TimeTab
  }
};
</script>

