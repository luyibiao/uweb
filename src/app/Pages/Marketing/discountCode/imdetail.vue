<template>
  <div>
    <el-breadcrumb separator="/" class="m-b-md">
      <el-breadcrumb-item to="/marketing/discountCode/imdata"><i class="el-icon-arrow-left icon-smaller"></i>导入记录</el-breadcrumb-item>
      <el-breadcrumb-item>导入详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pull-right">
      <el-button type="primary" size="small" @click="download">下载失败数据</el-button>
    </div>
    <el-table class="ukao-el-table"
      :data="tableData"
			v-loading="loading">
      <el-table-column
        prop="mercName"
        label="商户名称">
      </el-table-column>
      <el-table-column
        prop="name"
        label="优惠码名称">
      </el-table-column>
      <el-table-column
        prop="code"
        label="优惠码">
      </el-table-column>
       <el-table-column
        label="导入时间">
        <template slot-scope="scope">
          <p>{{ scope.row.createTime | getDate }}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="createName"
        label="导入者">
      </el-table-column>
      <el-table-column
        label="导入状态">
        <template slot-scope="scope">
          <p v-if="scope.row.isImport===1" class="text-success">导入成功</p>
          <p v-else-if="scope.row.isImport===0" class="text-danger">导入失败</p>
        </template>
      </el-table-column>
      <el-table-column
        label="导入结果">
        <template slot-scope="scope">
          <div v-if="scope.row.isImport" class="text-success">
            <router-link class="text-primary" target="_blank" :to="'/marketing/discountCode/codelibrary/'+scope.row.couponId+'/'+scope.row.codeType+'?code='+scope.row.code+'&name='+scope.row.name">查看</router-link>
            <!-- <a class="text-primary" target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" >查看</a> -->
          </div>
          <div  v-else-if="scope.row.isImport === 0" class="text-danger">{{scope.row.errorMsg}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t-sm clearfix">
      <div class="pull-left">
        <!--<el-button type="primary" size="small" @click="download">下载失败数据</el-button>-->
      </div>
      <el-pagination
        class="pull-right"
        :page-size="pagination.size"
        :current-page.sync="pagination.current"
        layout="total, prev, pager, next"
        @current-change="updateUrl"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";

export default {
  data: function() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        size: consts.PAGE_SIZE30,
        total: 0,
        current: 1
      }
    };
  },
  created() {
    this.initPramas();
    this.list();
  },
  watch: {
    $route() {
      this.initPramas();
      this.list();
    }
  },
  methods: {
     download() {
      window.open(
        `${consts.BASE_URL}/export/impCouponCodeInfo/list?batchId=${this
          .$route.params.id}`
      );
    },
    list() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "impCouponCodeInfo/list",
          data: {
            batchId: this.$route.params.id,
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    initPramas() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current) || 1;
      }
    },
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current
        }
      });
    },
  },
};
</script>