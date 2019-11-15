<template>
<div class="ukao-pt-lg box-ft" v-loading="divloading">
  <el-row>
    <el-col :lg="12" :md="12" :xl="12" :offset="6">
      <div v-if="chargeMode && chargeMode>1">
        <div class="market-head">
        <div class="left_img">
          <img src="/static/img/finance/charge/service_pay.png" style="vertical-align: top;">
        </div>
        <div class="right_pay">
          <p>门店软件服务费</p>
          <p>服务价格：
            <span class="text-danger" style="font-size:18px;font-weight:500;" v-show="!edition">
              ￥{{incrementItem | getMin | amtFormat}} — ￥{{incrementItem | getMax | amtFormat}}
            </span>
            <span class="text-danger" style="font-size:18px;font-weight:500;" v-show="edition">
              ￥{{price}}
            </span>
            <span class="text-muted" v-show="edition">（￥{{unitPrice}}/月）</span>
          </p>
          <table style="margin:20px 0px;">
            <tr>
              <td style="width:73px;vertical-align: top;padding-top:10px;">应用版本：</td>
              <td>
                 <el-radio-group v-model="edition" style="word-wrap:break-word">
                   <el-radio-button v-for="item in incrementItem" :label="item.id" :key="item.id">{{item.cnt}}个月</el-radio-button>
                 </el-radio-group>
                </td>
            </tr>
          </table> 
          <p>
            <span style="visibility: hidden;">立即订购：</span>
            <el-button type="primary" @click="buy_btn" :disabled="buyBtnFlag" style="margin-left:10px;">立即订购</el-button>
          </p>
        </div>
      </div>

      <p style="margin:30px auto 20px;width:787px;">快速入口</p>
      <div class="market-foot">
        <img src="/static/img/finance/charge/active_code.png" width="35px" style="vertical-align: middle;">
        <span style="display:inline-block;margin-left:15px;">
          <p>我有激活码，我要兑换服务</p>
          <!-- <p class="text-muted">激活码有效期为发放后1年内，请尽快兑换</p> -->
        </span>
        <span class="pull-right">
          <el-button @click="$router.push({path:'/finance/service_order/active_code',query:{storeId:storeId}})">兑换</el-button>
        </span>
      </div>
      </div>
      <div v-else class="zan-wu">
        暂无订购服务
      </div>
    </el-col>
  </el-row>
</div>  
</template>
<script>
export default {
  data () {
    return {
      id:'',
      price:"",
      unitPrice:'',//单价
      edition:"",
      buyBtnFlag:true,
      incrementItem:[],
      storeId:"",
      divloading:"",
      chargeMode:''
    }
  },
  created () {
    if(this.$route.query.id && this.$route.query.id!==""){
       this.storeId=this.$route.query.id;
    }
    this.getincrementItem();
  },
  watch: {
    edition:'editionChange'
  },
  methods: {
    getincrementItem(){
      this.divloading=true;
      // return;
      this.$store.dispatch('post',{
        uri:"incrementItem/service/list",
        data:{
          serviceType:1
        }
      }).then(res=>{
         this.divloading=false;
         this.chargeMode=res.data.chargeMode;
        this.incrementItem=res.data.data.list;
      })
    },
    editionChange(end,start){
      // console.log(end,start)
      let _this=this
      this.id=end;
      for(let i=0;i<this.incrementItem.length;i++){
        if(end===this.incrementItem[i].id){
           _this.price= _this.$options.filters.amtFormat(_this.incrementItem[i].price);
           _this.unitPrice=(_this.$options.filters.amtFormat(_this.incrementItem[i].price)/_this.incrementItem[i].cnt).toFixed(2);
           break;
        }
      }
      if(this.edition!==""){
        this.buyBtnFlag=false;
      }
      // this.price=
    },
   buy_btn(){
       this.$router.push({path:"./confirm_single",query:{storeId:this.storeId,monthId:this.id}}) 
   }
  },
  filters: {
    getMax(item){
       if(item.length<1){
        return;
      }
      let Arr=[];
      for(let i=0;i<item.length;i++){
        Arr[i]=item[i].price;
      }
       let newArray=Array.from(new Set(Arr));
      let minNum=Math.min(...newArray);
      return Math.max(...newArray);
    },
    getMin(item){
      if(item.length<1){
        return;
      }
      let Arr=[];
      for(let i=0;i<item.length;i++){
        Arr[i]=item[i].price;
      }
       let newArray=Array.from(new Set(Arr));
      let minNum=Math.min(...newArray);
      return Math.min(...newArray);
    }
  }
}
</script>

<style  lang="less">
.market-head{
  position: relative;
  margin: 0 auto;
  width: 787px;
  border: 1px solid #e5e5e5;
  padding: 20px 15px 18px;
  .left_img{
    position: absolute;
    display: inline;
    img{
      width:185px;
    }
  };
  .right_pay{
   display: inline-block;
   margin-left: 210px;
    .el-button{
      padding: 10px 0px !important;
      width: 90px !important;
    };
    p+p{
      // color: #b4b4b4;
      margin-top: 20px;   
    };
  .el-radio-button{
    margin-right: 10px !important;
    margin-top: 10px;
    word-break:break-all !important;
  }
  .el-radio-button:last-child{
    margin-right: 0px !important;
  }
  .el-radio-button__inner{
    text-align: center;
    border:1px solid #bfcbd9 !important;
    border-left:inherit;
    border-right: 1px solid #bfcbd9 !important;
    padding: 10px 0px !important;
    width: 70px;
    border-radius:0px 0 0 0px !important;
  }
   .el-radio-button__inner:hover{
     background-color:  #20a0ff !important;
     color: white !important;
   }
  .el-radio-button .el-radio-button__inner{
    border-radius:0px 0 0 0px !important;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
  box-shadow:0px 0 0 0 #20a0ff !important;
  }
   }
}
.market-foot{
  margin: 0 auto;
  width: 787px;
  background-color: #f8f8f8;
  padding: 20px 15px;
}
.zan-wu{
  font-size:16px;
  font-weight: 600;
  text-align: center;
}
</style>

