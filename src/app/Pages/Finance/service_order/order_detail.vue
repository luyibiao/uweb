<template>
<div class="ukao-pt-lg box-ft" v-loading="divLoad">
  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
       <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/finance/service_order/buy_record">
            <i class="el-icon-arrow-left icon-smaller"></i>购买记录</el-breadcrumb-item>
          <el-breadcrumb-item>订购单详情</el-breadcrumb-item>
        </el-breadcrumb>
    </el-col>
  </el-row>
  <el-row style="margin-top:30px">
    <el-col :lg="24" :xl="24" :md="24">
      <div class="detail-status">
        <div class="left-div">
          <div v-if="orderStatus===1">
             <span class="text-success" style="font-size:14px;"><img src="/static/img/finance/charge/success.png" style="vertical-align: middle;margin-right:8px;" width="22px">{{detail.statusText}}</span>
          </div>
          <div v-else-if="orderStatus===0">
            <div>
             <span class="text-danger" style="font-size:14px;"><img src="/static/img/finance/charge/pay_logo.png" style="vertical-align: middle;margin-right:8px;" width="22px">{{detail.statusText}}</span>
             <span class="pull-right" style="margin-right:50px;">应付：<span style="color:#FF7012;">￥{{detail.amount | amtFormat}}</span></span>
           </div>
           <div class="two-left-div">
             <span>请在{{timestrap}}日前付款，以免订单超时关闭</span>
             <span class="pull-right">
               <el-button @click="cancel" :loading="canceLoad">取消订购单</el-button>
               <el-button type="primary" @click="payBtn" :loading="btnStatus.payLoading">立即付款</el-button>
             </span>
           </div>
          </div>
          <div v-else-if="orderStatus===2">
            <div>
             <span class="text-muted" style="font-size:14px;"><img src="/static/img/finance/charge/close.png" style="vertical-align: middle;margin-right:8px;" width="22px">{{detail.statusText}}</span>
           </div>
           <div class="two-left-div">
             <span class="text-muted">关闭时间：{{detail.updateTime | getDateTime}}</span>
           </div>
          </div>
        </div>
        <div class="right-div">
          <span>
             <p>订购单号：{{detail.seq}}</p>
             <p>创建时间：{{detail.createTime | getDateTime}}</p>
              <div v-if="orderStatus===1">
                <p>付款时间：{{detail.tradeTime | getDateTime}}</p>
                <p>支付流水号：{{detail.tradeSeq}}</p>
                <p>支付方式：
                   <span v-if="detail.payMethod===12">
                    <label>激活码兑换({{detail.activationCode}})</label>
                  </span>
                  <span v-else>
                    <label>{{ detail.payMethod | getValText('PAY_METHOD')}}</label>
                  </span>
                </p>
              </div>
          </span>
        </div>
      </div>
    </el-col>
  </el-row>

  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
      <div class="shop_detail">
        <div class="shop_detail-head">
          <ul>
            <!-- <li>
              <div>订购商家：华天商家</div>
            <li> -->
              <li>
                <div>订购门店：<span class="text-success">{{detail.storeName}}</span></div>
              </li>
              <li>
                <div>订购内容：{{ruleData.name}}</div>
              </li>
          </ul>
        </div>
        <div class="shop_detail-body">
          <table>
            <tr>
              <td>服务内容</td>
              <td>规格</td>
              <td>生效时间</td>
              <td>服务价格（元）</td>
            </tr>
            <tr style="border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5">
              <td>{{detail.serviceTypeName}}</td>
              <td>{{detail.val}}个月</td>
              <td>订购成功后立即生效</td>
              <td>
                <span v-if="detail.payMethod===12">无</span>
                <span v-else>{{ruleData.price || 0 | amtFormat}}</span>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div>
                   <el-popover ref="popover1"
                      placement="bottom-start"
                      width="200"
                      trigger="hover">
                      <p>{{detail.deductionCoin ? 0 : ruleData.invitationCoin || 0}}个通洗币</p>
                    </el-popover>
                  <p class="text-muted" v-if="detail.deductionCoin">通洗币抵扣：{{detail.deductionCoin}}.00元</p>
                  <p class="text-muted ac-code" v-if="detail.payMethod===12">激活码兑换</p>
                  <span v-show="detail.status===1">实</span><span v-show="detail.status===0 || detail.status===2">应</span>付：￥<span style="font-size:20px;">{{detail.amount || 0 | amtFormat}}</span>
                  <div style="letter-spacing:2px;margin-top:10px;">
                    <div v-if="orderStatus===0">
                       <div v-popover:popover1 class="dis-inline">付款后，将获得{{detail.deductionCoin ? 0 : ruleData.invitationCoin || 0}}<i class="el-icon-caret-bottom m-l-xs text-smaller icon-smaller"></i>通洗币奖励</div>
                    </div>
                    <div v-else-if="orderStatus===1">
                      <span v-if="detail.payMethod!==12">
                         <p class="text-muted" style="margin-bottom:10px;" v-if="detail.activationCode">已填写推广码：{{detail.activationCode}}</p>
                      </span>           
                           <div v-popover:popover1 class="dis-inline">已获得{{detail.deductionCoin ? 0 : ruleData.invitationCoin || 0}}<i class="el-icon-caret-bottom m-l-xs text-smaller icon-smaller"></i>通洗币奖励</div>
                    </div>                 
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </el-col>
  </el-row>

   <!--付款弹出框-->
   <el-dialog :visible.sync="dialogData.dialogvisible" :title="dialogData.diaTitle">
     <div class="dialog-content" v-if="dialogData.contentShow===1">
       <p>订购内容： {{ruleData.name}}</p>
       <p>订购门店： {{detail.storeName}}</p>
       <p>应付金额： <span style="color:#FF7012;font-size:20px;">{{detail.amount || 0 | amtFormat}}元</span></p>
       <div class="pay-type">
         <p>支付方式： </p>
         <div class="pay-type-type">
            <el-radio-group v-model="dialogData.payWay" @change="payWayChange">
              <el-radio label="1" style="margin-bottom:10px;" :disabled="dialogData.disabledRadio">余额支付(剩余余额￥{{dialogData.mercPayInfo.balance | amtFormat}}元<label v-if="dialogData.mercPayInfo.balance<detail.amount" class="text-muted">，余额不足请先充值</label>)</el-radio>
              <p><el-radio label="2" style="margin-bottom:10px;" :disabled="dialogData.disabledCode">扫码支付</el-radio></p>
              <!-- <el-radio label="3">汇款支付</el-radio> -->
          </el-radio-group>
         </div>
       </div>
       <div style="width:100%;height:1px;background-color:#e5e5e5;"></div>
       <div class="pay-detail">
         <div v-show="dialogData.payWay==='1'" style="width:80px;margin:20px auto">
           <el-button type="primary" @click="balanceBtn" :loading="btnStatus.balanceBtn">立即支付</el-button>
         </div>
         <div v-show="dialogData.payWay==='2'" style="margin-top:20px;">
           <div>
              <el-radio-group v-model="dialogData.codePay" @change="codePayFun">
                <el-radio-button :label="1">微信</el-radio-button>
                <el-radio-button :label="2">支付宝</el-radio-button>
              </el-radio-group>
         </div>
         <div class="code_pay">
             <div v-loading="dialogData.orderQcode.loading">    
                <Qrcode v-show="dialogData.orderQcode.type === 1" :value="dialogData.orderQcode.wxValue" :options="{ size: 150 }"></Qrcode>
                <Qrcode v-show="dialogData.orderQcode.type === 2" :value="dialogData.orderQcode.zfbValue" :options="{ size: 150 }"></Qrcode>
             </div>
           <div class="code_pay-way">
             <span v-if="dialogData.codePay===1"><img src="/static/img/finance/charge/wePay.png">微信支付</span>
             <span v-else="dialogData.codePay===2"><img src="/static/img/finance/charge/zhiPay.png">支付宝支付</span>
           </div>
           <p style="font-size:22px;">扫一扫完成支付</p>
         </div>
         </div>
         <div v-show="dialogData.payWay==='3'" class="remit">
           <div class="remit_content">
              <p>你需汇款<label style="color:#FF7012;">{{detail.amount || 0 | amtFormat}}元</label>至以下账户，汇款成功后上传凭证信息，审核通过后到账</p>
              <div class="remit-content_info">
                <table>
                  <tr>
                    <td>收款方户名：</td>
                    <td>{{dialogData.mercPayInfo.payment_name}}</td>
                  </tr>
                   <tr>
                    <td>收款方开户行：</td>
                    <td>{{dialogData.mercPayInfo.payment_bank_name}}</td>
                  </tr>
                   <tr>
                    <td>收款方账户：</td>
                   <td>{{dialogData.mercPayInfo.payment_bank_no}}</td>
                  </tr>
                </table>
              </div>
           </div>
         </div>
         <div v-if="dialogData.payWay==='3'" style="margin:30px 0px 10px auto;width:186px;"><el-button type="primary" @click="remitBtn">已转账汇款，我要上传凭证</el-button></div>
       </div>
     </div>

     <div v-else-if="dialogData.contentShow===2" class="proof">
       <div class="make-info">
         <p class="text-muted">收款方信息</p>
         <div>
           <table>
             <tr>
               <td>户名：</td>
               <td>{{dialogData.mercPayInfo.payment_name}}</td>
             </tr>
              <tr>
               <td>开户行：</td>
               <td>{{dialogData.mercPayInfo.payment_bank_name}}</td>
             </tr>
              <tr>
               <td>账号：</td>
               <td>{{dialogData.mercPayInfo.payment_bank_no}}</td>
             </tr>
           </table>
         </div>
       </div>
       <div class="payment">
         <p class="text-muted">付款信息</p>
         <div>
           <el-form :model="dialogData.payRuleForm" ref="payRuleForm" label-width="110px">
             <el-form-item label="付款户名：" :rules="[{required: true, message: '请输入户名'}]" prop="accountName">
               <el-input v-model="dialogData.payRuleForm.accountName" class="w-lg" ></el-input>
             </el-form-item>
             <el-form-item label="付款账号：" :rules="[{required: true, message: '请输入付款账号'}]" prop="accountNo">
               <el-input v-model="dialogData.payRuleForm.accountNo" class="w-lg"></el-input>
             </el-form-item>
             <el-form-item label="金额："><span>{{detail.amount || 0 | amtFormat}}元</span></el-form-item>
             <el-form-item label="付款时间" :rules="[{required: true, message: '请填写付款时间'}]" prop="tradeTime">
               <span>
                  <el-date-picker
                    v-model="dialogData.payRuleForm.tradeTime"
                    type="date"
                    placeholder="选择日期"
                    class="w-lg"
                    :picker-options="pickerOptions">
                  </el-date-picker>
               </span>
             </el-form-item>
             <el-form-item>
               <el-button type="primary" @click="onPaySubmit('payRuleForm')" :loading="btnStatus.remitBtnStatus">确认提交</el-button>
             </el-form-item>
           </el-form>
         </div>
       </div>
     </div>

     <div class="" v-else-if="dialogData.contentShow===3">
       <p>凭证已提交，友靠将在3个工作日内完成审核，通过后自动完成订购</p>
       <div class="pull-right" style="margin:20px 0px;">
          <el-button type="primary" @click="myKnow">我知道了</el-button>
       </div>
     </div>
   </el-dialog>
