<template>
  <div class="info-group">
    <div class="info-group-title relase-bg">限时折扣</div>
    <div class="info-group-cont relase-bg">
      <el-form ref="otherForm"
               label-width="120px"
               :model="form">
        <el-form-item label="限时抢购："
                      prop="flash">
            <el-radio v-model="form.flashSale" label="1">开启</el-radio>
            <el-radio v-model="form.flashSale" label="0">关闭</el-radio>
        </el-form-item>
        <el-form-item label="生效日期"  v-if="form.flashSale == 1"  :rules="[
				    { required: true, message: '请选择生效日期', trigger: 'change' },
				  ]">

          <el-date-picker
            v-model="timeStartObj"
            type="datetimerange"
            placeholder="选择有效日期"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="changeTimeStart"
            :picker-options="pickerOptions0">
          </el-date-picker>
          <div class="text-xs text-muted">活动开始前，商品详情页价格下方将会预告活动开始时间和折扣。
            <!--<a class="text-primary" target="_blank" href="www.baidu.com">查看示例</a>-->
          </div>
        </el-form-item>
        <el-form-item label="有效期" prop="cardValid" v-if="type==3"
                      :rules="[
				    {  required: cardValidFlag == 1, message: '请选择有效日期' },
				    { message: '请选择有效日期', trigger: 'change'}]"
        >
          <el-radio v-model="cardValidFlag" label="0" @change="remindDateCheckbox2">付款完成卡券长期可用</el-radio>
          <el-radio v-model="cardValidFlag" label="1" >付款完成卡券有效期至
            <el-date-picker
              v-model="form.cardValid"
              :disabled="cardValidFlag == 0"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-radio>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>
<script>

import calculation from "@/utils/helpers/calculation";
import validate from "@/utils/helpers/validate";
import time from '@/utils/helpers/timeLite'

export default {
  props: {
    // 限购数量
    type: 0,
    flashSaleFlag: '',
    cardValid: '',
    timeStartList:{
      default: _ => []
    }
  },
  data() {
    return {
      cardValidFlag: '0',
      timeStartObj:[],
      form: {
        flashSale:'0',
        cardValid:'',
        saleTimeStart:'',
        saleTimeEnd: '',
      },
      pickerOptions0: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const date = new Date();
            picker.$emit('pick', [date, date]);
          }
        },{
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', [date, date]);
          }
        }, {
          text: '最近三天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30 * 3);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      rules: {
        flash: [{ required: true, message: "请选择商品类型" }],
        groupIds: [{ required: true, message: "请选择商品分组" }]
      }
    };
  },
  watch: {
    flashSaleFlag(n){
      this.form.flashSale = n+''
    },
    cardValid(n){
      this.form.cardValid = '';
      this.cardValidFlag = '0';
     if( n != -1){
       this.cardValidFlag = '1';
       this.form.cardValid = n;
     }
    },
    timeStartList(n){
      this.form.saleTimeStart =time.getDateTime(n[0]) ;
      this.form.saleTimeEnd = time.getDateTime(n[1]);
      this.timeStartObj.push(new Date(n[0]));
      this.timeStartObj.push(new Date(n[1]));
    }
  },
  created() {

  },
  methods: {
    //日期
    changeTimeStart(item){
      if(item){
        this.form.saleTimeStart = item[0];
        this.form.saleTimeEnd = item[1];
      }else{
        this.form.saleTimeStart = "";
        this.form.saleTimeEnd = "";
      }
    },
    remindDateCheckbox2(){
      if(this.cardValidFlag == 0){
        this.form.cardValid = '';
      }
    },
    getData(){
      let cardValid = this.cardValidFlag == 0 ? '-1' :  this.form.cardValid;
      return{
        flashSale: this.form.flashSale,
        cardValid: cardValid,
        saleTimeStart: this.form.saleTimeStart,
        saleTimeEnd: this.form.saleTimeEnd,
      }
    },
    validate() {
      let flag = false;
      this.$refs.otherForm.validate(valid => {
        flag = valid;
      });
      return flag;
    },
  }
};
</script>