<template>
  <div>
    <el-row>
      <el-col :lg="21"
              :md="21">
        <div>
          <div class="table-right b-a">
            <ul class="b-b">
              <li v-for="(item,index) in productTypeTotalList"
                  @click="chooseCategory(item)"
                  :key="index"
                  :class="{ 'is-active': item.typeId == tableData.typeId }">
                <span v-text="item.typeName"></span>
                (
                <span v-text="item.cnt"></span>)
              </li>
            </ul>
          </div>
          <el-table ref="tableData"
                    :data="tableData.list"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    class="ukao-el-table"
                    v-loading="loading">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column label="图片"
                             width="100">
              <template slot-scope="scope">
                <img class="thumb"
                     :src="scope.row.imgPath || '/static/img/product/wxdef.png'"
                     alt="">
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <router-link :to="'/marketing/group/info/'+scope.row.id"
                             class="text-primary"
                             target="_blank">{{scope.row.name}}</router-link>
              </template>

            </el-table-column>
            <el-table-column label="所属经营项目">
              <template slot-scope="scope">
                <div v-if="scope.row.exp">
                  <p v-text="scope.row.exp.mercBusinessName"></p>
                  <!--<p v-if="scope.row.exp.mercBusinessName != scope.row.exp.businessName">-->
                    <!--（{{scope.row.exp.businessName}}）-->
                  <!--</p>-->
                </div>
              </template>
            </el-table-column>
            <el-table-column label="价格"
                             min-width="200">
              <template slot-scope="scope"
                        v-if="scope.row.serviceList">
                <p v-for="(item,index) in scope.row.serviceList"
                   :key="index">
                  <span>{{item.serviceName}}</span>:
                  <span>{{item.price | amtFormat}}</span>
                  <span>{{scope.row.exp.unit}}</span>
                  <span class="m-l-xs text-danger" v-if="mercInfo.isOpenVipPrice && typeof(item.vipPrice) == 'number'">会员价:{{item.vipPrice | amtFormat}}{{scope.row.exp.unit}}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="所属产品类别"
                             prop="exp.typeName">
            </el-table-column>
            <el-table-column label="首字母"
                             prop="firstWord">
            </el-table-column>
            <el-table-column label="序号"
                             prop="sortNo">
            </el-table-column>
            <el-table-column label="折扣">
              <template slot-scope="scope">
                <p>{{ scope.row.exp.saleTypeName }}</p>
                <p v-if="scope.row.saleType == 2">{{ scope.row.discount }}%</p>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.status == 1"
                            effect="dark"
                            content="已启用"
                            placement="right">
                  <i class="t-state t-state-success"></i>
                </el-tooltip>
                <el-tooltip v-if="scope.row.status == 0"
                            effect="dark"
                            content="未启用"
                            placement="right">
                  <i class="t-state"></i>
                </el-tooltip>
                <el-tooltip v-if="scope.row.status == -1"
                            effect="dark"
                            content="已删除"
                            placement="right">
                  <i class="t-state"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :lg="24"
              :md="24">
        <div class="pull-left">
          <auth perm="marketing.group.price">
            <el-button type="success"
                     size="small"
                     :disabled="btn.enable"
                     @click="updateStatusEnable">启用</el-button>
            <el-button type="danger"
                     size="small"
                     :disabled="btn.disable"
                     @click="updateStatusDisable">停用</el-button>
            <el-button type="danger"
                     size="small"
                     :disabled="btn.delete"
                     @click="updateStatusDelete">删除</el-button>
          </auth>
        </div>
        <div class="pull-right">
          <el-pagination :current-page.sync="pagination.current"
                         :page-size="pagination.size"
                         layout="total, prev, pager, next"
                         :total="pagination.total"
                         @current-change="nextPage">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
import helpers from "@/utils/helpers/base";
import product from "@/utils/mixins/product_detail";

