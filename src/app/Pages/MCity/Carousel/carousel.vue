<template>
	<div class="clearfix">
		<div class="sidebar pull-left">
			<v-project-model v-bind:cityId="cityInfo.id"></v-project-model>
		</div>
		<div class="main" v-loading="carouselLoading">
			<div class="m-l-lg" >
				<p class="text-center m-b">轮播图</p>
				<table class="ukao-table b-t" style="width: 100%">
			  	<tbody>
			  		<tr>
			  			<td>微信首页轮播图</td>
			  			<td>
			  				<el-switch
								  v-model="isClientAdveVal"
								  active-color="#13ce66"
								  inactive-color="#dcdcdc"
									active-text="已启用"
									inactive-text="未启用"
								  :width="74" @change="updateClientAdveStatus">
								</el-switch>
			  			</td>
			  			<td></td>
			  			<td><el-button type="primary" @click="addClientAdve">添加轮播图片</el-button></td>
			  		</tr>
			  		<tr v-show="!isClientAdveVal">
			  			<td class="enabled" colspan="4">
			  				<div class="enabled-tip text-center text-white wrapper">
			  					<p class="title m-b-sm">未启用</p>
			  					<p>若要启用该功能，请在上方点击“启用按钮”启用</p>
			  				</div>
			  			</td>
			  		</tr>
			  		<tr>
			  			<td>图片</td>
			  			<td>链接</td>
			  			<td>显示顺序</td>
			  			<td>操作</td>
			  		</tr>
			  		<tr v-for="item in carouselItems" v-show="carouselItems.length > 0">
			  			<td><img class="thumb-xl" v-bind:src="item.imgPath" alt=""></td>
			  			<td>
								<div class="text-primary ukao-popover">查看链接<i class="el-icon-caret-bottom m-l-xs text-smaller icon-smaller"></i>
									<div class="ukao-popover-content text-muted">
										<span v-text="item.link"></span>
									</div>
								</div>
			  			</td>
			  			<td><span class="text-primary" v-text="item.sortNo"></span></td>
			  			<td>
			  				<el-button type="info" size="small" @click="updateClientAdve(item)">编辑</el-button>
			  				<el-button type="danger" size="small" @click="deleteClientAdve(item)">删除</el-button>
			  			</td>
			  		</tr>
			  		<tr v-show="carouselItems.length == 0">
			  			<td colspan="4" class="no-padder">
			  				<div class="carousel-no-data text-dark m-t">
			  					<p class="m-b-lg text-lg">暂无数据</p>
			  					<p>添加轮播图片，显示在微信首页的顶部。</p>
			  				</div>
			  			</td>
			  		</tr>
			  	</tbody>
			  </table>
			</div>
		</div>

		<!--添加 -->
		<el-dialog class="ukao-dialog"
			title="广告图片"
			:visible.sync="dialogVisible"
			size="small">
			<div>
				<el-form :model="ruleForm" ref="ruleForm" label-width="160px">
					<el-form-item label="链接" prop="link" :rules="[
						{ min: 4, max: 255, message: '链接长度4至255'}
					]">
				  <div class="w-lg">
				  	<el-input type="textarea" placeholder="http//" v-model="ruleForm.link" auto-complete="off"></el-input>
				  </div>
			  </el-form-item>
					<el-form-item label="序号" prop="sortNo" :rules="[
						{ type:'number', required: false, message: '序号必须为整数'}
					]">
				  <div class="w-lg">
				  	<el-input v-model="ruleForm.sortNo" auto-complete="off"></el-input>
				  </div>
			  </el-form-item>
				<el-form-item label="广告图片">
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
						<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import auth from '@/utils/auth'
	import msg from '@/utils/msg'
	import vProjectModel from '../Project/project_model.vue'

	export default {
		components: {
			vProjectModel
		},
		data: function() {
			return {
				dialogVisible: false,
				isClientAdveVal: true,	//开关
				cityInfo: {
					id: this.$route.params.cityId,
					name: '',
					isClientAdve: 1
				},
				mercInfo: {
					name: ''
				},
				loading: false,
				carouselLoading: false,
				carouselItems: [],
				ruleForm: {
				  id: '',
					scene: 1,
				  imgPath: '',
					link: '',
					sortNo: '',
					remark: ''
				}
			}
		},
		created () {
			this.mercInfo = auth.getMercInfo()
			var _this = this
			_this.queryRepeatCity(function (cnt) {
				_this.list()
      })
	  },
		methods: {
			queryRepeatCity(fn) {
				this.$store.dispatch('post', {
					uri : 'mercBusiness/queryRepeatCity',
					data: {
						cityId: this.cityInfo.id
					}
				}).then((res) =>{
					let cnt = res.data.data ? res.data.data : 0
					this.cityInfo = res.data.city
					this.isClientAdveVal = this.cityInfo.isClientAdve ? true : false
				  if(typeof (fn) === 'function'){
						fn(cnt)
					}
        })
			},
		  list (){
				this.$store.dispatch('post', {
					uri : 'clientAdve/list',
					data: {
						cityId: this.cityInfo.id,
					}
				}).then((res) =>{
					let list = res.data.data.list || []
					this.carouselItems = list
					this.carouselLoading = false
				})
			},
			updateProjectModel(status){
			  //设置页面左侧移动端模型页面刷新
				//状态改变，页面自动刷新
				this.$emit("projectModelStatus", status || true)
			},
			addClientAdve (){
				this.ruleForm = {
				  id: '',
					scene: 1,
				  imgPath: '',
					link: '',
					sortNo: '',
					remark: ''
				}
			  this.dialogVisible = true
			},
			updateClientAdve (item){
				console.log(item)
				this.ruleForm = {
					id: item.id,
					scene: item.scene,
					imgPath: item.imgPath,
					link: item.link,
					sortNo: item.sortNo,
					remark: item.remark
				}
				this.dialogVisible = true
			},
			deleteClientAdve(item){
			  var _this = this
			  msg.confirm({
					msg: '此操作将永久删除选中项, 是否继续?',
					confirmFn: function () {
						_this.$store.dispatch('post', {
							uri: 'clientAdve/delete',
							data: {
							  id: item.id
							}
						}).then((res) => {
						  msg.success()
							_this.list()
							_this.updateProjectModel()
						})
          }
				})
			},
			updateClientAdveStatus (){		//修改轮播图总开关
				this.$store.dispatch('post', {
					uri: 'mercCity/updateClientAdve',
					data: {
					  id: this.cityInfo.id,
						isClientAdve: this.isClientAdveVal ? 1 : 0
					}
				}).then((res) => {
				  msg.success()
					this.updateProjectModel()
				})
			},
			submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('post', {
              uri: this.ruleForm.id ? 'clientAdve/update' : 'clientAdve/add',
							data: this.ruleForm
            }).then((res) => {
              this.dialogVisible = false
              msg.success();
							this.list()
							this.updateProjectModel()
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
	.sidebar {
		width: 400px;
	}
	.wap-bg {
		width: 350px;
		height: 625px;
		position: relative;
		background: url('/static/img/weixin/wap_bg.png') no-repeat center center;
		background-size: 350px 625px;
	}
	.main {
		margin-left: 440px;
	}
	.wap-bg .wap-content {
		position: absolute;
		top: 18px;
		left: 0;
		right: 0;
	}
	.head .top-text {
		line-height: 42px;
		text-align: center;
		font-size: 16px;
		color: rgba(255,255,255,.8);
	}
	.head .main-text {
		line-height: 36px;
		position: relative;
	}
	.head .main-text .text-smaller {
		font-size: 12px;
	}
	.main-text .title {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.project-item-container {
		height: 292px;
		overflow: hidden;
	}
	.el-carousel__item .carousel-img {
		display: block;
    width: 100%;
    height: auto;
    margin: 0;
  }
	.project-container {
		position: relative;
	}
  .project-container .project-img {
  	width: 100%;
  	height: auto;
  }
  .project-container .content {
  	position: absolute;
  	bottom: 5px;
  	left: 0;
  	right: 0;
  	text-align: center;
  }
  .foot .sc {
  	display: inline-block;
  	background-color: #36c924;
  	padding: 5px 20px;
  	border-radius: 20px;
  	color: #fff;
  	font-size: 14px;
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

	.ukao-popover {
		position: relative;
		display: inline-block;
		padding: 10px 0;
	}
	.ukao-popover:hover .ukao-popover-content {
		display: block;
	}
	.ukao-popover-content {
		position: absolute;
		left: 0;
		top: 100%;
		background-color: #fff;
		border: 1px solid #dee5e7;
		border-radius: 2px;
		padding: 10px;
		box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
		display: none;
		z-index: 1;
		min-width: 200px;
		max-width: 300px;
		word-break:break-all;
	}
	.carousel-no-data {
		padding: 60px 20px;
		background-color: #f4f5f9;
		text-align: center;
	}
</style>