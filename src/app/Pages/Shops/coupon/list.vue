<template>
  <div>
    <div style="position: relative;">
      <el-tabs type="card" class="m-b-sm" v-model="search.status"  @tab-click="handleTabChange">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane label="正有效" name="1"></el-tab-pane>
        <el-tab-pane label="已失效" name="0"></el-tab-pane>
      </el-tabs>
      <auth perm="shops.coupon.update">
        <el-button style="position: absolute;right: 0;top: 0;" type="primary" @click="$router.push('coupon/create')">新建礼券</el-button>
      </auth>
    </div>
     <el-table
      v-loading="loading"
      class="m-b ukao-el-table"
      :data="tabelData">
      <el-table-column
        prop="name"
        label="礼券名称">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="有效期">
        <template slot-scope="scope">
          <div v-if="scope.row.dateType === 1">
            <p>{{scope.row.timeStart | getDate}}至</p>
            <p>{{scope.row.timeEnd | getDate}}</p>
          </div>
          <div v-else>
            兑换后{{scope.row.term}}天有效
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="总量">
        <template slot-scope="scope">
          <p>{{scope.row.cnt}}</p>
          <auth perm="shops.coupon.export">
            <el-button size="small" @click="exportXls(scope.row.id)">导出</el-button>
          </auth>
        </template>
      </el-table-column>
      <el-table-column
        prop="exchangeCnt"
        label="已兑换">
      </el-table-column>
      <el-table-column
        prop="useCnt"
        label="已使用">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text"@click="$router.push('/shops/coupon/library/'+scope.row.id)">券库</el-button>
          <auth perm="shops.coupon.update">
            <span>-</span>
            <el-button type="text" @click="$router.push('/shops/coupon/edit/'+scope.row.id)">编辑</el-button>
          </auth>
        </template>
      </el-table-column>
     </el-table>
    <div class="pull-right">
      <el-pagination 
        :current-page.sync="pagination.current" 
        :page-size="pagination.size" 
        layout="total, prev, pager, next" 
        :total="pagination.total" 
        @current-change="updateUrl"/>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";

export default {
  data() {
    return {
      loading: false,
      search: {
        status: "-1"
      },
      pagination: {
        current: 1,
        size: consts.PAGE_SIZE,
        total: 0
      },
      tabelData: []
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
        this.pagination.current = parseInt(data.current) || 1;
        this.search.status = data.status;
      }
    },
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current,
          status: this.search.status
        }
      });
    },
    handleTabChange() {
      this.pagination.current = 1;
      this.updateUrl();
    },
    getList() {
      this.loading = true;
      let status = this.search.status == "-1" ? "" : this.search.status;
      this.$store
        .dispatch("post", {
          uri: "mall/coupon/list",
          data: {
            status,
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.tabelData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    exportXls(id) {
      window.open(consts.BASE_URL + "/export/fcode/list?couponId=" + id);
    }
  }
};
</script>