</div>  
</template>
<script>
import timeLite from "@/utils/helpers/timeLite";
import msg from "@/utils/msg";
import Qrcode from "@xkeshi/vue-qrcode";
import calculation from '@/utils/helpers/calculation'
export default {
  components: {
    Qrcode
  },
  data () {
    return {
      divLoad:false,
      canceLoad:false,
      orderStatus:1,
      detail:{},
      ruleData:{},
      timestrap:'',
      dialogData:{
        dialogvisible:false,//弹出框开关
        diaTitle:'选择付款方式',//弹出框标题
        payWay:"1",//付款方式
        codePay:1,//扫码付款方式
        contentShow:1,//弹出框内容显示
        disabledRadio:false,//余额不足单选框是否禁止
        disabledCode:false,//应付款为0时禁止选择扫码支付
        payRuleForm:{
          orderId:'',//订单id
          tradeType:'0201',
          amount:"",//交易金额
          payMethod:7,
          accountName:'',//户名
          accountNo:"",//账号
          tradeTime:'',//付款时间
          incrementType:2
        },
       mercPayInfo:{},
       orderQcode:{
           type: 1, //支付类型
           loading: true, //开启支付状态
           wxValue: "", //付款码值
           zfbValue: "", //付款码值
          incrementSeq: "", //订单id
       },
       orderQcodeTrade:{
         wxTradeSeq:'',
         zfbTradeSeq:""
       }
      },
      btnStatus:{
        tongbiFlag:'',//通洗币是否抵扣开关
        payBtnFlag:true,//立即支付按钮禁止开关
        payLoading:false,
        balanceBtn:false,//余额正在支付
        divloading:true,// 读取数据
        remitBtnStatus:false,//点击汇款按钮状态
      },
      time:null,
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
      }
    }
  },
  watch: {
    "dialogData.dialogvisible":'dialogvisibleChange',
  },
  created () {
    this.getDetail();
    this.detail.deductionCoin=true
  },
  methods: {
    cancel(){
       msg.confirm({
        msg: "确定取消此订单",
        confirmFn: _ => {
          this.canceLoad=true
          this.$store
            .dispatch("post", {
              uri: "tradeIncrement/cancel",
              data: {
                id:this.detail.id,
                status:2
              },
              forceResolve:true,
            })
            .then(res => {
              if(res.data.httpCode===200){
                msg.success('操作成功');
                this.getDetail();
              }
              else{
                msg.error(res.data.msg);
              }
               this.canceLoad=false
            });
        }
      });
    },
    getDetail(){
      this.divLoad=true;
      this.$store.dispatch('post',{
        uri:"tradeIncrement/queryServiceDetail",
        data:{
          incrementSeq:this.$route.params.seq,
        }
      }).then(res=>{
         this.divLoad=false;
         let Arr=res.data.data;
          Arr.ruleData=JSON.parse(Arr.ruleData);
          this.ruleData=Arr.ruleData;
           if(Arr.deductionCoin){
             this.ruleData.giveCnt=0;
            }
          this.detail=Arr;
          this.orderStatus=this.detail.status;
          if(this.orderStatus===0){
              this.timestrap=this.$options.filters.getDate(timeLite.add(res.data.timestamp,3,'days'))
            }
          })
      },

       //切换微信支付宝
     codePayFun(){
      this.dialogData.orderQcode.type=this.dialogData.codePay;
    },

    //支付方式选择
    payWayChange(){
      clearInterval(this.timer);
      if(this.dialogData.payWay==='2'){
         if (this.timer) clearInterval(this.timer);
         this.timer = setInterval(_ => {
        this.tradeStatus(this.dialogData.mercPayInfo.seq);
      }, 3000);
      }
    },

    //订单查询状态
    tradeStatus(seq){
      this.$store.dispatch('post',{
        uri:"tradePay/queryStatusBySeq",
        data:{
          seq:this.dialogData.orderQcode.type===1 ? this.dialogData.orderQcodeTrade.wxTradeSeq : this.dialogData.orderQcodeTrade.zfbTradeSeq 
        }
      }).then(res=>{
        if(res.data.data.status===1){
          clearInterval(this.timer);
          this.$router.push({path:'/finance/service_order/buy_record'})
        }
      })
    },

    //得到二维码
     getQRValue(incrementSeq) {
      // wx
      this.$store
        .dispatch("post", {
          uri: "tradePay/increment/wxPay",
          data: {
            incrementSeq
          }
        })
        .then(res => {
          this.dialogData.orderQcode.loading=false;
          // this.order.loading = false;
          this.dialogData.orderQcode.wxValue = res.data.data.codeUrl;
          this.dialogData.orderQcodeTrade.wxTradeSeq=res.data.data.tradeSeq
        });
      // 支付宝
      this.$store
        .dispatch("post", {
          uri: "tradePay/increment/aliPay",
          data: {
            incrementSeq
          }
        })
        .then(res => {
          this.dialogData.orderQcode.zfbValue = res.data.data.codeUrl;
          this.dialogData.orderQcodeTrade.zfbTradeSeq=res.data.data.tradeSeq;
        });
    },

    //点击余额支付立即支付
    balanceBtn(){
      this.btnStatus.balanceBtn=true;
      this.$store.dispatch('post',{
        uri:"tradeIncrement/pay",
        forceResolve:true,
        data:{incrementSeq:this.dialogData.mercPayInfo.seq}
      }).then(res=>{
        if(res.data.httpCode===200){
         msg.success();
         this.dialogData.dialogvisible=false;
         this.getDetail();
        }
        else{
           msg.error(res.data.msg);
        }
        this.btnStatus.balanceBtn=false;
      })
    },

    //查询订单
     payBtn(){
      this.dialogData.orderQcode.loading=true;
      this.btnStatus.payLoading=true
      this.$store.dispatch('post',{
        uri:"tradeIncrement/detail",
        forceResolve:true,
        data:{
          incrementSeq:this.detail.seq,
          status:0
        }
      }).then(res=>{
         let _this=this
        if(res.data.httpCode===200){
          // res.data.data.balance=calculation.accDiv( res.data.data.balance,100);
           _this.dialogData.mercPayInfo=res.data.data;
           _this.dialogData.payRuleForm.orderId=_this.dialogData.mercPayInfo.incrementId;
            if(parseInt(_this.detail.amount)>parseInt(_this.dialogData.mercPayInfo.balance)){
              _this.dialogData.disabledRadio=true;
              _this.dialogData.payWay='2'
              _this.payWayChange();
            }
            if(parseInt(_this.detail.amount)==0){
              _this.dialogData.disabledCode=true;
            }
            _this.btnStatus.payLoading=false
            _this.dialogData.dialogvisible=true;
            if(this.detail.amount && this.detail.amount>0)
            _this.getQRValue(res.data.data.seq)
        }
        else{
          _this.btnStatus.payLoading=false
          msg.error(res.data.msg);
        }
      })
    },

     //点击我要上传凭证
    remitBtn(){
      this.dialogData.diaTitle="线下转账凭证"
      this.dialogData.contentShow=2;
    },

     //提交转账凭证
    onPaySubmit(formName){
       this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.dialogData.payRuleForm.payMethod,'aaaa');
          // return;
          // let amount=this.detail.amount;
          this.dialogData.payRuleForm.amount=this.detail.amount;
          this.dialogData.payRuleForm.tradeTime=this.$options.filters.getDate(this.dialogData.payRuleForm.tradeTime);
          this.dialogData.payRuleForm.accountNo=this.dialogData.payRuleForm.accountNo.trim().replace(/\s/g,"");
          this.btnStatus.remitBtnStatus=true;
          // console.log(this.obj.price,'....',this.dialogData.payRuleForm.amount)
          this.$store.dispatch('post',{
            uri:"tradeAudit/merc/recharge",
            data:this.dialogData.payRuleForm,
            forceResolve:true,
          }).then(res=>{
            if(res.data.httpCode===200){
              // this.getDetail();
               this.dialogData.contentShow=3;
               this.dialogData.diaTitle="转账汇款凭证"
               msg.success('操作成功');
               this.btnStatus.remitBtnStatus=false;
            }
            else{
               msg.error(res.data.msg);
               this.btnStatus.remitBtnStatus=false;
            }
          })
        } 
      });
    },

     // 点击我知道了按钮
    myKnow(){
      this.dialogData.dialogvisible=false;
    },


    //弹出框隐藏所做操作
    dialogvisibleChange(endVal,startVal){
       if(!endVal){
         this.dialogData.diaTitle="选择付款方式";
         this.dialogData.contentShow=1;
        //  this.dialogData.payRuleForm={};
         this.dialogData.payWay='1';
        //  this.dialogData.codePay=1;
         clearInterval(this.timer)
       }
    },


  }  
}
</script>

