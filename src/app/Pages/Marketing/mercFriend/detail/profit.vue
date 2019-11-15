<template>
  <div>
    <TimeTab v-model="searchDate" @change="updateUrl"></TimeTab>
    <el-table v-loading="loading" class="ukao-el-table m-t" :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="时间">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="订单号">
        <template slot-scope="scope">
          <p>{{scope.row.orderNo}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="订单金额（元）">
        <template slot-scope="scope">
          <p>{{scope.row.payablePrice || 0 | amtFormat}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="优惠券金额（元）">
        <template slot-scope="scope">
          <p>{{scope.row.couponAmt || 0 | amtFormat}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="支付金额（元）">
        <template slot-scope="scope">
          <p>{{scope.row.paymentAmount || 0 | amtFormat}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="佣金比例">
        <template slot-scope="scope">
          <p v-if="scope.row.profitType === 1">{{scope.row.profitValue/100}}%</p>
          <p v-else>{{scope.row.profitValue | amtFormat}}元</p>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="佣金（元）">
        <template slot-scope="scope">
          <p>{{scope.row.income || 0 | amtFormat}}</p>
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
      // 加载中
      loading: false
    };
  },
  watch: {
    $route(){
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
    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "profitDetail/friend/share/list",
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
        });
    },
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
    }
  },
  components: {
    TimeTab
  }
};
</script>

