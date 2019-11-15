<template>
  <div>
    <ul class="uk-search m-b">
      <li class="uk-search-item">
        <div class="uk-search-label">关键字：</div>
        <div class="uk-search-content w-sm">
          <el-input placeholder="请输入" v-model="keywords"></el-input>
        </div>
      </li>
      <li class="uk-search-item">
        <el-button type="primary" @click="search">筛选</el-button>
      </li>
      <li class="pull-right">
        <auth perm="shops.group.update">
          <el-button type="primary" @click="openDialogForm('add')">新建商品分组</el-button>
        </auth>
      </li>
    </ul>
    <el-table
      v-loading="loading"
      class="m-b ukao-el-table"
      :data="tabelData">
      <el-table-column
        label="分组名称">
        <template slot-scope="scope">
          <span class="text-primary">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="序号">
        <template slot-scope="scope">{{ scope.row.sort}}</template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="商品数">
        <template slot-scope="scope">{{ scope.row.goodsCnt}}</template>
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime | getDate}} {{ scope.row.createTime | getTime}}</template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <auth perm="shops.group.update">
            <el-button type="text" @click="openDialogForm('edit',scope.row)">编辑</el-button>
            <span>-</span>
            <el-button type="text" @click="deleted(scope.row.id)">删除</el-button>
            <template slot="noPerm">-</template>
          </auth>
        </template>
      </el-table-column>
    </el-table>
    <div class="pull-right">
      <el-pagination 
        :current-page.sync="pagination.current" 
        :page-size="pagination.size" 
        layout="total, prev, pager, next" 
        :total="pagination.total" 
        @current-change="updateUrl"/>
    </div>
    <el-dialog
      class="ukao-dialog"
      :visible.sync="dialog.show"
      :title="dialog.type == 'edit' ? '编辑商品分组' : '新建商品分组'">
      <el-form :model="dialog.form" label-width="150px" ref="form">
        <el-form-item label="组名" prop="name" :rules="[
            { required: true, message: '请输入组名' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ]">
          <el-input v-model.trim="dialog.form.name" class="w-lg" placeholder="请输入组名"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="sort" :rules="[
          { required: true, message: '请输入序号'},
          {validator:checkSort, trigger: 'blur'}
        ]">
          <el-input v-model.trim="dialog.form.sort" class="w-lg" placeholder="请输入序号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveDialogForm">确 定</el-button>
          <el-button @click="dialog.show = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
export default {
  data() {
    return {
      loading: false,
      keywords: "",
      tabelData: [],
      pagination: {
        current: 1,
        size: consts.PAGE_SIZE,
        total: 0
      },
      dialog: {
        show: false,
        type: "edit",
        form: {
          name: "",
          sort: ""
        }
      },
      editId: ""
    };
  },
  watch: {
    $route() {
      this.initParmas();
      this.getGroup();
    }
  },
  created() {
    this.initParmas();
    this.getGroup();
  },
  methods: {
    // 删除
    deleted(id) {
      this.editId = id;
      msg.confirm({
        msg: "删除后不可恢复，确定删除该分组吗？",
        confirmFn: this.delGroup
      });
    },
    // 开启分组弹窗
    openDialogForm(type, item = null) {
      this.dialog.show = true;
      // 类型（add:新增，edit:修改）
      this.dialog.type = type;
      this.$nextTick(_ => {
        this.$refs.form.resetFields();
        if (item) {
          this.dialog.form.name = item.name;
          this.dialog.form.sort = item.sort;
          this.editId = item.id;
        }
      });
    },
    // 保存分组弹窗
    saveDialogForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.dialog.type == "edit") {
            this.updatedGroup().then(_ => {
              msg.success("修改成功");
              this.getGroup();
              this.dialog.show = false;
            });
          } else {
            this.addGroup().then(_ => {
              msg.success("新建分组成功");
              this.getGroup();
              this.dialog.show = false;
            });
          }
        }
      });
    },
    // 验证序号
    checkSort(rule, value, callback) {
      validate.amount(value, 0, 0, 999999, true)
        ? callback()
        : callback(new Error("序号应是大于0的整数"));
    },
    // 获取分组
    getGroup() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "goodsGroup/list",
          data: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            keywords: this.keywords
          }
        })
        .then(res => {
          this.tabelData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          this.loading = false;
        });
    },
    // 删除分组
    delGroup() {
      this.$store
        .dispatch("post", {
          uri: "goodsGroup/delete",
          data: {
            id: this.editId
          }
        })
        .then(res => {
          msg.success("删除成功");
          this.getGroup();
        });
    },
    // 添加分组
    addGroup() {
      return this.$store.dispatch("post", {
        uri: "goodsGroup/add",
        data: {
          name: this.dialog.form.name,
          sort: this.dialog.form.sort
        }
      });
    },
    // 编辑分组
    updatedGroup() {
      return this.$store.dispatch("post", {
        uri: "goodsGroup/update",
        data: {
          id: this.editId,
          name: this.dialog.form.name,
          sort: this.dialog.form.sort
        }
      });
    },
    initParmas() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.current = parseInt(data.current) || 1;
        this.keywords = data.keywords;
      }
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
      this.pagination.current = 1;
      this.updateUrl();
    }
  }
};
</script>
