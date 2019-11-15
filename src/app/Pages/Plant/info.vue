<template>
	<div>
    <navs class="m-b-md" :name="factoryInfo.name" menu="info"></navs>
		<div class="m-t-lg ukao-v-loading" v-loading="loading">
			<p class="ukao-tb-title text-black">工厂详情</p>
			<div class="ukao-tb-default">
				<table class="ukao-table b-t" style="width: 100%">
					<tbody>
						<tr>
							<td style="width: 30%">工厂名称</td>
							<td>{{factoryInfo.name}}</td>
							<td style="width: 20%">
								<auth perm="plant.update">
									<el-button @click="update('name', '工厂名称', 1)">修改</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>编号</td>
							<td>{{factoryInfo.code}}</td>
							<td></td>
						</tr>
						<tr>
							<td>创建时间</td>
							<td>{{factoryInfo.createTimeText}}</td>
							<td></td>
						</tr>
						<tr>
							<td>地址</td>
							<td>{{factoryInfo.regionalDesc}} {{factoryInfo.addrDesc}}</td>
							<td>
								<!--<el-button>修改</el-button>-->
							</td>
						</tr>
						<tr>
							<td>坐标（经度/纬度）</td>
							<td>
								{{factoryInfo.longitude || '-'}}, {{factoryInfo.latitude || '-'}}
								<a class="text-primary m-l" href="https://lbs.qq.com/tool/getpoint/" target="_blank">
								<i class="iconfont el-icon-location-outline"></i>拾取坐标</a></td>
							<td>
								<!--<el-button>修改</el-button>-->
							</td>
						</tr>
						<tr>
							<td>状态</td>
							<td>{{factoryInfo.statusText}}</td>
							<td>
								<auth perm="plant.update">
									<el-switch
										v-model="factoryInfo.statusVal"
										active-color="#13ce66"
										inactive-color="#dcdcdc"
										:width="74"
										on-text="已启用"
										off-text="未启用" @change="updateStatus">
									</el-switch>
								</auth>
							</td>
						</tr>
						<tr>
							<td>出厂小票类型</td>
							<td>{{factoryInfo.outPrintType | getValText('OUT_PRINT_TYPE')}}</td>
							<td style="width: 20%">
								<auth perm="plant.update">
									<el-button @click="update('outPrintType', '出厂小票类型', 1)">修改</el-button>
								</auth>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div class="m-t-xl">
			<p class="ukao-tb-title text-black">管理信息</p>
			<div class="ukao-tb-default">
				<table class="ukao-table b-t" style="width: 100%">
					<tbody>
						<tr>
							<td style="width: 30%">厂长登录账号</td>
							<td>{{manager.account}}</td>
							<td style="width:20%"></td>
						</tr>
						<tr>
							<td style="width: 30%">厂长登录密码</td>
							<td>******</td>
							<td style="width:20%">
								<auth perm="plant.update">
									<el-button @click="update('pwd', '厂长登录密码', 2)">修改</el-button>
								</auth>
							</td>
						</tr>
						<tr>
							<td>状态</td>
							<td>
								<div v-if="manager.statusVal" class="text-success">{{manager.statusText}}</div>
								<div v-else class="text-muted">{{manager.statusText}}</div>
							</td>
							<td>
								<auth perm="plant.update">
									<el-switch
										v-model="manager.statusVal"
										active-color="#13ce66"
										inactive-color="#dcdcdc"
										on-text="已启用"
										off-text="未启用"
										:width="74" @change="updateManagerStauts">
									</el-switch>
								</auth>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div class="m-t-xl">
			<p class="ukao-tb-title text-black">
				<span v-if="!cashier.exis">工位机信息</span>
				<span v-if="cashier.exis">已绑定工位机（{{cashier.cnt}}台）</span>
				<a class="m-l-xl text-primary" href="javascript:void(0)" >
					<auth perm="plant.update">
						<router-link to="" @click.native="bindingCashier">绑定工位机</router-link>
					</auth>
				</a>
			</p>
			<div class="ukao-tb-default">
				<table class="ukao-table b-t" style="width: 100%">
					<tbody>
						<tr v-if="!cashier.exis"><td style="text-align: center">还未绑定工位机</td></tr>
						<tr v-for="item in cashier.list">

							<td style="width: 30%">序列号/激活码</td>
							<td>{{item.serialNum}}/{{item.actCode}}</td>
							<td>
								<div v-if="item.monitor" class="machine-icon-size">
									<img v-if="item.monitor == 'T2lite' || item.monitor =='D1'" src="/static/img/machine/T2little.png" />
									<img v-else="" src="/static/img/machine/L1.png"/>
									{{ item.monitor}}<span>{{'(V'+item.bizVersion+')'}}</span>
								</div>
							</td>
							<td style="width:20%">
								<auth perm="plant.update">
									<el-button @click="unbind(item)">解绑</el-button>
								</auth>
							</td>
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
				  <el-form-item label="工厂名称" prop="name" v-if="dialog.attr ==='name'" :rules="[
				    { required: true, message: '名称不能为空'},
				    { min: 1, max: 25, message: '长度在1到25个长度', trigger: 'blur' }
				  ]">
				  	<div class="w-lg">
				  		<el-input v-model="ruleForm.name"></el-input>
				  	</div>
				  </el-form-item>

					<el-form-item label="出厂小票类型" v-if="dialog.attr ==='outPrintType'" prop="outPrintType" :rules="[
					  { required: true, message: '请选择' },
					]">
						<el-radio class="radio" v-model="ruleForm.outPrintType" label="1">热敏小票</el-radio>
						<el-radio class="radio" v-model="ruleForm.outPrintType" label="2">无纺布小票</el-radio>
					</el-form-item>

					<el-form-item label="厂长登录密码" v-if="dialog.attr ==='pwd'"   prop="pwd" :rules="[
							{ required: true, message: '厂长登录密码不能为空'},
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

				  <el-form-item>
				  	<el-button @click="dialog.visible=false">取消</el-button>
						<el-button type="primary"  @click="submitForm('ruleForm')" v-if="dialog.act === 1">保存</el-button>
						<el-button type="primary"  @click="updatePwd('ruleForm')" v-if="dialog.act === 2">保存</el-button>
				  </el-form-item>
				</el-form>
		  </div>
		</el-dialog>
		<!-- end-->

		<!-- 绑定工位机-->
		<el-dialog class="ukao-dialog"
			:visible.sync="binding.dialogVisible"
			size="small">
				<div class="text-center ukao-v-loading" v-loading="binding.loading">
					<div class="dis-inline w-xxl b-a bg-cash">
						<div class="m-t-md">
							<img class="cash-register-img v-top" src="/static/img/pad.png" alt="">
						</div>
						<div>
							<div class="text-center text-black m-t m-b">绑定工位机</div>
								<div class="padder-md">
									<el-form :model="ruleFormBinding"  ref="ruleFormBinding" label-width="65px">
									<el-form-item label="序列号" prop="serialNum"  :rules="[
												{ required: true, message: '序列号不能为空'},
												{ min: 6, max: 12, message: '无效的序列号', trigger: 'blur' }]">
											<el-input v-model="ruleFormBinding.serialNum" placeholder="请输入序列号"></el-input>
										</el-form-item>
										<el-form-item label="激活码" prop="actCode" :rules="[
												{ required: true, message: '激活码不能为空'},
												{ min: 6, max: 16, message: '无效的激活码', trigger: 'blur' }]">
											<el-input v-model="ruleFormBinding.actCode" placeholder="请输入激活码"></el-input>
										</el-form-item>
									<el-form-item class="text-left">
										<p class="text-muted text-xs">工位机绑定序列号，验证成功后，不支持修改</p>
										<el-button @click="binding.dialogVisible=false">关闭</el-button>
										<el-button type="primary" :loading="binding.btn.loading" @click="submitFormBinding('ruleFormBinding')">激活并绑定</el-button>
										<div class="text-right"><a class="text-primary" target="_blank" :href="portals_url">还没有，去购买</a></div>
									</el-form-item>
								</el-form>
							</div>
						</div>
					</div>
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

	import navs from "./commponents/navs";
	export default {
		data: function() {
			return {
				menu:'工厂详情',
				loading: true,
				dialog: {
				  title: '',
				  attr: '',
				  visible : false
				},
				portals_url: consts.PORTALS_URL,
				formTitle: '编辑',
				factoryInfo: {
				  id: this.$route.params.id
				},
				manager: {},
				cashier: {		//设备
					exis: false,
					cnt: 	0,	//数量
					list: []
				},
				ruleForm: {
					id: this.$route.params.id,
          outPrintType :'',
					name:'',
					pwd:'',
					pwd1:''
				},
				binding: {
					dialogVisible: false,
					loading: false,
					act:1,
					btn: {
						loading: false
					}
				},
				ruleFormBinding : {
				  storeId: '',
				  serialNum: '',
					actCode: ''
				}
			}
		},
		created () {
      this.info()
    },
		methods: {
			info (){
				this.$store.dispatch('post', {
					uri : 'factoryInfo/detail',
					data: {
						id: this.factoryInfo.id
					}
				}).then((res) =>{
					var data = res.data.data
					var cashierList = res.data.expList || []
					this.cashier = {
						exis : cashierList && cashierList.length > 0 ? true : false,
						cnt : cashierList ? cashierList.length : 0,
						list : cashierList
					 }
					if(data){
						this.factoryInfo = data;
						let sData = this.statusTrans(data.status)
						this.factoryInfo.statusVal = sData.val
						this.factoryInfo.statusText = sData.text
						this.factoryInfo.createTimeText = time.getDateTime(data.createTime)
						let manager = res.data.manager
						if(manager){
							this.manager = manager
							sData = this.statusTrans(manager.status)
							this.manager.statusVal = sData.val
							this.manager.statusText = sData.text
						}
						this.ruleForm = {
							id: data.id,
							name: data.name,
              outPrintType:this.factoryInfo.outPrintType + ''
						};
						this.loading = false
					}
				})
			},
			updateStatus (){
				 this.$store.dispatch('post', {
					 uri: this.factoryInfo.status ? 'factoryInfo/disable' : 'factoryInfo/enable',
					 data: {
						 id: this.factoryInfo.id
					 }
				 }).then((res) => {
						msg.success();
						this.info()
				 })
			},
			updateManagerStauts (){
				 this.$store.dispatch('post', {
					 uri: this.manager.status ? 'workerAccount/disable' : 'workerAccount/enable',
					 data: {
						 id: this.manager.id
					 }
				 }).then((res) => {
						msg.success();
						this.info()
				 })
			 },
			statusTrans (status){
				 return {
						val : status ? true : false,
						text : status ? '已启用' : '已停用'
				 }
			},
			update(attr, title, act){
				this.dialog.title = '修改' + title
				this.dialog.attr = attr
				this.dialog.act = act
				this.dialog.visible = true
			},
			updateWorkerAccount (title){
				this.ruleForm = {
					label: title,
					uri: 'workerAccount/update',
					id: this.manager.id
				}
				this.dialogVisible = true
			},
			bindingCashier(){
				this.binding.btn.loading = false
				this.binding.dialogVisible = true
			},
			submitFormBinding (formName) {		//激活并绑定
				this.ruleFormBinding.factoryId = this.factoryInfo.id
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.binding.btn.loading = true
						this.$store.dispatch('post', {
							uri: 'factoryMachineInfo/actBinding',
							data: this.ruleFormBinding,
							forceResolve: true
						}).then((res) => {
							if(!res || res.data.httpCode != 200) {
								msg.error(res.data.msg || consts.ERROR_MSG);
								this.binding.btn.loading = false
							}else {
								this.binding.dialogVisible = false
								msg.success('设备激活并绑定成功');
								//清除参数
								this.ruleFormBinding = {
									factoryIdId: '',
									serialNum: '',
									actCode: ''
								}
								this.info()
							}
						})
					} else {
						return false;
					}
				});
			},
			unbind (item){	//解绑
				let _this = this
				msg.confirm({
					msg: '此操解除工位机绑定该工厂, 是否继续?',
					confirmFn: function () {
						_this.$store.dispatch('post', {
							uri: 'factoryMachineInfo/unbind',
							data: {
								id: item.id
							}
						}).then((res) => {
							msg.success('设备解绑成功')
							_this.info()
						})
					}
				})
			},
			submitForm (formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$store.dispatch('post', {
							uri: 'factoryInfo/update',
							data: this.ruleForm
						}).then((res) => {
							this.dialog.visible = false
							msg.success();
							this.info()
						})
					} else {
						return false;
					}
				});
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
								workId: this.factoryInfo.workId,
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
			validatePass (rule, value, callback) {
				 if (value === '') {
					 callback(new Error('请输入密码'));
				 } else {
					 if (this.ruleForm.pwd !== '') {
					   if(this.ruleForm.pwd.length < 6 || this.ruleForm.pwd.length > 16){
							 callback(new Error('请输入6至16位长度密码'));
						 }else{
							 this.$refs.ruleForm.validateField('pwd1');
						 }
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
			}
		},
		components: {
			navs
		}
	}
</script>
</script>

<style scoped>
	.cash-register-img {
		width: 200px;
		height: auto;
	}
	.bg-cash {
		background: #f7f7f7;
	}
	.machine-icon-size > img{
		width: 20px;
	}
</style>