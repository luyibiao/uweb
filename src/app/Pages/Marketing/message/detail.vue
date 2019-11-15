
<template>
  <div>
    <el-row>
      <el-col :lg="5"
              :md="5">
        <el-breadcrumb 
                       separator="/">
          <el-breadcrumb-item to="/marketing/message/push">
            <i class="el-icon-arrow-left icon-smaller"></i>消息推送</el-breadcrumb-item>
          <el-breadcrumb-item>{{detail.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row style="margin-top:50px;">
      <el-col :lg="24"
              :md="24">
        <span class="message">
          <p>1.两种发送方式都选上，关注了微信公众号的客户将收到微信模板消息，收不到短信提醒；未关注公众号的客户将收到短信提醒。</p>
          <p>2.两种发送方式都未勾选，客户都收不到提醒.</p>
        </span>
      </el-col>
    </el-row>
    <div class="radio-f" v-if="detail.code == 'REACH_STORE'">
      发送时间点：
      <el-radio-group v-model="delaySend" @change="onChangeSend">
        <el-radio :label="0">到店后立即发送</el-radio>
        <el-radio :label="1">到店后<label v-if="delaySend===1">约</label></el-radio>
      </el-radio-group>
      <span v-if="delaySend===1">
        <el-input class="x-lg" placeholder="请输入时间" v-model="delayTime"></el-input>小时发送
      </span>
      <el-button type="primary" style="margin-left:20px;" v-if="delaySend===1" @click="save">保存</el-button>
      <p class="msg text-danger" v-if="msg!==''">{{msg}}</p>
    </div>
    <el-row>
      <el-col :lg="24"
              :md="24"> 
        <div class="content">
          <!--左侧模板-->
          <div class="weOrShort pull-left"
               v-bind:class="{'activeBorder':messageShort,'unactiveBorder':!messageShort}" v-show="shortVisible">
            <div>
              <el-checkbox-group v-model="messageShort" fill="#20a0ff" text-color="white" @change="onChangeTime" >
                <el-checkbox-button>
                   <img src="/static/img/marketing/checkBoxed.png" width="18px" style="vertical-align:middle" v-if="messageShort">
                   <img src="/static/img/marketing/unCheckBoxed.png" width="18px" style="vertical-align:middle" v-else>
                短信模板（计费发送）
              </el-checkbox-button>
             </el-checkbox-group>  
            </div>
            <div>
              <img src="/static/img/marketing/shortModal.png">
              <div class="shortContent">
                <!-- <img src="" class="angle_img"> -->
                <span class="short-message-content">
                  <p v-html="detail.smsDemo"></p>
                </span>
              </div>
            </div>
          </div>

          <!--右侧模板-->
          <div class="weOrShort pull-right"
               v-bind:class="{'activeBorder':messageWe,'unactiveBorder':!messageWe}" v-show="weVisible">
            <div>
              <el-checkbox-group v-model="messageWe" fill="#20a0ff" text-color="white" @change="onChangeTime" >
                <el-checkbox-button>
                   <img src="/static/img/marketing/checkBoxed.png" width="18px" style="vertical-align:middle" v-if="messageWe">
                   <img src="/static/img/marketing/unCheckBoxed.png" width="18px" style="vertical-align:middle" v-else>
                微信模板（免费发送）
              </el-checkbox-button>
             </el-checkbox-group>  
            </div>
            <div>
              <img src="/static/img/marketing/weModal.png">
              <div class="weContent">
                <p><strong>{{detail.name}}</strong></p>
                <div v-html="detail.wxDemo" class="wx-demo"></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import msg from "@/utils/msg";
export default {
  data(){
    return {
      id:this.$route.params.id,
      messageShort: "",//是否开启了短信提示
      messageWe: "",//是否开启了微信提示
      detail:{},//接收信息模板详情
      confShort:'',//短信息字符提示串
      confWe:'',//微信息字符提示串
      shortVisible:false,//是否开通了短信提醒功能
      weVisible:false,//是否开启了微信提醒功能
      throttle:0,
      fill:'',
      delaySend:'',
      delayTime:'',
      msg:''
    };
  },
  created(){
    this.getDetail();
  },
  methods:{
    save(){
      let _this=this;
       if(this.delaySend===1 && this.delayTime===""){
         this.msg="时间不能为空"
         return;
       }
       if(this.delaySend===1 && Math.floor(+this.delayTime)!==+this.delayTime){
          this.msg="时间必须为整数"
          return;
       }
       if(this.delaySend===1 && +this.delayTime<0){
         this.msg="时间不能为负数"
         return;
       }
       else{
         this.msg=""
         _this.$store.dispatch('post',{
           uri:'pushMsgConf/updateDelaySend',
           data:{
              id:this.id,
              delaySend:this.delaySend,
              delayTime:this.delayTime
           }
         }).then(res=>{
           msg.success();
         })
       }
    },
    onChangeSend(){
      if(this.delaySend===0){
        this.delayTime=""
        this.save();
      }
    },
    onChange(){
      let _this=this;
      let short;
      let we;
      if(_this.shortVisible && _this.weVisible){
         short=_this.messageShort===true ? '1':'0'
          we=_this.messageWe===true ? '1':'0'
      }
      else{
        if(!_this.shortVisible){
           short='-'
           we=_this.messageWe===true ? '1':'0'
        }
        else if(!_this.weVisible){
           short=_this.messageShort===true ? '1':'0'
           we='-';
        }
      }
      this.$store.dispatch('post',{
        uri:'pushMsgConf/updateConf',
        data:{
          id:this.id,
          isSendSms:short,
          isSendWechat:we
        }
      }).then(res=>{
        msg.success();
      })
    },
    onChangeTime() {
      let d = new Date().getTime();
      if (d - this.throttle < 1000) {
        msg.warning("操作过于频繁", 1000);
      } else {
        this.throttle = d;
        this.onChange();
      }
    },
    getDetail(){
      this.$store.dispatch('post',{
        uri:'pushMsgConf/detail',
        data:{
          id:this.id
        }
      }).then(res=>{
        this.detail=res.data.data|| {};
        this.delaySend=this.detail.delaySend;
        this.delayTime=this.detail.delayTime;
        this.getType(this.detail.conf);
      })
    },
  
    weorShortVisiblen(){
      this.messageShort=this.confShort==='1'?true:false
      this.messageWe=this.confWe==='1'?true:false
    },

    getChecked(){
       this.shortVisible=(this.confShort==='1' || this.confShort==='0')?true:false;
       this.weVisible=(this.confWe==='1' || this.confWe==='0')?true:false;
       
       this.weorShortVisiblen();
    },
    getType(item){
      this.confShort=item[0];
      this.confWe=item[1];
      this.getChecked();
    },
  }
};
</script>

<style>
.message{
  display: block;
  background-color: #f2f7ff;
  border-radius: 8px;
  line-height: 24px;
  padding: 15px 20px;
  margin: 0 auto;
  width: 800px;
}
.radio-f{
  width: 750px;
  margin: 20px auto 0px;
}
.x-lg{
  width: 150px;
  margin: 0px 8px;
}
.msg{
  margin-left: 310px;
}
.content{
  width: 700px;
  margin: 0 auto;
  margin-top: 30px;
}
.content .weOrShort{
  height: 100%;
  width: 45%;
}
.weOrShort > :first-child{
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-weight: 600;
}
.content .weOrShort > :nth-child(2){
  padding: 37px;
  position: relative;
}
.content .weOrShort > :nth-child(2) > img{
  width: 240px;
}
.activeBorder{
  border: 1px solid #20a0ff;
}
.unactiveBorder{
  border: 1px solid #e5e5e5;
}
.unactiveBorder>:first-child{
   background-color: #e5e5e5; 
}
.activeBorder>:first-child{
   background-color: #20a0ff;
}
.unactiveBorder .el-checkbox-button__inner, .el-transfer-panel{
  background-color: #e5e5e5;
  border: none;
  color: black;
}
.el-checkbox-button:first-child .el-checkbox-button__inner{
   border-left:none; 
}
.shortContent{
  width: 210px;
  min-height: 60px;
  position: absolute;
  left: 50%;
  margin-left: -105px;
  top: 25%;
  background-image: url("/static/img/marketing/angle.png");
  background-repeat: no-repeat;
  background-position: 0% 100%;
}
.short-message-content{
  width: 200px;
  display: block;
  background-color: #e5e5e5;
  border-radius: 10px;
  margin: 5px auto;
}
.short-message-content p{
  padding: 7px;
  font-size: 12px;
}
.weContent{
  width: 210px;
  background-color: white;
  position: absolute;
  left: 50%;
  margin-left:-105px;
  top:25%;
}
.weContent>p{
  margin: 10px;
}
.weContent .wx-demo{
  padding: 10px;
}
</style>