<style scoped lang="less">
.detail-status{
  position: relative;
  border-top: 1px solid #e5e5e5;
  border-bottom:  1px solid #e5e5e5;
  padding: 20px 0px 20px;
}
.detail-status>.left-div{
  /* padding-right: 30px; */
  width: 70%;
   height: 80px;
   /* background-color: yellow; */
}
.two-left-div{
  margin-top: 10px;
    margin-right: 50px;
  height: 30px;
}
.two-left-div>:first-child{
  color: #b4b4b4;
}
.two-left-div .el-button{
  padding:7px 14px;
}
.two-left-div>:first-child{
  line-height: 30px;
}
.right-div{ 
  position: absolute;
  display: table;
  right: 0px;
  top: 50%;
  /* vertical-items: center; */
  min-height: 70px;
  /* padding-left: 60px; */
  transform: translate(0,-50%);
  width: 30%;
   border-left: 2px solid #e5e5e5;
  /* background-color: pink; */
}
.right-div>span{
  display: table-cell;
  vertical-align: middle;
}
.right-div p{
  margin-left: 50px;
  color: #b4b4b4;
}
.shop_detail{
  margin-top: 30px;
  overflow: hidden;
}
/* .shop_detail-head{
  margin-bottom: 30px;
} */
.shop_detail-head ul{
  margin: 0;
  padding: 0;
}
.shop_detail-head ul li{
  float: left;
  margin-right: 30px;
}
.shop_detail-head ul li div{
  font-size: 16px;
}
.shop_detail-body{
  margin-top:55px; 
}
.shop_detail-body table{
  width: 100%;
  border-collapse:collapse;
}
.shop_detail-body table tr:nth-child(odd){
  height: 40px;
  background-color: #f5f5f5;
}
.shop_detail-body table tr:nth-child(even){
  height: 40px;
   background-color: #ffffff;
}
.shop_detail-body table tr td{
  margin: 0;
  padding: 0;
  width: 25%;
}
.shop_detail-body table tr td:nth-child(2),.shop_detail-body table tr td:nth-child(3){
  text-align: center;
}
.shop_detail-body table tr td:nth-child(4){
  text-align: right;
}
.shop_detail-body table tr>:last-child,.shop_detail-body table tr>:first-child{
  padding: 0px 20px;
}
.shop_detail-body table>:last-child{
  text-align: right;
  height: 120px !important;
}
.dialog-content>p+p{
  margin-top: 10px;
}
.pay-type{
  position: relative;
  margin: 10px 0px;
  height: 105px;
}
.pay-type-type{
  position: absolute;
  top: 0;
  left: 70px;
}
.pay-detail{
  // padding: 20px 20px;
  width: 100%;
  // min-height: 40px;
  // border: 1px solid #e5e5e5;
  // border-radius: 5px;
}
 .code_pay{
    width: 250px;
    margin: 25px auto 0px;
    // background-color: pink;
    text-align: center;
    img{
      display: inline-block;
    }
  }
.code_pay .code_pay-way{
   margin-bottom: 30px;
    img{
      width: 25px;
      vertical-align: middle;
    }
    span{
      cursor: pointer;
    }
}
.remit{
  margin-top: 40px;
  // margin-bottom: 30px;
  min-height: 40px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}
.remit .remit_content{
  margin:15px;
}
.remit .remit-content_info{
  margin-top: 20px;
  margin-left: 40px;
  table tr{
    height: 30px;
    font-size: 14px;
    font-weight:bold; 
  }
  table tr td:first-child{
    text-align: right;
  }
}
.proof .make-info{
  border-bottom: 1px dashed	#e5e5e5;
  padding-bottom: 30px;
  margin-bottom: 10px;
  &>div{
    width: 70%;
    margin: 0 auto;
  }
   table tr{
    height: 30px;
    font-size: 14px;
    font-weight:bold; 
  }
  table tr td:first-child{
    text-align: right;
  }
}
.proof .payment{
  &>div{
    width: 70%;
    margin: 0 auto;
  }
}
// .ac-code{
//   color: #000;
//   font-size: 12px;
// }
</style>

