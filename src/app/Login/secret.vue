<template>
	<div>
		 <div class="b-b text-xl text-black ft-size text-center img-box">
        <div class="wrapper-lg text-left" style="width:100%;">
          <img src="/static/img/register/logo.png" width="110px;" ref="headimg" style="vertical-align:middle;" >
          <span class="box-img-text">找回密码</span>
        </div>		
	   </div>
		<!-- <div class="wrapper-lg b-b text-xl text-black">找回密码</div> -->
		<div v-if="type===1" class="text-center">
		<div class="wrapper-lg w-xl m-t-lg dis-inline">
				<div class="ukao-login m-b-sm m-t-xl" :class="chkname?'u-is-error':''">
				<input class="ukao-login_input" type="tel" v-model.trim="account.username" @blur="check('chkname', account.username)" @keyup="onfirstup('chkname', account.username)" placeholder="请输入您注册的手机号码">
				<!-- 错误提示控制class: u-is-error。 -->
				<div class="validate-container">
					<div class="text-danger text-left">请输入有效的手机号码</div>
				</div>
			</div>
			<div class="m-t-lg">
				<el-button class="w-full" size="large" @click="chgPwd" type="primary" :loading="loading">下一步</el-button>
			</div>
			<div class="text-left clearfix lh24 m-t-sm">
				<span class="text-primary pull-right"><router-link to="/login">取消重置密码</router-link></span>
			</div>
			</div>
		</div>
		<div v-else class="text-center">
			<div class="checkCodeDiv">
				<div style="margin:40px 0px;">
					<span>已发送一条验证短信至<span class="text-primary"><strong>{{account.username}}</strong></span></span>
					<p>请输入短信中的验证码</p>
				</div>
				<div style="margin-top:20px;height:63px;">
						<input type="text" class="ukao-login_input checkCode pull-left" placeholder="请输入短信验证码" v-model="code" autocomplete="new-password"/>
						<el-button class="pull-right codebtn" :disabled="codeBtnDisable" @click="getCode">{{codeBtnName}}</el-button>
				</div>
				<div>
					<input type="password" class="ukao-login_input" placeholder="设置新密码（至少六位，包含数字和字母）" @blur="checkPass" @focus="checkPassFus" @keyup="onKey" v-model="newPass" autocomplete="new-password"/>
					<p class="text-danger text-left" v-show="errorFlag">{{errMsg}}</p>
				</div>
				<div style="margin-top:30px;">
					<el-button type="primary" style="width:100%;" :disabled="checkDisabled" @click="checkPwd" :loading="checkLoading" class="register_login_btn">确认修改</el-button>
				</div>
					<div class="text-left clearfix lh24 m-t-sm">
						<span class="text-primary pull-right"><router-link to="/login">取消重置密码</router-link></span>
					</div>
			</div>
			</div> 
		</div>
</template>

