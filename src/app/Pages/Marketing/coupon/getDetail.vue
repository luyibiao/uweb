<template>
  <div>
    <el-row>
      <el-col :lg="10"
              :md="10">
        <el-breadcrumb class="link-back"
                       separator="/">
          <el-breadcrumb-item to="/marketing/coupon/get">
            <i class="el-icon-arrow-left icon-smaller"></i>会员领取列表</el-breadcrumb-item>
          <el-breadcrumb-item>优惠卷领取详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-tabs v-model="detailTab" class="m-t" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="1"></el-tab-pane>
      <el-tab-pane label="已使用" name="2"></el-tab-pane>
      <el-tab-pane label="正有效" name="3"></el-tab-pane>
      <el-tab-pane label="已过期" name="4"></el-tab-pane>
    </el-tabs>
    <div class="m-t">
      <el-table class="ukao-el-table"
                v-loading="loading"
                :data="couponUserRelList"
                style="width: 100%">
        <el-table-column
          label="头像" width="70px">
          <template slot-scope="scope">
            <div v-if="">
              <img class="thumb"
                      :src="scope.row.headimgPath || '/static/img/user/def.png'"
                      alt="">
            </div>
            <!--<div>{{ scope.row.createTime | getTime }}</div>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="客户">
        </el-table-column>
        <el-table-column
          label="领取时间">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | getDate}}</p>
            <p>{{scope.row.createTime | getTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="有效日期">
          <template slot-scope="scope">
            <p>{{scope.row.timeStart | getDate}}至</p>
            <p>{{scope.row.timeEnd | getDate}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="面额">
          <template slot-scope="scope">
            <p>{{scope.row.amount| amtFormat}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="couponRuleName"
          label="使用规则">
        </el-table-column>
        <el-table-column
          label="使用时间">
          <template slot-scope="scope">
            <p>{{scope.row.usedTime | getDate}}</p>
            <p>{{scope.row.usedTime | getTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="订单">
          <template slot-scope="scope">
            <a :href="'/order/list/detail/'+scope.row.orderId" v-if="scope.row.orderId" target="_blank" class="text-primary">查看</a>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <p v-if="dateStatus(scope.row)===-2" class="text-danger">已过期</p>
            <p v-else-if="dateStatus(scope.row)===-1" class="text-danger">已作废</p>
            <p v-else-if="dateStatus(scope.row)===0" class="text-muted">未使用</p>
            <p v-else-if="dateStatus(scope.row)===1" class="text-success">已使用</p>
            <p v-else-if="dateStatus(scope.row)===2" class="text-muted">已失效</p>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="text-right m-t-sm">
      <el-pagination
        :page-size="pagination.size"
        :current-page.sync="pagination.current"
        layout="total, prev, pager, next"
        :total="pagination.total"
        @current-change="handleCurrentChange">
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
      curDate: new Date(),
      loading:true,
      detailTab: "1",
      couponUserRelList: [],
      pagination: {
        size: consts.PAGE_SIZE,
        page: 0,
        total: 0,
        current: 1,
      },
      tableData:{
        couponId:this.$route.query.couponId,

      },
      serviceTime:'',
      name: "",
      flag: true
    };
  },
  created() {
    this.getProductBusiness();
  },
  methods: {
    dateStatus(item) {

      if (item.status === 1 &&item.useStatus === 1) {
        return 1; //已使用
      }
      if (item.status === 1 &&item.shareStatus === 1) {
        return 2; //已分享
      }
      if (item.status === 0) {
        return -1; //已作废
      }

      if (time.getDate(item.timeEnd) > time.getDate(this.curDate)) {
        return -2; //已过期
      }

      if (item.status === 1 && item.useStatus === 0) {
        return 0; //未使用
      }
    },
    getProductBusiness() {
      this.tableData.pageSize = this.pagination.size;
      this.tableData.startRow = this.pagination.page ;
      this.$store
        .dispatch("post", {
          uri: "couponUserRel/list",
          data:this.tableData,
        })
        .then(res => {
          this.curDate = new Date(res.timestamp);
          this.couponUserRelList = res.data.data.list || [];
          this.serviceTime = res.data.timestamp || new Date().getTime() ;
          this.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    },
    handleClick(){
      this.pagination.current = 1;
      this.tableData.useStatus = undefined;
      this.tableData.timeEnd = undefined;
      this.tableData.timeStart = undefined;
      if(this.detailTab == 2){
       this.tableData.useStatus = 1;
      }else if(this.detailTab == 3){
        this.tableData.useStatus = 0;
        this.tableData.timeStart = 1;
      }else if(this.detailTab == 4){
        this.tableData.timeEnd = 1;
         this.tableData.useStatus = 0;
      }
      this.getProductBusiness();
    },
    handleCurrentChange (val){
      this.pagination.page = (val-1) * this.pagination.size
      this.getProductBusiness();
    },
    search() {
      let str = (this.businessId || "") + "," + this.keywords;
      this.$refs.price.getKeywordsAndbuss(str);
    },
    onTabs(tab) {
      if (tab.name === "price" && this.flag) {
        this.$refs.price.getDataFlag(tab.name, this.flag);
        this.flag = false;
      }
    }
  }
};
</script>
<style scoped>

</style>