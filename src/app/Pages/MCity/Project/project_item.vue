<template>
	<div>
		<div>
			<p class="text-center project-item-top">
				<el-breadcrumb class="link-back" separator="/">
					<el-breadcrumb-item :to="'/mcity/project/'+item.cityId"><i class="el-icon-arrow-left icon-smaller"></i>经营项目</el-breadcrumb-item>
					<el-breadcrumb-item>{{item.name}}</el-breadcrumb-item>
				</el-breadcrumb>
				<span v-text="item.name"></span>
			</p>
			<table class="ukao-table b-t" style="width: 100%">
				<tbody>
					<tr>
						<td>状态</td>
						<td>
							<el-switch  active-color="#13ce66" inactive-color="#dcdcdc" v-model="statusVal"
								on-text="已启用"  off-text="未启用" :width="74" @change="updateStatus">
							</el-switch>
						</td>
						<td></td>
						<td></td>
					</tr>
					<tr v-show="!statusVal">
						<td class="enabled" colspan="4">
							<div class="enabled-tip text-center text-white wrapper">
								<p class="title m-b-sm">未启用</p>
								<p>若要启用该功能，请在上方点击“启用按钮”启用</p>
							</div>
						</td>
					</tr>
					<tr>
						<td>显示序号</td>
						<td><span v-text="item.sortNo"></span></td>
						<td></td>
						<td><el-button plain type="info" size="small" @click="update('sortNo')">修改</el-button></td>
					</tr>
					<tr>
						<td>服务项目名称</td>
						<td><span v-text="item.name"></span></td>
						<td><el-checkbox v-model="showNameCheck" @change="showNameChecked">隐藏</el-checkbox></td>
						<td><el-button plain type="info" size="small" @click="update('name')">修改</el-button></td>
					</tr>
					<tr>
						<td>备注说明</td>
						<td><span v-text="item.subtitle"></span></td>
						<td><el-checkbox v-model="showSubtitleCheck" @change="showSubtitleChecked">隐藏</el-checkbox></td>
						<td><el-button plain type="info" size="small" @click="update('subtitle')">修改</el-button></td>
					</tr>
					<tr>
						<td>图标</td>
						<td><img class="thumb-md" v-bind:src="item.imgPath" alt=""></td>
						<td></td>
						<td><el-button plain type="info" size="small" @click="update('imgPath')">修改</el-button></td>
					</tr>
					<tr>
						<td>服务产品</td>
						<td><span v-text="item.productCnt"></span> </td>
						<td></td>
						<td>
							<router-link :to="'/mcity/project/products/'+item.cityId + '/'+ item.id">
								<el-button plain type="info" size="small">查看</el-button>
							</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- 修改 -->
		<el-dialog class="ukao-dialog"
		  :title="formTitle"
		  :visible.sync="dialogVisible"
		  size="small">
		  <div>
				<el-form :model="ruleForm" ref="ruleForm" label-width="160px" class="demo-ruleForm">
				  <el-form-item label="服务项目名称" prop="name" v-if="attr == 'name'" :rules="[
				    { required: true, message: '名称不能为空'},
				    { min: 1, max: 5, message: '长度在1到5个长度', trigger: 'blur' }
				  ]">
	          <div class="dis-inline w-xl">
	            <el-input v-model="ruleForm.name" auto-complete="off"></el-input>
	          </div>
				  </el-form-item>
					<el-form-item label="序号" prop="sortNo" v-if="attr == 'sortNo'" :rules="[
				    { required: true, message: '序号不能为空'}
				  ]">
	          <div class="dis-inline w-xl">
	            <el-input  v-model.number="ruleForm.sortNo" auto-complete="off"></el-input>
	          </div>
				  </el-form-item>
					<el-form-item label="备注说明" prop="subtitle" v-if="attr == 'subtitle'" :rules="[
				    { min: 0, max: 12, message: '长度在0到12个长度' }
				  ]">
	          <div class="dis-inline w-xl">
	            <el-input v-model="ruleForm.subtitle" auto-complete="off"></el-input>
	          </div>
				  </el-form-item>
					<el-form-item label="图片" v-if="attr == 'imgPath'">
					<el-upload
					  class="u-avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false">
					  <img v-if="ruleForm.imgPath" :src="ruleForm.imgPath" class="u-avatar">
					  <i v-else class="el-icon-plus u-avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				  <el-form-item>
				  	<el-button @click="dialogVisible=false">取消</el-button>
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
		props: ['id'],
		data: function() {
			return {
				dialogVisible: false,
				formTitle: '编辑',
				attr: '',
				statusVal: true,
				showNameCheck: '',
				showSubtitleCheck: '',
				item: {
				  id: '',
					cityId: '',
				  name : '',
					sortNo: '',
					status: '',
					imgPath: '',
					subtitle: '',
					showName: '',
					showSubtitle: '',
				},
				ruleForm: {
				  id: '',
					name: '',
					sortNo: '',
					name: '',
					showName:'',
					subtitle: '',
					showSubtitle:'',
					imgPath:''
				}
			}
		},
		created () {
		  this.item.id = this.id
			this.info()
    },
		methods: {
			info (){
				this.$store.dispatch('post', {
					uri : 'mercBusiness/detail',
					data: {
						id: this.id || this.ruleForm.id
					}
				}).then((res) =>{
					let mercBusiness = res.data.data
					this.item = mercBusiness
					this.statusVal = mercBusiness.status ? true : false
					this.showNameCheck = mercBusiness.showName ? false : true
					this.showSubtitleCheck = mercBusiness.showSubtitle ? false : true
					this.ruleForm = {
						id: mercBusiness.id,
						cityId: mercBusiness.cityId,
						name : mercBusiness.name,
						sortNo: mercBusiness.sortNo,
						status: mercBusiness.status,
						imgPath: mercBusiness.imgPath,
						subtitle: mercBusiness.subtitle,
						showName: mercBusiness.showName,
						showSubtitle: mercBusiness.showSubtitle,
					}
				})
			},
			update (attr){
			  this.attr = attr
			  this.dialogVisible = true
			},
			updateProjectModel(status){
			  //设置页面左侧移动端模型页面刷新
				//状态改变，页面自动刷新
				this.$emit("projectModelStatus", status || true)
			},
			updateStatus (val){
				this.$store.dispatch('post', {
					uri : val ? 'mercBusiness/enable' : 'mercBusiness/disable',
					data: {
						id: this.item.id
					}
				}).then((res) =>{
					msg.success()
					this.updateProjectModel(val)
				})
			},
			showNameChecked (event){
			  var _this = this
				this.showNameCheck = event.target.checked
			  this.ruleForm.showName = event.target.checked ? 0 : 1
				this.updateSave()
			},
			showSubtitleChecked(event){
				var _this = this
				this.ruleForm.showSubtitle = event.target.checked ? 0 : 1
				this.updateSave()
			},
			updateSave (){
				this.$store.dispatch('post', {
					uri: 'mercBusiness/update',
					data: this.ruleForm
				}).then((res) => {
					this.dialogVisible = false
					msg.success()
					this.info()
					this.updateProjectModel(true)
				})
			},
			submitForm (formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
            this.updateSave()
          }else{
					  return false
					}
				})
			}
    }
	}
</script>

<style scoped>
	.link-back {
		height: 30px;
		line-height: 30px;
	}
	.project-item-top {
		position: relative;
		line-height: 30px;
		margin-bottom: 15px;
	}
	.project-item-top .link-back {
		position: absolute;
		top: 0;
		left: 0;
	}
	.ukao-table tbody tr td.enabled {
  	padding-left: 0;
  	padding-right: 0;
  }
  .enabled-tip {
  	background-color: #f17a3f;
  	border: 1px solid #c8000d;
  }
  .enabled-tip .title {
  	font-size: 18px;
  }
</style>