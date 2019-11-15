
<template>
  <div>
    <el-row>
      <el-col :lg="3"
              :md="3">
        <div class="m-b-lg mi">
          <el-breadcrumb class="link-back"
                         separator="/">
            <el-breadcrumb-item :to="'/marketing/discountCode/list'">
              <i class="el-icon-arrow-left icon-smaller"></i>优惠码</el-breadcrumb-item>
            <el-breadcrumb-item>码库</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="font-size:12px;font-weight:600" class="miname">{{name}}</div> 
        </div>
      </el-col>
      <el-col :lg="21"
              :md="21">
        <span style="margin-left:100px;"  v-if="nameShow">
          <span>优惠码：</span><el-input class="w-lg" placeholder="请输优惠码" v-model="code"></el-input>
          <el-button type="primary" @click="onselect">筛选</el-button>
        </span>
        <div class="pull-right">
          <auth perm="marketing.discountCode.store">
            <el-button type="primary" @click="ondialog(1)">添加库存</el-button>
          </auth>
          <auth perm="marketing.discountCode.import">
            <el-button type="primary" @click="ondialog(2)" :disabled="importBtn">导入</el-button>
          </auth>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <div class="code-detail"
           v-if="codeType==='2'">
        <span>通用码：
          <span>{{detail.code}}，库存：{{surplusCnt}}张</span>
        </span>
      </div>
      <el-col :lg="24"
              :md="24">
        <div>
          <el-table :data="tableData"
                    style="width: 100%"
                    class="ukao-el-table"
                    @selection-change="handleSelectionChange"
                    v-loading="loading">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column prop="code"
                             label="优惠码"
                             v-if="nameShow">
            </el-table-column>
            <el-table-column label="面额（元）">
              <template slot-scope="scope">
                <div v-if="couponInfo.random === 0">{{ couponInfo.amount | amtFormat }}</div>
                <div v-else>{{ couponInfo.minAmount | amtFormat }} - {{ couponInfo.maxAmount | amtFormat }}</div>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span v-if="codeType==='1'">
                   <p>{{couponInfo.createTime | getDate}}</p>
                   <p>{{couponInfo.createTime | getTime}}</p>
                </span>
                <span v-else>
                  <p>{{scope.row.redeemTime | getDate}}</p>
                  <p>{{scope.row.redeemTime | getTime}}</p>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="领取时间">
              <template slot-scope="scope">
                <span v-if="codeType==='1'">
                   <p>{{scope.row.redeemTime | getDate}}</p>
                   <p>{{scope.row.redeemTime | getTime}}</p>
                </span>
                <span v-else>
                   <p>{{couponInfo.createTime | getDate}}</p>
                   <p>{{couponInfo.createTime | getTime}}</p>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="领取人">
              <template slot-scope="scope">
                <p>
                  <router-link target="_blank"
                               :to="'/client/list/'+scope.row.userId+'/basic'"
                               class="text-primary">{{scope.row.userName || ""}}</router-link>
                </p>
                <router-link target="_blank"
                             :to="'/client/list/'+scope.row.userId+'/basic'"
                             class="text-primary">{{scope.row.userPhone || ""}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="使用时间">
              <template slot-scope="scope">
                <p>{{scope.row.usedTime | getDate}}</p>
                <p>{{scope.row.usedTime | getTime}}</p>
              </template>
            </el-table-column>
            <el-table-column label="订单详情">
              <template slot-scope="scope">
                <router-link :to="'/order/list/detail/'+scope.row.orderId"
                             class="text-primary"
                             target="_blank"
                             v-if="scope.row.useStatus===1">详情</router-link>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.useStatus===null">未领取</span>
                <span v-else>
                  <p v-if="scope.row.useStatus===0"
                     class="text-danger">未使用</p>
                  <p v-else-if="scope.row.useStatus===1"
                     class="text-success">已使用</p>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <el-col :lg="24"
              :md="24">
        <div>
          <auth perm="marketing.discountCode.delete">
            <el-button type="danger"
                     size="small"
                     :disabled="deleteBtn"
                     @click="onDeorOx(1)">删除</el-button>
          </auth>
          <auth perm="marketing.discountCode.export">
            <el-button size="small" @click="onDeorOx(2)">导出全部</el-button>
          </auth>
          <div class="pull-right">
            <el-pagination :current-page.sync="pagination.current"
                           :page-size="pagination.size"
                           layout="total, prev, pager, next"
                           :total="pagination.total"
                           @current-change="updateUrl"> </el-pagination>
          </div>
        </div>
        <div>
          <p class="text-danger"
             v-show="errorShow"
             style="margin-top:15px;">含有不是未领取状态的优惠码,不能删除</p>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="dialog.title"
               :visible.sync="visible"
               size="small"
               :center="true">
      <div v-show="type===1">
        <el-dialog size="large"
                   :title="dialog.title"
                   height="300px"
                   :visible.sync="innerVisible"
                   :modal="false"
                   :center="true">
          <div class="childDialig">
            <p style="margin-bottom:20px;">现有库存：{{parseInt(surplusCnt)+parseInt(dialog.ruleform.cnt)}}份</p>
            <p>本次新增：{{dialog.ruleform.cnt}}份</p>
          </div>
          <span slot="footer"
                class="dialog-footer">
            <el-button type="primary"
                       @click="visible=false">查看码库</el-button>
            <el-button @click="innerVisible=false">继续添加</el-button>
          </span>
        </el-dialog>
        <div ref="div"></div>
        <div>
          <table class="dialogTable">
            <tr>
              <td style="text-align:right;width:80px;">面值：</td>
              <td>
                <div v-if="couponInfo.random === 0">{{couponInfo.amount | amtFormat }}元</div>
                <div v-else>{{couponInfo.minAmount | amtFormat }}元 - {{couponInfo.maxAmount | amtFormat }}元</div>
              </td>
              </td>
              <tr>
                <td style="text-align:right;width:80px;">剩余库存：</td>
                <td>{{surplusCnt}}张</td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form :model="dialog.ruleform"
                           ref="ruleform"
                           @submit.native.prevent
                           :inline="true">
                    <el-form-item prop="cnt"
                                  :rules="[
				    { required: true, message: '请输入数量', trigger: 'blur' },
            {min:1,max:10000,message:'数量数必须在这个之间',trigger:'blur'}]"
                                  label="追加数量：">
                      <el-input v-model="dialog.ruleform.cnt"
                                style="width:150px;"
                                type="number"></el-input> 张
                    </el-form-item>
                  </el-form>
                </td>
              </tr>
              <tr>
                <td style="width:85px;">
                </td>
                <td>
                  <el-button @click="visible=false">取消</el-button>
                  <el-button type="primary"
                             @click="onSubmit('ruleform')"
                             :loading="savebtnStatu">确定</el-button>
                </td>
              </tr>
          </table>
        </div>
      </div>

      <!--导入优惠码-->
      <div v-show="type===2"
           class="">
        <table class="importTable">
          <tr>
            <td>面值：</td>
            <td>
              <div v-if="couponInfo.random === 0">{{couponInfo.amount | amtFormat }}元</div>
                <div v-else>{{couponInfo.minAmount | amtFormat }}元 - {{couponInfo.maxAmount | amtFormat }}元</div>
            </td>
          </tr>
          <tr>
            <td>剩余库存：</td>
            <td>{{surplusCnt}}张</td>
          </tr>
          <tr>
            <td colspan="2"
                style="text-align:left">
              <el-form :model="dialog.importRuleform"
                       ref="importRuleform">
                <el-form-item label="备注"
                              style="display: none">
                  <el-input type="textarea"
                            class="w-xl"
                            :rows="3"
                            v-model="dialog.importRuleform.remark"></el-input>
                </el-form-item>
                <el-form-item label="上传优惠码："
                              prop="fileCode"
                              :rules="[{required:true,message:'未上传文件',trigger:'blur'}]"
                              style="font-weight:600">
                  <el-upload drag
                             :with-credentials="true"
                             :before-upload="beforeUpload"
                             :on-success="successUpload"
                             :on-error="errorUpload"
                             :on-remove="removeFile"
                             :action="uploadUrl">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或
                      <em>点击上传</em>
                    </div>
                    <div class="el-upload__text">最后一次上传的模板数据为最终导入数据。</div>
                    <!-- <el-button type="primary">点击上传</el-button> -->
                    <div class="text-muted text-xs l-h texta"
                         slot="tip">
                      只能上传EXCEL文件，
                      <el-button type="text"
                                 size="small"
                                 @click="downloadTemplate">下载模板</el-button>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-form>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <el-button>取消</el-button>
              <el-button @click="onImport"
                         type="primary">确定</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import time from "@/utils/helpers/timeLite";
