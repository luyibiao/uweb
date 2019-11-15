<template>
	<div>
		<el-breadcrumb class="link-back" separator="/">
		  <el-breadcrumb-item to="list"><i class="el-icon-arrow-left icon-smaller"></i>工厂列表</el-breadcrumb-item>
		  <el-breadcrumb-item>新建工厂</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clearfix m-t-lg ">
			<div class="ukao-el-form-container pull-left">
			<el-form :model="ruleForm" ref="ruleForm" label-width="160px" class="demo-ruleForm">
			  <el-form-item label="工厂名称" prop="name" :rules="[
			    { required: true, message: '名称不能为空'},
			    { min: 1, max: 25, message: '长度在1到25个长度', trigger: 'blur' }
			  ]">
          <div class="dis-inline w-xl">
            <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入工厂名称"></el-input>
          </div>
			  </el-form-item>
				<el-form-item label="管理员姓名" prop="wkName" :rules="[
						{ required: true, message: '请填写姓名'},
						{ min: 1, max: 8, message: '请输入1至8位长度', trigger: 'blur'}
					]">
					<div class="w-lg">
						<el-input v-model="ruleForm.wkName" auto-complete="off" placeholder="请输入姓名"></el-input>
					</div>
				</el-form-item>
				<el-form-item
					label="管理员手机号"  prop="wkPhone"  :rules="[
						{ required: true, message: '请填写手机号'},
						{ min: 11, max: 11, message: '请输入手机号格式错误', trigger: 'blur'}
					]">
					<div class="w-lg">
						<el-input v-model="ruleForm.wkPhone" auto-complete="off" placeholder="请输入手机号"></el-input>
					</div>
				</el-form-item>
        <el-form-item label="厂长登录账号" prop="acc" :rules="[
						{ required: true, message: '厂长登录账号不能为空'},
						{ min: 3, max: 15, message: '长度在3到15个长度', trigger: 'blur' }
				]">
          <div class="dis-inline w-md">
            <el-input v-model="ruleForm.acc" placeholder="请输入数字、字母">
							<template slot="append">{{ruleForm.symbol}}</template>
						</el-input>
          </div>
        </el-form-item>
			  <el-form-item label="厂长登录密码" prop="pwd" :rules="[
						{ required: true, message: '厂长登录密码不能为空'},
						{ min: 6, max: 16, message: '长度在6到16位长度', trigger: 'blur' }
				]">
          <div class="dis-inline w-xl">
  			    <el-input type="password" v-model="ruleForm.pwd" placeholder="6到16位长度密码"></el-input>
          </div>
			  </el-form-item>
			  <el-form-item label="所在省市区" :rules="[
			    	{ required: true, message: '所在省市区不能为空'}
			  ]">
          <div class="dis-inline w-xl">
  			    <el-cascader
							v-model="selectedOptions"
							placeholder="请选择/搜索"
  					  :options="options"
							filterable
							:clearable="true"
							@change="selected"
  					></el-cascader>
          </div>
			  </el-form-item>
			  <el-form-item label="详细地址" prop="addrDesc" :rules="[
						{ min: 0, max: 255, message: '长度在0到255个长度', trigger: 'blur' }
				]">
          <div class="dis-inline w-xl">
  			  	<el-input v-model="ruleForm.addrDesc" placeholder="请输入地址详情"></el-input>
          </div>
			  </el-form-item>
				<el-form-item label="电话" prop="tel" :rules="[
						{min: 6, max: 20,  message: '请输入有效的电话' }
				]">
         <div class="dis-inline w-xl">
 			  	<el-input v-model="ruleForm.tel"  placeholder="请输入电话"></el-input>
         </div>
		  </el-form-item>
			  <el-form-item label="坐标（经度，纬度）">
			  	<div class="w-sm dis-inline">
			  		<el-input  v-model="ruleForm.longitude" placeholder="经度" :rules="[
			  				{ min: 10, max: 20, message: '长度在10到20个长度', trigger: 'blur' }
						]">
						</el-input>
			  	</div>，
					<div class="w-sm dis-inline">
			  		<el-input  v-model="ruleForm.latitude" placeholder="纬度" :rules="[
								{ min: 10, max: 20, message: '长度在10到20个长度', trigger: 'blur' }
						]"></el-input>
			  	</div>
					<a class="text-primary"
						 target="_blank"
						 href="https://lbs.qq.com/tool/getpoint/">拾取坐标</a>
			  </el-form-item>
			  <el-form-item>
			  	<div>
						<router-link to="list">
			  			<el-button>取消</el-button>
						</router-link>
			  		<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
			  	</div>
			  </el-form-item>
			</el-form>
			</div>
			<!-- <div class="cash-register">
				<div class="dis-inline w-xxl b-a bg-cash">
					<div class="text-center">
						<img class="cash-register-img m-t-lg m-b-lg v-top" src="/static/img/station_machine.png" alt="">
					</div>
					<div>
						<div class="title text-center text-black m-b">绑定工位机</div>
						<div class="padder-lg ">
							<el-form ref="form2" :model="form2" label-width="55px">
							  <el-form-item label="序列号">
							    <el-input v-model="form2.name" placeholder="请输入序列号"></el-input>
							  </el-form-item>
							  <el-form-item label="验证码" >
							    <el-input v-model="form2.name" placeholder="请输入验证码"></el-input>
							    <p class="text-muted text-xs">工位机绑定序列号，验证成功后，不支持修改</p>
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
			</div> -->
		</div>
	</div>
</template>


<script>
	import consts from '@/utils/consts'
	import auth from '@/utils/auth'
	import msg from '@/utils/msg'
	import regional from '@/utils/regional'
	import md5 from '@/utils/md5'

	export default {
		data: function() {
			return {
				ruleForm: {
          name: '',
					cityId: '',
					account: '',
					acc: '',
					password: '',
					pwd: '',
					regionalId: '',
					regionalDesc: '',
					addrDesc: '',
					symbol: '',
					tel: '',
					longitude: '',
					latitude: '',
					wkName:'',
					wkPhone:''
        },
        mercInfo:{},
        form2: {
        	name: ''
        },
				selectedOptions: [],	//默认选择省市区
        options: []	//选择地区
			}
		},
		created () {
      this.init()
			this.getRegional()
    },
		methods: {
			init (){
			  this.mercInfo = auth.getMercInfo()
				this.ruleForm.symbol = this.mercInfo.symbol
			},
			getRegional (){
				this.options = regional.all()
			},
			selected (val){
				if(val.length == 3){
					this.ruleForm.regionalId = val[2]
					let province = regional.getProvince(val[0])
					let city = regional.getCity(val[0], val[1])
					let area = regional.getArea(val[0], val[1], val[2])
					this.ruleForm.regionalDesc = province[0].label + city[0].label + area[0].label
				}
			},
			submitForm (formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.ruleForm.password = md5.hex_md5(this.ruleForm.pwd)
						this.ruleForm.account = this.ruleForm.acc
						this.$store.dispatch('post', {
							uri: 'factoryInfo/add',
							data: this.ruleForm
						}).then((res) => {
								msg.success();
								this.$router.push({ path: '/plant/list' })
						})
					}else{
						return false
					}
				})
			}
    }
	}
</script>

<style scoped>
	.cash-register {
		margin-left: 640px;
		overflow: hidden;
	}
	.cash-register-img {
		width: 200px;
		height: auto;
	}
	.bg-cash {
		background: #f7f7f7;
	}
</style>