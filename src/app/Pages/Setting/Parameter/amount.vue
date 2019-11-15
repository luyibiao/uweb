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
      <p class="description m-b-md">在收银机入库时修改订单总价以及每件衣服小计金额的权限。</p>
      <div class="clearfix m-b-sm">
        <p class="pull-left text-black text-md font-bold" style="line-height:36px;">订单金额修改设置</p>
        <div class="pull-right">
          <el-input class="w m-r" v-model.trim="keywords" prefix-icon="el-icon-search" placeholder="请输入门店"></el-input>
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
		      label="修改订单总额">
		      <template slot-scope="scope">
		        <div :class="scope.row.chgOrderPrice ? 'text-success':'text-danger'">{{scope.row.chgOrderPrice ? '允许':'不允许'}}</div>
            <div v-if="scope.row.chgOrderPrice" class="text-muted">{{scope.row.chgOrderUp ? '只能往大的修改': '任意修改'}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="修改衣物金额">
		      <template slot-scope="scope">
		        <div :class="scope.row.chgProPrice ? 'text-success':'text-danger'">{{scope.row.chgProPrice ? '允许':'不允许'}}</div>
            <div v-if="scope.row.chgProPrice" class="text-muted">{{scope.row.chgProUp ? '只能往大的修改': '任意修改'}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
          width="120"
		      label="操作">
		      <template slot-scope="scope">
            <auth perm="setting.parameter.amt">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <template slot="noPerm">-</template>
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
		<el-dialog class="ukao-dialog"
      :visible.sync="dialogVisible"
      title="编辑">
      <div>
        <el-form :model="form" ref="form" label-width="150px">
          <el-form-item label="修改订单总额：" prop="chgOrderPrice">
            <div>
              <el-switch
                v-model="form.chgOrderPrice"
                active-text="允许"
                inactive-text="不允许"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </div>
            <el-radio-group v-model="form.chgOrderUp" v-if="form.chgOrderPrice">
              <p class="m-t-sm">
                <el-radio :label="true">只能往大的修改</el-radio>
              </p>
              <p class="m-t-sm">
                <el-radio :label="false">任意修改</el-radio>
              </p>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="修改衣物金额：" prop="chgProPrice">
            <div>
              <el-switch
                v-model="form.chgProPrice"
                active-text="允许"
                inactive-text="不允许"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </div>
            <el-radio-group v-model="form.chgProUp" v-if="form.chgProPrice">
              <p class="m-t-sm">
                <el-radio :label="true">只能往大的修改</el-radio>
              </p>
              <p class="m-t-sm">
                <el-radio :label="false">任意修改</el-radio>
              </p>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
           
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import msg from "@/utils/msg";
import consts from "@/utils/consts";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: true,
      keywords: "", //搜索关键字
      tableData: [], //数据
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      form: {
        //修改表格数据
        chgOrderPrice: false,
        chgOrderUp: false,
        chgProPrice: false,
        chgProUp: false
      },
      editData: null //待修改数据
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
      //初始化表格数据
      this.keywords = this.$route.query.keywords || "";
      this.pagination.current = parseInt(this.$route.query.current) || 1;
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
            keywords: this.keywords,
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
    edit(item) {
      // 编辑
      this.form.chgOrderPrice = item.chgOrderPrice == 1;
      this.form.chgOrderUp = item.chgOrderUp == 1;
      this.form.chgProPrice = item.chgProPrice == 1;
      this.form.chgProUp = item.chgProUp == 1;
      this.editData = item;
      this.dialogVisible = true;
    },
    submitEdit() {
      //保存修改
      if (
        !!this.editData.chgOrderPrice != this.form.chgOrderPrice ||
        !!this.editData.chgOrderUp != this.form.chgOrderUp ||
        !!this.editData.chgProPrice != this.form.chgProPrice ||
        !!this.editData.chgProUp != this.form.chgProUp
      ) {
        let data = {
          id: this.editData.id,
          chgOrderPrice: this.form.chgOrderPrice ? 1 : 0,
          chgOrderUp: this.form.chgOrderUp ? 1 : 0,
          chgProPrice: this.form.chgProPrice ? 1 : 0,
          chgProUp: this.form.chgProUp ? 1 : 0
        };
        this.$store
          .dispatch("post", {
            uri: "storeParam/update",
            data
          })
          .then(res => {
            msg.success("保存成功！");
            this.editData.chgOrderPrice = data.chgOrderPrice;
            this.editData.chgOrderUp = data.chgOrderUp;
            this.editData.chgProPrice = data.chgProPrice;
            this.editData.chgProUp = data.chgProUp;
            this.dialogVisible = false;
          });
      } else {
        msg.success("保存成功！");
        this.dialogVisible = false;
      }
    }
  }
};
</script>