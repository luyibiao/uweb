
<template>
  <div>
    <el-row>
      <el-col :lg="5"
              :md="5">
        <div class="details m-t-lg text-center">
          <auth perm="marketing.group.update">
            <el-button class="pull-right edit"
                     type="text"
                     @click="onDialog">编辑</el-button>
          </auth>
          <el-input class="w-sm m-b-sm" v-focus="detailForm.show" v-if="detailForm.flag" v-model.trime="detailForm.name" @blur="updateUnionDetail" @keyup.enter.native="updateUnionDetail"></el-input>
          <h3 class="m-b-md"
              v-else>{{detail.name}}</h3>
          <span class="m-b-md" v-if="detail.saleType===2">
             <p>统一折扣</p>
                <span>{{detail.cardName}}</span> 
                <span v-if="getType(detail.cardRights)==='1'">
                      <span v-if="detail.cardDiscountType===1">（{{detail.cardDiscount | cardDiscount}}）</span>
                      <span v-else>多折扣</span>
                </span>
                 <span v-else-if="getType(detail.cardRights)==='0'" class="text-muted">（无折扣）</span>
             </span>
          <p class="m-b-md"
             v-else>会员折扣</p>
          <div style="margin:20px 10px" class="text-muted">
            <p v-if="detail.receiveCoupon===0">不允许领取优惠券</p>
            <p v-else>允许领取优惠券</p>
            <p v-if="detail.withActive===0">不享受充值营销活动</p>
            <p v-else>享受充值营销活动</p>
            <p v-if="detail.isVip===0">不享受会员价</p>
            <p v-else>可享受会员价</p>
          </div>
          <p class="m-b-md">创建时间：{{detail.createTime | getDate}} {{detail.createTime |getTime}}</p>
          <p>共
            <span class="num">{{total}}</span>个</p>
        </div>
      </el-col>
      <el-col :lg="18"
              :md="18"
              :offset="1">
        <el-row>
          <el-col :lg="5"
                  :md="5">
            <div style="position:relative; ">
              <el-input placeholder="请输入关键字"
                        size="10"
                        v-model="keywords"></el-input>
              <el-button type="primary"
                         style="position: absolute;top:0;right:-90px"
                         @click="onSelect"
                         :loading="btnLoading">筛选</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top:15px;">
          <el-col :lg="24"
                  :md="24">
            <div>
              <el-table :data="tableDataList"
                        class="ukao-el-table"
                        ref="tableDataList"
                        v-loading="loading">
                <el-table-column label="客户">
                  <template slot-scope="scope">
                    <p>
                      <img
                        style="vertical-align: middle;width: 14px; margin-right: 1px"
                        :src="scope.row.grade == 1 ? '/static/img/user/crown_blue.png' :
											scope.row.grade == 2 ? '/static/img/user/crown_yellow.png' :
											scope.row.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
                        alt=""/>
                      <router-link :to="'/client/list/'+scope.row.userId+'/basic'"
                                   target="_blank"
                                   class="text-primary">{{scope.row.userName}}</router-link>
                    </p>
                    <router-link :to="'/client/list/'+scope.row.userId+'/basic'"
                                 target="_blank"
                                 class="text-primary">{{scope.row.userPhone}}</router-link>
                    <div>
                      <router-link :to="'/client/list/'+scope.row.userId+'/basic'"
                                 target="_blank"
                                 class="text-primary">{{scope.row.cardNo}}</router-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="加入时间">
                  <template slot-scope="scope">
                    <p>{{scope.row.createTime |getDate}}</p>
                    <p>{{scope.row.createTime |getTime}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="余额（元）">
                  <template slot-scope="scope">
                    ￥{{scope.row.balance |amtFormat}}
                  </template>
                </el-table-column>
                <el-table-column label="折扣">
                  <template slot-scope="scope">
                    <span>
                      {{scope.row.cardName}}
                      <span v-if="getDiscountConfig(scope.row.cardRights)==='1'">
                        <span v-if="scope.row.cardDiscountType===1">（{{scope.row.cardDiscount | cardDiscount}}）</span>
                        <span v-else>多折扣</span>
                      </span>
                      <p v-else-if="getDiscountConfig(scope.row.cardRights)==='0'"
                         class="text-muted">无折扣</p>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <router-link class="text-primary"
                                 :to="'/client/list/'+scope.row.userId+'/basic'"
                                 target="_blank">查看</router-link>
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
      </el-col>
    </el-row>
    
    <!--弹出框-->
    <el-dialog title="修改团体客户信息"
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
        <el-form-item label="领取优惠券：">
          <el-radio-group v-model="dialogForm.addGroupForm.receiveCoupon">
            <el-radio :label="0">
              <span class="radioContent">
                不允许
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
              </span>
            </el-radio>
            <el-radio :label="1"
                      style="margin-left:150px">可享受</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="充值营销活动：">
          <el-radio-group v-model="dialogForm.addGroupForm.withActive" >
            <el-radio :label="0">
              <span class="radioContent">
                不享受
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
import filters from "@/utils/filters";
export default {
  props: ["id"],
  data() {
    return {
      tableDataList: [],
      detail: {},
      total: 0,
      pagination: {
        //分页信息
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      },
      detailForm: {
        name: "",
        show: false,
        flag:false,
      },
      dialogForm: {
        visible: false,
        addGroupForm: {
          name: "",
          receiveCoupon: "",
          isVip: "",
          withActive: "",
          remark: ""
        }
      },
       pageParams: {
        cardList: []
      },
      keywords: "",
      loading: true,
      btnLoading: false
    };
  },
  created() {
    this.getList();
    this.getDetail();
    this.initParams();
  },
  watch: {
    $route() {
      // 新建单位触发的修改不请求数据
      this.initParams();
      this.getList();
    }
  },
  methods: {
    onSelect() {
      this.btnLoading = true;
      this.getList();
    },
    onDialog(){
      this.dialogForm.addGroupForm.name=this.detail.name;
      this.dialogForm.addGroupForm.receiveCoupon=this.detail.receiveCoupon;
      this.dialogForm.addGroupForm.isVip=this.detail.isVip;
      this.dialogForm.addGroupForm.withActive=this.detail.withActive;
      this.dialogForm.addGroupForm.remark=this.detail.remark;
      this.dialogForm.visible=true;
    },
    onForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "unionInfo/update",
              data: {
                id:this.id,
                name: this.dialogForm.addGroupForm.name,
                remark: this.dialogForm.addGroupForm.remark,
                receiveCoupon:this.dialogForm.addGroupForm.receiveCoupon,
                isVip:this.dialogForm.addGroupForm.isVip,
                withActive:this.dialogForm.addGroupForm.withActive
              }
            })
            .then(res => {
              msg.success();
              this.getList();
              this.getDetail();
              this.dialogForm.visible = false;
            });
        }
      });
    },
    getDetail() {
      this.$store
        .dispatch("post", {
          uri: "unionInfo/detail",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.detail = res.data.data;
          this.childClick();
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
    getList() {
      this.$store

        .dispatch("post", {
          uri: "unionUserRel/list",
          data: {
            unionId: this.id,
            keywords: this.keywords,
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.tableDataList = res.data.data.list || [];
          this.pagination.total = res.data.data.total || 0;
          if (!this.keywords) {
            this.total = this.pagination.total;
          }
          this.loading = false;
          this.btnLoading = false;
        });
    },
    childClick() {
      this.$emit("childToParent", this.detail.name);
    },
    getDiscountConfig(rights) {
      return rights ? rights.substr(1, 1) : "0";
    },
     getType(typen) {
      return typen ? typen.substr(1, 1) : "0";
    }
  },
};
</script>
<style lang="less" scoped>
.radioContent {
  display: inline-block;
  position: relative;
}
.radioContentTwo {
  margin-right: 120px;
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
.details {
  padding: 30px 0;
  border: 1px solid #ecb07a;
  background-color: #fff3d3;
  border-radius: 5px;
  position: relative;
  .edit {
    position: absolute;
    right: 15px;
    top: 5px;
  }
}
.num {
  font-size: 32px;
}
</style>