<template>
  <div>
    <div>
      <div class="dis-inline m-r m-b-sm">
        状态：
        <el-select clearable
                   v-model="searchKeys.useState"
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
                  placeholder="请输入电子标签卡编号"></el-input>
      </div>
      <div class="dis-inline m-b-sm">
        <el-button type="primary"
                   @click="getTableList(1)">查询</el-button>
      </div>
    </div>

    <!-- 表格列表 -->
    <div class="m-t-lg ukao-v-loading">
      <el-table class="ukao-el-table m-t"
                :data="tableList"
                v-loading="loading"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="40">
        </el-table-column>
        <el-table-column label="卡编号"
                         prop="name">
          <template slot-scope="scope">
            <router-link class="text-primary"
                         :to="'/marketing/mark/detail/'+scope.row.markNo">{{scope.row.markNo}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="商户"
                         prop="mercName">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | getDate}}</p>
            <p>{{scope.row.createTime | getTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="使用次数">
          <template slot-scope="scope">
            <p class="text-primary">{{scope.row.bindCnt}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===1">
              <p v-if="scope.row.useState===0"
                 class="text-muted">未使用</p>
              <p v-else-if="scope.row.useState===1"
                 class="text-success">已使用</p>
            </span>
            <p v-else-if="scope.row.status===0"
               class="text-danger">
              已失效
            </p>
          </template>
        </el-table-column>
        <el-table-column min-width="100"
                         label="备注"
                         prop="remark">
        </el-table-column>
        <el-table-column width="100"
                         label="操作">
          <template slot-scope="scope">
            <router-link class="text-primary"
                         :to="'/marketing/mark/detail/'+scope.row.markNo">查看</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="text-right m-t-sm"
         v-if="pagination.total">

      <div class="pull-left">
        <auth perm="marketing.mark.update">
          <el-button size="small"
                   :disabled="btn.enable"
                   type="success"
                   @click="updateStatus(1)">启用</el-button>
          <el-button size="small"
                   :disabled="btn.disable"
                   type="danger"
                   @click="updateStatus(0)">作废</el-button>
        </auth>
        <auth perm="marketing.mark.export">
          <el-button size="small" style="margin-left: 10px"
                   @click="exportXls">导出</el-button>
        </auth>
      </div>

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
import validate from "@/utils/helpers/validate";
import time from "@/utils/helpers/timeLite";
import keyval from "@/utils/dickeyval";
import msg from "@/utils/msg";

export default {
  data() {
    return {
      loading: false, //加载中
      dialogVisible: false, //显示新建单位弹窗
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      multipleSelection: [], //多选列表
      searchKeys: {
        type: "",
        keywords: "",
        status: "",
        useState: ""
      },
      status: "",
      useState: "",
      statics: keyval["MARK_STATUS"],
      tableList: [
        //表格数据
      ],
      btn: {
        //操作btn
        enable: true, //启用
        disable: true //作废
      }
    };
  },
  created() {
    this.initParams();
    this.getTableList();
  },
  watch: {
    multipleSelection() {
      let bl = !(this.multipleSelection && this.multipleSelection.length > 0);
      this.btn = {
        disable: bl,
        enable: bl
      };
    },
    $route() {
      // 新建单位触发的修改不请求数据
      this.initParams();
      this.getTableList();
    }
  },
  methods: {
    initParams() {
      //初始化分页数据
      if (this.$route.query.current) {
        this.pagination.current = parseInt(this.$route.query.current) || 1;
      }
    },
    getTableList() {
      //获取数据列表
      this.loading = true;
      let _this = this;
      _this = _this.checkStatus(_this);
      this.$store
        .dispatch("get", {
          uri: "markCard/list",
          params: {
            status: _this.status,
            markNo: _this.searchKeys.keywords,
            useState: _this.useState,
            startRow: (_this.pagination.current - 1) * _this.pagination.size,
            pageSize: _this.pagination.size
          }
        })
        .then(res => {
          this.loading = false;
          this.tableList = res.data.data.list;
          this.pagination.total = res.data.data.total;
        });
    },
    // 跳转更新url
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current
        }
      });
    },
    nextPage() {
      // 新建单位触发的分页修改不执行
      this.updateUrl();
    },
    exportXls() {
      let _this = this;
      _this.checkStatus(_this);
      let params = "status=" + (_this.status || "");
      params += "&markNo=" + (_this.searchKeys.keywords || "");
      params += "&useState=" + (_this.useState || "");
      window.open(consts.BASE_URL + "/export/markCard/list?" + params);
    },
    updateStatus(type) {
      let _this = this;
      msg.confirm({
        msg: "此操作将作废选中的RFID标签卡, 是否继续?",
        confirmFn: function() {
          let list = _this.multipleSelection;
          let ids = type
            ? _this.selectEnableIds(list, _this)
            : _this.selectDisableIds(list, _this);
          if (!ids) return;
          _this.$store
            .dispatch("batch", {
              uri: "markCard/updateCardStatus",
              data: {
                idArr: ids,
                status: type
              }
            })
            .then(res => {
              msg.success();
              _this.getTableList();
            });
        }
      });
    },
    selectDisableIds(list, _this) {
      //获取作废选择id
      let ids = [];
      let flag = true;
      list.forEach(function(item) {
        if (item.useState || !item.status) {
          _this.$message(item.markNo + "标签的状态不处于未使用，无法修改");
          flag = false;
          return;
        }
        ids.push(item.id);
      });
      ids = flag ? ids : [];
      return ids.join(",");
    },
    selectEnableIds(list, _this) {
      let ids = [];
      let flag = true;
      list.forEach(function(item) {
        //获取启用选择id
        if (item.status) {
          _this.$message(item.markNo + "标签的状态不处于失效，无法修改");
          flag = false;
          return;
        }
        ids.push(item.id);
      });
      ids = flag ? ids : [];
      return ids.join(",");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkStatus(_this) {
      if (_this.searchKeys.useState == -1) {
        _this.useState = 0;
        _this.status = 0;
      } else if (_this.searchKeys.useState) {
        _this.useState = _this.searchKeys.useState;
        _this.status = 1;
      } else {
        _this.useState = "";
        _this.status = "";
      }
      return _this;
    }
  }
};
</script>
