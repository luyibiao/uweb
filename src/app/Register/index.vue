<template>
<div class="box register_box">
	<div class="b-b text-xl text-black ft-size text-center img-box">
		<div class="wrapper-lg text-left" style="width:100%;">
			<img src="/static/img/register/logo.png" width="110px;" ref="headimg" style="vertical-align:middle;" >
			<span class="box-img-text">{{headContent}}</span>
		</div>		
	</div>
	<div v-if="showId==='create'">
		<v-create v-on:childToParentMsg="getChildId"></v-create>
	</div>
	<div v-else-if="showId==='code'">
		<vCode v-on:childToParentMsg="getChildId"></vCode>
	</div>
	<!-- <div v-else-if="showId==='bind'">
		<v-bind v-on:childToParentMsg="getChildId"></v-bind>
	</div> -->
	<div v-else-if="showId==='brand'">
		<v-brand v-on:childToParentMsg="getChildId"></v-brand>
	</div>
	<div v-else-if="showId==='city'">
		<vCity v-on:childToParentMsg="getChildId"></vCity>
	</div>
	<div v-else-if="showId==='storen'">
		<vStoren v-on:childToParentMsg="getChildId"></vStoren>
	</div>
	<div v-else-if="showId==='bindCode'">
		<vBindCode v-on:childToParentMsg="getChildId"></vBindCode>
	</div>
	<div v-else-if="showId==='success'">
		<v-success></v-success>
	</div>
</div>
</template>

<script>
	import vCreate from './create.vue'
	import vCode from './code.vue'
	import vBrand from './brand.vue'
	import vCity from './service_city.vue'
	import vStoren from './storen.vue'
	import vBindCode from "./bind_code.vue"
	import vSuccess from './success.vue'
	import storagelite from '@/utils/helpers/storageLite'
  export default {
  	components: {
			vCreate,
			vCode,
			vBrand,
			vCity,
			vStoren,
			vBindCode,
			vSuccess
		},
    name: 'register',
    data() {
    	return {
    		showId: 'create',
				headContent:'创建账号'
    	}
    },
    created(){
  	  // if (this.$route.query.invite){
      //   this.showId = 'invite';
			// }
			if(storagelite.sessionGet("RIGISTER_INFO") &&storagelite.sessionGet("RIGISTER_INFO")!==""){
					this.getStoragelite();
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
      else{
				_this.$refs.headimg.src="/static/img/register/logo.png"
				_this.$refs.headimg.style.width=110+'px'
      }
    }
		},
    methods: {
			setSty1(){
				this.$refs.headimg.src="/static/img/register/logowu.png"
				this.$refs.headimg.style.width=30+'px'
			},
			getStoragelite(){
						this.showId = storagelite.sessionGet("RIGISTER_INFO").current;
						this.headContent=storagelite.sessionGet("RIGISTER_INFO").headContent
			},
    	// 获取从子组件传递过来的data，并赋值给showId
    	getChildId: function(data) {
				storagelite.sessionSet("RIGISTER_INFO",data);
				this.showId = data.current;
				this.headContent=data.headContent;
    	}
    }
  }
</script>

<style lang="scss" src="./theme/styles/index.scss">
</style>
<style scoped>
/* .box{
	position: relative;
} */
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
@media screen and (max-width: 600px) {
  .ft-size{
		font-size: 18px
	}
	.wrapper-lg{
		padding: 15px;
	}
}
</style>
