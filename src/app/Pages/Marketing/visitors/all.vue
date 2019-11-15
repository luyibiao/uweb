<style lang="less" scoped>
  .main-l {
    width: 320px;
    .link-back {
      line-height: 36px;
    }
  }

  .main-r {
    margin-left: 380px;
    overflow: hidden;
  }

  .num {
    font-size: 32px;
  }

  .details {
    padding: 30px 0;
    border: 1px solid #ecb07a;
    background-color: #fff3d3;
    border-radius: 5px;
    position: relative;
    .edit {
      /*display: none;*/
      position: absolute;
      right: 15px;
      top: 5px;
    }
    /*&:hover {*/
    /*.edit {*/
    /*display: block;*/
    /*}*/
    /*}*/
  }

  .fanchart {
    .title {
      padding: 0 20px;
      line-height: 32px;
      background-color: #f7f7f7;
    }
    .main {
      border: 1px solid #e5e5e5;
      width: 100%;
      height: 270px;
      box-sizing: border-box;
    }
  }

  .operation {
    overflow: hidden;
  }

  .formbox {
    margin: 0 auto;
    max-width: 410px;
    padding-right: 10px;
    line-height: 36px;
  }

  .form-label {
    width: 90px;
  }

  .form-input {
    margin-left: 100px;
  }
</style>


