<template>
<div>
   <div class="b-b text-xl text-black ft-size text-center img-box">
        <div class="wrapper-lg text-left" style="width:100%;">
          <img src="/static/img/register/logo.png" width="110px;" ref="headimg" style="vertical-align:middle;" >
          <span class="box-img-text">登录</span>
        </div>		
	   </div>
	<div class="text-center" v-if="showId==='account'">
		<!-- <div class="wrapper-lg b-b text-xl text-black">登录</div> -->
		<div class="m-t-lg wrapper-lg w-xl dis-inline" v-loading="signLoading">
			<p class="lh24">没有登录账号？<span class="text-primary m-l"><router-link to="/register">立即注册</router-link></span></p>
      	<p class="lh24 text-primary" style="display:none">微信扫码登录</p>
			<div class="m-t-md text-primary"  style="display: none">
				<a class="text-primary" @click="showId='scan'">微信扫码登录</a>
			</div>
			
			<div class="ukao-login m-b-sm m-t-xl" :class="chkname?'u-is-error':''">
				<input class="ukao-login_input" type="text" autocomplete="off"
							 v-model.trim="account.username"
							 @blur="check('chkname', account.username)"
							 placeholder="手机号码/账号">
				<!-- 错误提示控制class: u-is-error。 -->
				<div class="validate-container">
					<p class="text-danger text-left">请输入有效的手机号码/账号</p>
				</div>
        	 <div class="contentAfter"></div>
			</div>
		
			<div class="ukao-login two-input" :class="chkpwd?'u-is-error':''">
				<input class="ukao-login_input" type="password" autocomplete="off"
							 v-model="account.password" @blur="check('chkpwd', account.password)"
							 @keyup.enter="handleLogin"
							 placeholder="安全密码">
				<div class="validate-container">
					<div class="text-danger text-left">请输入正确的登录密码</div>
				</div>
         <div class="contentAfter"></div>
			</div>
			
			<div class="m-t-lg">
				<el-button class="w-full register_login_btn" size="large" type="primary" @click="handleLogin" :loading="loading">登录</el-button>
			</div>
			<div class="text-left clearfix lh24 m-t-sm">
				<el-checkbox v-model="account.rememberMe" ><span style="font-size:14px;">下次自动登录</span></el-checkbox>
				<span class="text-primary pull-right"><router-link to="login/secret">忘记密码？</router-link></span>
			</div>
		</div>
	</div>

	<div v-else class="text-center">
		<div class="wrapper-lg b-b text-xl text-black">登录你的 通洗 ID</div>
		<div class="wrapper-lg m-t-lg w-xl dis-inline">
			<p class="lh24">登录 通洗 ID 来使用 通洗 的所有功能。</p>
			<p class="lh24">没有 通洗 ID ?<a class="text-primary m-l"><router-link to="/register">注册</router-link></a></p>
			
			<div class="m-t-md" >
				<a class="text-primary" @click="showId='account'">账户登录</a>
			</div>
			
			<div class="m-t-md">
				<img class="w" src="/static/img/avatar.jpg" alt="">
			</div>
			<div class="m-t">
				打开手机微信，扫描二维码
			</div>
		</div>
	</div>

</div>
</template>

<script>
	import auth from '@/utils/auth'
	import md5 from '@/utils/md5'
  import msg from '@/utils/msg'
  import storagelite from '@/utils/helpers/storageLite'
  export default {
    data () {
			return {
				showId: 'account',
				chkname : false,
				chkpwd : false,
				account: {
						username: '',
						password: '',
						rememberMe: false,
						token: null
				},
        loading: false,
				signLoading: true,
			}
    },
    created() {
      this.getToken();
      this.setStore();
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
        else if (_this.$refs.headimg){
					_this.$refs.headimg.src="/static/img/register/logo.png"
					_this.$refs.headimg.style.width=110+'px'
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
      setStore(){
       	if(storagelite.sessionGet("RIGISTER_INFO") &&storagelite.sessionGet("RIGISTER_INFO")!==""){
           storagelite.sessionRemove("RIGISTER_INFO");
				}
      },
      check(name, value) {
          this[name] = !value;
      },
      getToken(){
        if(localStorage.getItem("ACCOUNTAUTH",{})) localStorage.removeItem("ACCOUNTAUTH")
          let _this = this;
          this.$store.dispatch('get', {
              uri: 'workerLogin/token'
          }).then((res) => {
            _this.account.token = res.data.loginSign;
            let signCode = _this.$route.query.signCode;
            if (signCode) {
              _this.signLoading = true
              _this.login(signCode);
            }else{
							_this.signLoading = false
						}
          })
      },
      login(signCode){
        let _this = this;

        _this.loading = true;
        let pwd = _this.account.password;
        _this.account.password = '';

        let loginData = {
          username: _this.account.username,
          password: md5.hex_md5(md5.hex_md5(pwd)+_this.account.token),
          rememberMe: _this.account.rememberMe
				};

        if (signCode) {
          loginData = {signCode}
				}

        this.$store.dispatch('post', {
          uri: 'workerLogin/login',
          forceResolve:true,
          data: loginData
        }).then((res) => {
          if (res.data.httpCode != 200) {
            if (res.data.httpCode == 403) {
              this.$store.register = {
                mercId: res.data.data
              };
              this.$router.push('/register?invite=true')
            } else {
              msg.error(res.data.msg);
            }
          } else {
            let _this=this;
            if(res.data.errPage && res.data.errPage!==""){
              if(res.data.errPage==='notMercName'){
                  storagelite.sessionSet("RIGISTER_INFO",{merIc:res.data.mercId,current:'brand',headContent:'创建品牌信息'});
              }
              else if(res.data.errPage==='notCity'){
                 storagelite.sessionSet("RIGISTER_INFO",{merIc:res.data.mercId,current:'city',brandId:res.data.symbol,headContent:'设定开通服务的城市'});
              }
              _this.$router.push({path:'/register'})
              return;
            }
            if (res.data.indexPage) {
              let data = {
                workInfo:{
                  loginType:res.data.loginType,
                  roleName:res.data.roleName,
                  cityName:res.data.cityName,
									authEnable:res.data.authEnable,
                  ...res.data.workInfo
                },
                mercInfo:{
                  symbol:res.data.symbol,
									otherEnable:res.data.otherEnable,
                  isOpenVipPrice: res.data.isOpenVipPrice,
                  isAuth: res.data.isAuth,
                  ...res.data.mercInfo
                },
                menuList:res.data.menuList,
//                allMenuList:res.data.allMenuList,
                permList:res.data.permList
              }
              this.$store.commit('SETWORKINFO',data.workInfo);
              auth.login(data);
              this.$router.push(res.data.indexPage);
            } else {
              msg.error("没有访问权限");
            }
          }
          _this.loading = false;
        })
			},
      handleLogin () {
        let _this = this;

        if (!_this.account.username || !_this.account.password) {
          return;
        }

        this.login();
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
.u-is-error .contentAfter{
  height: 20px;
  width: 10px;
  /* background-color: yellow; */
}
.two-input{
  margin-top: 20px;
}
.two-input.u-is-error{
  margin-top: 10px;
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

