<template>
  <div>
    <el-button type="primary"
               @click="openDialog(1,'新建标签')">新建标签</el-button>
    <el-input v-model="keywords"
              placeholder="请输入标签名称"
              style="width:300px;"
              class="pull-right">
      <el-button slot="append"
                 icon="el-icon-search"
                 @click="search"></el-button>
    </el-input>
    <el-table class="ukao-el-table m-t"
              :data="tableList"
              v-loading="loading">
      <el-table-column label="标签名">
        <template slot-scope="scope">
          <p>{{scope.row.name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="自助收款码数量">
        <template slot-scope="scope">
          <p>{{scope.row.selfCnt || 0}}</p>
        </template>
      </el-table-column>
      <el-table-column label="指定金额收款码数量">
        <template slot-scope="scope">
          <p>{{scope.row.fixCnt || 0}}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | getDate}}</p>
          <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="openDialog(2,'编辑',scope.row)">编辑</el-button>
          <span class="m-r-xs m-r-xs">-</span>
          <el-button type="text"
                     @click="deleteTips(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="text-right m-t-lg">
      <el-pagination :current-page.sync="pagination.current"
                     :page-size="pagination.size"
                     layout="total, prev, pager, next"
                     :total="pagination.total"
                     @current-change="updateUrl"> </el-pagination>
    </div>
    <el-dialog custom-class="ukao-dialog-xs"
               :title="dialog.title"
               :visible.sync="dialog.visible">
      <el-form ref="ruleForm"
               label-width="100px"
               :model="ruleForm">
        <el-form-item label="标签名称"
                      :rules="[
                        { required: true, message: '标签名不能为空' },
                        { min: 2, max: 24, message: '长度在2到24个字符之间' }
                      ]"
                      prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary"
                   @click="submit('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";

export default {
  data() {
    return {
      keywords: "",
      loading: false,
      tableList: [],
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      dialog: {
        visible: false,
        title: "",
        type: 1 //
      },
      ruleForm: {
        id:'',
        name: ""
      }
    };
  },
  created() {
    this.init();
    this.getList();
  },
  watch: {
    $route() {
      this.init();
      this.getList();
    }
  },
  methods: {
    init() {
      let data = this.$route.query;
      if (JSON.stringify(data) != "{}") {
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
    search(){
      this.getList();
      this.keywords=""
    },
    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "cashierTag/list",
          data:{
            keywords:this.keywords
          },
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.tableList = res.data.data.list || [];
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    
    openDialog(type, title, item) {
      this.dialog.type = type;
      this.dialog.title = title;
      this.dialog.visible = true;
      if (type === 1 && this.ruleForm.name) {
        this.ruleForm.name = "";
      }
      if (item) {
        this.ruleForm.name = item.name;
        this.ruleForm.id=item.id;
      }
    },
    //事件
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialog.type === 1 ? this.createData() : this.editData();
        }
      });
    },

    deleteTips(id) {
      let _this=this;
       msg.confirm({msg:'确定删除?',
            confirmFn(){
              _this.$store.dispatch('post', {
                uri: 'cashierTag/delete',
                data: {id: id}
              }).then((res) => {
                msg.success();
                _this.getList();
              });
						}
          })
    },
    // 创建标签
    createData() {
      this.$store
        .dispatch("post", {
          uri: "cashierTag/add",
          data: {
            name: this.ruleForm.name
          }
        })
        .then(res => {
          this.pagination.current > 1
            ? this.updateUrl()
            : (this.pagination.current = 1);
          msg.success();
          this.getList();
          this.dialog.visible = false;
        });
    },
    //
    editData() {
      this.$store
        .dispatch("post", {
          uri: "cashierTag/update",
          data: {
           id:this.ruleForm.id,
           name:this.ruleForm.name
          }
        })
        .then(res => {
          this.getList();
          msg.success();
          this.dialog.visible = false;
        });
    }
  },
};
</script>
