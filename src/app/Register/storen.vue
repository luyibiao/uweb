<template>
	<div>
    <div class="mask"></div>
		<!-- <div class="wrapper-lg b-b text-xl text-black text-center ft-size">创建第一个门店</div> -->
    <p class="text-center text-primary" style="margin:20px 0px;cursor: pointer;" @click="option(1,3)">返回上一步，修改城市</p>
		<div class="medi">
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" :label-position="labelPosition">
        <el-form-item label="门店名称" :rules="[{required:true,message:'门店名称不能为空',trigger:'blur'},{max:12,message:'长度最多为12个中文字符',trigger:'blur'}]" prop="storeName">
          <!-- <el-input v-model="ruleFrom.storeName" class="ukao-login_input1"></el-input> -->
           <el-input v-model="ruleForm.storeName" class="ukao-login_input1 inputing" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="店长姓名" :rules="[{required:true,message:'姓名不能为空',trigger:'blur'}]" prop="shoperName">
           <el-input v-model="ruleForm.shoperName" class="ukao-login_input1 inputing" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="店长手机号" :rules="[{required:true,message:'手机号不能为空',trigger:'blur'},{validator:checkPhone}]" prop="phone">
           <el-input v-model="ruleForm.phone" class="ukao-login_input1 inputing" placeholder="请输入手机号" type="tel" pattern="\d*"></el-input>
        </el-form-item>
         <el-form-item label="登录账号" :rules="[{required:true,message:'账号不能为空',trigger:'blur'},{min:6,message:'长度至少为6位',trigger:'blur'},{validator:checkUser}]" prop="loginUser">
           <el-input v-model="ruleForm.loginUser" class="ukao-login_input1 inputing" placeholder="至少六位，一般为门店拼音">
            <template slot="append">@{{ruleForm.brandId}}</template>
           </el-input>
        </el-form-item>
        <el-form-item label="登录密码" :rules="[{required:true,message:'密码不能为空',trigger:'blur'},{min:6,message:'长度至少为6位',trigger:'blur'},{validator:checkUser}]" prop="loginPass">
           <el-input v-model="ruleForm.loginPass" class="ukao-login_input1 inputing" placeholder="至少六位，可以是数字和字母" type="password" ></el-input>
        </el-form-item>
         <el-form-item label="门店服务电话" :rules="[{required:true,message:'门店服务电话不能为空',trigger:'blur'}]" prop="servicePhone">
           <el-input v-model="ruleForm.servicePhone" class="ukao-login_input1 inputing" placeholder="请输入门店服务电话"></el-input>
        </el-form-item>
      </el-form>
      <div class="fottbtn">
         <el-button type="primary" style="width:100%;" @click="option('ruleForm',1)" :loading="nextloading" :disabled="nextdin">确定，下一步</el-button>
         <!-- <span><</padding> -->
         <div class="skipbtn">
           <el-button type="text" class="text-primary register_login_btn"  @click="option(1,2)" :loading="skiploading" :disabled="skipdin">跳过此步骤</el-button>
         </div>
      </div>
	</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import validate from "@/utils/helpers/validate";
  import storagelite from '@/utils/helpers/storageLite'
  import md5 from '@/utils/md5'
	export default {
		data() {
			return {
        labelPosition:'',
        nextloading:false,
        skiploading:false,
        nextdin:false,
        skipdin:false,
        ruleForm:{
          storeName:"",
          shoperName:'',
          phone:'',
          loginUser:'',
          loginPass:'',
          servicePhone:'',
          brandId:'',
        },
			}
    },
    created () {
      this.getStorite();
    },
    mounted () {
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          this.setSty();
    } 
    let _this=this;
    window.onresize=function(){
      if(window.screen.width<=600){
        _this.setSty();
      }
      else{
         _this.labelPosition='right';
      }
    }
    },
    methods: {
      checkPhone(rule, value, callback){
        if(!validate.tel(value)){
          callback(new Error('手机号格式错误'));
        }
        else{
          callback();
        }
      },
      checkUser(rule, value, callback){
        if(!validate.letterNum(value)){
          callback(new Error('只能包含数字和字母'));
        }
        else{
          callback();
        }
      },
      setSty(){
        this.labelPosition='top';
      },
      getStorite(){
      let obj=storagelite.sessionGet("RIGISTER_INFO");
      this.ruleForm.brandId=obj.brandId;
      },
      option(formName,type=0){
        let mask=document.getElementsByClassName('mask')[0];
        mask.style.display="block";
        // return;
         let _this = this;
         let obj={};
         obj=storagelite.sessionGet("RIGISTER_INFO");
        if(type===1){
           _this.$refs[formName].validate(valid => {
          if (valid) {
            _this.nextloading=true;
            _this.skipdin=true;
            _this.$store.dispatch('post',{
              uri:'workerLogin/newRegister',
              forceResolve:true,
              data:{
                // symbol:this.ruleForm.brandId,
                mercId:obj.merIc,
                siname:this.ruleForm.storeName,
                wkName:this.ruleForm.shoperName,
                wkPhone:this.ruleForm.phone,
                wkAccount:this.ruleForm.loginUser,
                wkPassword:this.ruleForm.loginPass,
                tel:this.ruleForm.servicePhone,
                cityName:obj.cityName,
                regionalId:obj.regionalId,
              }
            }).then(res=>{
              if (res.data.httpCode === 200) {
                 obj.signCode=res.data.data.signCode
                 obj.storeId=res.data.data.storeId
                 obj.current="success"
                 obj.stroen=_this.ruleForm;
                 obj.headContent='通洗， 让洗涤更智慧'
                _this.$emit("childToParentMsg", obj);
              }
              else{
                 msg.error(res.data.msg);
                 _this.nextloading=false;
                 _this.skipdin=false;
                 mask.style.display="none";
              }
            })
        }
      });
    }
    else if(type===2){
      _this.skiploading=true
      _this.nextdin=true;
       _this.$store.dispatch('post',{
         uri:'workerLogin/newRegister',
         forceResolve:true,
         data:{
           skip:1,
           cityName:obj.cityName,
           regionalId:obj.regionalId,
           mercId:obj.merIc
         }
       }).then(res=>{
         if (res.data.httpCode === 200) {
            obj.signCode=res.data.data.signCode
            obj.current="success"
            obj.headContent='通洗， 让洗涤更智慧'
           _this.$emit("childToParentMsg", obj);
         }
         else{
            msg.error(res.data.msg);
            _this.skiploading=false;
            _this.nextdin=false;
            mask.style.display="none";
         }
       })
    }
    else if(type===3){
      obj.current="city"
      obj.headContent='设定开通服务的城市'
      this.$emit("childToParentMsg", obj);
    }
      },
    }
	}
</script>
<style>
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
.medi{
  width:395px;
  margin:0 auto;
  /* background-color: yellow; */
}
.fottbtn{
  width:72%;
  margin: 0 108px 30px;
}
.el-input__inner:focus{
   box-shadow: 0 0 4px 1px #74b1e5;
   border-color: #20a0ff;
}
.el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-textarea__inner{
  box-shadow: 0 0 1px 0 red;
  border-color:red; 
}
.skipbtn{
    width: 100px;
    /* background-color: yellow; */
    text-align: center;
    margin: 20px auto 30px;
  }
@media screen and (max-width: 600px) {
  .el-form--label-top .el-form-item__label{
    padding: 0 0 5px;
  }
 .el-form-item{
   margin-bottom: 5px;
 }
 .el-form-item__error {
    position: relative;
}
  .medi{
  width: 350px;
  margin:0 auto;
  /* background-color: yellow */
  }
  .inputing{
   width: 100%;
  }
  .fottbtn{
    width: 100%;
    margin: 15px 0px 30px;
  }
   .ft-size{
		font-size: 18px
	}
	.wrapper-lg{
		padding: 15px;
	}
  .m-t-lg{
    margin-top: 0px;
  }
}
</style>