<script>
	import md5 from '@/utils/md5'
  import msg from '@/utils/msg'
	import consts from '@/utils/consts'
	import validate from "@/utils/helpers/validate";
	export default {
		data() {
			return {
				newPass:'',//输入的密码
				code:'',//短信验证码
				codeBtnName:'',//验证码按钮内容
				codeBtnDisable:"",//验证码按钮禁止开关
				loading:false,//下一步按钮loading
				checkLoading:false,//确认按钮loading
				errorFlag:false,//输入密码校验开关
				errMsg:'',//输入密码校验提示
				checkDisabled:true,//确认修改按钮禁止开关
				chkname : false,//手机号码检验提示开关
				// chkImgCode : false,
				nextFlag:false,//是否进行下一步开关
				type:1,//页面显示开关
				account: {
					username: '',//手机号
				},
				// validImgCode:{
				// 	url: consts.BASE_URL + '/api/valid/getImgCode'
				// }
			}
		},
	 mounted () {
    let _this=this;

    //判断是否为手机端操作
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        _this.setSty1();
    } 
    window.onresize=function(){
			if(window.screen.width<=600){
				_this.setSty1();
			}
			else if (_this.$refs.headimg) {
				_this.$refs.headimg.src = "/static/img/register/logo.png"
				_this.$refs.headimg.style.width = 110 + 'px'
			}
		}
	},
		methods: {
			setSty1(){
        if (this.$refs.headimg) {
          this.$refs.headimg.src = "/static/img/register/logowu.png"
          this.$refs.headimg.style.width = 30 + 'px'
        }
			},
			onfirstup(name, value){
				this[name]=false;
				let _this=this
				if(this.account.username!=="" && validate.tel(this.account.username)){
					_this.nextFlag=true;
					_this[name]=false;
				}
				else{
						_this.nextFlag=false;
				}
			},
			onKey(){
					this.errorFlag=false;
				 if(this.newPass===''){
					 this.errorFlag=true;
					 this.errMsg="重置密码不能为空"
					 this.checkDisabled=true;
					 return;
				 }
				 if(this.newPass.length<6){
					 this.errorFlag=true;
					 this.errMsg="密码不得少于六位数"
					 this.checkDisabled=true;
					 return;
				 }
				 if(!validate.letterNum(this.newPass)){
					 this.errorFlag=true;
					 this.errMsg="只能是由数字和密码组成"
					 this.checkDisabled=true;
					 return;
				 }
				else if(this.newPass!=='' && this.newPass.length>=6 && validate.letterNum(this.newPass)){
					this.checkDisabled=false
				}
			},
			checkPass(){
				this.errorFlag=false
			},
			checkPassFus(){
				this.errorFlag=false;
			},
			check(name, value) {
				if(value==="" || !validate.tel(this.account.username)){
						this[name] = true;
				}
			},
			refreshImgCode(){
				this.validImgCode.url = consts.BASE_URL + "/api/valid/getImgCode?&_t="+new Date().getTime();
			},
			checkPwd(){
				this.checkLoading=true;
				this.$store.dispatch('post',{
					uri:"workerLogin/updatePwd",
					data:{
						username:this.account.username,
						password:md5.hex_md5(this.newPass),
						code:this.code
					}
				}).then(res=>{
						msg.success();
						this.checkLoading=false;
						this.$router.push({path:'/login'})
				})
			},
			getCode() {
				let _this = this;
				_this.codeBtnDisable=true
				var codeBtnTime = 60;
			  _this.codeBtnName ='重新发送'+"("+codeBtnTime + "s"+")";
				let t = setInterval(function (){
					codeBtnTime --;
				  _this.codeBtnName ='重新发送'+"("+codeBtnTime + "s"+")";
					if (codeBtnTime <= 0) {
							clearInterval(t);
							_this.codeBtnName = '重新发送';
							_this.codeBtnDisable = false;
					}
				}, 1000);

				 _this.$store.dispatch('post',{
          uri:'workerLogin/getChgPwdCodeNew',
          data:{
            username:_this.account.username
          }
        }).then(res=>{
				})
			},
			chgPwd () {
				let _this = this;
				if(_this.nextFlag){
					_this.loading=true
					_this.$store.dispatch('post',{
						uri:'workerLogin/checkChgPwdPhone',
						forceResolve:true,
						data:{
							username:_this.account.username
						}
					}).then(res=>{
						 if (res.data.httpCode === 200) {
							 _this.type=2;
							 _this.getCode();	
							 _this.loading=false
						 }
						else{
							 msg.error(res.data.msg);
							 _this.loading=false
							}
					})		
				}
			}
		}
	}
</script>


<style lang="scss" scoped src="./theme/styles/index.scss">
</style>
<style scoped>
.wrapper-lg{
	padding: 25px;
}
.img-box{
	position: relative;
}
.box-img-text{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
}
.codebtn{
	 padding: 10px 0px;
   width: 123px;
}
.u-is-error .code{
	position: absolute;
	bottom: -20px;
}
.checkCodeDiv{
min-width:350px;
display: table;
margin:0 auto;
}
.checkCodeDiv .ukao-login_input.checkCode{
	max-width: 64%;
}
.validate-container{
	bottom: -20px;
}
@media screen and (max-width: 600px) {
  .ft-size{
		font-size: 18px
	}
	.wrapper-lg{
		padding: 15px;
	}
	.logina{
		display:none;
	}
}
</style>
