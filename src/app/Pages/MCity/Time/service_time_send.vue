<template>
	<div v-loading="loading">
		<el-breadcrumb class="link-back" separator="/">
		  <el-breadcrumb-item :to="'/mcity/time/'+cityInfo.id+'/period'"><i class="el-icon-arrow-left icon-smaller"></i>服务时间段</el-breadcrumb-item>
		  <el-breadcrumb-item>取件时间</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="m-t-lg text-muted">开启的时间段将用于系统自动安排送件时间</div>
		<p class="p-l18 m-t-lg">时间段</p>
		<div class="ukao-tb-default m-t-sm">
			<el-row v-for="item in timeList" class="b-b b-t" :key="item.id">
			  <el-col :span="16">
				  <div>
						{{item.timeStart}} - {{item.timeEnd}}
					</div>
			  </el-col>
			  <el-col :span="8">
				  <div>
				  	<el-switch
						  v-model="item.statusVal"
						  active-color="#13ce66"
						  inactive-color="#dcdcdc"
						  on-text="已启用"
						  off-text="未启用" 
						  :width="74" @change="updateStatus(item)">
						</el-switch>
				  </div>
			  </el-col>
			</el-row>
		</div>

		<p class="m-t-lg p-l18">设置临界点时间</p>
		<div class="ukao-tb-default m-t-sm">
			<el-row class="b-b b-t">
			  <el-col :span="2">
				  <div>时间</div>
			  </el-col>
			  <el-col :span="4">
				  <div v-if="cityInfo.closestTime">{{cityInfo.closestTime}}</div>
					<div v-if="!cityInfo.closestTime"><div class="text-muted">未设置</div></div>
			  </el-col>
			  <el-col :span="10">
				  <div class="text-muted">待送件的衣物在该时间点之前，系统自动安排在当天内送件</div>
				  <div class="text-muted">待送件的衣物在该时间点之后，系统自动安排在第二天送件</div>
			  </el-col>
				<el-col :span="4">
					<div>
						<el-switch
							v-model="cityInfo.isClosestVal"
							active-color="#13ce66"
							inactive-color="#dcdcdc"
							on-text="已启用"
							off-text="未启用"
							:width="74" @change="updateClosest">
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
				id: this.$route.params.cityId,
				closestTime: '',
				isClosestVal : false
			},
			ruleForm: {
			  id: '',
				closestTime: '',
				isClosest: 0
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
					cityId: this.cityInfo.id,
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
					closestTime: cityInfo.closestTime,
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

