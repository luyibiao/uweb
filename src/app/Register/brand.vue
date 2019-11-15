<template>
	<div class="text-center">
		<!-- <div class="wrapper-lg b-b text-xl text-black ft-size">创建品牌信息</div> -->
		<div class="m-t-lg wrapper-lg w-xl dis-inline">
			<div class="ukao-login m-t-xl" :class="chkName?'u-is-error':''">
				<input class="ukao-login_input" type="text" placeholder="品牌名称" v-model.trim="account.name" @blur="checkName()" @keyup="onKey(1)">
				<!-- 错误提示控制class: u-is-error。 -->
				<div class="validate-container">
					<p class="text-danger text-left">{{chkNameDesc}}</p>
				</div>
        <div class="contentAfter"></div>
			</div>
			<p class="text-muted m-t-sm text-left text-xs">长度不能超过12，可以是汉字、字母，设置后不能修改。<span>例：友靠洗衣</span></p>
			<div class="ukao-login m-t two-input" :class="chkSymbol?'u-is-error':''">
				<input class="ukao-login_input" placeholder="品牌ID" v-model.trim="account.symbol" @keyup="onKey(2)">
				<div class="validate-container">
					<p class="text-danger text-left">{{chkSymbolDesc}}</p>
				</div>
        <div class="contentAfter"></div>
			</div>
			<p class="text-muted m-t-sm text-left text-xs">长度为3-12，可以是字母、数字、下划线，设置后不能修改。<span>例：ukaoxiyi</span></p>
			<div class="m-t-xl">
				<!-- <router-link to="invite"><el-button class="w-full" size="large" type="success">确认</el-button></router-link> -->
				<el-button class="w-full register_login_btn" size="large" type="primary" @click="confirm" :loading="loading">确认</el-button>
			</div>
			<p class="lh24 text-muted m-t-xxl">客服热线：0731-89748960</p>
		</div>
	</div>
</template>

<script>
  import md5 from '@/utils/md5'
  import storagelite from '@/utils/helpers/storageLite'
  import msg from '@/utils/msg'
  export default{
    name: 'brand',
    data(){
      return {
        loading:false,
        chkName: false,
        chkNameFlag:false,
        chkNameDesc:'此品牌已被占用，请重新输入。',
        chkSymbol: false,
        chkSymbolFlag:false,
        chkSymbolDesc:'此ID已被占用，请重新输入。',
        nextFlag:false,
        account: {
          username: '',
          password: '',
          spreadCode:'',
					name:'',
          symbol:''
        }
			}
    },
    created() {
      // this.account = this.$store.register.account
		},
    methods: {
      checkName() {
        if (!this.account.name) {
           this.chkNameFlag=false;
          this.chkName = true;
          this.chkNameDesc = '请输入品牌名称';
          return;
        } 
        if(this.account.name.includes(' ')){
           this.chkNameFlag=false;
           this.chkName = true;
           this.chkNameDesc = '不能含有空格';
           return;
        }
        if(this.account.name.length>12){
           this.chkNameFlag=false;
           this.chkName = true;
           this.chkNameDesc = '长度最多为12个字';
           return;
        }
        else{
          this.chkNameFlag=true;
				}
      },
      onKey(type){
        if(type===1 && this.account.name){
          this.chkName=false
        }
        else if(type===2 && this.account.symbol  && !(this.account.symbol.length <= 2 || this.account.symbol.length > 12)){
          this.chkSymbol=false
        }
      },
      checkSymbol() {
      },
      confirm() {
        let _this = this;
        if (!_this.account.symbol) {
          _this.chkSymbol = true;
          _this.chkSymbolDesc = '请输入品牌ID';
        } else if(_this.account.symbol.length <= 2 || _this.account.symbol.length > 12){
					_this.chkSymbol = true;
					_this.chkSymbolDesc = '品牌ID的长度为3-12';
        } 
        else{
          _this.chkSymbolFlag=true
        }
        if(_this.chkNameFlag && _this.chkSymbolFlag){
          _this.loading=true;
          let obj={};
          obj=storagelite.sessionGet("RIGISTER_INFO");
          _this.$store.dispatch('post', {
            uri: 'workerLogin/updateRegister',
            forceResolve:true,
            data: {
              mercId:obj.merIc,
              name:_this.account.name,
              symbol: _this.account.symbol
            }
          }).then((res) => {
            if (res.data.httpCode != 200) {
               _this.loading=false;
                msg.error(res.data.msg);
              // _this.chkSymbol = true;
              // _this.chkSymbolDesc = '此ID已被占用，请重新输入。';
            } else {
              _this.loading=false;
               obj.current="city",
               obj.brandName=_this.account.name,
               obj.brandId=_this.account.symbol;
               obj.headContent='设定开通服务的城市'
               _this.$emit("childToParentMsg", obj);
              // _this.chkSymbolFlag=true
              // _this.chkSymbol = false;
        //        if (_this.chkNameFlag && _this.chkSymbolFlag) {
        //         let obj={};
        //         obj=storagelite.sessionGet("RIGISTER_INFO");
        //         obj.current="city",
        //         obj.brandName=_this.account.name,
        //         obj.brandId=_this.account.symbol;
        //         _this.$emit("childToParentMsg", obj);
        // }
            }
          });
        }
      },
    }
  }
</script>
<style scoped>
.u-is-error .contentAfter{
  height: 20px;
  width: 10px;
  /* background-color: yellow; */
}
.two-input.u-is-error{
  margin-top: 10px;
}
@media screen and (max-width: 600px) {
	.wrapper-lg{
		padding: 15px;
	}
  .m-t-lg{
    margin-top: 0px;
  }
}
</style>


