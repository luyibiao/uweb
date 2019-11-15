<template>
	<div v-loading="loading">
		<el-breadcrumb class="link-back" separator="/">
		  <el-breadcrumb-item to="/weixin/time/period"><i class="el-icon-arrow-left icon-smaller"></i>服务时间段</el-breadcrumb-item>
		  <el-breadcrumb-item>送件时间</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="m-t-lg text-muted">开启的时间段将用于系统自动安排送件时间</div>
		<p class="p-l18 m-t-lg">
			时间段  <el-button size="small" type="primary" style="margin-left: 15px" @click="add">添加</el-button>
		</p>
		<div class="ukao-tb-default m-t">
			<el-row v-for="item in timeList" class="b-b" :key="item.id">
			  <el-col :span="13">
				  <div>{{item.timeStart}} - {{item.timeEnd}}</div>
			  </el-col>
			  <el-col :span="5">
				  <div>
				  	<el-switch
							v-model="item.statusVal"
						  active-color="#13ce66"
						  inactive-color="#dcdcdc"
							active-text="已启用"
							inactive-text="未启用"
						  @change="updateStatus(item)">
						</el-switch>
				  </div>
			  </el-col>
				<el-col :span="6">
					<el-button size="small" @click="update(item)">修改</el-button>
					<el-button  size="small" @click="deleteConfirm(item)">删除</el-button>
				</el-col>
			</el-row>
		</div>

		<p class="m-t-lg p-l18">设置信息</p>
		<div class="ukao-tb-default m-t-sm">
			<el-row class="b-b b-t">
			  <el-col :span="2">
				  <div>时间</div>
			  </el-col>
			  <el-col :span="3">
					<div v-if="cityInfo.closestTime">{{cityInfo.closestTime}}</div>
					<div v-if="!cityInfo.closestTime"><div class="text-muted">未设置</div></div>
			  </el-col>
			  <el-col :span="10">
					<div class="text-muted">待送件的衣物在该时间点之前，系统自动安排在当天内送件</div>
			  	<div class="text-muted">待送件的衣物在该时间点之后，系统自动安排在第二天送件</div>
			  </el-col>
				<el-col :span="5">
					<div>
						<el-switch
							v-model="cityInfo.isClosestVal"
							active-color="#13ce66"
							inactive-color="#dcdcdc"
							active-text="已启用"
							inactive-text="未启用"
							@change="updateClosest">
						</el-switch>
					</div>
				</el-col>
			  <el-col :span="4">
				  <div>
						<el-button @click="setClosestTime">设置时间</el-button>
				  </div>
			  </el-col>
			</el-row>
		</div>

		<el-dialog class="ukao-dialog"
				title="服务时间"
				:visible.sync="dialog.visible"
				size="small">
				<div>
					<el-form :model="ruleFormSave"  ref="ruleFormSave" label-width="150px">
						<el-form-item label="起始时间" prop="timeStart"   :rules="[
								 { required: true, message: '请选择起始时间'},
							]">
							<el-time-select
									placeholder="起始时间"
									:editable=false
									v-model="ruleFormSave.timeStart"
									:picker-options="{
										start: '06:00',
										step: '00:30',
										end: '23:30'
									}">
								</el-time-select>
						</el-form-item>

						<el-form-item label="结束时间" prop="timeEnd"   :rules="[
								 { required: true, message: '请选择结束时间'},
							]">
							<el-time-select
								placeholder="结束时间"
								:editable=false
								v-model="ruleFormSave.timeEnd"
								:picker-options="{
									start: '06:00',
									step: '00:30',
									end: '23:30',
									minTime: ruleFormSave.timeStart
								}">
							</el-time-select>

						</el-form-item>

						<el-form-item>
							<el-button @click="dialog.visible=false">取消</el-button>
							<el-button type="primary"  @click="submitFormSave('ruleFormSave')">保存</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-dialog>

		<el-dialog class="ukao-dialog"
			title="设置临界点时间"
		  :visible.sync="dialogVisible"
		  size="small">
		  <div>
		  	<el-form :model="ruleForm" ref="ruleForm" label-width="160px">
					<el-form-item prop="closestTime" label="时间" :rules="[
					   { required: true, message: '请选择时间'},
					]">
						<el-time-select
				    placeholder="请选择时间"
				    v-model="ruleForm.closestTime"
				    :picker-options="{
				      start: '13:00',
				      step: '00:15',
				      end: '20:30'
				    }">
				  </el-time-select>
					</el-form-item>
				  <el-form-item>
				    <el-button @click="dialogVisible=false">取消</el-button>
				    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
				  </el-form-item>
				</el-form>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import msg from '@/utils/msg'

