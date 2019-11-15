<template>
  <div>
    <el-breadcrumb separator="/" class="m-b">
      <el-breadcrumb-item :to="{ path: '/shops/coupon' }"><i class="el-icon-arrow-left icon-smaller"></i>礼券列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{couponName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs type="card" class="m-b-sm" v-model="search.redeem"  @tab-click="handleTabChange">
      <el-tab-pane label="全部" name="-1"></el-tab-pane>
      <el-tab-pane label="未兑换" name="0"></el-tab-pane>
      <el-tab-pane label="已兑换" name="1"></el-tab-pane>
    </el-tabs>
     <el-table
      v-loading="loading"
      class="m-b ukao-el-table"
      :data="tabelData">
      <el-table-column
        prop="code"
        label="兑换码">
      </el-table-column>
      <el-table-column
        prop="secret"
        label="兑换密钥">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="兑换时间">
        <template slot-scope="scope">
          <div v-if="scope.row.redeemTime">
            <p>{{scope.row.redeemTime | getDate}}</p>
            <p>{{scope.row.redeemTime | getTime}}</p>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column
        label="兑换人">
        <template slot-scope="scope">
          <p>{{scope.row.userName || '-'}}</p>
          <p>{{scope.row.userPhone }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="使用时间">
        <template slot-scope="scope">
          <div v-if="scope.row.usedTime">
            <p>{{scope.row.usedTime | getDate}}</p>
            <p>{{scope.row.usedTime | getTime}}</p>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <p :class="scope.row.redeemStatus ? 'text-muted': 'text-success'">{{scope.row.redeemStatus ? '已兑换' :'未兑换'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="使用详情">
        <template slot-scope="scope">
          <el-button type="text" @click="getRemarkDetail(scope.row.remark)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <auth perm="shops.coupon.export">
        <el-button size="small" class="pull-left" @click="exportXls">导出</el-button>
      </auth>
      <div class="pull-right">
        <el-pagination 
          :current-page.sync="pagination.current" 
          :page-size="pagination.size" 
          layout="total, prev, pager, next" 
          :total="pagination.total" 
          @current-change="updateUrl"/>
      </div>
    </div>

  </div>
</template>
<script>
import consts from "@/utils/consts";

export default {
  data() {
    return {
      loading: false,
      couponName: "",
      search: {
        redeem: "-1"
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
    // 获取数据
    getList() {
      this.loading = true;
      let redeem = this.search.redeem == "-1" ? "" : this.search.redeem;
      this.$store
        .dispatch("post", {
          uri: "couponFCode/list",
          data: {
            redeem,
            couponId: this.$route.params.id,
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.couponName = res.data.couponName;
          this.tabelData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    // 重置参数
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current) || 1;
        this.search.redeem = data.redeem;
      }
    },
    // 更新url
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current,
          redeem: this.search.redeem
        }
      });
    },
    // 状态改变
    handleTabChange() {
      this.pagination.current = 1;
      this.updateUrl();
    },
    // 查看详情
    getRemarkDetail(data) {
      data = data || "无";
      const h = this.$createElement;
      this.$msgbox({
        title: "使用详情",
        message: h("div", null, [
          h("p", { class: "text-muted pull-left" }, "备注："),
          h("p", { style: "margin-left: 60px;" }, data)
        ]),
        confirmButtonText: "关闭"
      });
    },
    // 导出
    exportXls() {
      window.open(
        consts.BASE_URL + "/export/fcode/list?couponId=" + this.$route.params.id
      );
    }
  }
};
</script>
