<template>
	<div>
		<div v-loading="loading" class="ukao-tb-default ukao-v-loading">
			<table class="ukao-table b-t w-full">
				<tbody>
					<tr>
						<td>品牌名称</td>
						<td>{{mercInfo.name}} -
							<span class="text-success" v-if="mercInfo.param.isAuth === 1">已认证</span>
							<span class="text-muted" v-else-if="mercInfo.param.isAuth === 0">未认证</span>
							<span class="text-danger" v-else>认证失败</span>
						</td>
						<td>
							<auth perm="setting.account.basic.update">
								<router-link class="text-primary" to="/setting/account/merc_auth" v-if="isMercWork">
									<template v-if="mercInfo.param.isAuth == 1">
										查看认证资料
									</template>
									<template v-if="mercInfo.param.isAuth == -1">
										重新认证
									</template>
									<template v-if="mercInfo.param.isAuth == 0">
										去认证
									</template>
								</router-link>
							</auth>
						</td>
					</tr>
					<tr>
						<td>品牌ID</td>
						<td>{{mercInfo.param && mercInfo.param.symbol}}</td>
						<td></td>
					</tr>

					<tr>
						<td>品牌代码</td>
						<td>{{mercInfo.code}}</td>
						<td>
						</td>
					</tr>
					<tr>
						<td>品牌LOGO</td>
						<td>
							<div v-if="mercInfo.logoPath">
								<img class="thumb-md" :src="mercInfo.logoPath" alt="">
							</div>
							<div class="text-muted" v-else>还未设置LOGO</div>
						</td>
						<td>
							<auth perm="setting.account.basic.update">
								<el-button v-show="isMercWork" @click="update('logoPath', '品牌LOGO', 1)">修改</el-button>
							</auth>
						</td>
					</tr>
					<tr>
						<td>地址</td>
						<td>{{mercInfo.regionalDesc}} {{mercInfo.addrDesc}}</td>
						<td>
							<auth perm="setting.account.basic.update">
								<el-button v-show="isMercWork" @click="update('addr', '地址', 1)">修改</el-button>
							</auth>
						</td>
					</tr>
					<tr>
						<td>主体信息</td>
						<td>
							<div v-if="mercInfo.param && mercInfo.param.mainInfo">{{mercInfo.param.mainInfo}}</div>
							<div v-else class="text-muted">还未设置主体信息</div>
						</td>
						<td>
							<auth v-if="mercInfo.param.isAuth != 1" perm="setting.account.basic.update">
								<el-button v-show="isMercWork" @click="update('mainInfo', '主体信息', 1)">修改</el-button>
							</auth>
						</td>
					</tr>
					<tr>
						<td>总部客服电话</td>
						<td>{{mercInfo.tel}}</td>
						<td>
							<auth perm="setting.account.basic.update">
								<el-button v-show="isMercWork" @click="update('tel', '总部客服电话', 1)">修改</el-button>
							</auth>
						</td>
					</tr>
					<tr v-if="isCityWork">
						<td>城市客服电话</td>
						<td>{{mercCity.tel}}</td>
						<td>
							<auth perm="setting.account.basic.update">
								<el-button v-show="isCityWork" @click="update('cityTel', '城市客服电话', 2)">修改</el-button>
							</auth>
						</td>
					</tr>
					<tr>
						<td>联系人姓名</td>
						<td>{{mercInfo.param && mercInfo.param.legalPerson}}</td>
						<td>
							<!--<el-button v-show="isMercWork">修改</el-button>-->
						</td>
					</tr>
					<tr>
						<td>联系人手机号</td>
						<td>{{mercInfo.param && mercInfo.param.legalPersonPhone}}</td>
						<td>
							<!--<el-button v-show="isMercWork">修改</el-button>-->
						</td>
					</tr>
					<tr>
						<td>邮箱地址</td>
						<td>{{mercInfo.param && mercInfo.param.email}}</td>
						<td>
							<auth perm="setting.account.basic.update">
								<el-button v-show="isMercWork" @click="update('email', '邮箱地址', 1)">修改</el-button>
							</auth>
						</td>
					</tr>
					<tr>
						<td>创建时间</td>
						<td>{{mercInfo.createTime}}</td>
						<td></td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- 修改基本信息 -->
		<el-dialog class=""
			:title="dialog.title"
			:visible.sync="dialog.visible"
			size="small">
			<div>
				<el-form :model="ruleForm"  ref="ruleForm" label-width="150px">
					<el-form-item label="地址" v-if="dialog.attr == 'addr'" prop="selectedOptions" :rules="[
							{ required: true, message: '所在省市区不能为空'}
						]">
						<div class="dis-inline w-xl">
							<el-cascader
							v-model="ruleForm.selectedOptions"
							placeholder="请选择/搜索"
								:options="options"
							filterable
							:clearable="true"
							@change="selected"
							></el-cascader>
						</div>
					</el-form-item>
					<el-form-item label="详细地址" v-if="dialog.attr == 'addr'" prop="addrDesc" :rules="[
							{ min: 0, max: 255, message: '长度在0到255个长度', trigger: 'blur' }
					]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.addrDesc" placeholder="请输入详细地址"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="总部客服电话" v-if="dialog.attr == 'tel'" prop="tel" :rules="[
							{min: 6, max: 20,  message: '请输入有效的客服电话' }
					]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.tel" placeholder="请输入有效的客服电话"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="城市客服电话" v-if="dialog.attr == 'cityTel'" prop="cityTel" :rules="[
							{min: 6, max: 20,  message: '请输入有效的客服电话' }
					]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.cityTel" placeholder="请输入有效的客服电话"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="主体信息" v-if="dialog.attr == 'mainInfo'" prop="tel" :rules="[
							{min: 2, max: 50,  message: '内容2到50位长度' }
					]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.mainInfo" placeholder="请输入主体信息"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="邮箱地址" v-if="dialog.attr == 'email'" prop="email" :rules="[
							{min: 3, max: 50,  message: '请输入有效的邮箱地址' }
					]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.email" placeholder="请输入有效的邮箱地址"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="" v-if="dialog.attr == 'logoPath'">
						<Uploader
							:path="mercInfo.logoPath"
							class="u-avatar-uploader"
							tip="尺寸为200像素*200像素，大小不超过2M"
							size="2"
							:beforeFn="beforeAvatarUpload"
							:changeFn="handleAvatarChange"
							:successFn="handleAvatarSuccess"
							:saveSuccessFn="handleSaveSuccess"/>
					</el-form-item>

					<el-form-item>
						<el-button @click="dialog.visible=false">取消</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')" v-if="dialog.act === 1">保存</el-button>
						<el-button type="primary" @click="updateCity('ruleForm')" v-if="dialog.act === 2">保存</el-button>
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
	import regional from '@/utils/regional'
	import Uploader from '@/components/Uploader'
	import validate from '@/utils/helpers/validate'
	import auth from '@/utils/auth'
	import storageLite from '@/utils/helpers/storageLite'

  export default {
		components: {
			Uploader
		},
		data: function() {
      return {
				loading: true,
        mercInfo:{
					param:{}
				},
        mercCity:{},
				selectedOptions: [],	//默认选择省市区
        options: [],	//选择地区
				dialog:{
					title:'',
					visible: false,
					attr: '',
				},
				ruleForm:{
				  id:'',
					regionalId:'',
					regionaDesc:'',
					addrDesc:'',
					tel:'',
					cityTel:'',
					email:'',
					logoPath:'',
					mainInfo:'',
					selectedOptions:[]
				},
				isMercWork: false,
        isCityWork: false,
				authMercInfo:{}
			}
    },
		created () {
		 this.info();
	 	},
		mounted(){
		  this.getRegional();
		  this.authMercInfo = auth.getMercInfo();
		},
		methods: {
			info (){
				this.$store.dispatch('get', {
					uri : 'mercInfo/detail',
					data: {}
				}).then((res) =>{
					var data = res.data.data
					var param = res.data.param
					if(data) {
					  data.createTime = time.getDateTime(data.createTime)
					  this.mercInfo = data
					  this.mercInfo.param = param
          }
					this.loading = false
				});

        let authWorkInfo = auth.getWorkInfo();
        if (authWorkInfo.roleId == 1 || authWorkInfo.roleId == 7) {
          this.isMercWork = true;

          if (authWorkInfo.roleId == 7) {
            this.isCityWork = true;
            this.cityInfo();
					}
        } else {
          this.isCityWork = true;
          this.cityInfo();
				}

			},
			cityInfo() {
        this.$store.dispatch('post', {
          uri : 'mercCity/info'
        }).then((res) =>{
          var data = res.data.data
          this.mercCity = data
          setTimeout(() => {
            this.setRuleForm()
          }, 500);
        })
			},
      updateCity(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('post', {
              uri : 'mercCity/update',
              data: {tel: this.ruleForm.cityTel}
            }).then((res) =>{
              this.dialog.visible = false
              msg.success();
              this.info()
            })
          }
        })
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
					this.ruleForm.regionaDesc = province[0].label + city[0].label + area[0].label
				}
			},
			setRuleForm(){
			  this.ruleForm.id = this.mercInfo.id
			  this.ruleForm.regionalId = this.mercInfo.regionalId
			  this.ruleForm.regionaDesc = this.mercInfo.regionaDesc
			  this.ruleForm.addrDesc = this.mercInfo.addrDesc
			  this.ruleForm.tel = this.mercInfo.tel
				this.ruleForm.cityTel = this.mercCity.tel
			  this.ruleForm.email = this.mercInfo.param.email
			  this.ruleForm.logoPath = this.mercInfo.logoPath
			  this.ruleForm.mainInfo = this.mercInfo.param.mainInfo
				if(this.mercInfo.regionalId) {
					this.ruleForm.selectedOptions.length = 0
          this.ruleForm.selectedOptions.push(Number(this.mercInfo.regionalId.toString().substr(0, 2)))
          this.ruleForm.selectedOptions.push(Number(this.mercInfo.regionalId.toString().substr(0,4)))
          this.ruleForm.selectedOptions.push(410103)
        }
			},
			update(attr, title, act){
			  this.dialog.attr = attr
			  this.dialog.title = "编辑" + title
				this.dialog.act = act
				this.setRuleForm()
				this.dialog.visible = true
			},
			setStorageMercInfo(){
				//更新缓存
				if(this.ruleForm.logoPath) {
					this.authMercInfo.logoPath = this.ruleForm.logoPath
					storageLite.set("mercInfo", this.authMercInfo)
				}
				if(this.ruleForm.mainInfo) {
					this.authMercInfo.mainInfo = this.ruleForm.mainInfo
					storageLite.set("mercInfo", this.authMercInfo)
				}
			},
			submitForm (formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$store.dispatch('post', {
							uri: 'mercInfo/update',
							data: this.ruleForm
						}).then((res) => {
						  this.dialog.visible=false
							this.setStorageMercInfo()
							msg.success();
							this.info()
						})
					}else{
						return false
					}
				})
			},
			//图片上传模块
			 handleAvatarChange(file){
			 },
			 handleAvatarSuccess(fileNames) {
				 var _this = this
				 if (fileNames && fileNames[0]) {
					 _this.ruleForm.logoPath = fileNames[0]
				 }
			 },
			 handleSaveSuccess(att){
		//			  console.log(att)
			 },
			 beforeAvatarUpload(file) {
				 const isImg = validate.image(file.type)
				 if (!isImg) {
					 msg.error('上传文件不是图片！');
				 }
				 const isLt2M = file.size / 1024 / 1024 < 2;
				 if (!isLt2M) {
					 msg.error('上传图片大小不能超过 2MB!');
				 }
				 return isImg && isLt2M;
			 },
		}
  }
</script>
