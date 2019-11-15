<style lang="less" scoped>
.goods-logo {
  margin: 8px 0;
  width: 55px;
  height: 55px;
  display: block;
}
.amount {
  color: #f89f01;
}
.popover-header {
  line-height: 26px;
  padding: 6px 10px;
}
.popover-checkbox {
  width: 100%;
  height: 260px;
  padding: 8px 10px;
  box-sizing: border-box;
  background-color: #fff;
  overflow-y: auto;
}
.popover-footer {
  padding: 8px 20px;
}
.popover-box {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  .container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
  .btn {
    position: relative;
    z-index: 2;
  }
}

.flash{
  border-radius:10px;
  padding:0 5px;
  border:1px solid #FF4949;
  color: #fff;
  background-color: #FF4949;
}
</style>

<template>
  <div>
    <ul class="uk-search m-b-sm">
      <li class="uk-search-item">
        <div class="uk-search-label">商品类目：</div>
        <div class="uk-search-content w-sm">
          <el-select placeholder="请选择" clearable v-model="search.categoryId">
            <el-option
              value=""
              label="全部">
            </el-option>
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">商品分组：</div>
        <div class="uk-search-content w-sm">
          <el-select placeholder="请选择" clearable v-model="search.groupId">
            <el-option
              value=""
              label="全部">
            </el-option>
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </li>
      <li class="uk-search-item">
        <div class="uk-search-label">关键字：</div>
        <div class="uk-search-content w-sm">
          <el-input v-model="search.keywords" prefix-icon="el-icon-search" placeholder="请输入"></el-input>
        </div>
      </li>
      <li class="uk-search-item">
        <el-button type="primary" @click="searchData">筛选</el-button>
      </li>
      <li class="pull-right">
        <auth perm="shops.list.update">
          <el-button type="primary" @click="$router.push('create')">发布商品</el-button>
        </auth>
      </li>
    </ul>
    <el-tabs type="card" class="m-b-sm" v-model="search.status"  @tab-click="handleTabChange">
      <el-tab-pane label="出售中" name="1"></el-tab-pane>
      <el-tab-pane label="已售罄" name="2"></el-tab-pane>
      <el-tab-pane label="仓库中" name="3"></el-tab-pane>
    </el-tabs>
    <el-table
      class="m-b"
      v-loading = "loading"
      :data="tabelData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column
        class-name="cell-pd0"
        width="55"
        label="商品">
        <template slot-scope="scope">
           <img class="goods-logo" :src="scope.row.imgPath">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="价格">
        <template slot-scope="scope">
          <router-link class="text-primary" :to="'edit/'+scope.row.id">{{scope.row.name}}</router-link>
          <p class="amount">￥{{scope.row.price | amtFormat}} <span class="" v-if="scope.row.flashSale" class="flash text-xs">限时折扣</span></p>
          <p style="text-decoration: line-through" v-if="scope.row.mktprice > 0">￥{{scope.row.mktprice | amtFormat}}</p>
        </template>
      </el-table-column>
      <!--<el-table-column label="浏览量">-->
        <!--<template slot-scope="scope">-->
          <!--<p>{{scope.row.viewCount}}</p>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="store"
        label="库存">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime | getDate}}
          {{scope.row.createTime | getTime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="buyCount"
        label="总销量">
      </el-table-column>
      <el-table-column
        label="序号">
        <template slot-scope="scope">
          <el-popover
          placement="right"
          width="130"
          :show="onEditSort(scope.row)"
          v-model="scope.row.sortVisible">
            <div>
              <el-input style="width: 80px" size="mini" v-model="scope.row.editSort"></el-input>
              <el-button size="mini" type="text" @click="updateSort(scope.row)">确定</el-button> <span class="text-muted">|</span>
              <el-button size="mini" type="text" @click="scope.row.sortVisible = false">取消</el-button>
            </div>
            <el-button type="text" slot="reference">{{scope.row.sort}}</el-button>
          </el-popover>

        </template>
      </el-table-column>

      <el-table-column label="所属分组">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.groupList" style="margin-left: 3px" :close-transition="true" :key="index">{{item.name}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <auth perm="shops.list.update">
            <el-button type="text" @click="$router.push('edit/'+scope.row.id)">编辑</el-button>
            <span>-</span>
            <el-button type="text" @click="deletedOne(scope.row.id)">删除</el-button>
            <template slot="noPerm">-</template>
          </auth>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfix" v-if="pagination.total">
      <div class="pull-left">
        <auth perm="shops.list.update">
          <div class="popover-box">
            <el-popover
              ref="popover"
              popper-class="no-pad-popover"
              placement="top-start"
              v-model="showPopover"
              width="180">
              <div>
                <div class="popover-header">
                  <span>修改分组</span>
                  <el-button class="pull-right" size="small" type="text">管理分组</el-button>
                </div>
                <div class="popover-checkbox b-b  b-t">
                  <el-checkbox-group
                    v-model="selectedGroup">
                    <p v-for="item in groupList" :key="item.id">
                      <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
                    </p>
                  </el-checkbox-group>
                </div>
                <div class="popover-footer">
                  <el-button size="mini" type="primary" @click="groupBatch">保存</el-button>
                  <el-button size="mini" @click="showPopover = false">取消</el-button>
                </div>
              </div>
            </el-popover>
            <span v-popover:popover class="container"></span>
            <el-button class="btn" @click="beforeBatch(beforeGroupBatch)" size="small">改分组</el-button>
          </div>
          <el-button size="small" v-if="search.status !== '2'" @click="beforeBatch(shelves)">{{search.status === '1' ? '下架':'上架'}}</el-button>
          <el-button size="small" @click="beforeBatch(deleted)">删除</el-button>
        </auth>
      </div>
      <div class="pull-right">
        <el-pagination 
          :current-page.sync="pagination.current" 
          :page-size="pagination.size" 
          layout="total, prev, pager, next" 
          :total="pagination.total" 
          @current-change="updateUrl"/>
      </div>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import consts from "@/utils/consts";

export default {
  data() {
    return {
      loading: false,
      search: {
        keywords: "",
        status: "1",
        groupId: "",
        categoryId: ""
      },
      pagination: {
        current: 1,
        size: consts.PAGE_SIZE,
        total: 0
      },
      tabelData: [], //数据列表
      categoryList: [], //类目列表
      groupList: [], //分组列表
      editList: [], // 批量编辑列表
      selectedGoods: [], //选择的商品id列表
      selectedGroup: [], //选择的商品分组id列表
      showPopover: false
    };
  },
  created() {
    this.initParams();
    this.getList();
    this.getCategoryList();
    this.getGroupList();
  },
  watch: {
    $route() {
      this.initParams();
      this.getList();
    }
  },
  methods: {
    // 初始化搜索参数
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current);
        this.search.keywords = data.keywords;
        this.search.status = data.status;
        this.search.groupId = parseInt(data.groupId) || "";
        this.search.categoryId = parseInt(data.categoryId) || "";
      }
    },
    onEditSort(item) {
      item.editSort = item.sort;
    },
    updateSort(item){
      this.$store.dispatch("post", {
          uri: "goodsInfo/updateSort",
          data: {
            id: item.id,
            sort: item.editSort
          }
        }).then(_ => {
          msg.success();
          item.sort = item.editSort;
          item.sortVisible = false;
      });
    },
    // 更新url
    updateUrl() {
      this.$router.push({
        path: this.$route.path,
        query: {
          current: this.pagination.current,
          keywords: this.search.keywords,
          status: this.search.status,
          groupId: this.search.groupId,
          categoryId: this.search.categoryId
        }
      });
    },
    // 搜索数据
    searchData() {
      this.pagination.current = 1;
      this.updateUrl();
    },
    // tab栏改变
    handleTabChange() {
      this.search.keywords = "";
      this.search.categoryId = "";
      this.search.groupId = "";
      this.searchData();
    },
    // 获取数据列表
    getList() {
      var _this = this;
      this.loading = true;
      let data = {
        startRow: (this.pagination.current - 1) * this.pagination.size,
        pageSize: this.pagination.size,
        keywords: this.search.keywords,
        groupId: this.search.groupId,
        categoryId: this.search.categoryId
      };
      if (this.search.status === "2") {
        data.isSoldout = 0;
        data.marketable = 0;
      } else if (this.search.status === "3") {
        data.isStore = 0;
        data.marketable = 0;
      } else {
        data.marketable = 1;
      }
      this.$store
        .dispatch("post", {
          uri: "goodsInfo/list",
          data
        })
        .then(res => {
          this.loading = false;
          var list = res.data.data.list || [];
          this.pagination.total = res.data.data.total;
          list.forEach(function (item) {
            //[{"id":2,"name":"12寸蛋糕"},{"id":4,"name":"8寸蛋糕"},{"id":6,"name":"14寸蛋糕"}]
            item.groupList = item.groups ? JSON.parse(item.groups) : [];
            item.sortVisible = false;
          });
          this.tabelData = list
        });
    },
    // 获取分组列表
    getGroupList() {
      this.$store
        .dispatch("post", {
          uri: "goodsGroup/list"
        })
        .then(res => {
          this.groupList = res.data.data.list;
        });
    },
    // 获取类目列表
    getCategoryList() {
      this.$store
        .dispatch("post", {
          uri: "categoryInfo/list"
        })
        .then(res => {
          this.categoryList = res.data.data.list;
        });
    },
    // 商品列表选择项发生变化时,获取选中的商品ids
    handleSelectionChange(selection) {
      let arr = [];
      selection.forEach(item => {
        arr.push(item.id);
      });
      this.selectedGoods = arr;
    },
    // 批量操作前先验证是否选择商品
    beforeBatch(fn) {
      if (!this.selectedGoods.length) {
        msg.warning("请选择商品", 1500);
        return false;
      }
      fn && fn();
    },
    // 批量操作成功
    successBatch(text) {
      msg.success(text, 1500);
      this.getList();
    },
    // 操作商品上下架
    shelves() {
      let txt = this.search.status !== "1" ? "上架" : "下架";
      msg.confirm({
        msg: `确定${txt}这些商品？`,
        confirmFn: this.loadBatch
      });
    },
    // 删除商品
    deleted() {
      msg.confirm({
        msg: "删除后不可恢复，确定删除这些商品吗？",
        confirmFn: _ => {
          this.deleteBatch(this.selectedGoods.join(","));
        }
      });
    },
    // 删除单个商品
    deletedOne(id) {
      msg.confirm({
        msg: "删除后不可恢复，确定删除这件商品吗？",
        confirmFn: _ => {
          this.deleteBatch(id);
        }
      });
    },
    //提交 批量删除
    deleteBatch(ids) {
      this.$store
        .dispatch("post", {
          uri: "goodsInfo/deleteBatch",
          data: {
            ids
          }
        })
        .then(res => {
          this.successBatch("删除商品成功");
        });
    },
    //提交 批量上、下架
    loadBatch() {
      // 判断是上架还是下架
      let url = "goodsInfo/unloadBatch";
      let text = "下架";
      let ids = this.selectedGoods.join(",");
      if (this.search.status !== "1") {
        url = "goodsInfo/loadBatch";
        text = "上架";
      }
      this.$store
        .dispatch("post", {
          uri: url,
          data: {
            ids
          }
        })
        .then(res => {
          this.successBatch("批量" + text + "成功");
        });
    },
    //提交批量修改分组
    groupBatch() {
      if (!this.selectedGroup.length) {
        msg.warning("请选择分组");
        return false;
      }
      this.$store
        .dispatch("post", {
          uri: "goodsInfo/groupBatch",
          data: {
            ids: this.selectedGoods.join(","),
            groupIds: this.selectedGroup.join(",")
          }
        })
        .then(res => {
          this.successBatch("批量修改分组成功");
          this.showPopover = false;
        });
    },
    // 批量修改分组前，打开popover，清空之前的分组选择
    beforeGroupBatch() {
      this.showPopover = true;
      this.selectedGroup = [];
    }
  }
};
</script>
// goodsInfo/carriageBatch 批量修改运费  ids: 1,2,3,4 carriage:运费金额