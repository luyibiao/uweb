<template>
	<div class="ukao-tb-default" v-loading="loading">
		<table class="ukao-table w-full">
			<tbody>
				<tr>
					<td>登录账号</td>
					<td>{{acc.account}}</td>
					<td></td>
				</tr>
				<tr>
					<td>登录密码</td>
					<td>******</td>
					<td>
						<el-button @click="update('status', '登录密码')">修改</el-button>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- 修改基本信息 -->
		<el-dialog class="ukao-dialog"
			:title="dialog.title"
			:visible.sync="dialog.visible"
			size="small">
			<div>
				<el-form :model="ruleForm"  ref="ruleForm" label-width="150px">
					<el-form-item label="账号密码"    prop="pwd" :rules="[
							{ required: true, message: '密码不能为空'},
							{ validator: validatePass, min: 6, max: 16, message: '长度在6到16个长度', trigger: 'blur' }
						]">
						<div class="w-lg">
							<el-input v-model="ruleForm.pwd" type="password" auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="确定密码"   prop="pwd1" :rules="[
							{ required: true, message: '确定密码不能为空'},
							{ validator: validatePass2, min: 6, max: 16,  trigger: 'blur' }
						]">
						<div class="w-lg">
							<el-input v-model="ruleForm.pwd1" type="password" auto-complete="off"></el-input>
						</div>
					</el-form-item>

					<el-form-item>
						<el-button @click="dialog.visible=false">取消</el-button>
						<el-button type="primary"  @click="updatePwd('ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<!-- end-->
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import time from '@/utils/helpers/timeLite'
	import md5 from '@/utils/md5'
	import validate from '@/utils/helpers/validate'

  export default {
		data: function() {
      return {
				loading: true,
				acc: {
					account: ''
				},
				ruleForm:{
				  pwd:'',
					pwd1:''
				},
				dialog:{
				  title:'修改',
					attr:'',
					visible: false,
					act:''
				},
			}
    },
		created () {
		 this.info()
	 	},
		methods: {
			info (){
				this.$store.dispatch('post', {
					uri : 'workerAccount/detail',
					data: {}
				}).then((res) =>{
					var data = res.data.data
					if(data) {
					  this.acc = data
          }
					this.loading = false
				})
			},
			validatePass (rule, value, callback) {
				 if (value === '') {
					 callback(new Error('请输入密码'));
				 } else {
					 if (this.ruleForm.pwd !== '') {
						 this.$refs.ruleForm.validateField('pwd1');
					 }
					 callback();
				 }
			 },
			validatePass2 (rule, value, callback) {
				 if (value === '') {
					 callback(new Error('请再次输入密码'));
				 } else if (value !== this.ruleForm.pwd) {
					 callback(new Error('两次输入密码不一致!'));
				 } else {
					 callback();
				 }
			},
			update(attr, title){
			  this.dialog.attr = attr
			  this.dialog.visible = true
			},
			updatePwd(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.ruleForm.pwd == '' || md5.hex_md5(this.ruleForm.pwd) !== md5.hex_md5(this.ruleForm.pwd1)) {
						  msg.error("2次密码不一致")
							return
						}
						this.$store.dispatch('post', {
							uri: 'workerAccount/updatePwd',
							data: {
								id: this.acc.id,
								password: md5.hex_md5(this.ruleForm.pwd)
							}
						}).then((res) => {
							this.dialog.visible = false
							msg.success();
							this.info()
						})
					}
        })
			},
		}
  }
</script>