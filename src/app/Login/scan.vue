<template>
	<div class="text-center">
		<div class="wrapper-lg b-b text-xl text-black">登录您的 通洗 ID</div>
		<div class="wrapper-lg m-t-lg w-xl dis-inline">
			<p class="lh24">登录 通洗 ID 来使用 通洗 的所有功能。</p>
			<p class="lh24">没有 通洗 ID ?<a class="text-primary m-l"><router-link to="/register">注册</router-link></a></p>
			
			<div class="m-t-md" >
				<a class="text-primary"><router-link to="/login">账户登录</router-link></a>
			</div>
			
			<div class="m-t-md">
				<img class="w" src="/static/img/avatar.jpg" alt="">
			</div>
			<div class="m-t">
				打开手机微信，扫描二维码
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped src="./theme/styles/index.scss">
</style>
