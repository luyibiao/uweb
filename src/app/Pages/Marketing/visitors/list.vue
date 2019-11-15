<style lang="less" scoped>
.formbox {
  max-width: 420px;
}

.form-label {
  width: 60px;
  line-height: 36px;
}

.form-input {
  margin-left: 80px;
}
</style>

<template>
  <div>
    <auth perm="marketing.visitors.update">
      <div class="text-right">
        <el-button type="primary" @click="dialogVisible=true">新建团卡</el-button>
      </div>
    </auth>
    <!-- 表格列表 -->
    <div class="m-t-lg ukao-v-loading">
      <el-table class="ukao-el-table m-t"
                :data="tableList"
                v-loading="loading">
        <el-table-column label="名称"
                         prop="name">
          <template slot-scope="scope">
            <router-link class="text-primary"
                         :to="'/marketing/visitors/detail/'+scope.row.id">{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | getDate}}</p>
            <p>{{scope.row.createTime | getTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="折扣">
          <template slot-scope="scope">
            <p>{{scope.row.cardName}}</p>
            <p>{{getDiscount(scope.row.cardDiscount,scope.row.rights)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="卡数量（张）"
                         prop="cardCnt">
        </el-table-column>
        <el-table-column min-width="100"
                         label="备注"
                         prop="remark">
        </el-table-column>
        <el-table-column width="100"
                         label="操作">
          <template slot-scope="scope">
            <router-link class="text-primary"
                         :to="'/marketing/visitors/detail/'+scope.row.id">详情</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="text-right m-t-lg"
         v-if="pagination.total">
      <el-pagination :current-page.sync="pagination.current"
                     :page-size="pagination.size"
                     layout="total, prev, pager, next"
                     :total="pagination.total"
                     @current-change="nextPage">
      </el-pagination>
    </div>
    <!-- 新建弹框 -->
    <el-dialog title="新建团卡"
               :visible.sync="dialogVisible"
               :lock-scroll="false"
               size="tiny">
      <div class="formbox">
        <div class="clearfix">
          <label class="pull-left text-right form-label">
            <span class="text-danger m-r-xs">*</span>名称</label>
          <div class="form-input">
            <el-input v-model.trim="form.name"
                      placeholder="请输入团卡名称"></el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">
            <span class="text-danger m-r-xs">*</span>会员卡</label>
          <div class="form-input">
            <el-select v-model="form.cardId"
                       placeholder="请选择">
              <el-option v-for="item in cardList"
                         :key="item.info.id"
                         :label="item.info.name"
                         :value="item.info.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">备注</label>
          <div class="form-input">
            <el-input type="textarea"
                      v-model.trim="form.remark"
                      placeholder="请填写制作充值卡的备注(自己可见)"></el-input>
          </div>
        </div>
        <div class="m-t-md">
          <div class="form-input text-right">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="submit">确 定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
export default {
  data() {
    return {
      loading: false, //加载中
      dialogVisible: false, //显示新建团卡弹窗
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      tableList: [
        //表格数据
      ],
      cardList: [], //可选择的会员卡列表
      form: {
        //新建团卡表单信息
        name: "", //名称
        cardId: "", //会员卡
        remark: "" //备注
      },
      restart: false //新建团卡标识
    };
  },
  created() {
    this.initParams();
    this.getTableList();
    this.getCardList();
  },
  watch: {
    $route() {
      // 新建团卡触发的修改不请求数据
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
        path: "/marketing/visitors/list",
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
          uri: "groupCard/list",
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
    getCardList() {
      //获取可选择的会员卡列表
      this.$store
        .dispatch("get", {
          uri: "userCard/list"
        })
        .then(res => {
          this.cardList = res.data.data.list;
        });
    },
    addGroupCard() {
      //新增团卡
      this.$store
        .dispatch("post", {
          uri: "groupCard/add",
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
      let nameWarn = "",
        cardWarn = "";
      if (this.form.name.length < 2 || this.form.name.length > 8) {
        nameWarn = "团建名长度应在 2 至 8 个字符之间！";
      }
      if (this.form.cardId == "") {
        cardWarn = "请选择会员卡！";
      }
      if (nameWarn || cardWarn) {
        this.$message({
          message: `${nameWarn} ${cardWarn}`,
          type: "error",
          duration: 2000
        });
      } else {
        this.addGroupCard();
      }
    },
    getDiscount(dis, rights) {
      // 获取折扣
      if (rights.split("")[1] == 0 || !dis || dis == 100) {
        return "无折扣";
      } else {
        return dis / 10 + "折";
      }
    },
    nextPage() {
      //分页跳转
      // 新建团卡触发的修改不触发
      if (!this.restart) {
        this.updateUrl();
      }
    }
  }
};
</script>
