<style lang="less" scoped>
.data {
  width: 300px;
  margin-right: 50px;
  &-title {
    background-color: #f7f7f7;
  }
  &-content {
    padding: 8px 15px;
  }
  &-base {
    min-height: 120px;
  }
  &-item {
    padding: 6px 0;
  }
  &-name,
  &-cnt {
    float: left;
  }
  &-name {
    width: 76px;
  }
  &-cnt {
    width: 86px;
    text-align: center;
  }
  &-total {
    overflow: hidden;
    text-align: right;
  }
  &-split {
    margin: 10px auto;
    width: 100%;
    height: 0;
    border-top: 1px dashed #ccc;
  }
}
</style>

<template>

  <div class="clearfix">
    <navs class="m-b-md"
          :name="factory.name"
          menu="statistics"></navs>
    <div class="data pull-left b-a">
      <div class="data-title data-content b-b">员工操作统计</div>
      <div class="data-content data-base"
           v-loading="loading.station">
        <div class="data-item clearfix">
          <div class="data-name">工位</div>
          <div class="data-cnt">数量（件）</div>
          <div class="data-total">金额（元）</div>
        </div>
        <div class="data-item clearfix"
             v-for="item in operates.def"
             :key="item.id">
          <div class="data-name">{{item.name}}</div>
          <div class="data-cnt">{{(item.cnt || 0)}}</div>
          <div class="data-total">{{item.amount | amtFormat}}</div>
        </div>
        <div class="data-split"
             v-if="operates.def.length && operates.other.length"></div>
        <div class="data-item clearfix"
             v-for="item in operates.other"
             :key="item.id">
          <div class="data-name">{{item.name}}</div>
          <div class="data-cnt">{{(item.cnt || 0)}}</div>
          <div class="data-total">{{item.amount | amtFormat}}</div>
        </div>
      </div>
      <div class="data-title data-content text-md font-bold">
        <div class="data-item clearfix">
          <div class="data-name">合计</div>
          <div class="data-cnt">{{totalData.cnt}}</div>
          <div class="data-total">{{totalData.amount | amtFormat}}</div>
        </div>
      </div>
    </div>
    <div class="of-hide">
      <ul class="uk-search m-b-md">
        <li class="uk-search-item">
          <span class="uk-search-label">员工：</span>
          <el-select class="uk-search-content w-sm"
                     clearable
                     v-model="search.workId"
                     placeholder="请选择">
            <el-option label="全部"
                       value=""></el-option>
            <el-option :label="item.name"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in wordList"></el-option>
          </el-select>
        </li>
        <li class="uk-search-item">
          <span class="uk-search-label">工位：</span>
          <el-select class="uk-search-content w-sm"
                     clearable
                     v-model="search.kindId"
                     placeholder="请选择">
            <el-option label="全部"
                       value=""></el-option>
            <el-option :label="item.name"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in stationList"></el-option>
          </el-select>
        </li>
        <li class="uk-search-item">
          <span class="uk-search-label">操作时间：</span>
          <!-- 注意：时间不能为空，否则会影响搜索效率-->
          <el-date-picker v-model="search.time" :clearable="false"
                          type="daterange" :picker-options="pickerOptions0"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
          <el-button class="m-l-sm"
                     type="primary"
                     @click="searchData">筛选</el-button>
        </li>
      </ul>
      <el-table class="ukao-el-table"
                v-loading="loading.table"
                :data="tableData">
        <el-table-column prop="workName"
                         label="员工">
        </el-table-column>
        <el-table-column prop="kindName"
                         label="工位">
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <p>{{ scope.row.createTime | getDate }}</p>
            <p>{{ scope.row.createTime | getTime }}</p>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            {{scope.row.proType === 1 ? '衣物' : '附件'}}
          </template>
        </el-table-column>
        <el-table-column prop="proName"
                         label="衣物名称">
        </el-table-column>
        <el-table-column label="衣物条码">
          <template slot-scope="scope">
            <router-link class="text-primary"
                         target="_blank"
                         :to="`/product/detail/${scope.row.proId}`">{{scope.row.proScanCode}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="小计（元）">
          <template slot-scope="scope">
            {{scope.row.subtotal || 0 | amtFormat}}
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right m-t-md">
        <el-button size="small"
                   class="pull-left"
                   @click="exportData">导出</el-button>
        <el-pagination :page-size="pagination.size"
                       layout="total, prev, pager, next"
                       :total="pagination.total"
                       :current-page.sync="pagination.current"
                       @current-change="updateUrl">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";

import navs from "./commponents/navs";
export default {
  data() {
    return {
      factory: {},
      search: {
        workId: "",
        kindId: "",
        time: [new Date() - 3600 * 1000 * 24 * 7, new Date()]
      },
      pagination: {
        size: consts.PAGE_SIZE,
        current: 1,
        total: 0
      },
      // 员工操作
      operates: { def: [], other: [] },
      // 工位列表
      stationList: [],
      // 员工列表
      wordList: [],
      // 列表
      tableData: [],
      loading: {
        table: false,
        station: false
      },
      pickerOptions0: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  watch: {
    $route() {
      this.init();
      this.getTableData();
      window.scrollTo(0, 0);
    }
  },
  created() {
    this.init();

    this.getTableData();
    this.getStatistics();

    this.getFactoryInfo();
    this.getWorkList();
    this.getStationList();
  },
  methods: {
    // 初始化
    init() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current) || 1;
        this.search.workId = parseInt(data.workId) || "";
        this.search.kindId = parseInt(data.kindId) || "";
        this.search.time = [
          time.getDate(data.startDate) || "",
          time.getDate(data.endDate) || ""
        ];
      }
    },
    // 更新路由
    updateUrl() {
      if (!this.search.time) this.search.time = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current,
          workId: this.search.workId,
          kindId: this.search.kindId,
          startDate: time.getDate(this.search.time[0]),
          endDate: time.getDate(this.search.time[1])
        }
      });
    },
    // 搜索内容
    searchData() {
      this.pagination.current === 1
        ? this.updateUrl()
        : (this.pagination.current = 1);
      this.getStatistics();
    },
    // 获取表格数据
    getTableData() {
      this.loading.table = true;
      this.$store
        .dispatch("get", {
          uri: "workProductRecord/list",
          params: {
            startRow: this.pagination.size * (this.pagination.current - 1),
            pageSize: this.pagination.size,
            factoryId: this.$route.params.id,
            workId: this.search.workId,
            kindId: this.search.kindId,
            startDate: time.getDate(this.search.time[0]) || "",
            endDate: time.getDate(this.search.time[1]) || ""
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading.table = false;
        });
    },
    // 获取统计数据
    getStatistics() {
      this.loading.station = true;
      this.$store
        .dispatch("get", {
          uri: "workProductRecord/kindTotal/list",
          params: {
            factoryId: this.$route.params.id,
            workId: this.search.workId,
            kindId: this.search.kindId,
            startDate: time.getDate(this.search.time[0]) || "",
            endDate: time.getDate(this.search.time[1]) || ""
          }
        })
        .then(res => {
          let i = 0;
          for (let index = 0; index < res.data.data.list.length; index++) {
            if (res.data.data.list[index].def) {
              i = index + 1;
            } else {
              break;
            }
          }
          this.operates.def = res.data.data.list.splice(0, i);
          this.operates.other = res.data.data.list;
          this.loading.station = false;
        });
    },
    // 工厂信息
    getFactoryInfo() {
      this.$store
        .dispatch("get", {
          uri: "factoryInfo/detail",
          params: { id: this.$route.params.id }
        })
        .then(res => {
          this.factory = res.data.data;
        });
    },
    // 获取员工列表
    getWorkList() {
      this.$store
        .dispatch("get", {
          uri: "workerInfo/factory/list",
          params: { factoryId: this.$route.params.id }
        })
        .then(res => {
          this.wordList = res.data.data;
        });
    },
    // 获取工位列表
    getStationList() {
      this.$store
        .dispatch("get", {
          uri: "workerKind/list",
          params: { factoryId: this.$route.params.id }
        })
        .then(res => {
          this.stationList = res.data.data;
        });
    },
    exportData() {
      window.open(
        `${consts.BASE_URL}/export/workProduct/list?factoryId=${
          this.$route.params.id
        }&workId=${this.search.workId}&kindId=${
          this.search.kindId
        }&startDate=${time.getDate(this.search.time[0]) ||
          ""}&endDate=${time.getDate(this.search.time[1]) || ""}`
      );
    }
  },
  computed: {
    // 统计合计
    totalData() {
      let data = { cnt: 0, amount: 0 };
      Object.keys(this.operates).forEach(key => {
        this.operates[key].forEach(item => {
          data.cnt += item.cnt;
          data.amount += item.amount;
        });
      });
      return data;
    },
  },
  components: {
    navs
  }
};
</script>
