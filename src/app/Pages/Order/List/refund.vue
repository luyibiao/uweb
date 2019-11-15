<style lang="less" scoped>

</style>

<template>
  <div>
    <div>
      <el-breadcrumb class="link-back" separator="/">
        <el-breadcrumb-item to="/order/list/all"><i class="el-icon-arrow-left icon-smaller"></i>订单列表</el-breadcrumb-item>
        <el-breadcrumb-item :to='`/order/list/detail/${$route.params.id}`'>订单详情</el-breadcrumb-item>
        <el-breadcrumb-item>退款记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <p class="text-black l-h36 m-t">订单号：{{ tableData[0] ? tableData[0].orderNo : ($route.query.orderNo || '-')}}</p>
      <el-table
        v-loading="loading"
        class="ukao-el-table ukao-tabel-bg m-t"
        :data="tableData">
        <el-table-column
          prop="seq"
          label="退款流水号">
        </el-table-column>
        <el-table-column
          label="申请时间">
          <template slot-scope="scope">
            {{scope.row.createTime | getDate}}
            {{scope.row.createTime | getTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="退款方式">
					<template slot-scope="scope">
						<div>{{ scope.row.refundMethodText }}<span v-if="scope.row.agentPay==1">-代销</span><span class="dis-inline text-xs text-danger" v-if="scope.row.isSign==1">（标记退款）</span></div>
					</template>
        </el-table-column>
        <el-table-column
          label="金额">
					<template slot-scope="scope">
						<div>￥{{ scope.row.amount || 0 | amtFormat }}</div>
					</template>
        </el-table-column>
        <el-table-column
          label="状态">
					<template slot-scope="scope">
            <span :class="{'text-success':scope.row.status === 1,'text-danger':scope.row.status === -1}">{{scope.row.statusText}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "tradeOrderRefund/list",
          params: {
            orderId: this.$route.params.id
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.loading = false;
        });
    }
  }
};
</script>
