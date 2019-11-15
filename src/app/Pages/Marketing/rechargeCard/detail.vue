<style lang="less" scoped>
.main-l {
  width: 320px;
}
.main-r {
  margin-left: 380px;
}
.details {
  padding: 30px 0;
  border: 1px solid #ecb07a;
  background-color: #fff3d3;
  border-radius: 5px;
}
</style>

<template>
  <div>
    <el-breadcrumb class="link-back" separator="/">
      <el-breadcrumb-item to="/marketing/recharge">
        <i class="el-icon-arrow-left icon-smaller"></i>充值卡列表</el-breadcrumb-item>
      <el-breadcrumb-item>批次：{{$route.params.id}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="clearfix">
      <div class="pull-left main-l">
        <div class="details m-t-lg">
          <div class="text-center text-lg m-b-md">充值卡批次：{{$route.params.id}}</div>
          <div class="text-center m-b">创建时间：{{detail.createTime | getDate}} {{detail.createTime | getTime}}</div>
          <div class="text-center">生效时间：{{detail.timeStart | getDate}}</div>
          <div class="text-center">失效时间：{{detail.timeEnd | getDate}}</div>
          <div class="text-center m-t-md">共<span class="text-lg">{{detail.cnt}}</span>张</div>
        </div>
      </div>
      <div class="main-r of-hide">
        <div class="text-right">
          <el-input class="w-md"
                    placeholder="请输入兑换码"
                    v-model="keywords">
          <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          </el-input>
        </div>
        <div class="clearfix">
          <el-tabs v-model="tabName" type="card" @tab-click="tabChange">
            <el-tab-pane label="全部" name="-"></el-tab-pane>
            <el-tab-pane label="未兑换" name="0"></el-tab-pane>
            <el-tab-pane label="已兑换" name="1"></el-tab-pane>
            <el-tab-pane label="已作废" name="-1"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="m-t-lg">
          <el-table class="ukao-el-table m-t"
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="value"
              label="面值（元）">
              <template slot-scope="scope">
                {{scope.row.faceValue | amtFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop="redeemCode"
              label="兑换码">
            </el-table-column>
            <el-table-column
              label="领取限制">
              <template slot-scope="scope">
                <p v-if="scope.row.useNumLimit">每人{{scope.row.useNumLimit}}次</p>
                <p v-else>不限</p>
              </template>
            </el-table-column>
            <el-table-column
              label="兑换渠道">
              <template slot-scope="scope">
                {{scope.row.originText}}
              </template>
            </el-table-column>
            <el-table-column
              label="兑换时间">
              <template slot-scope="scope" v-if="scope.row.exchangeTime">
                <p>{{scope.row.exchangeTime | getDate}}</p>
                <p>{{scope.row.exchangeTime | getTime}}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="兑换客户">
              <template slot-scope="scope">
                <router-link target="_blank" class="text-primary" :to="`/client/list/${scope.row.userId}/basic`" v-if="scope.row.userId">
                  <p>{{scope.row.userName}}</p>
                  <p>{{scope.row.userPhone}}</p>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                <p :class="{
                  'text-muted':scope.row.status === 0,
                  'text-success':scope.row.status === 1,
                  'text-danger':scope.row.status === -1,
                }">
                {{status[scope.row.status]}}
                </p>
              </template>
            </el-table-column>
            <el-table-column
              width="76"
              label="操作">
              <template slot-scope="scope" v-if="scope.row.status === 0">
                <auth perm="marketing.recharge.destroy">
                  <el-button size="small" type="danger" @click="disableCard(scope.row.id)">作废</el-button>
                  <template slot="noPerm">-</template>
                </auth>
              </template>
            </el-table-column>
          </el-table>
          <div class="text-right m-t">
            <auth perm="marketing.recharge.export">
              <el-button class="pull-left" size="small" @click="exportData">导出</el-button>
            </auth>
            <el-pagination 
              :current-page.sync="pagination.current" 
              :page-size="pagination.size" 
              layout="total, prev, pager, next" 
              :total="pagination.total" 
              @current-change="updateUrl">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";

export default {
  data() {
    return {
      loading: false,
      tabName: "-",
      keywords: "",
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE20,
        total: 0,
        current: 1
      },
      detail: {},
      tableData: [],
      status: { "0": "未兑换", "1": "已兑换", "-1": "作废" }
    };
  },
  created() {
    this.init();
    this.getDetail();
    this.getData();
  },
  watch: {
    $route() {
      this.init();
      this.getData();
      window.scrollTo(0, 0);
    }
  },
  methods: {
    init() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current) || 1;
        this.tabName = data.status;
        this.keywords = data.keywords;
      }
    },
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current,
          status: this.tabName,
          keywords: this.keywords
        }
      });
    },
    searchData() {
      this.pagination.current > 1
        ? (this.pagination.current = 1)
        : this.updateUrl();
    },
    tabChange() {
      this.keywords = "";
      this.searchData();
    },
    getDetail() {
      this.$store
        .dispatch("get", {
          uri: "rechargeCard/batch/detail",
          params: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          this.detail = res.data.data;
        });
    },
    getData() {
      this.loading = true;
      this.$store
        .dispatch("get", {
          uri: "rechargeCard/redeem/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size || 0,
            pageSize: this.pagination.size,
            batchId: this.$route.params.id,
            keywords: this.keywords,
            status: this.tabName === "-" ? "" : this.tabName || ""
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    disableCard(id) {
      msg.confirm({
        msg: "作废后不可恢复，是否继续？",
        confirmFn: _ => {
          this.stopRechargeCard(id);
        }
      });
    },
    // 提交作废
    stopRechargeCard(id) {
      this.$store
        .dispatch("post", {
          uri: "rechargeCard/redeem/delete",
          data: {
            id
          }
        })
        .then(res => {
          msg.success("成功作废");
          this.getData();
        });
    },
    exportData() {
      window.open(
        consts.BASE_URL +
          "/export/rechargeCard/redeem/list?batchId=" +
          this.$route.params.id
      );
    }
  }
};
</script>

