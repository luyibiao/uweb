<template>
  <div>
    <el-breadcrumb separator="/" class="m-b-md">
      <el-breadcrumb-item to="/client/import"><i class="el-icon-arrow-left icon-smaller"></i>导入记录</el-breadcrumb-item>
      <el-breadcrumb-item>导入详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pull-right">
      <el-button type="primary" size="small" @click="download">下载失败数据</el-button>
    </div>
    <el-table class="ukao-el-table"
      :data="tableData"
			v-loading="loading">
      <el-table-column
        prop="storeName"
        label="所属门店">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="cardNo"
        label="会员卡号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="sexText"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="cardName"
        label="会员卡">
      </el-table-column>
      <el-table-column
        label="余额">
        <template slot-scope="scope">
            <div>{{scope.row.balance | amtFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="point"
        label="积分">
      </el-table-column>
      <el-table-column
        label="生日">
        <template slot-scope="scope">
          <div>{{scope.row.birthday | getDate }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="导入结果">
        <template slot-scope="scope">
          <div v-if="scope.row.isImport" class="text-success">
            导入成功，<a class="text-primary" target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" >查看</a>
          </div>
          <div class="text-danger" v-else-if="scope.row.isCorrect === 0" v-html="scope.row.errorMsg"></div>
          <div v-else>导入失败</div>
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
    list() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "import/userInfo/list",
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
    download() {
      window.open(
        `${consts.BASE_URL}/import/userBatch/failed/download?batchId=${this
          .$route.params.id}`
      );
    }
  },
  filters: {
    sex(status) {
      let data = {
        "0": "未知",
        "1": "男",
        "2": "女"
      };
      return data[status];
    }
  }
};
</script>