<template xmlns="http://www.w3.org/1999/html">
  <div>
    <el-breadcrumb class="link-back"
                   separator="/">
      <el-breadcrumb-item to="/marketing/mark/list">
        <i class="el-icon-arrow-left icon-smaller"></i>RFID标签卡</el-breadcrumb-item>
      <el-breadcrumb-item>{{markNo}}标签卡使用记录</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="text-black m-t"></p>
    <div>
      <div class="dis-inline m-r m-b-sm">
        状态：
        <el-select clearable
                   v-model="searchKeys.status"
                   placeholder="全部">
          <el-option v-for="item in statics"
                     :key="item.val"
                     :label="item.text"
                     :value="item.val">
          </el-option>
        </el-select>
      </div>
      <div class="dis-inline m-r m-b-sm">
        <el-input v-model="searchKeys.keywords"
                  prefix-icon="el-icon-search"
                  placeholder="订单号|衣物条码|手机号"></el-input>
      </div>
      <div class="dis-inline m-b-sm">
        <el-button type="primary"
                   @click="list()">查询</el-button>
      </div>
    </div>

    <!-- 表格列表 -->
    <div class="m-t-lg ukao-v-loading">
      <el-table class="ukao-el-table m-t"
                :data="tableData"
                v-loading="loading">

        <el-table-column label="标签卡"
                         prop="markNo">
          <!--<template slot-scope="scope">
            <router-link class="text-primary" :to="'/marketing/mark/detail/'+scope.row.id">{{scope.row.markNo}}</router-link>
          </template>-->
        </el-table-column>
        <el-table-column label="使用时间">
          <template slot-scope="scope">
            <p>{{scope.row.bindTime | getDate}}</p>
            <p>{{scope.row.bindTime | getTime}}</p>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 0"
               placement="right"
               class="text-muted">已释放</p>
            <p v-if="scope.row.status == 1"
               placement="right"
               class="text-success">使用中</p>
          </template>
        </el-table-column>

        <el-table-column label="名称">
          <template slot-scope="scope">
            <p v-if="scope.row.status==0"
               class="text-muted">{{scope.row.productName}}</p>
            <p v-if="scope.row.status==1">{{scope.row.productName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="订单号|衣物条码">
          <template slot-scope="scope">
            <div>
              <a target="_blank"
                 :href="'/order/list/detail/'+scope.row.orderId"
                 class="text-primary">
                {{scope.row.orderNo}}
              </a>
            </div>
            <div>
              <a target="_blank"
                 :href="'/product/detail/'+scope.row.orderProId"
                 class="text-primary">
                {{scope.row.scanCode}}
              </a>
            </div>
          </template>
        </el-table-column>

        <el-table-column min-width="100"
                         label="客户">
          <template slot-scope="scope">
            <p v-if="scope.row.userId">
              <a target="_blank"
                 :href="'/client/list/'+scope.row.userId+'/basic'">{{scope.row.userName}}</a>
            </p>
            <p v-if="scope.row.userId">
              <a target="_blank"
                 :href="'/client/list/'+scope.row.userId+'/basic'"
                 class="text-primary">{{scope.row.userPhone}}</a>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <auth perm="marketing.mark.update">
              <el-button type="text"
                         @click="untie(scope.row)"
                         :disabled="scope.row.status===0 ? true : false">解绑</el-button>
              <template slot="noPerm">-</template>
            </auth>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
    </div>
    <div class="text-right m-t-lg"
         v-if="pagination.total">
      <el-pagination :current-page.sync="pagination.current"
                     :page-size="pagination.size"
                     layout="total, prev, pager, next"
                     :total="pagination.total"
                     @current-change="nextPage">
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
      markNo: "",
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      searchKeys: {
        type: "",
        keywords: "",
        status: ""
      },
      statics: [{ val: "1", text: "使用中" }, { val: "0", text: "已释放" }]
    };
  },
  created() {
    this.initParams();
    this.list();
    // this.queryBalance();
  },
  watch: {
    $route() {
      // 新建单位触发的修改不请求数据
      this.initParams();
      this.getTableList();
    }
  },
  methods: {
    list() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "markCard/queryLogList",
          data: {
            status: this.searchKeys.status,
            keywords: this.searchKeys.keywords,
            markNo: this.$route.params.markNo,
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
        });
    },

    initParams() {
      this.markNo = this.$route.params.markNo;
      //初始化分页数据
      if (this.$route.query.current) {
        this.pagination.current = parseInt(this.$route.query.current) || 1;
      }
    },
    nextPage() {
      // 新建单位触发的分页修改不执行
      this.updateUrl();
    },
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current
        }
      });
    },
    untie(row) {
      this.$store
        .dispatch("post", {
          uri: "markCard/updateUseState",
          data: {
            id: row.id
          }
        })
        .then(res => {
          msg.success();
          this.list();
        });
    }
  }
};
</script>

<style scoped>
.title {
  background: #f8f8f8;
  padding: 10px 15px;
}
.content li {
  padding: 10px 15px;
}
</style>