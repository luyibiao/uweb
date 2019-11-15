<style scoped>
.pc{
 padding: 0 24px;
}
.mask{
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  background: rgba(255,255,255,0.5);
  z-index: 10;
}
.content{
  /* width: 800px;
  height: 300px; */
  position: relative;
  padding: 50px;
  display: table;
  margin: 0 auto;
  background-color: #f7f7f7;
}
.content-main{
  background-color: yellow;
}
.getxu{
  position: absolute;
  right: 0;
  top: -25px;
}
.and_ji{
  max-width: 200px;
}
.main_input{
display: inline-block;
margin-left: 5px;
width: 300px;
}
.footbtn{
  margin-bottom: 40px;
}
</style>

<template>
  <div class="text-center">
    <div class="mask"></div>
    <!-- <div class="wrapper-lg b-b text-xl text-black">绑定序列号和激活码</div> -->
    <div class="m-t-lg wrapper-lg w-xl dis-inline">
      <p class="lh24">绑定至门店：
        <span style="font-size:22px;">{{stroenN}}</span>
      </p>
      <div>
        <el-radio-group v-model="type" style="margin-top:30px;">
          <el-radio-button :label="1"><span style="font-size:14px;">安卓触屏一体机</span></el-radio-button>
          <el-radio-button :label="2"><span class="pc" style="font-size:14px;">pc客户端</span></el-radio-button>
        </el-radio-group>
      </div>
    </div>
      <div class="text-left content">
         <!-- <router-link to="/" class="text-primary getxu">如何获取序列号和激活码?</router-link> -->
        <div class="content-main">
          <div class="pull-left" style="margin:0px 50px">
          <img :src="type===1 ? '/static/img/register/android_ji.png': '/static/img/register/pc_client.png'" class="and_ji">
        </div>
        <div class="pull-right" style="margin:0px 50px">
          <div style="width:400px;margin-top:20px;" v-show="type===1"> 
            <label>序列号 </label>
            <input class="ukao-login_input main_input"
               type="text"
               placeholder="请输入序列号"
               v-model.trim="seq_code">
               <br><br>
            <label>激活码</label>
            <input class="ukao-login_input main_input"
               type="text"
               placeholder="请输入激活码"
               v-model.trim="active_code">
          </div>  
          <div style="width:400px;margin-top:20px;" v-show="type===2"> 
            <label>序列号 </label>
            <input class="ukao-login_input main_input"
               type="text"
               placeholder="请输入序列号"
               v-model.trim="clientSerialNum">
               <br><br>
            <label>激活码</label>
            <input class="ukao-login_input main_input"
               type="text"
               placeholder="请输入激活码"
               v-model.trim="clientActCode">
          </div>  
        </div>
        </div>
      </div>
     <div class="m-t-xl footbtn"> 
        <el-button size="large" type="primary" @click="confirm(1)" style="width:300px;" :loading="loading" :disabled="nextDin" class="register_login_btn">确定,下一步</el-button>
        <p><el-button type="text" class="text-primary m-t-xl register_btn" @click="confirm(2)" :disabled="skipDin" :loading="skipLoading">跳过此步骤</el-button></p>
      </div>
       <!-- <p class="text-muted m-t-xxl">客服热线：0731-89748960</p> -->
  </div>
</template>

<script>
import storagelite from '@/utils/helpers/storageLite'
import msg from '@/utils/msg'
import md5 from '@/utils/md5'
export default {
  name: "invite",
  data() {
    return {
      chkCode: false,
      nextDin:false,
      skipDin:false,
      seq_code: "",//安卓序列号
      active_code:"",//安卓激活码

      clientSerialNum:'',//pc序列号
      clientActCode:'',//pc激活码
      type:1,
      loading:false,
      skipLoading:false,
      stroenN:""
    };
  },
  created() {
    this.getScreenPx();
    this.getStiorie();
    // this.mercId = this.$store.register.mercId;
  },
  methods: {
    getStiorie(){
      this.stroenN=storagelite.sessionGet("RIGISTER_INFO").stroen.storeName
    },
    getScreenPx(){
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
         let obj={};
         obj=storagelite.sessionGet("RIGISTER_INFO");
         obj.current="success"
         this.$emit("childToParentMsg", obj);
    } 
    },
    confirm(item) {
      // let _this=this
      let mask=document.getElementsByClassName('mask')[0];
      mask.style.display="block";
      let _this=this;
      let obj={};
      obj=storagelite.sessionGet("RIGISTER_INFO");
      if(item===1){
        _this.loading=true;
        _this.skipDin=true
        _this.$store.dispatch('post',{
          uri:_this.type===1 ? 'api/cashierMachineInfo/addCashier ' : 'api/cashierMachineInfo/addClient',
          forceResolve:true,
          data:{
            serialNum:_this.type===1 ? _this.seq_code : _this.clientSerialNum,
            actCode:_this.type===1 ? _this.active_code: _this.clientActCode,
            storeId:obj.storeId,
            mercId:obj.merIc
          }
        }).then(res=>{
          if (res.data.httpCode === 200) {
            obj.seq_code=_this.seq_code
            obj.active_code=_this.active_code;
            obj.current="success"
            obj.headContent='通洗， 让洗涤更智慧'
            _this.$emit("childToParentMsg", obj);
      //       if(nextFlag){
      //      _this.$store.dispatch('post',{
      //         uri:'workerLogin/newRegister',
      //         forceResolve:true,
      //         data:{
      //           cashierSerialNum:_this.seq_code,
      //           cashierActCode:_this.active_code,
      //           clientSerialNum:_this.clientSerialNum,
      //           clientActCode:_this.clientActCode,
                
      //           code:obj.code,
      //           name:obj.brandName,
      //           symbol:obj.brandId,
      //           cityName:obj.cityName,
      //           regionalId:obj.regionalId,
      //           username:obj.phone,
      //           password:obj.password,

      //           siname: obj.stroen.storeName,
      //           wkName: obj.stroen.shoperName,
      //           wkPhone: obj.stroen.phone,
      //           wkAccount: obj.stroen.loginUser,
      //           wkPassword:obj.stroen.loginPass,
      //           tel:obj.stroen.servicePhone
      //     }
      //   }).then(res=>{
      //     if (res.data.httpCode === 200) {
         
      //     }
      //     else{
      //        _this.loading=false
      //         _this.skipDin=false
      //        msg.error(res.data.msg);
      //     }
      //   })
      // }    
     }
      else{
         mask.style.display="none";
        _this.skipDin=false
        _this.loading=false
        msg.error(res.data.msg);
      }
    })    
    }
       
    else if(item===2 && obj.signCode){
      _this.nextDin=true
      _this.nextDin=false
       obj.current="success"
       obj.headContent='通洗， 让洗涤更智慧'
      _this.$emit("childToParentMsg", obj);
        }
    }
  }
};
</script>


