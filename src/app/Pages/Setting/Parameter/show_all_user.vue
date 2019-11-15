<style lang="less" scoped>
  .description {
    display: inline-block;
    padding: 15px 20px;
    border-radius: 8px;
    background: #f3f7ff;
  }
</style>
<template>
  <div>
    <div class="m-t">
      <p class="description m-b-md">在收银机上店员是否有权限查看所有的客户信息，设置不允许查看只能通过搜索显示客户信息。</p>
      <div class="clearfix m-b-sm">
        <p class="pull-left text-black text-md font-bold" style="line-height:36px;">店员查看客户权限设置</p>
        <div class="pull-right">
          <el-input class="w m-r" prefix-icon="el-icon-search" v-model.trim="keywords" placeholder="请输入门店"></el-input>
          <el-button type="primary" @click="search">筛 选</el-button>
        </div>
      </div>
    </div>
    <div class="m-t-lg">
      <el-table class="ukao-el-table ukao-v-loading"
                :data="tableData"
                style="width: 100%" v-loading="loading">
        <el-table-column
          label="门店">
          <template slot-scope="scope">
            <div>{{ scope.row.storeName }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="店员查看所有客户信息">
          <template slot-scope="scope">
            <auth perm="setting.parameter.logistics">
              <el-switch
                v-model="scope.row.showAllUser"
                @change="statusChange(scope.row)"
                :active-value="1" :inactive-value="0"
                active-color="#13ce66" inactive-color="#ff4949"
                active-text="允许" inactive-text="不允许">
              </el-switch>
              <template slot="noPerm">
                <el-switch
                  v-model="scope.row.showAllUser"
                  :active-value="1" :inactive-value="0" disabled
                  active-color="#13ce66" inactive-color="#ff4949"
                  on-text="允许" off-text="不允许">
                </el-switch>
              </template>
            </auth>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-t-sm text-right">
        <el-pagination
          :page-size="pagination.size"
          :current-page.sync="pagination.current"
          @current-change="updateUrl"
          layout="total, prev, pager, next"
          :total="pagination.total">
        </el-pagination>
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
        loading: true,
        keywords: "", //搜索门店关键字
        tableData: [], //数据
        pagination: {
          size: consts.PAGE_SIZE,
          total: 0,
          current: 1
        }
      };
    },
    created() {
      this.init();
      this.getData();
    },
    watch: {
      $route() {
        this.init();
        this.getData();
      }
    },
    methods: {
      init() {
        let data = this.$route.query;
        this.pagination.current = parseInt(data.current) || 1;
        this.keywords = data.keywords || "";
      },
      updateUrl() {
        this.$router.push({
          path: this.$route.path,
          query: {
            current: this.pagination.current,
            keywords: this.keywords
          }
        });
      },
      search() {
        this.pagination.current > 1
          ? (this.pagination.current = 1)
          : this.updateUrl();
      },
      getData() {
        this.loading = true;
        //获取数据列表
        this.$store
          .dispatch("get", {
            uri: "storeParam/list",
            params: {
              startRow: (this.pagination.current - 1) * this.pagination.size,
              pageSize: this.pagination.size,
              keywords: this.keywords
            }
          })
          .then(res => {
            this.loading = false;
            this.tableData = res.data.data.list;
            this.pagination.total = res.data.data.total;
          });
      },
      // 更新门店跳过与工厂物流环节
      updateSkipLogistics(id, showAllUser) {
        this.$store
          .dispatch("post", {
            uri: "storeParam/update",
            data: {
              id,
              showAllUser
            }
          })
          .then(res => {
            msg.success();
          });
      },
      // 更改状态
      statusChange(value) {
        msg.confirm({
          msg: `${value.showAllUser ? "允许" : "不允许"}门店员工查看所有客户信息？`,
          confirmFn: _ => {
            this.updateSkipLogistics(value.id, value.showAllUser);
          },
          cancelFn: _ => {
            value.showAllUser = value.showAllUser ? 0 : 1;
          }
        });
      }
    }
  };
</script>

// 流程设置