<template>
  <div>
    <el-row>
      <el-col :lg="24"
              :md="24">
        <div>
          <el-form :inline="true"
                   :model="ruleForm"
                   class="demo-form-inline">
            <el-form-item label="团卡名称："
                          class="select">
              <el-select class="w-sm"
                         v-model="ruleForm.groupCardId"
                         filterable>
                <el-option v-for="item in forSelect"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="卡状态："
                          class="select">
              <el-select class="w-sm"
                         v-model="ruleForm.status">
                <el-option v-for="item in statusOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="请输入卡号"
                        prefix-icon="el-icon-search"
                        v-model="ruleForm.keywords"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="onSelected">筛选</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :lg="24"
              :md="24">
        <div class="m-t-lg ukao-v-loading">
          <el-table class="ukao-el-table m-t"
                    :data="tableList"
                    v-loading="loading">
            <el-table-column label="团卡名称"
                             prop="gcName">
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <p>{{scope.row.createTime | getDate}}</p>
                <p>{{scope.row.createTime | getTime}}</p>
              </template>
            </el-table-column>
            <el-table-column label="卡号" prop="rfidNo"></el-table-column>
            <el-table-column label="等级">
              <template slot-scope="scope">
                <p>{{scope.row.cardName}}</p>
                <p class="text-muted">{{scope.row.cardDiscount | cardDiscount}}</p>
              </template>
            </el-table-column>
            <el-table-column label="卡金额">
              <template slot-scope="scope">
                <div class="text-success font-bold">{{scope.row.balance | amtFormat}}</div>
              </template>
            </el-table-column>
            <el-table-column label="赠送金额">
              <template slot-scope="scope">
                <div class="text-success font-bold">{{scope.row.giftAmount | amtFormat}}</div>
              </template>
            </el-table-column>
            <el-table-column label="用户"
                             prop="user">
              <template slot-scope="scope">
                <p>
                  <a target="_blank"
                     :href="'/client/list/'+scope.row.userId+'/basic'"
                     class="text-primary">{{scope.row.userName}}</a>
                </p>
                <p>
                  <a target="_blank"
                     :href="'/client/list/'+scope.row.userId+'/basic'"
                     class="text-primary">{{scope.row.userPhone}}</a>
                </p>
                <p>
                  <a target="_blank"
                     :href="'/client/list/'+scope.row.userId+'/basic'"
                     class="text-primary">{{scope.row.cardNo}}</a>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="团体" prop="unionName"></el-table-column>
            <el-table-column label="状态">
               <template slot-scope="scope">
                  <p :class="{ 'text-muted':scope.row.rfStatus == 1 && !scope.row.userName ,'text-danger':scope.row.rfStatus == 0,'text-success':scope.row.rfStatus===1 && scope.row.userId}">{{scope.row | cardState}}</p>
                </template>
            </el-table-column>
            <el-table-column label="绑定时间">
              <template slot-scope="scope">
                <p>{{scope.row.bindTime | getDate}}</p>
                <p>{{scope.row.bindTime | getTime}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <template v-if="scope.row.rfStatus == 1 && scope.row.status == 1">
                  <auth perm="marketing.visitors.recharge">
                    <el-button type="success" size="small" @click="recharge(scope.row.id, scope.row)">充值</el-button>
                  </auth>
                </template>
                <template v-if="scope.row.rfStatus == 1 && !scope.row.userId">
                  <auth perm="marketing.visitors.withhold">
                    <el-button size="small" @click="deduction(scope.row.id, scope.row)">扣款</el-button>
                  </auth>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div class="text-right m-t-lg">
            <el-pagination :current-page.sync="pagination.current"
                           :page-size="pagination.size"
                           layout="total, prev, pager, next"
                           :total="pagination.total"
                           @current-change="nextPage">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 充值 扣款-->
    <el-dialog :title="regMoneyForm.title"
               :visible.sync="regMoneyVisible"
               :lock-scroll="false"
               custom-class="ukao-dialog-xs">
      <div class="formbox">
        <div class="clearfix">
          <div class="pull-left text-right form-label">
            会员卡号
          </div>
          <div class="form-input form-label">
            {{regMoneyForm.rfidNo}}
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">实充金额</label>
          <div class="form-input">
            <el-input v-model.trim="regMoneyForm.amount"
                      placeholder="请输入充值金额">
              <span slot="append">元</span>
            </el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">赠送金额</label>
          <div class="form-input">
            <el-input v-model.trim="regMoneyForm.giftAmount"
                      placeholder="请输入赠送金额">
              <span slot="append">元</span>
            </el-input>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <label class="pull-left text-right form-label">团体</label>
          <div class="form-input">
            <el-select v-model="regMoneyForm.unionId"
                       filterable
                       clearable
                       placeholder="全部">
              <el-option v-for="item in unionList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="clearfix m-t-md" v-if="mercInfo.isOpenVipPrice">
          <label class="pull-left text-right form-label">享受会员价</label>
          <div class="form-input">
            <el-radio-group v-model="regMoneyForm.isVip">
              <el-radio :label="1">享受</el-radio>
              <el-radio :label="0">不享受</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="clearfix m-t-md">
          <div class="form-input">
            <el-button @click="regMoneyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitRegModifyMoney">保 存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
import msg from "@/utils/msg";
import calculation from "@/utils/helpers/calculation";
import auth from "@/utils/auth";
export default {
  data() {
    return {
      mercInfo: auth.getMercInfo(),
      ruleForm: {
        keywords: "",
        status: "",
        groupCardId: ""
      },
      forSelect: [],
      unionList: [],
      statusOptions: [
        { value: "", label: "全部" },
        { value: "1", label: "已使用" },
        { value: "0", label: "未使用" },
        { value: "-1", label: "已作废" }
      ], //会员卡可选状态
      tableList: [],
      loading: true,
      regMoneyVisible: false, //显示充值
      changeItem: null, //暂存修改金额项
      regMoneyForm: {
        //充值扣款金额表单提交的数据
        amount: "",
        giftAmount: "", //赠送金额
        isVip: 0, // 是否参与会员价
        unionId: '', // 团体客户
        rfidNo: "",
        id: "",
        title: "充值",
        type: 1
      },
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      }
    };
  },
  created() {
    this.getList();
    this.initParams();
    this.queryForSelect();
    this.queryUnionList();
  },
  watch: {
    $route() {
      // 新建单位触发的修改不请求数据
      this.initParams();
      this.getList();
    }
  },
  filters: {
      cardState(item) {
      //获取会员卡使用状态
      if (item.rfStatus == 1) {
        if (item.userId) {
          return "已使用";
        }
        return "未使用";
      }
      return "已作废";
    }
  },
  methods: {
    onSelected() {
      this.getList();
    },
    // 获取团体客户
    queryUnionList() {
      this.$store
        .dispatch("post", {
          uri: "unionInfo/queryForSelect"
        })
        .then(res => {
          this.unionList = res.data.data || [];
        });
    },
    recharge(id, item) {
      this.regMoneyForm.id = id;
      this.regMoneyForm.rfidNo = item.rfidNo;
      this.regMoneyForm.amount="";
      this.regMoneyForm.giftAmount="";
      this.regMoneyForm.isVip=0;
      this.regMoneyForm.unionId="";
      this.regMoneyForm.title = "充值";
      this.regMoneyForm.type = 1;
      this.regMoneyVisible = true;
      this.changeItem = item;
    },
    deduction(id, item) {
      this.regMoneyForm.id = id;
      this.regMoneyForm.rfidNo = item.rfidNo;
      this.regMoneyForm.amount="";
      this.regMoneyForm.giftAmount="";
      this.regMoneyForm.isVip=0;
      this.regMoneyForm.unionId="";
      this.regMoneyForm.title = "扣款";
      this.regMoneyForm.type = 2;
      this.regMoneyVisible = true;
      this.changeItem = item;
    },
    submitRegModifyMoney() {
      //确认充值
      let moneyWarn = "";
      if (!this.regMoneyForm.amount && !this.regMoneyForm.giftAmount) {
        moneyWarn = "请输入实充金额或赠送金额！";
      } else if (!validate.amount(this.regMoneyForm.amount, 2, 0.01, 999999, true)) {
        moneyWarn = "请输入正确的实充金额（0.01至999999之间）！";
      } else if (!validate.amount(this.regMoneyForm.giftAmount, 2, 0.01, 999999, true)) {
        moneyWarn = "请输入正确的赠送金额（0.01至999999之间）！";
      }

      if (moneyWarn) {
        this.$message({
          message: moneyWarn,
          type: "error",
          duration: 2000
        });
        return;
      }

      var url = this.regMoneyForm.type === 2
        ? "groupCard/deduction"
        : "groupCard/recharge";
      this.$store
        .dispatch("post", {
          uri: url,
          data: {
            id: this.regMoneyForm.id,
            amount: calculation.accMul(this.regMoneyForm.amount, 100),
            giftAmount: calculation.accMul(this.regMoneyForm.giftAmount, 100),
            unionId: this.regMoneyForm.unionId,
            isVip: this.regMoneyForm.isVip
          }
        })
        .then(res => {
          if (this.regMoneyForm.type === 2) {
            this.changeItem.balance += -calculation.accMul(this.regMoneyForm.amount,100);
            this.changeItem.giftAmount += -calculation.accMul(this.regMoneyForm.giftAmount,100);
          } else {
            this.changeItem.balance += calculation.accMul(this.regMoneyForm.amount,100);
            this.changeItem.giftAmount += calculation.accMul(this.regMoneyForm.giftAmount,100);
          }
          this.regMoneyVisible = false;
          msg.success(this.regMoneyForm.title + "成功");
        });
    },
    getList() {
      this.$store
        .dispatch("post", {
          uri: "groupCard/binding/list",
          data: {
            groupCardId:this.ruleForm.groupCardId,
            status: this.ruleForm.status,
            keywords: this.ruleForm.keywords
          },
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.loading=false
          this.pagination.total = res.data.data.total;
          this.tableList = res.data.data.list || [];
        });
    },
    queryForSelect() {
      this.$store
        .dispatch("post", {
          uri: "groupCard/queryForSelect"
        })
        .then(res => {
          this.forSelect = res.data.data;
        });
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
    },
    nextPage() {
      // 新建单位触发的分页修改不执行
      this.updateUrl();
    },
    onAddGroup() {
      this.dialogForm.visible = true;
      this.getCardList();
    }
  }
};
</script>


