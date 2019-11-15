<template>
	<div class="text-center">
		<div class="wrapper-lg b-b text-xl text-black">创建您的 通洗 ID，绑定管理员微信。</div>
		<div class="wrapper-lg w-xl dis-inline m-t-lg">
			<p class="lh24">请用微信扫一扫，绑定管理员微信</p>
			<p class="lh24">绑定后可直接微信扫码登录</p>
			<div class="m-t-lg">
				<img class="w" src="/static/img/avatar.jpg" alt="">
			</div>
			<div class="m-t">
				<!-- <a class="text-primary"><router-link to="brand">暂不绑定，跳过</router-link></a> -->
				<!-- <a class="text-primary" @click="childToParent">暂不绑定，跳过</a> -->
			</div>
		</div>
	</div>
</template>

<script>
  export default{
    name: 'bind',
    data(){
      return {}
    },
    methods: {
      childToParent(){
        this.$emit("childToParentMsg", "brand");
      }
    }
  }
</script>
