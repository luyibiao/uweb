<template>
  <div>
    <auth perm="marketing.ucard.update">
      <div class="text-right">
        <el-button type="primary" @click="dialogVisible=true">新建单位</el-button>
      </div>
    </auth>
    <!-- 表格列表 -->
    <div class="m-t-lg ukao-v-loading">
      <el-table class="ukao-el-table m-t" :data="tableList" v-loading="loading">
        <el-table-column label="单位名称" prop="name">
          <template slot-scope="scope">
            <router-link class="text-primary" :to="'/marketing/ucard/detail/'+scope.row.id">{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | getDate}}</p>
            <p>{{scope.row.createTime | getTime}}</p>            
          </template>
        </el-table-column>
        <el-table-column label="卡数量（张）" prop="cardCnt">
        </el-table-column>
        <el-table-column min-width="100" label="备注" prop="remark">
        </el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <router-link class="text-primary" :to="'/marketing/ucard/detail/'+scope.row.id">详情</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="text-right m-t-lg" v-if="pagination.total">
      <el-pagination 
        :current-page.sync="pagination.current" 
        :page-size="pagination.size" 
        layout="total, prev, pager, next" 
        :total="pagination.total" 
        @current-change="nextPage">
      </el-pagination>
    </div>
    <!-- 新建弹框 -->
    <el-dialog title="新建单位" class="ukao-dialog" :visible.sync="dialogVisible" :lock-scroll="false" >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="单位名称" prop="name">
          <el-input class="w-lg" v-model.trim="form.name" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="支付比例" prop="payRatio">
          <el-input placeholder="每笔订单支付的比例" v-model.trim="form.payRatio" class="w-sm m-r-xs"></el-input><span>%</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="w-lg" type="textarea" v-model.trim="form.remark" placeholder="请填写备注(自己可见)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
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
      tableList: [
        //表格数据
      ],
      form: {
        //新建单位表单信息
        name: "", //名称
        payRatio: "", //会员卡
        remark: "" //备注
      },
      rules: {
        name: [
          { required: true, message: "请输入单位名称", trigger: "blur" },
          { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
        ],
        payRatio: [
          { required: true, message: "请输入支付比例", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              validate.amount(value, 0, 0, 100)
                ? callback()
                : callback(new Error("请输入0 ~ 100的整数"));
            },
            trigger: "blur"
          }
        ]
      },
      restart: false //新建单位标识
    };
  },
  created() {
    this.initParams();
    this.getTableList();
  },
  watch: {
    $route() {
      // 新建单位触发的修改不请求数据
      if (!this.restart) {
        this.initParams();
        this.getTableList();
      }
    }
  },
  methods: {
    initParams() {
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
    },
    getTableList() {
      //获取数据列表
      this.loading = true;
      return this.$store
        .dispatch("get", {
          uri: "ucard/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.loading = false;
          this.tableList = res.data.data.list;
          this.pagination.total = res.data.data.total;
        });
    },
    addUcard() {
      //新增单位
      this.$store
        .dispatch("post", {
          uri: "ucard/add",
          data: this.form
        })
        .then(res => {
          this.restart = true;
          this.pagination.current = 1;
          this.updateUrl();
          this.getTableList().then(_ => {
            this.restart = false;
          });
          this.dialogVisible = false;
        });
    },
    submit() {
      // 提交新建团建资料
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addUcard();
        }
      });
    },
    nextPage() {
      // 新建单位触发的分页修改不执行
      if (!this.restart) {
        this.updateUrl();
      }
    }
  }
};
</script>
