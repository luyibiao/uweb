<style lang="less" scoped>
.main-l {
  width: 320px;
  .link-back {
    line-height: 36px;
  }
}

.main-r {
  margin-left: 380px;
  overflow: hidden;
}

.num {
  font-size: 32px;
}

.details {
  padding: 40px 0;
  border: 1px solid #ecb07a;
  background-color: #fff3d3;
  border-radius: 5px;
  position: relative;
  margin-top: 7px;
  .edit {
    display: none;
    position: absolute;
    right: 15px;
    top: 5px;
  }
  &:hover {
    .edit {
      display: block;
    }
  }
}

.fanchart {
  .title {
    padding: 0 20px;
    line-height: 32px;
    background-color: #f7f7f7;
  }
  .main {
    border: 1px solid #e5e5e5;
    width: 100%;
    height: 270px;
    box-sizing: border-box;
  }
}

.operation {
  overflow: hidden;
}

.formbox {
  margin: 0 auto;
  max-width: 410px;
  padding-right: 10px;
  line-height: 36px;
}

.form-label {
  width: 90px;
}

.form-input {
  margin-left: 100px;
}
.el-tabs {
  position: relative;
}
.el-tabs-child {
  position: absolute;
  top: 0;
  right: 0;
}
</style>

<template>
  <div>
    <el-row>
      <el-col :lg="4"
              :md="4">
        <el-breadcrumb class="link-back"
                       separator="/">
          <el-breadcrumb-item to="/marketing/couponGift/list">
            <i class="el-icon-arrow-left icon-smaller"></i>礼包列表</el-breadcrumb-item>
          <el-breadcrumb-item>批次：{{packageId}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <el-col :lg="4"
              :md="4">
        <!-- 优惠券礼包信息 -->
        <div class="details m-t-lg text-center">
          <h3 class="m-b-md">优惠券礼包批次：{{packageId}}</h3>
           <h4 class="m-b-md">优惠券礼包名称：{{cardMessage.name}}</h4>
          <p class="m-b-md">制作时间：{{cardMessage.createTime | getDate}} {{cardMessage.createTime | getTime}}</p>
          <div>
            <strong>有效期：</strong>
            <span v-if="cardMessage.dateType == 1">
              <strong>{{cardMessage.timeStart | getDate}} 至 {{cardMessage.timeEnd | getDate}}</strong>
            </span>
            <span v-else>
              <strong>兑换后 {{cardMessage.term}}天后失效</strong>
            </span>
          </div>
          <p>共
            <span class="num">&nbsp;{{cardMessage.cnt}}&nbsp;</span>个礼包</p>
        </div>
      </el-col>
      <el-col :lg="18"
              :md="18"
              :offset="1">
        <div>
          <el-tabs v-model="step.active"
                   type="card"
                   @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in tabs"
                         :key="item.index"
                         :label="item.label"
                         :name="item.name"></el-tab-pane>
          </el-tabs>
          <div class="el-tabs-child">
            <el-input class="pull-right"
                      placeholder="输入关键字"
                      v-model="tableData.keywords"
                      style="width:250px">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="tabHandleClick"></el-button>
            </el-input>
          </div>
        </div>
        <div>

          <!-- 表格数据 -->
          <el-table class="ukao-el-table"
                    :data="tableData.list"
                    v-loading="loading">
            <el-table-column label="礼包秘钥"
                             prop="secret">
            </el-table-column>
            <el-table-column label="券数量"
                             prop="couponCnt">
            </el-table-column>
            <el-table-column label="券面值（元）">
              <template slot-scope="scope">
                <div class=" font-bold">{{cardMessage.amount | amtFormat}}</div>
                <p class="text-muted">
                  满 {{cardMessage.fullAmount | amtFormat}}元可用</p>
              </template>
            </el-table-column>
            <el-table-column label="礼包总额（元）">
              <template slot-scope="scope">
                <div class=" font-bold">{{scope.row.couponCnt * cardMessage.amount | amtFormat}}</div>
              </template>
            </el-table-column>
            <el-table-column label="使用规则">
              <template slot-scope="scope">
                <div>{{cardMessage.ruleName}}</div>
              </template>
            </el-table-column>
            <el-table-column label="兑换时间 | 客户">
              <template slot-scope="scope">
                <div>{{scope.row.obtainTime | getDate}} {{scope.row.obtainTime | getTime}} </div>
                <div>
                  <a target="_blank"
                     :href="'/client/list/'+scope.row.userId+'/basic'"
                     class="text-primary">{{scope.row.phone}}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <p class=""
                   v-if="scope.row.status == 1">未兑换</p>
                <p class="text-success"
                   v-if="scope.row.status == 2">已兑换</p>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="text-right m-t-sm"
               v-if="tableData.pagination.total > 0">
            <div class="pull-left">
              <auth perm="marketing.couponGift.export">
                <el-button size="small" @click="exportXls">导出</el-button>
              </auth>
            </div>
            <el-pagination :current-page.sync="tableData.pagination.current"
                           :page-size="tableData.pagination.size"
                           layout="total, prev, pager, next"
                           :total="tableData.pagination.total"
                           @current-change="list">
            </el-pagination>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";
import msg from "@/utils/msg";

export default {
  data() {
    return {
      packageId: "",
      loading: false, //加载中
      activeName: "carList", //默认选中页签
      tabs: [
        { label: "全部", name: "all", value: "" },
        { label: "未兑换", name: "step1", value: 1 },
        { label: "已兑换", name: "step2", value: 2 }
      ],
      step: {
        active: "all"
      },
      tableData: {
        status: "",
        keywords: "",
        list: [],
        pagination: {
          size: consts.PAGE_SIZE,
          total: 0,
          page: 1
        }
      },
      cardMessage: {},
      search: {
        cardNo: ""
      }
    };
  },
  created() {
    this.initParams();
    this.detail();
    this.list();
  },
  watch: {},
  methods: {
    // 初始化 tab 搜索 分页 参数
    initParams() {
      this.packageId = this.$route.query.packageId;

      this.tableData.status = this.$route.query.status || "";
      if (this.tableData.status) {
        this.tabs.forEach(item => {
          if ((this.tableData.status = item.value)) {
            this.step.active = item.name;
            return false;
          }
        });
      }
    },
    detail() {
      this.$store
        .dispatch("get", {
          uri: "giftPackageInfo/detail",
          params: {
            id: this.packageId
          }
        })
        .then(res => {
          this.cardMessage = res.data.data;
        });
    },
    list(page) {
      this.loading = true;
      if (page) this.tableData.pagination.page = parseInt(page || 1);
      this.$store
        .dispatch("post", {
          uri: "giftPackage/list",
          data: {
            packageId: this.packageId,
            startRow:
              (this.tableData.pagination.page - 1) *
              this.tableData.pagination.size,
            status: this.tableData.status || "",
            pageSize: this.tableData.pagination.size,
            keywords: this.tableData.keywords || ""
          }
        })
        .then(res => {
          this.tableData.list = res.data.data.list || [];
          this.tableData.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
    },
    // 跳转更新url
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          startRow:
            (this.tableData.pagination.page - 1) *
            this.tableData.pagination.size,
          status: this.tableData.status || "",
          pageSize: this.tableData.pagination.size,
          keywords: this.tableData.keywords || ""
        }
      });
    },
    handleCurrentChange(val) {
      this.list(val);
    },
    handleClick(tab, event) {
      this.tabs.forEach(item => {
        if (item.name === tab.name) {
          this.tableData.status = item.value;
          return false;
        }
      });
      this.list();
    },
    tabHandleClick() {
      this.list();
    },
    exportXls() {
      window.open(
        consts.BASE_URL +
          "/export/GiftPackageInfo/detail?packageId=" +
          this.packageId +
          "&status=" +
          this.tableData.status +
          "&keywords=" +
          this.tableData.keywords
      );
    }
  }
};
</script>

