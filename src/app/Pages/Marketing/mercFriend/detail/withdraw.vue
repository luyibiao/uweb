
<template>
  <div>
    <el-table v-loading="loading" class="ukao-el-table m-t" :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="申请时间" min-width="150">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="提现银行|流水号" min-width="250">
        <template slot-scope="scope">
          <el-tooltip effect="light" placement="bottom-start">
            <span>{{scope.row.bankName}}...{{scope.row.accountNoHide}}<i class="el-icon-caret-bottom m-l-xs"></i></span>
            <div slot="content">
              <p class="m-b-xs">收款银行：{{scope.row.bankName}}</p>
              <p class="m-b-xs">银行账户：{{scope.row.accountNo}}</p>
              <p class="m-b-xs">账户名：{{scope.row.accountName}}</p>
              <p>流水号：{{scope.row.seq}}</p>
            </div>
          </el-tooltip>
          <p class="text-muted">流水号：{{scope.row.seq}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="提现金额（元）" min-width="150">
        <template slot-scope="scope">
          <p class="text-danger">{{scope.row.amount | amtFormat}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="处理完成时间"  min-width="160">
        <template slot-scope="scope">
          <p>{{scope.row.tradeTime | getDate}}</p>
          <p>{{scope.row.tradeTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="状态"  min-width="140">
        <template slot-scope="scope">
          <p :class="{'text-danger':scope.row.auditStatus<0,'text-success':scope.row.auditStatus>0,}">{{auditStatus[scope.row.auditStatus]}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="80">>
        <template slot-scope="scope">
          <el-button type="text" @click="viewDetails(scope.row)">详情</el-button>
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
    <el-dialog class="ukao-dialog" title="审核详情" :visible.sync="detail.dialog">
      <el-form v-if="detail.item" label-width="100px">
        <el-form-item label="付款方式：">
          <p>{{detail.item.payMethodText}}</p>
        </el-form-item>
        <el-form-item label="账户类型：">
          <p>{{bankType[detail.item.bankType]}}</p>
        </el-form-item>
        <el-form-item label="账号：">
          <p>{{detail.item.accountNo || '无'}}</p>
        </el-form-item>
        <el-form-item label="账户名：">
          <p>{{detail.item.accountName || '无'}}</p>
        </el-form-item>
        <el-form-item label="付款金额：">
          <p>{{detail.item.amount | amtFormat}}元</p>
        </el-form-item>
        <el-form-item label="备注：">
          <p>{{detail.item.auditRemark || '无'}}</p>
        </el-form-item>
        <el-form-item label="操作时间：">
          <p v-if="detail.item.auditTime">{{detail.item.auditTime | getDate}}&nbsp;{{detail.item.auditTime | getTime}}</p>
          <p v-else>无</p>
        </el-form-item>
        <el-form-item label="操作人：">
          <p>{{detail.item.auditName || '无'}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="detail.dialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
export default {
  data() {
    return {
      // 员工id
      id: "",
      // 数据列表
      tableData: [],
      // 分页
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        page: 1
      },
      // 申请状态
      auditStatus: {
        "-1": "已拒绝",
        "0": "申请中",
        "1": "已付款"
      },
      // 账户类型
      bankType: {
        "1": "个人账户",
        "2": "对公账户"
      },
      // 查看的详情
      detail: {
        dialog: false,
        item: null
      },
      loading: true
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
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.page = parseInt(data.page || 1);
      }
    },
    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "tradeAudit/friend/list",
          data: {
            startRow: (this.pagination.page - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            friendId: this.id
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    },
    // 更改url 更新列表数据
    updateUrl(start = 1) {
      this.$router.push({
        path: this.$route.path,
        query: {
          page: start
        }
      });
    },
    // 翻页
    lipPages(value) {
      this.updateUrl(value);
    },
    // 查看详情
    viewDetails(item) {
      this.detail.dialog = true;
      this.detail.item = item;
    }
  }
};
</script>
