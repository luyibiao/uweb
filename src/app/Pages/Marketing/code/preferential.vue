<template>
  <div>
    <el-button type="primary"
               @click="openDialog(1,'添加收款码优惠')">新建</el-button>
    <el-button @click="onselect(0)">全部</el-button>
    <el-button type="success" @click="onselect(1)">正在进行</el-button>
    <el-button type="danger" @click="onselect(2)">失效</el-button>
    <el-table class="ukao-el-table m-t"
              :data="tableList"
              v-loading="loading">
      <el-table-column label="收款码优惠">
        <template slot-scope="scope">
          <p>满{{scope.row.fullAmount}}元减{{scope.row.amount}}元</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
           <p>{{scope.row.createTime | getDate}}</p>
           <p>{{scope.row.createTime | getTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p v-if="scope.row.status===1" class="text-success">正在进行</p>
          <p v-else class="text-danger">已失效</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="openDialog(2,'编辑信息',scope.row)" :disabled="scope.row.status===0">编辑</el-button>
          <span class="m-r-xs m-l-xs">-</span>
          <el-button type="text"
                     @click="failData(scope.row)"
                     :disabled="scope.row.status===0">使失效</el-button>
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
    <!-- 弹出框 -->
    <el-dialog class="ukao-dialog"
               :title="dialog.title"
               :visible.sync="dialog.visible">
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               label-width="60px">
        <el-form-item label="每满"
                      prop="fullAmount">
          <el-input class="w-sm m-r-xs"
                    v-model="ruleForm.fullAmount" type="number"></el-input>元</el-form-item>
        <el-form-item label="立减"
                      prop="amount">
          <el-input class="w-sm m-r-xs"
                    v-model="ruleForm.amount"  type="number"></el-input>元</el-form-item>
        <el-form-item label-width="170px"
                      label="每笔订单最高累计优惠"
                      prop="maxAmount"
                     :rules="[
                        { min: 0, max: 5, message: '最高金额99999元' }
                      ]"
                      >
          <el-input class="w-sm m-r-xs"
                    v-model="ruleForm.maxAmount" type="number"></el-input>
          <span>元</span>
          <p class="text-muted">未设置表示优惠金额无上限</p>
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
import validate from "@/utils/helpers/validate";
export default {
  data() {
    const amountValidate = value => {
      return validate.amount(value, 2, 0.01, 99999999);
    };
    const amountRules = [
      { required: true, message: "请输入有效金额" },
      {
        validator: (rule, value, callback) => {
          amountValidate(value)
            ? callback()
            : callback(new Error(""));
        }
      }
    ];
    return {
      btnstatu:'',
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
        fullAmount: "",
        amount: "",
        maxAmount: "",
        status:''
      },
    
      rules: {
        fullAmount: amountRules,
        amount: amountRules,
        // maxAmount: [
        //   {
        //     validator: (rule, value, callback) => {
        //       if (value.replace(/\s/g, "")) {
        //         amountValidate(value)
        //           ? callback()
        //           : callback(new Error(""));
        //       } else {
        //         callback();
        //       }
        //     }
        //   }
        // ]
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
    onselect(item){
      if(item===1){
        this.ruleForm.status=1; 
      }
      else if (item===2){
        this.ruleForm.status=0;
      }
      else if(item===0){
        this.ruleForm.status=""
      }
       this.getList();
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
    },
    
    getList() {
      this.loading = true;
      this.$store
        .dispatch("post", {
          uri: "cashierBenefit/list",
          data:{
            status:this.ruleForm.status
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
    
    openDialog(type, title, data) {
      this.dialog.type = type;
      this.dialog.title = title;
      this.dialog.visible = true;
      if(type===1 && this.ruleForm.fullAmount){
        this.ruleForm.fullAmount = "";
        this.ruleForm.amount = "";
        this.ruleForm.maxAmount = "";
      }
      if (data) {
        this.ruleForm.fullAmount = data.fullAmount || "";
        this.ruleForm.amount = data.amount || "";
        this.ruleForm.maxAmount = data.maxAmount || "";
        this.ruleForm.id=data.id
      } 
    },
    
    submit(formName) {
      console.log('ds');
      let _this=this
       this.$refs[formName].validate(valid => {
        if (valid) {
          _this.dialog.type === 1 ? _this.createData() : _this.editData();
        }
      });
    },
    
    createData() {
      this.$store
        .dispatch("post", {
          uri: "cashierBenefit/add",
          data: {
            fullAmount:this.ruleForm.fullAmount,
            amount:this.ruleForm.amount,
            maxAmount:this.ruleForm.maxAmount
          }
        })
        .then(res => {
          this.pagination.current > 1
            ? this.updateUrl()
            : (this.pagination.current = 1);
          msg.success();
          this.getList();
          this.dialog.visible=false;
        });
    },
    // 
    editData() {
      this.$store
        .dispatch("post", {
          uri: "cashierBenefit/update",
          data: {
             id:this.ruleForm.id,
            fullAmount:this.ruleForm.fullAmount,
            amount:this.ruleForm.amount,
            maxAmount:this.ruleForm.maxAmount
          }
        })
        .then(res => {
          this.getList();
          msg.success();
          this.dialog.visible=false
        });
    },
    // 
    failData(item) {
       let _this=this;
       msg.confirm({msg:'确定使失效?',
            confirmFn(){
              _this.$store.dispatch('post', {
                uri: 'cashierBenefit/delete',
                data: {id: item.id}
              }).then((res) => {
                msg.success();
                _this.getList();
              });
						}
          })
    }
  }
};
</script>
