
<template>
  <div>
    <el-table v-loading="loading" class="ukao-el-table m-t" :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="付款时间">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="订单号">
        <template slot-scope="scope">
          <p>{{scope.row.orderNo}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="支付金额">
        <template slot-scope="scope">
          <p>{{scope.row.expenditure | amtFormat}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="支付方式 | 支付流水号">
        <template slot-scope="scope">
          <p>{{scope.row.payMethodText}}</p>
          <p>{{scope.row.seq}}</p>
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
export default {
  data() {
    return {
      workId: "",
      loading: true,
      tableData: [],
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        page: 1
      }
    };
  },
  created() {
    this.workId = this.$route.params.id;
    this.initParams();
    this.getList();
  },
  methods: {
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.page = parseInt(data.page || 1);
      }
    },
    // 获取代付记录列表数据
    getList() {
      this.loading = true;
      let start = (this.pagination.page - 1) * this.pagination.size;
      this.$store
        .dispatch("post", {
          uri: "profitDetail/otherPay/list",
          data: {
            startRow: start,
            pageSize: this.pagination.size,
            workId: this.workId
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    },
    // 更改url 更新列表数据
    updateList(start = 1) {
      this.$router.push({
        path: this.$route.path,
        query: {
          page: start
        }
      });
    },
    // 翻页
    lipPages(value) {
      this.updateList(value);
    }
  },
  watch: {
    $route() {
      this.initParams();
      this.getList();
    }
  }
};
</script>
