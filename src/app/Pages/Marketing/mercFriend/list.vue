<style lang="less" scoped>
.search {
  position: relative;
  .add {
    position: absolute;
    right: 0;
    top: 0;
  }
  ul {
    margin-right: 120px;
  }
  li {
    margin-bottom: 15px;
    margin-right: 15px;
  }
}
</style>

<template>
  <div>
    <div class="search">
      <ul class="uk-search">
        <li class="dis-inline ukao-form">
          <span class="m-r-sm">创建日期：</span>
          <el-date-picker v-model="search.time" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </li>
        <li class="dis-inline ukao-form">
          <span class="m-r-sm">友商：</span>
          <el-input class="w-sm" v-model="search.searchValue" placeholder="手机号或姓名"></el-input>
        </li>
        <li class="dis-inline ukao-form">
          <span class="m-r-sm">邀请方手机号：</span>
          <el-input class="w-sm" v-model="search.invitePhone"></el-input>
        </li>
        <li class="dis-inline ukao-form">
          <el-button type="primary" @click="updateUrl(1)">筛选</el-button>
        </li>
      </ul>
      <div class="add">
        <auth perm="marketing.friend.update">
          <el-button class="pull-right" type="primary" @click="openForm"><i class="el-icon-plus m-r-xs"></i>新建友商</el-button>
        </auth>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="ukao-el-table m-t"
      ref="multipleTable"
      :data="tableData"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        min-width="125"
        label="友商">
        <template slot-scope="scope">
          <p><router-link class="text-primary" :to="'/marketing/friend/detail/'+scope.row.id">{{scope.row.phone}}</router-link></p>
          <p><router-link class="text-primary" :to="'/marketing/friend/detail/'+scope.row.id">{{scope.row.name}}</router-link></p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="110"
        label="标识码">
        <template slot-scope="scope">
          <p>{{scope.row.spreadCode}}</p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="125"
        label="邀请方">
          <template slot-scope="scope">
          <p>{{scope.row.invitePhone || '-'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="180"
        label="加粉佣金">
          <template slot-scope="scope">
          <p>考验期数：{{scope.row.testDay}}天</p>
          <p>单粉佣金：{{scope.row.newFansAmt | amtFormat}}元/粉丝</p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="160"
        label="粉丝分润">
          <template slot-scope="scope">
          <p>分润期数：{{scope.row.profitDay}}天</p>
          <p v-if="scope.row.consumeType == 1">消费提成：{{scope.row.consume/100}}%</p>
          <p v-else>消费提成：{{scope.row.consume | amtFormat}}元</p>
          <p v-if="scope.row.rechargeType == 1">充值提成：{{scope.row.recharge/100}}%</p>
          <p v-else>充值提成：{{scope.row.recharge | amtFormat}}元</p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="120"
        label="客户数（人）">
          <template slot-scope="scope">
          <p>{{scope.row.fansCnt}}</p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="126"
        label="累计成交笔数">
          <template slot-scope="scope">
          <p>{{scope.row.fansOrderCnt}}</p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="126"
        label="累计成交金额">
          <template slot-scope="scope">
          <p class="text-success">{{scope.row.fansOrderAmount | amtFormat}}</p>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="操作">
          <template slot-scope="scope">
          <el-button type="text" @click="$router.push('/marketing/friend/detail/'+scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right m-t">
      <el-pagination 
        :page-size="pagination.size" 
        layout="total, prev, pager, next" 
        :total="pagination.total" 
        @current-change="lipPages"
        :current-page.sync="pagination.page">
      </el-pagination>
    </div>
    <el-dialog class="ukao-dialog " title="新建友商" :visible.sync="dialog.show">
      <el-form label-width="150px" :model="dialog.form" ref="form">
        <el-form-item label="用户名" prop="name" :rules="[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]">
          <el-input v-model.trim="dialog.form.name" class="w-xl"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" :rules="rules.tel">
          <el-input v-model="dialog.form.phone" class="w-xl"></el-input>
        </el-form-item>
        <el-form-item label="邀请方手机号" prop="invitePhone" :rules="rules.inviteTel">
          <el-input v-model="dialog.form.invitePhone" class="w-xl"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input  type="textarea" :rows="3" v-model="dialog.form.remark" class="w-xl"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialog.show = false">取消</el-button>
          <el-button type="primary" :loading="dialog.saving" @click="saveForm">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
import validate from "@/utils/helpers/validate";
export default {
  data() {
    return {
      loading: true,
      // 搜索内容
      search: {
        time: [],
        searchValue: "",
        invitePhone: ""
      },
      // 友商信息列表
      tableData: [],
      // 分页信息
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        page: 1
      },
      // 新建友商弹窗
      dialog: {
        show: false,
        form: {
          name: "",
          phone: "",
          invitePhone: "",
          remark: ""
        },
        saving: false
      },
      // 表单验证
      rules: {
        // 手机号
        tel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (validate.tel(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的手机号"));
              }
            },
            trigger: "blur"
          }
        ],
        // 推荐放手机号
        inviteTel: [
          {
            validator: (rule, value, callback) => {
              if (!value || validate.tel(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的手机号"));
              }
            },
            trigger: "blur"
          }
        ]
      },
      restart: false // 重置数据（控制url改变引起的多次数据请求）
    };
  },
  watch: {
    $route() {
      if (!this.restart) {
        this.initParams();
        this.getList();
      }
    }
  },
  created() {
    this.initParams();
    this.getList();
  },
  methods: {
    // 获取友商列表
    getList(fn) {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "friendInfo/list",
          data: {
            startRow: (this.pagination.page - 1) * this.pagination.size,
            pageSize: this.pagination.size,
            searchValue: this.search.searchValue,
            invitePhone: this.search.invitePhone,
            startDate: time.getDate(this.search.time[0]) || "",
            endDate: time.getDate(this.search.time[1]) || ""
          }
        })
        .then(res => {
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total || 0;
          this.loading = false;
          fn && fn();
        });
    },
    // 上传新建友商信息
    addFriend(fn) {
      this.$store
        .dispatch("post", {
          uri: "friendInfo/add",
          data: this.dialog.form,
          forceResolve: true
        })
        .then(res => {
          fn && fn(res);
        });
    },
    // 初始化参数
    initParams() {
      let data = this.$route.query;
      if (JSON.stringify(data) !== "{}") {
        this.pagination.page = parseInt(data.page) || 1;
        this.search.searchValue = data.searchValue;
        this.search.invitePhone = data.invitePhone;
        this.search.time = [data.startDate || "", data.endDate || ""];
      }
    },
    // 新建友商成功=>重置页面数据
    restartData() {
      this.restart = true;
      this.pagination.page = 1;
      this.search.time = [];
      this.search.searchValue = "";
      this.search.invitePhone = "";
      this.$router.push(this.$route.path);
      this.getList(_ => {
        this.restart = false;
      });
    },
    // 更新页面url参数
    updateUrl(start = 1) {
      if (!this.search.time) this.search.time = [];
      this.$router.push({
        path: this.$route.path,
        query: {
          page: start, //从第几页开始
          searchValue: this.search.searchValue,
          invitePhone: this.search.invitePhone,
          startDate: time.getDate(this.search.time[0]) || "",
          endDate: time.getDate(this.search.time[1]) || ""
        }
      });
    },
    // 翻页
    lipPages(value) {
      if (!this.restart) {
        this.updateUrl(value);
      }
    },
    // 打开新建友商表单
    openForm() {
      this.dialog.show = true;
      this.dialog.saving = false;
      this.$nextTick(_ => {
        this.$refs.form.resetFields();
      });
    },
    // 提交表单数据
    saveForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialog.saving = true;
          this.addFriend(res => {
            // 新建后重置数据
            if (res && res.data.httpCode == 200) {
              msg.success("新建成功！");
              this.restartData();
              this.dialog.show = false;
            } else {
              msg.error(res.data.msg);
            }
            this.dialog.saving = false;
          });
        }
      });
    },
    handleSelectionChange() {}
  }
};
</script>
// 友商列表