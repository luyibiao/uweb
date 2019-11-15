<template>
	<div class="text-center">
		<!-- <div class="wrapper-lg b-b text-xl text-black ft-size">创建账号
		</div> -->
		<div class="wrapper-lg w-xl m-t-lg dis-inline">
			<p class="lh24">只需一个管理账号，即可使用通洗的所有功能。</p>
			<p class="lh24">已有管理账号?<a class="text-primary m-l"><router-link to="/login">立即登录</router-link></a></p>
			
			<div class="ukao-login m-t-xl" :class="chkUserName?'u-is-error':''">
				<input class="ukao-login_input" type="tel" placeholder="请输入手机号码"  v-model.trim="account.username"  @blur="check('chkUserName', account.username)" @keyup="onKey(account.username)" pattern="\d*"/>
			</div>
			<p style="color:red;" class="text-left" v-show="chkUserName">请输入有效的手机号码</p>
			<p class="text-muted m-t-sm text-left text-xs">这将是你的登录账号。</p>
			<div class="m-t-xl">
				<el-button class="w-full register_login_btn" size="large" type="primary" @click="regist" :loading="loading">下一步</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import validate from "@/utils/helpers/validate";
	import storagelite from '@/utils/helpers/storageLite'
	export default {
		data() {
			return {
				chkUserName: false,
				loading:false,
				nextFlag:false,
				account: {
					username:''
				},
			}
		},
		created () {
				this.getStoragelite();
		},
		methods: {
			getStoragelite(){
					if(storagelite.sessionGet("RIGISTER_INFO") && storagelite.sessionGet("RIGISTER_INFO")!==""){
						this.account.username = storagelite.sessionGet("RIGISTER_INFO").phone;
				}
			},
			onKey(value){	
					if ( value && validate.tel(value)){
						this.chkUserName=false;	
						this.nextFlag=true;
			 	}
				else{
					this.nextFlag=false;
				 }
			},
			check(name, value) {
			 this.chkUserName=false;
			 if ( !value || !validate.tel(value)){
				 this.chkUserName=true;	
			 }
			// this.chkUserName=false;
			},
			regist(){
				let _this=this;
				if(this.nextFlag){
					this.loading=true;
					this.$store.dispatch('post',{
					uri:'workerLogin/queryCheckUserName',
					forceResolve:true,
					data:{
							username:this.account.username
						}
					}).then(res=>{
					if (res.data.httpCode === 200) {
							let obj={current:'code',phone:this.account.username,headContent:'创建登录账号'}
							this.$emit("childToParentMsg", obj);
					}
					else{
						 msg.error(res.data.msg);
						 _this.loading=false;
					}
        })
				}
			},
		}
	}
</script>
<style scoped>
@media screen and (max-width: 600px) {
	.wrapper-lg{
		padding: 15px;
	}
	/* .logina{
		display:none;
	} */
}
</style>

