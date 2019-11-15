<template>
	<div class="text-center">
		<!-- <div class="wrapper-lg b-b text-xl text-black ft-size">创建你的登录账号</div> -->
		<div class="wrapper-lg w-xl dis-inline m-t-lg">
			<p class="lh24">已发送一条验证码短信至 <span class="text-primary"><strong>{{phone}}</strong></span></p>
			<p class="lh24">请输入短信中的验证码</p>
      <span class="lh24">
        <el-button type="text" class="text-primary" @click="option">返回上一步，修改手机号码</el-button>
      </span>
			<div class="m-t-lg">
      	<input class="ukao-login_input code" type="tel" placeholder="请输入短信验证码"  @blur="checkCode(code)" v-model="code" autocomplete="new-password" pattern="\d*"/>
        <el-button @click="setContent" :disabled="codeBtn" class="codebtn">{{btnContent}}</el-button>
			</div>
      <div class="m-t-lg">
      	<input class="ukao-login_input twoinput" :class="pawShow ? 'u-is-error': ''" type="password" placeholder="请设置密码,至少六位（可以是数字和字母）"  @blur="checkPass(password)" v-model="password"  @keyup="onKey()" autocomplete="new-password" >
          <!-- <div class="validate-container">
            <p class="text-danger text-left">{{chkNameDesc}}</p>
          </div> -->
        <p class="text-danger text-left" v-show="pawShow" >{{errMsg}}</p>
			</div>
      <div class="m-t-lg" v-if="spreadCodeFlag">
        <input class="ukao-login_input twoinput"  placeholder="请填写推广码（选填）" v-model="spreadCode" >
      </div>
      <div class="m-t-lg">
         <el-button type="primary" style="width:100%;" @click="childToParent"  :loading="loading" class="register_login_btn">下一步</el-button>
      </div>
		</div>
	</div>
</template>

<script>
import storagelite from '@/utils/helpers/storageLite'
import validate from "@/utils/helpers/validate";
import md5 from '@/utils/md5'
import msg from '@/utils/msg'
  export default{
    data () {
      return {
        phone:"",
        code:'',
        codeBtn:"",
        btnContent:'',
        password:'',
        spreadCode:undefined,
        spreadCodeFlag:false,
        pawShow:false,
        errMsg:'',
        loading:false,
        nextFlag:false
      }
    },
    created () {
      if(!this.$route.query.spreadCode || this.$route.query.spreadCode==""){
        this.spreadCodeFlag=true;
      }
      else{
        this.spreadCode=this.$route.query.spreadCode
      }
        this.getStoragelite();
        this.setContent();
        this.setTextIn();
    },
    methods: {
      setTextIn(){
        if(this.password!==""){
          this.password=""
        }
      },
      getStoragelite(){
        let obj=storagelite.sessionGet("RIGISTER_INFO");
        this.phone=obj.phone;
      },
      setContent(){
        let timeContent=60;
        let _this=this;
        _this.codeBtn=true;
        this.btnContent="重新发送"+"("+timeContent+")";
        let timeIn=setInterval(function(){
          timeContent--;
          _this.btnContent="重新发送"+"("+timeContent+")";
          if(timeContent<=0){
            clearInterval(timeIn);
            _this.codeBtn=false
            _this.btnContent="获取验证码"
          }
        },1000)

        this.$store.dispatch('post',{
          uri:'workerLogin/getRegisterCode',
          data:{
            username:this.phone
          }
        }).then(res=>{
        })
      },
      option(){
       let obj={current:'create',phone:this.phone,headContent:'创建账号'}
       this.$emit("childToParentMsg", obj);
      },
      checkCode(){},
      onKey(){
        let _this=this
        if(this.password.length>=6 && validate.letterNum(this.password)){
          _this.nextFlag=true
          _this.pawShow=false;
        }
        else{
           _this.nextFlag=false
        }
      },
      checkPass(item){
        this.pawShow=false;
        if(item.length<6){
          this.errMsg='密码长度至少六位'
          this.pawShow=true;
          return;
        }
         if(!validate.letterNum(item)){
            this.errMsg='只能包含数字和字母'
            this.pawShow=true;
            return;
        }
      },
      childToParent(){
        let _this=this
        if(this.nextFlag){
          this.loading=true;
          _this.$store.dispatch('post',{
          uri:'workerLogin/registerMerc',
          forceResolve:true,
          data:{
            username:_this.phone,
            password:_this.password,
            code:_this.code,
            spreadCode:this.spreadCode
          }
        }).then(res=>{
          if(res.data.httpCode === 200){
             let obj={current:'brand',phone:_this.phone,code:this.code,password:_this.password,merIc:res.data.data,headContent:'创建品牌信息'}
            _this.$emit("childToParentMsg", obj);
          }
          else{
           msg.error(res.data.msg);
            _this.loading=false;
          }
          
        })
        }
        // if(this.nextFlag){
        //    let obj={current:'brand',phone:this.phone,code:this.code,password:this.password}
        //    this.$emit("childToParentMsg", obj);
        // }
      }
    }
  }
</script>

<style scoped>
.code{
  display: inline-block;
  width: 189px;
}
.u-is-error{
  box-shadow: 0 0 1px 0 red;
  border-color:red; 
  margin-top: 20px;
}
.ukao-login_input .twoinput{
  width:96%;
}
.codebtn{
  padding: 10px 0px;
  width: 123px;
}
@media screen and (max-width: 600px) {
  .ft-size{
		font-size: 18px
	}
	.wrapper-lg{
		padding: 15px;
	}
  .m-t-lg{
    margin-top: 17px;
  }
}
</style>
