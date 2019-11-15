
<template>
  <div>
    <TimeTab v-model="searchDate" @change="updateUrl"></TimeTab>
    <el-table v-loading="loading" class="ukao-el-table m-t" :data="tableData" style="width: 100%">
      <el-table-column label="时间" width="110">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="类型 | 支付流水号" min-width="150">
        <template slot-scope="scope">
          <p>{{scope.row.tradeTypeText}}</p>
          <p>{{scope.row.seq}}</p>
          <p></p>
        </template>
      </el-table-column>
      <el-table-column label="消费金额（元）" min-width="100">
        <template slot-scope="scope">{{scope.row.paymentAmount | amtFormat}}</template>
      </el-table-column>
      <el-table-column label="分润提成" min-width="94">
        <template slot-scope="scope" v-if="scope.row.profitType">
          <p v-if="scope.row.profitType === 1">
            {{(scope.row.profitValue || 0)/100}}%
          </p>
          <p v-else>{{(scope.row.profitValue || 0) | amtFormat}}元</p>
        </template>    
      </el-table-column>
      <el-table-column label="收入（元）" min-width="106">
        <template slot-scope="scope">
          <span :class="scope.row.income > 0 ? text-success : text-danger" v-if="scope.row.income">{{scope.row.income > 0 ? '+':''}}{{scope.row.income | amtFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支出（元）" min-width="106">
        <template slot-scope="scope">
          <span class="text-danger" v-if="scope.row.expenditure">-{{scope.row.expenditure | amtFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额（元）" min-width="106">
        <template slot-scope="scope">
          <span class="text-success">{{scope.row.balance | amtFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式 | 单号" min-width="136">
        <template slot-scope="scope">
          <p>{{scope.row.payMethodText}}</p>
          <p>{{scope.row.orderNo || '无'}}</p>
          <p></p>
        </template>
      </el-table-column>
      <el-table-column label="客户" min-width="136">
        <template slot-scope="scope">
          <p>{{scope.row.userName}}</p>
          <p><a target="_blank" :href="'/client/list/'+scope.row.userId+'/basic'" class="text-primary">{{scope.row.userPhone}}</a></p>
          <p></p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="viewDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right m-t">
      <auth perm="marketing.friend.read">
        <el-button size="small" class="pull-left" @click="exportData">导出</el-button>
      </auth>
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
import time from "@/utils/helpers/timeLite";
import TimeTab from "@/components/TimeTab";
export default {
  data() {
    return {
      id: 0, //员工id
      searchDate: [time.getDate(new Date()), time.getDate(new Date())], // 搜索时间(默认今天)
      tableData: [], //数据列表
      // 分页信息
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        page: 1
      },
      // 加载中
      loading: true
    };
  },
  watch: {
    $route(){
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
    // 初始化搜索参数
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.page = parseInt(data.page || 1); //第几页
        this.searchDate = [
          time.getDate(data.startDate) || "",
          time.getDate(data.endDate) || ""
        ]; //时间内容
      }
    },
    // 跳转url更新页面数据
    updateUrl(start = 1) {
      if (!this.searchDate) this.searchDate = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          page: start, //从第几页开始
          startDate: this.searchDate[0] || "",
          endDate: this.searchDate[1] || ""
        }
      });
    },
    // 翻页
    lipPages(value) {
      this.updateUrl(value);
    },
    // 查看详情
    viewDetails(item) {
      if (item.orderId) {
        this.$router.push("/order/list/detail/" + item.orderId);
      } else {
        const h = this.$createElement;
        let data = item.remark || "无";
        this.$msgbox({
          title: "查看详情",
          message: h("div", null, [
            h("p", { class: "text-muted pull-left" }, "备注："),
            h("p", { style: "margin-left: 60px;" }, data)
          ]),
          confirmButtonText: "关闭",
          callback: _ => {}
        });
      }
    },
    // 获取数据列表
    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "profitDetail/friend/list",
          data: {
            startRow: (this.pagination.page - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            friendId: this.id,
            startDate: this.searchDate[0] || "",
            endDate: this.searchDate[1] || ""
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    },
    exportData(){
      let data = {
        friendId: this.id,
        startDate: this.searchDate[0] || "",
        endDate: this.searchDate[1] || ""
      };
      let params =
        Object.keys(data).map(key=>{
          return `${key}=${data[key]}`
        }).join('&');
      window.open(consts.BASE_URL +"/export/profitDetail/list?" + params)
    }
  },
  components: {
    TimeTab
  }
};
</script>