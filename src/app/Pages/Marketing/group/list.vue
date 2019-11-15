
<template>
  <div>

    <auth perm="marketing.group.update">
      <el-row>
        <el-col :lg="24" :md="24">
          <div class="pull-right">
            <el-button type="primary" @click="onAddGroup">新建团体客户</el-button>
          </div>
        </el-col>
      </el-row>
    </auth>

    <el-row style="margin-top:20px">
      <el-col :lg="24"
              :md="24">
        <div>
          <el-table :data="groupTableDataList"
                    class="ukao-el-table"
                    ref="groupTableDataList"
                    v-loading="loading">
            <el-table-column label="名称">
              <template slot-scope="scope">
                <router-link :to="'/marketing/group/detail/'+scope.row.id"
                             class="text-primary">{{scope.row.name}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <p>{{ scope.row.createTime | getDate }}</p>
                <p>{{ scope.row.createTime | getTime }}</p>
              </template>
            </el-table-column>
            <el-table-column label="折扣">
              <template slot-scope="scope">
                <span v-if="scope.row.saleType===1">
                  <p>客户原有折扣</p>
                </span>
                <span v-else>
                  <p>统一折扣</p>
                  <span class="text-muted">
                    {{scope.row.cardName}}
                    <span v-if="getType(scope.row.cardRights)==='1'">
                      <span v-if="scope.row.cardDiscountType===1">（{{scope.row.cardDiscount | cardDiscount}}）</span>
                      <p v-else>多折扣</p>
                    </span>
                    <p v-else-if="getType(scope.row.cardRights)==='0'"
                       class="text-muted">无折扣</p>
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="客户数"
                             prop="cnt">
            </el-table-column>
            <el-table-column label="领取优惠券">
              <template slot-scope="scope">
                <p v-if="scope.row.receiveCoupon===0" class="text-muted">不允许</p>
                <p v-else class="text-success">允许</p>
              </template>
            </el-table-column>
            <el-table-column label="会员价">
              <template slot-scope="scope">
                <p v-if="scope.row.isVip===0" class="text-muted">不享受</p>
                <p v-else class="text-success">可享受</p>
              </template>
            </el-table-column>
            <el-table-column label="充值营销活动">
              <template slot-scope="scope">
                <p v-if="scope.row.withActive===0" class="text-muted">不享受</p>
                <p v-else class="text-success">享受</p>
              </template>
            </el-table-column>
            <el-table-column label="备注"
                             prop="remark">
            </el-table-column>
          </el-table>

          <!--分页-->
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

    <!--新建集团客户弹出框-->
    <el-dialog title="新建团体客户"
               :visible.sync="dialogForm.visible" >
      <el-form :model="dialogForm.addGroupForm"
               label-width="150px"
               class="demo-ruleForm"
               ref="dialogForm.addGroupForm">
        <el-form-item label="名称："
                      prop="name"
                      :rules="[
					  { required: true, message: '请输入名称', trigger: 'blur' },
					]">
          <el-input v-model="dialogForm.addGroupForm.name"
                    class="w-lg"></el-input>
        </el-form-item>
        <el-form-item label="折扣："
                      prop="discount"
                      :rules="[
					  { required: true,  trigger: 'blur' },
					]">
          <el-radio-group v-model="dialogForm.addGroupForm.discount">
            <el-radio :label="'2'">
              <span class="radioContent radioContentTwo">
                统一折扣
                <p class="text-muted">客户将享受团体统一折扣</p>
              </span>
            </el-radio>
            <el-radio :label="'1'">
              <span class="radioContent">
                客户原有折扣
                <p class="text-muted">客户享受自己原有的折扣</p>
              </span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dialogForm.addGroupForm.discount==='2'">
          <template>
            <el-select v-model="dialogForm.addGroupForm.grade"
                       placeholder="请选择会员卡">
              <el-option v-for="item in pageParams.cardList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="领取优惠券：">
          <el-radio-group v-model="dialogForm.addGroupForm.receiveCoupon">
            <el-radio :label="0">
              <span class="radioContent">
                不允许
                <p class="text-muted">团体客户不能领取优惠券</p>
              </span>
            </el-radio>
            <el-radio :label="1"
                      style="margin-left:150px">允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员价：">
          <el-radio-group v-model="dialogForm.addGroupForm.isVip">
            <el-radio :label="0">
              <span class="radioContent">
                不享受
                <p class="text-muted">团体客户不享受会员价</p>
              </span>
            </el-radio>
            <el-radio :label="1"
                      style="margin-left:150px">
              <span class="radioContent">
                可享受
                <p class="text-muted">若客户是会员，则享受会员价</p>
              </span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="充值营销活动：">
          <el-radio-group v-model="dialogForm.addGroupForm.withActive" >
            <el-radio :label="0">
              <span class="radioContent">
                不享受
                <p class="text-muted" style="letter-spacing:2px">团体客户充值时将不会赠送金额、优惠券、积分、折扣会员卡，例：充500元送100元，<br>团体客户到账余额为500元,普通用户到账余额为600元</p>
              </span>
            </el-radio>
            <el-radio :label="1" style="margin-left:150px">享受</el-radio>
          </el-radio-group>
        </el-form-item>
        <br>
        <el-form-item label="备注：" >
          <el-input class="w-lg"
                    v-model="dialogForm.addGroupForm.remark"
                    type="textarea"
                    :rows="3"
                    style="width:350px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogForm.visible = false">取 消</el-button>
        <el-button type="primary"
                   @click="onForm('dialogForm.addGroupForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
