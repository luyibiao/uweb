<template>
	<div>
		<div v-loading="loading" class="ukao-v-loading">
			<div style="margin-bottom: 50px">
				<el-breadcrumb class="link-back" separator="/">
					<el-breadcrumb-item to="/mcity/list"><i class="el-icon-arrow-left icon-smaller"></i>城市管理</el-breadcrumb-item>
					<el-breadcrumb-item>城市详情</el-breadcrumb-item>
				</el-breadcrumb>
			</div>

			<div class="ukao-tb-default">
				<div class="text-right">
					<el-button @click="deleteCity" type="danger">删除该城市</el-button>
				</div>
				<p style="height: 25px"></p>
				<table class="ukao-table b-t w-full">
					<tbody>
						<tr>
							<td>城市</td>
							<td>{{mercCity.name}}</td>
							<td><a class="text-primary" v-show="enableInitProduct" @click="initProduct()">初始化产品数据</a></td>
						</tr>
						<tr>
							<td>创建时间</td>
							<td>{{mercCity.createTime | getDate}} {{mercCity.createTime | getTime}}</td>
							<td></td>
						</tr>
						<tr>
							<td>管理员账号</td>
							<td>{{mercCity.workAccount}}</td>
							<td></td>
						</tr>
						<tr>
							<td>管理员账号密码</td>
							<td>******</td>
							<td><el-button v-show="btn.update" @click="update('pwd', '管理员账号密码', 1)">修改</el-button></td>
						</tr>
						<tr>
							<td>管理员姓名</td>
							<td>{{mercCity.wkName}}</td>
							<td><el-button v-show="btn.update" @click="update('wkName', '管理员姓名', 2)">修改</el-button></td>
						</tr>
						<tr>
							<td>管理员手机号</td>
							<td>{{mercCity.wkPhone}}</td>
							<td><el-button v-show="btn.update" @click="update('wkPhone', '管理员手机号', 2)">修改</el-button></td>
						</tr>
						<tr>
							<td>支付账号</td>
							<td>{{mercCity.payTypeText}}</td>
							<td><el-button v-show="btn.update" @click="update('payType', '支付账号', 4)">修改</el-button></td>
						</tr>
						<tr>
							<td>客服电话</td>
							<td>{{mercCity.tel}}</td>
							<td><el-button v-show="btn.update" @click="update('tel', '客户电话', 3)">修改</el-button></td>
						</tr>
						<tr>
							<td>微信店铺</td>
							<td>
								<p v-if="mercCity.isShopOpen">已开启</p>
								<p v-else>未开启</p>
							</td>
							<td><el-button v-show="btn.update" @click="update('shop', '微信店铺', 3)">修改</el-button></td>
						</tr>
						<tr v-if="mercCity.cupboardCnt">
							<td>智能柜自助店</td>
							<td>
								<p v-if="mercCity.isCupboard">已开启</p>
								<p v-else>未开启</p>
							</td>
							<td><el-button v-show="btn.update" @click="update('cupboard', '智能柜自助店', 3)">修改</el-button></td>
						</tr>
						<tr>
							<td>微信商城</td>
							<td>
								<p v-if="mercCity.isMall">已开启</p>
								<p v-else>未开启</p>
							</td>
							<td><el-button v-show="btn.update" @click="update('mall', '微信商城', 3)">修改</el-button></td>
						</tr>
						<tr>
							<td>状态</td>
							<td>
								<div v-if="mercCity.status == 1" class="t-state-success">正常使用</div>
								<div v-if="mercCity.status == 0">已停用</div>
								<div v-if="mercCity.status == -1">已删除</div>
							</td>
							<td><el-button v-show="btn.update" @click="update('status', '状态', 3)">修改</el-button></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<!-- 修改基本信息 -->
		<el-dialog class="ukao-dialog"
			:title="dialog.title"
			:visible.sync="dialog.visible"
			size="small">
			<div>
				<el-form :model="ruleForm"  ref="ruleForm" label-width="150px">
					<el-form-item label="管理员账号密码" v-if="dialog.attr ==='pwd'"   prop="pwd" :rules="[
							{ required: true, message: '密码不能为空'},
							{ validator: validatePass, min: 6, max: 16, message: '请输入6至16位长度密码', trigger: 'blur' }
						]">
						<div class="w-lg">
							<el-input v-model="ruleForm.pwd" type="password" auto-complete="off"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="确定密码" v-if="dialog.attr ==='pwd'"  prop="pwd1" :rules="[
							{ required: true, message: '确定密码不能为空'},
							{ validator: validatePass2, min: 6, max: 16,  trigger: 'blur' }
						]">
						<div class="w-lg">
							<el-input v-model="ruleForm.pwd1" type="password" auto-complete="off"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="管理员姓名" v-if="dialog.attr ==='wkName'"  prop="wkName" :rules="[
							{ required: true, message: '名称不能为空'},
							{ min: 1, max: 15, message: '长度在1到15位长度', trigger: 'blur' }
						]">
						<div class="w-lg">
							<el-input v-model="ruleForm.wkName"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="管理员手机号" v-if="dialog.attr ==='wkPhone'"  prop="wkPhone" :rules="[
							{ required: true, message: '手机号不能为空'},
							{ validator: checkTel,  message: '请输入有效的手机号', trigger: 'blur' }
						]">
						<div class="w-lg">
							<el-input v-model="ruleForm.wkPhone"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="客服电话" v-if="dialog.attr ==='tel'" prop="tel" :rules="[
					  {min: 6, max: 20,  message: '请输入有效的客服电话' },
					]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.tel" placeholder="请输入有效的客服电话"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="支付账号" v-if="dialog.attr ==='payType'" prop="payType" :rules="[
					  { required: true, message: '请选择' },
					]">
						<el-radio class="radio" v-model="ruleForm.payType" label="1">总部支付账号</el-radio>
						<el-radio class="radio" v-model="ruleForm.payType" label="2">城市支付账号</el-radio>
					</el-form-item>

					<el-form-item label="微信店铺" v-if="dialog.attr ==='shop'" prop="isShopOpen" :rules="[
							{ required: true, message: '请选择' },
						]">
						<el-radio class="radio" v-model="ruleForm.isShopOpen" label="1">启用</el-radio>
						<el-radio class="radio" v-model="ruleForm.isShopOpen" label="0">关闭</el-radio>
					</el-form-item>

					<el-form-item label="智能柜自助店" v-if="dialog.attr ==='cupboard'" prop="isCupboard" :rules="[
							{ required: true, message: '请选择' },
						]">
						<el-radio class="radio" v-model="ruleForm.isCupboard" label="1">启用</el-radio>
						<el-radio class="radio" v-model="ruleForm.isCupboard" label="0">关闭</el-radio>
					</el-form-item>

					<el-form-item label="微信商城" v-if="dialog.attr ==='mall'" prop="isMall" :rules="[
							{ required: true, message: '请选择' },
						]">
						<el-radio class="radio" v-model="ruleForm.isMall" label="1">启用</el-radio>
						<el-radio class="radio" v-model="ruleForm.isMall" label="0">关闭</el-radio>
					</el-form-item>

					<el-form-item label="状态" v-if="dialog.attr ==='status'" prop="isShopOpen" :rules="[
							{ required: true, message: '请选择' },
						]">
						<el-radio class="radio" v-model="ruleForm.status" label="1">正常使用</el-radio>
						<el-radio class="radio" v-model="ruleForm.status" label="0">停用</el-radio>
					</el-form-item>

					<el-form-item>
						<el-button @click="dialog.visible=false">取消</el-button>
						<el-button type="primary"  @click="updatePwd('ruleForm')" v-if="dialog.act === 1">保存</el-button>
						<el-button type="primary"  @click="updateWk('ruleForm')" v-if="dialog.act === 2">保存</el-button>
						<el-button type="primary"  @click="updateMercCity('ruleForm')" v-if="dialog.act === 3">保存</el-button>
						<el-button type="primary"  @click="updatePayType('ruleForm')" v-if="dialog.act === 4">保存</el-button>
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
				mercCity:{
				  id: this.$route.params.id
				},
				btn: {
					update: true,
				},
				dialog:{
				  title:'编辑',
					attr:'',
					visible: false,
					act:''
				},
				ruleForm:{
				  id:'',
					pwd:'',
					pwd1:'',
					wkName:'',
					wkPhone:'',
					tel:'',
					payType:'',
					isShopOpen:'',
					isCupboard:'',
					isMall:'',
					status:''
				},
        initTmpProduct:false,
        enableInitProduct: false
			};
    },
		created () {
		 	this.info()
      this.enableInit()
	 	},
		methods: {
			info (){
				this.$store.dispatch('post', {
					uri : 'mercCity/detail',
					data: {
					  id: this.mercCity.id
					}
				}).then((res) =>{
					var data = res.data.data
					this.mercCity = data
					setTimeout(() => {
						this.loading = false
						this.setRuleForm(data)
					}, 500);
				})
			},
      enableInit(){
        this.$store.dispatch('post', {
          uri: 'tmpProductInfo/enableInit'
        }).then((res) => {
          this.enableInitProduct = res.data.data == 1;
        })
      },
      initProduct() {
        var _this = this
        msg.confirm({
          msg: '确认初始化系统预设产品数据?', confirmFn: function () {
            _this.$store.dispatch('post', {
              uri: 'tmpProductInfo/initProduct',
              data: {
                cityId: _this.mercCity.id
              }
            }).then((res) => {
              msg.success();
              _this.enableInitProduct = false;
            })
          }
        })
      },
			setRuleForm(data){
				 this.ruleForm.id = data.id
				 this.ruleForm.wkName = data.wkName
				 this.ruleForm.wkPhone = data.wkPhone
				 this.ruleForm.tel = data.tel+''
				 this.ruleForm.payType = data.payType+''
				 this.ruleForm.isShopOpen = data.isShopOpen+''
				 this.ruleForm.isCupboard = data.isCupboard+''
				 this.ruleForm.isMall = data.isMall+''
				 this.ruleForm.status = data.status+''
			},
			update(attr, title, act){
			  this.dialog.attr = attr
			  this.dialog.act = act
			  this.dialog.visible = true
        this.dialog.title = "编辑" + title
			},
			updatePwd(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.ruleForm.pwd == '' || md5.hex_md5(this.ruleForm.pwd) !== md5.hex_md5(this.ruleForm.pwd1)) {
						  msg.error("2次密码不一致")
							return
						}
						this.$store.dispatch('post', {
							uri: 'workerAccount/updateWkPwd',
							data: {
								workId: this.mercCity.workId,
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
			updateWk(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$store.dispatch('post', {
							uri : 'workerInfo/update',
							data: {
								id: this.mercCity.workId,
								name: this.ruleForm.wkName,
								phone: this.ruleForm.wkPhone
							}
						}).then((res) =>{
							this.dialog.visible = false
							msg.success();
							this.info()
						})
					}
        })
			},
			updateMercCity(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$store.dispatch('post', {
							uri : 'mercCity/update',
							data: this.ruleForm
						}).then((res) =>{
							this.dialog.visible = false
							msg.success();
							this.info()
						})
					}
        })
			},
      updatePayType(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('post', {
              uri : 'mercCityParam/updatePayType',
              data: this.ruleForm
            }).then((res) =>{
              this.dialog.visible = false
              msg.success();
              this.info()
            })
          }
        })
      },
			validatePass (rule, value, callback) {
				 if (value === '') {
					 callback(new Error('请输入密码'));
				 } else {
					 if(this.ruleForm.pwd.length < 6 || this.ruleForm.pwd.length > 16){
						 callback(new Error('请输入6至16位长度密码'));
					 }else{
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
			checkTel (rule, value, callback) {
				if (!validate.tel(value, rule.ignoreEmpty)) {
					callback(new Error());
				} else {
					callback();
				}
			 },
			deleteCity(){
				var _this = this
        msg.confirm({
          msg: '此操作将永久删除该城市, 是否继续?', confirmFn: function () {
						_this.$store.dispatch('post', {
              uri: 'mercCity/delete',
              data: {
                id: _this.mercCity.id
              }
            }).then((res) => {
              msg.success();
							_this.$router.push({ path: '/mcity/list' })
            })
          }
        })
			}
		}
  }
</script>
