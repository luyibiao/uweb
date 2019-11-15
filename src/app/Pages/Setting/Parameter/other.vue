<template>
  <div>
    <p class="m-t m-b text-black text-md font-bold">提现设置</p>
    <div class="b-t  text-center padder-v">
       <span class="pull-left">员工单笔申请提现金额最小限制<span class="text-muted">（0不限制）</span></span>
      <div>
        {{params.wkMinExtractMoney || 0 | amtFormat}}元
        <auth perm="setting.parameter.withdraw">
          <el-button @click="updateWkMinExtractMoney" size="small" class="m-l-md">编辑</el-button>
        </auth>
      </div>
    </div>
    <div class="b-t b-b text-center padder-v">
      <span class="pull-left">友商单笔申请提现金额最小限制<span class="text-muted">（0不限制）</span></span>
      <div >
        {{params.fdMinExtractMoney || 0 | amtFormat}}元
        <auth perm="setting.parameter.withdraw">
          <el-button @click="updateWkMinExtractMoney" size="small" class="m-l-md">编辑</el-button>
        </auth>
      </div>
    </div>

    <el-dialog class="ukao-dialog" size="small"
       :visible.sync="dialog.visible"
       title="单笔申请提现金额最小限制（0不限制）">
       <div>
         <el-form :model="dialog.ruleForm" ref="dialog.ruleForm" label-width="150px">
           <el-form-item label="员工：" prop="wkMinExtractMoney" :rules="[
               { required: true, min: 0, max: 9999999, message: '有效的金额', trigger: 'blur'}
             ]">
             <div>
               <el-input v-model="dialog.ruleForm.wkMinExtractMoney" min="0" max="9999999" type="number" style="width: 85px"></el-input>&nbsp;元
             </div>
           </el-form-item>
           <el-form-item label="友商：" prop="wkMinExtractMoney" :rules="[
                { required: true, min: 0, max: 9999999, message: '有效的金额', trigger: 'blur'}
              ]">
             <div>
               <el-input v-model="dialog.ruleForm.fdMinExtractMoney" min="0" max="9999999" type="number" style="width: 85px"></el-input>&nbsp;元
             </div>
           </el-form-item>
         </el-form>
       </div>
       <div slot="footer">
         <el-button @click="dialog.visible = false">取消</el-button>
         <el-button type="primary" @click="updateMinExtractMoney">保存</el-button>
       </div>
    </el-dialog>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import calculation from '@/utils/helpers/calculation';

export default {
data() {
    return {
      params:{
      },
      dialog:{
        visible: false,
        ruleForm:{
          wkMinExtractMoney: 0, //员工最小申请提取金额（0不限制）
          fdMinExtractMoney: 0,  //友商最小申请提取金额（0不限制）
        }
      }
    };
  },
  created() {
    this.getCityParams();
  },
  methods: {
    // 城市参数配置
    getCityParams() {
      this.$store
        .dispatch("get", {
          uri: "mercCityParam/detail"
        })
        .then(res => {
          this.params = res.data.data
        });
    },
    updateWkMinExtractMoney(){
      this.dialog.visible = true;
      this.dialog.ruleForm.wkMinExtractMoney = calculation.accDiv(this.params.wkMinExtractMoney || 0, 100)
      this.dialog.ruleForm.fdMinExtractMoney = calculation.accDiv(this.params.fdMinExtractMoney || 0, 100)
    },
    // 更新状态
    updateMinExtractMoney() {
      this.$store
        .dispatch("post", {
          uri:'mercCityParam/updateMinExtractMoney',
          data:{
            wkMinExtractMoney: calculation.accMul(this.dialog.ruleForm.wkMinExtractMoney, 100),
            fdMinExtractMoney: calculation.accMul(this.dialog.ruleForm.fdMinExtractMoney, 100)
          }
        })
        .then(res => {
          this.dialog.visible = false;
          msg.success();
          this.getCityParams();
        });
    },
  }
};
</script>