import calculation from "@/utils/helpers/calculation";
import base from "@/utils/helpers/base";
import filters from "@/utils/filters";
export default {
  data: function() {
    return {
      groupTableDataList: [],
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      dialogForm: {
        visible: false,
        addGroupForm: {
          name: "",
          discount: "2",
          grade: "",
          isVip:0,
          receiveCoupon: 0,
          withActive: 0,
          remark: ""
        }
      },
      btn: {},
      markNo: "",
      pageParams: {
        cardList: []
      },
      loading: true
    };
  },

  created() {
    this.initParams();
    this.getList();
  },
  watch: {
    $route() {
      // 新建单位触发的修改不请求数据
      this.initParams();
      this.getList();
    }
  },
  methods: {
    getList(start) {
      let _this = this;
      this.$store
        .dispatch("post", {
          uri: "unionInfo/list",
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.groupTableDataList = res.data.data.list || [];
          this.pagination.total = res.data.data.total;
          this.loading = false;
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
    },
    onForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "unionInfo/add",
              data: {
                name: this.dialogForm.addGroupForm.name,
                saleType: this.dialogForm.addGroupForm.discount,
                cardId: this.dialogForm.addGroupForm.grade,
                remark: this.dialogForm.addGroupForm.remark,
                receiveCoupon:this.dialogForm.addGroupForm.receiveCoupon,
                isVip:this.dialogForm.addGroupForm.isVip,
                withActive:this.dialogForm.addGroupForm.withActive
              }
            })
            .then(res => {
              msg.success();
              this.getList();
              this.dialogForm.visible = false;
            });
        }
      });
    },
    getCardList() {
      this.$store
        .dispatch("post", {
          uri: "userCard/listForSelect"
        })
        .then(res => {
          this.pageParams.cardList = res.data.data.list;
          this.getCardDfault();
        });
    },
    getCardDfault() {
      for (let index = 0; index < this.pageParams.cardList.length; index++) {
        let item = this.pageParams.cardList[index];
        if (item.def === 1) {
          this.dialogForm.addGroupForm.grade = item.id;
          break;
        }
      }
    },
    getType(typen) {
      return typen ? typen.substr(1, 1) : "0";
    }
  }
};
</script>

<style scoped>
.radioContent {
  display: inline-block;
  position: relative;
}
.radioContentTwo {
  margin-right: 120px;
}
.radioContent p {
  position: absolute;
  top: 20px;
}
.table-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 180px;
  overflow: hidden;
}
.table-right ul li {
  padding-left: 20px;
  line-height: 40px;
}
.table-right ul li.is-active,
.table-right ul li:hover {
  background-color: #f8f8f8;
}
</style>

