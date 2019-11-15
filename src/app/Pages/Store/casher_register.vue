<template>
	<div>
		<el-breadcrumb class="link-back" separator="/">
		  <el-breadcrumb-item to="/store/list"><i class="el-icon-arrow-left icon-smaller"></i>门店列表</el-breadcrumb-item>
		  <el-breadcrumb-item to="/store/info/19">涉外店</el-breadcrumb-item>
		  <el-breadcrumb-item>新建门店</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="text-center m-t-xl">
			<div class="dis-inline w-xxl b-a bg-cash">
				<div>
					<img class="cash-register-img v-top" src="/static/img/pos.png" alt="">
				</div>
				<div>
					<div class="title text-center text-black m-t m-b">绑定收银机</div>
					<div class="padder-lg ">
						<el-form ref="form2" :model="form2" label-width="55px">
						  <el-form-item label="序列号">
						    <el-input v-model="form2.name" placeholder="请输入序列号"></el-input>
						  </el-form-item>
						  <el-form-item label="验证码" >
						    <el-input v-model="form2.name" placeholder="请输入验证码"></el-input>
						    <p class="text-muted text-xs">收银机绑定序列号，验证成功后，不支持修改</p>
						  </el-form-item>
						  <el-form-item>
						    <el-button>取消</el-button>
						    <el-button type="primary">确定</el-button>
						    <div class="text-right"><a class="text-primary"><router-link to="">还没有，去购买</router-link></a></div>
						  </el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form2: {
        	name: ''
        },
			}
		}
	}
</script>

<style scoped>
	.cash-register-img {
		max-width: 100%;
		height: auto;
	}
	.bg-cash {
		background: #f7f7f7;
	}
</style>