export default {
  data() {
    return {
      id:'',
      code:'',
      codeType: '',
      name:this.$route.query.name,
      nameShow: true,
      btnstaus: false,
      loading: true,
      savebtnStatu: false,
      deleteBtn: false,
      importBtn: false,
      tableData: [],
      innerVisible: false,
      visible: false,
      type: "",
      multipleSelection: [], //多选id列表
      errorShow: false,
      detail: {},
      couponInfo:{},
      surplusCnt:'',
      cntInfo: {
        ciCnt: 0,//总库存
        totalNum:0,//已领取
        ciAmount: 0,
        ciRandow: "",
        ciMaxAmount: 0,
        ciMinAmount: 0
      },
      dialog: {
        title: "",
        ruleform: {
          cnt: ""
        },
        importRuleform: {
          fileCode: "",
          remark:''
        }
      },
      pagination: {
        size: consts.PAGE_SIZE,
        total: 0,
        current: 1
      }
    };
  },
  computed: {
    // 文件上传地址
    uploadUrl() {
      return consts.BASE_URL + "/attachment/uploadTemplate";
    }
  },
  created() {
    if(this.$route.params.id){
      this.id=this.$route.params.id;
    }
    if(this.$route.query.code){
      this.code=this.$route.query.code
    }
    if(this.$route.params.codeType){
      this.codeType=this.$route.params.codeType
    }
     this.getCodeDetail();
    this.init();
    this.getList();
  },
  watch: {
    $route() {
      this.init();
      this.getList();
    },
    innerVisible: "changeDialog",
    visible: "changeDialopar",
  },
  methods: {
    checkNumber(rule, value, callback) {
      if (!validate.number(value, rule.min, rule.max, rule.ignoreEmpty)) {
        callback(new Error());
      } else {
        callback();
      }
    },
     changeDialopar() {
      let _this = this;
      if (!this.visible && this.innerVisible) {
        _this.innerVisible = false;
      }
    },
    changeDialog() {
      let _this = this;
      if (!this.innerVisible) {
        _this.$refs.div.className = "";
        _this.surplusCnt =parseInt(_this.surplusCnt)+parseInt(_this.dialog.ruleform.cnt);
        this.dialog.ruleform.cnt = "";
        _this.getList();
      }
    },
    getCodeDetail() {
      let _this=this;
      this.deleteBtn = true;
      this.importBtn = true;
      this.codeType==='1' ? (_this.deleteBtn=false,_this.importBtn=false) : (_this.deleteBtn=true,_this.importBtn=true)
      this.codeType==='1' ? _this.nameShow=true : _this.nameShow=false
      //this.nameShow = false;
      this.$store
        .dispatch("post", {
          uri: "couponFCode/queryCode",
          data: {
            couponId: this.id
          }
        })
        .then(res => {
          this.detail = res.data.data;
          this.couponInfo=res.data.couponInfo;
          this.surplusCnt=res.data.surplusCnt;
        });
    },
    onselect(){
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri:
            this.codeType === "1" ? "couponFCode/list" : "couponUserRel/list",
          data: {
            type: this.codeType === "1" ? "" : 7,
            couponId: this.id,
            code:this.code,
            // status: 1
          },
          params: {
            startRow: (this.pagination.current - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data.data.list;
          this.pagination.total = res.data.data.total;
          // if (this.tableData.length > 0) {
          //   this.selectCnt();
          // }
        });
    },
    // selectCnt() {
    //   let Arr = this.tableData;
    //   this.cntInfo.ciCnt = Arr[0].ciCnt;
    //   this.cntInfo.ciAmount = Arr[0].ciAmount;
    //   this.cntInfo.ciRandom = Arr[0].ciRandom;
    //   this.cntInfo.ciMaxAmount = Arr[0].ciMaxAmount;
    //   this.cntInfo.ciMinAmount = Arr[0].ciMinAmount;
    //   this.cntInfo.totalNum=Arr[0].totalNum;
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onImport() {
      this.$store.dispatch('post',{
        uri:'couponInfo/template/data',
        data:{
          couponId:this.id,
          remark:this.dialog.importRuleform.remark,
          fileCode:this.dialog.importRuleform.fileCode
        }
      }).then(res=>{
        msg.success();
        this.visible=false;
        this.getList();
      })
    },
    // 上传文件前检测文件类型
    beforeUpload(file) {
      if (!/\.(xl|XL)[a-zA-Z]{1,2}$/.test(file.name)) {
        msg.warning("请上传EXCEL文件");
        return false;
      }
    },
    // 上传文件成功
    successUpload(response, file, fileList) {
      this.dialog.importRuleform.fileCode = response.data[0].code;
      // 始终显示最新上传文件
      if (fileList.length > 1) {
        fileList.shift();
      }
      this.$refs.importRuleform.validateField("fileCode");
    },
    // 删除文件
    removeFile(file, fileList) {
      // 上传文件列表为空，则清空fileCode
      if (fileList.length === 0) {
        this.dialog.importRuleform.fileCode = "";
      }
    },
    // 上传失败
    errorUpload() {
      msg.error("上传失败，请重试");
    },
    downloadTemplate() {
      window.open(`${consts.BASE_URL}/couponInfo/template`);
    },
   
    onSubmit(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.savebtnStatu = true;
          _this.$store
            .dispatch("post", {
              uri: "couponInfo/addCouponCodeCount",
              data: {
                id: this.id,
                cnt: this.dialog.ruleform.cnt
              }
            })
            .then(res => {
              _this.savebtnStatu = false;
              _this.$refs.div.className = "mask";
              _this.dialog.title = "批量添加结果";
              _this.innerVisible = true;
            });
        }
      });
    },
    ondialog(type) {
      let _this = this;
      this.type = type;
      if (type === 1) {
        // _this.getCnt();
        _this.dialog.title = "批量添加库存";
      } else if (type === 2) {
        _this.dialog.title = "导入优惠码";
      }
      this.visible = true;
    },
    onDeorOx(type) {
      type === 1 ? this.deleteC() : this.oxEportC();
    },
    deleteC() {
      let _this = this;
      msg.confirm({
        msg: "此操作将删除选中的优惠码, 是否继续?",
        confirmFn: function() {
          let Arr = _this.multipleSelection;
//          console.log(_this.multipleSelection, "1");
          let ids = [];
          let flag = true;
          Arr.forEach(function(item) {
            if (item.useStatus !== null) {
              _this.errorShow = true;
              // _this.deleteBtn=true;
              flag = false;
              return;
            }
            ids.push(item.id);
          });
          if (ids.length > 0 && flag) {
            ids = ids.join(",");
            _this.errorShow = false;
            _this.$store
              .dispatch("post", {
                uri: "couponFCode/deleteBatch",
                data: {
                  ids: ids
                }
              })
              .then(res => {
                msg.success();
                _this.getList();
              });
          }
        }
      });
    },
    oxEportC() {
      window.open(
        consts.BASE_URL + "/export/couponFCode/list?couponId=" + this.id
      );
    },
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
    }
  }
};
</script>
<style>
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.5;
  z-index: 1000;
}
.dialogTable {
  margin-left: 50px;
}
.dialogTable tr td {
  height: 50px;
}
.childDialig {
  font-weight: 600;
  margin-left: 80px;
}
.el-dialog__wrapper {
  overflow: hidden;
}
.importTable {
  width: 800px;
  /* background-color: pink; */
  margin-left: 50px;
}
.importTable tr td {
  /* font-weight: 600; */
  height: 30px;
}
.importTable tr td:first-child {
  width: 94px;
  text-align: right;
}
.el-upload-dragger {
  margin-top: 10px;
}
.texta {
  margin-left: 100px;
}
.el-upload-list__item {
  width: 300px;
  margin-left: 100px;
}
.code-detail {
  width: 350px;
  margin: 20px auto;
}
/* .mi{
  position: relative;
  display: table;
   min-width: 140px;
  width: 100%;
 background-color: pink
}  */
.miname{
  position: absolute;
  right: 0;
  left: 110px;
  top:0;
  display: inline-block;
   min-width: 10px;
  /* background-color: yellow; */
}
@media only screen and (min-width: 1600px) and (max-width: 1800px) {
  .el-upload-dragger {
    width: 280px;
  }
  .el-upload-list__item {
    width: 300px;
  }
}
@media only screen and (min-width: 1388px) and (max-width: 1600px) {
  .el-upload-dragger {
    width: 270px;
  }
  .el-upload-dragger .el-upload__text {
    font-size: 10px;
  }
  .el-upload-list__item {
    width: 250px;
  }
}
@media only screen and (min-width: 1023px) and (max-width: 1388px) {
  .el-upload-dragger {
    width: 200px;
  }
  .el-upload-dragger .el-upload__text {
    font-size: 10px;
  }
  .el-upload-list__item {
    width: 200px;
  }
}
</style>


