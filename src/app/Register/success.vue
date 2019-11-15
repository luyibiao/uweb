<template>
	<div class="text-center">
		<!-- <div class="wrapper-lg b-b text-xl text-black ft-size">通洗， 让洗涤更智慧</div> -->
		<div class="m-t-lg wrapper-lg w-xl dis-inline">
			<div>
				<img class="thumb-lg img-circle" src="/static/img/register/success.png" alt="">
				<!-- <el-button type="success" icon="el-icon-check" circle></el-button> -->
				<p class="text-success m-t ft-succ">恭喜你，已完成注册向导</p>
			</div>
			<div class="m-t-xl pc_div">
				<a class="text-xl text-primary" style="font-size:23px;" @click="setStorie"><router-link :to="'/login?signCode='+signCode">立即进入管理平台，开启智慧之旅</router-link></a>
			</div>
			<div class="m-t-xl an_div">
				<p>请在电脑上打开浏览器，输入网址</p>
				<p style="font-sizt:23px;">www.twash.cn</p>
				<a class="text-xl text-primary" style="font-size:23px;" @click="setStorie"><router-link :to="'/login?signCode='+signCode">进入管理平台</router-link></a>
			</div>
		</div>
	</div>
</template>
<script>
import storagelite from '@/utils/helpers/storageLite'
export default {
	data () {
		return {
			signCode:''	
		}
	},
	created () {
		this.getStorie();
	},
	methods: {
		getStorie(){
			let obj=storagelite.sessionGet("RIGISTER_INFO");
			this.signCode=obj.signCode;
		},
		setStorie(){
			storagelite.sessionRemove("RIGISTER_INFO");
		},
	}	
}
</script>

<style scoped>
.w-xl{
	width: 345px;
}
.wrapper-lg{
	padding: 30px 10px 30px 10px
}
.ft-succ{
	font-size:23px;
}
.pc_div{
	display: block;
}
.an_div{
	display: none;
}
@media screen and (max-width: 600px) {
	.an_div{
	display: block;
}
.an_div p,.an_div a{
	font-size: 16px;
	margin-bottom: 10px;
}
.an_div>:nth-child(2){
	font-size: 23px;
	/* margin-bottom: 15px; */
}
.pc_div a{
	display: none;
	font-size: 20px;
}
  .ft-size{
		font-size: 18px
	}
	.wrapper-lg{
		padding: 15px;
	}
	.img-circle{
		width: 50px;
	}
	.ft-succ{
		font-size: 18px;
	}
}
</style>



