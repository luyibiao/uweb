<template>
	<div class="text-center">
		<div class="wrapper-lg b-b text-xl text-black">创建您的 通洗 ID</div>
		<div class="m-t-lg wrapper-lg w-xl dis-inline">
			<p class="lh24">系统内测中，还没完全开放使用。</p>
			<p class="lh24">正式开放使用后会以短信的形式告知您。谢谢：）</p>
			
			<!-- 错误提示控制class: u-is-error。 -->
			<div class="ukao-login m-t-xl" :class="chkCode?'u-is-error':''">
				<input class="ukao-login_input" type="text" placeholder="邀请码" v-model.trim="code" @blur="checkCode()">
				<div class="validate-container">
					<div class="validate-box">请输入有效的邀请码</div>
				</div>
			</div>
			<div class="m-t-xl">
				<!-- <router-link to="success"><el-button class="w-full" size="large" type="success">确认</el-button></router-link> -->
				<el-button class="w-full" size="large" type="success" @click="confirm">确认</el-button>
			</div>
			<p class="text-muted m-t-xxl">客服热线：0731-89748960</p>
		</div>
	</div>
</template>

<script>
  export default{
    name: 'invite',
    data(){
      return {
        chkCode: false,
        code:'',
        mercId:'',
			}
    },
    created() {
      this.mercId = this.$store.register.mercId;
		},
    methods: {
      checkCode() {
				this.chkCode = !this.code || this.code.length < 4 || this.code.length > 16;
				return this.chkCode;
//        if (!this.code) {
//          this.chkCode = true;
//				}
			},
      confirm(){
        let _this = this;
        if (!this.checkCode()) {
          this.$store.dispatch('post', {
            uri: 'workerLogin/verifyMercCode',
            data: {
              code: this.code,
              mercId: this.mercId
            }
          }).then((res) => {
            this.$store.register = null;
            _this.$emit("childToParentMsg", "success");
          });
				}else{
					_this.chkCode = false;
				}
      }
    }
  }
</script>