export default {
  data: function() {
		return {
			dialogVisible: false,
			loading: true,
			timeList: [],
			cityInfo: {
				closestTime: '',
				isClosestVal : false
			},
			dialog:{
				visible: false,
			},
			ruleForm: {
				closestTime: '',
				isClosest: 0,
			},
			ruleFormSave: {
			  id: '',
				timeStart:'',
				timeEnd:''
			},
		}
	},
	created () {
	  this.list()
   },
	methods: {
		list (){
			this.loading = true
			this.$store.dispatch('post', {
				uri : 'serviceTime/list',
				data: {
					type: 2
				}
			}).then((res) =>{
				let list = res.data.data.list || []
				list.forEach(function (item) {
					item.statusVal = item.status ? true : false
        })
				let cityInfo = res.data.cityInfo
				this.cityInfo = cityInfo
				this.cityInfo.isClosestVal = cityInfo.isClosest ? true : false
				this.ruleForm = {
				  id: cityInfo.id,
					closestTime: cityInfo.closestTime || '',
					isClosest: cityInfo.isClosest || 0,
				}
				this.timeList = list
				this.loading = false
			})
		},
		updateStatus (item){
			this.$store.dispatch('post', {
				uri : item.statusVal ? 'serviceTime/enable' : 'serviceTime/disable',
				data: {
					id: item.id
				}
			}).then((res) =>{
				msg.success()
				this.list()
			})
		},
		setClosestTime (){
		  this.dialogVisible = true
		},
		updateClosest (val){
			this.ruleForm.isClosest = val ? 1 : 0
			this.$store.dispatch('post', {
				uri: 'mercCity/updateClosestTime',
				data: this.ruleForm
			}).then((res) => {
				msg.success()
				this.list()
			})
		},
		deleteConfirm (item){
			let _this = this
			msg.confirm({msg:'确定删除选择的服务时间?', confirmFn:function(){
				_this.$store.dispatch('post', {
					uri : 'serviceTime/delete',
					data: {
						id: item.id
					}
				}).then((res) =>{
					msg.success();
					_this.list();
				})
			}})
		},
		add(){
			this.ruleFormSave.id = ''
			this.ruleFormSave.timeStart = ''
			this.ruleFormSave.timeEnd = ''
			this.dialog.visible = true
		},
		update(item){
			this.ruleFormSave.id = item.id
			this.ruleFormSave.timeStart = item.timeStart
			this.ruleFormSave.timeEnd = item.timeEnd
			this.dialog.visible = true
		},
		submitFormSave (formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					var uri = this.ruleFormSave.id ? 'serviceTime/send/update' : 'serviceTime/send/add'
					this.$store.dispatch('post', {
						uri: uri,
						data: this.ruleFormSave
					}).then((res) => {
						this.dialog.visible = false
						msg.success();
						this.list()
					})
				} else {
					return false;
				}
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$store.dispatch('add', {
						uri: 'mercCity/updateClosestTime',
						data: this.ruleForm
					}).then((res) => {
						this.dialogVisible = false
						msg.success();
						this.cityInfo.closestTime = this.ruleForm.closestTime
						this.cityInfo.isClosestVal = this.ruleForm.isClosest ? true : false
					})
				} else {
					return false;
				}
			});
		}
	}
}
</script>

<style scoped>
	.p-l18 {
		padding-left: 18px;
	}
</style>

