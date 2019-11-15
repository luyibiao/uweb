<template>
	<div>
		<div v-loading="loading" class="ukao-v-loading">
			<el-breadcrumb class="link-back" separator="/">
				<el-breadcrumb-item to="/weixin/time/period"><i class="el-icon-arrow-left icon-smaller"></i>服务时间段</el-breadcrumb-item>
				<el-breadcrumb-item>取件时间</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="m-t-lg text-muted">开启的时间段将在客户下单界面被选择</div>
			<p class="p-l18 m-t-lg">
				时间段  <el-button size="small" type="primary" style="margin-left: 15px" @click="add">添加</el-button>
			</p>
			<div class="ukao-tb-default m-t">
				<el-row v-for="item in timeList" class="b-b" :key="item.id">
					<el-col :span="13">
						<div>	{{item.timeStart}} - {{item.timeEnd}}</div>
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
		</div>

		<el-dialog class="ukao-dialog"
			title="服务时间"
			:visible.sync="dialog.visible"
			size="small">
			<div>
				<el-form :model="ruleForm"  ref="ruleForm" label-width="150px">
					<el-form-item label="起始时间" prop="timeStart"   :rules="[
							 { required: true, message: '请选择起始时间'},
						]">
						<el-time-select
						    placeholder="起始时间"
								:editable=false
						    v-model="ruleForm.timeStart"
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
						    v-model="ruleForm.timeEnd"
						    :picker-options="{
									start: '06:00',
									step: '00:30',
									end: '23:30',
						      minTime: ruleForm.timeStart
						    }">
						  </el-time-select>
					</el-form-item>

					<el-form-item>
						<el-button @click="dialog.visible=false">取消</el-button>
						<el-button type="primary"  @click="submitForm('ruleForm')">保存</el-button>
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
			loading: true,
			timeList: [],
			dialog:{
				visible: false,
			},
			ruleForm:{
			  id:'',
				timeStart:'',
				timeEnd:''
			}
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
					type: 1
				}
			}).then((res) =>{
				let list = res.data.data.list || []
				list.forEach(function (item) {
					item.statusVal = item.status ? true : false
        })
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
			this.ruleForm.id = ''
			this.ruleForm.timeStart = ''
			this.ruleForm.timeEnd = ''
			this.dialog.visible = true
		},
		update(item){
			this.ruleForm.id = item.id
			this.ruleForm.timeStart = item.timeStart
			this.ruleForm.timeEnd = item.timeEnd
			this.dialog.visible = true
		},
		submitForm (formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
				  var uri = this.ruleForm.id ? 'serviceTime/take/update' : 'serviceTime/take/add'
					this.$store.dispatch('post', {
						uri: uri,
						data: this.ruleForm
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
	}
}
</script>

<style scoped>
	.time-list li {
		float: left;
		margin-top: 10px;
		margin-right: 15px;
	}
	.time-list .time-item {
		background: #dcdcdc;
		padding: 10px 15px;
		color: #fff;
		border-radius: 4px;
	}
	.time-list .time-item.is-active {
		background-color: #36c924;
	}
	.p-l18 {
		padding-left: 18px;
	}
</style>