export default {
  props: ["id"],
  mixins: [product],
  data() {
    return {
      tableData: {
        businessId: "",
        typeId: "",
        keywords: "",
        pageStart: 0,
        list: [],
        expList: [] //扩展内容
      },
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      btn: {
        //操作btn
        enable: true, //启用
        disable: true, //停用
        delete: true //删除
      },
      multipleSelection: [], //多选列表
      pageParams: {},
      productTypeTotalList: [], //所属产品类别合计
      loading: true
    };
  },
  created() {},
  watch: {
    multipleSelection() {
      let bl = !(this.multipleSelection && this.multipleSelection.length > 0);
      this.btn = {
        enable: bl,
        disable: bl,
        delete: bl
      };
    }
  },
  filters: {
    //数据过滤器
    numFormat: function(value) {
      return helpers.numFormat({ value, fixed: 2 });
    }
  },
  methods: {
    getDataFlag(tabsName, flag) {
      if (tabsName === "price" && flag) {
        this.getunionList();
        this.initParams();
      }
    },
    updateStatusEnable() {
      //启用
      let list = this.multipleSelection;
      let ids = this.selectionIds(list);
      this.$store
        .dispatch("batch", {
          uri: "productInfo/enableBatch",
          data: {
            ids: ids
          }
        })
        .then(res => {
          msg.success();
          this.list(this.tableData.pageStart);
        });
    },
    updateStatusDisable() {
      //停用
      let list = this.multipleSelection;
      let ids = this.selectionIds(list);
      this.$store
        .dispatch("batch", {
          uri: "productInfo/disableBatch",
          data: {
            ids: ids
          }
        })
        .then(res => {
          msg.success();
          this.list(this.tableData.pageStart);
        });
    },
    updateStatusDelete() {
      //删除
      var _this = this;
      msg.confirm({
        msg: "此操作将永久删除选中项, 是否继续?",
        confirmFn: function() {
          let list = _this.multipleSelection;
          let ids = _this.selectionIds(list);
          _this.$store
            .dispatch("batch", {
              uri: "productInfo/deleteBatch",
              data: {
                ids: ids
              }
            })
            .then(res => {
              msg.success();
              _this.list(_this.tableData.pageStart);
            });
        }
      });
    },
    selectionIds(list) {
      //获取选择id
      let ids = [];
      list.forEach(function(item) {
        ids.push(item.id);
      });
      return ids.join(",");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    getProductTypeTotalList(fn) {
      this.$store
        .dispatch("getList", {
          uri: "productInfo/unionTypeTotal",
          data: {
            unionId: this.id,
            businessId:this.tableData.businessId || ''
          }
        })
        .then(res => {
          let list = res.data.data || [];
          let cnt = 0;
          if (list && list.length >= 0) {
            list.forEach(function(item) {
              cnt += item.cnt;
            });
          }
          this.productTypeTotalList = list;
          this.productTypeTotalList.unshift({
            typeName: "所有产品类别",
            cnt: cnt,
            typeId: "",
            id: ""
          });
        });
    },
    getunionList() {
      let _this = this;
      this.$store
        .dispatch("post", {
          uri: "productInfo/unionList",
          data: {
            unionId: this.id,
            typeId: this.tableData.typeId || "",
            keywords: this.tableData.keywords || "",
            businessId: this.tableData.businessId || "",
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          let list = res.data.data.list || [];
          let expList = res.data.expList || [];
          let productServiceList = res.data.productServiceList || [];
          list.forEach(function(item, index) {
            item.exp = _this.filterData(expList, item.id);
            productServiceList.forEach(function(sitem) {
              if (sitem.info.id == item.id) {
                item.serviceList = sitem.serviceRelExp || [];
                return false;
              }
            });
          });
          this.loading = false;
          this.tableData.list = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.getProductTypeTotalList();
        });
    },
    getKeywordsAndbuss(val) {
      let Arr = val.split(",");
      this.tableData.keywords = Arr[1];
      this.tableData.businessId = Arr[0];
      this.search();
    },
    search() {
      this.getunionList();
    },
    chooseCategory(item) {
      this.tableData.typeId = item.typeId || "";
      this.search();
    },

    initParams() {
      this.markNo = this.$route.params.markNo;
      //初始化分页数据
      if (this.$route.query.current) {
        this.pagination.current = parseInt(this.$route.query.current) || 1;
      }
    },
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current
        }
      });
      this.getunionList();
    },
    nextPage() {
      // 新建单位触发的分页修改不执行
      this.updateUrl();
    },
    filterData(list, id) {
      //数据过滤
      if (!list && id != "") return;
      let tmpItem = null;
      list.forEach(function(item) {
        if (id && item.id === id) {
          tmpItem = item;
          return false;
        }
      });
      return tmpItem;
    }
  }
};
</script>
<style>
.table-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 180px;
  overflow: auto;
  text-align: center;
  z-index: 10;
  background-color: white;
}
.table-right ul li {
  line-height: 40px;
}
.table-right ul li.is-active,
.table-right ul li:hover {
  background-color: #f8f8f8;
  cursor: pointer;
}
</style>
>