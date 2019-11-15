<template>
	<div>
	<div class="add-city">
		<div>
			<el-breadcrumb class="link-back" separator="/">
				<el-breadcrumb-item to="/mcity/list"><i class="el-icon-arrow-left icon-smaller"></i>城市列表</el-breadcrumb-item>
				<el-breadcrumb-item>添加城市</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="city-tree b-a">
			<el-row>
			  <el-col :span="8" class="outer-item b-r">
			  	<ul class="inner-list">
						<li class="inner-item" v-for="item in provinceItems" :key="item.value" v-bind:class="{ selected: item.selected }" v-on:click="chooseProvince(item)">
							<div class="clearfix b-a select-item">
								<span class="city" v-text="item.label"></span>
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
			  </el-col>
			  <el-col :span="8" class="outer-item b-r">
			  	<ul class="inner-list">
						<li class="inner-item" v-for="item in cityItems" :key="item.value" v-bind:class="{ 'is-selected': item.checkedValue }">
							<div class="clearfix b-a select-item">
								<el-checkbox class="city" v-model="item.checkedValue" v-on:change="changeCity(item)">
									<span v-text="item.label"></span>
								</el-checkbox>
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
			  </el-col>
			  <el-col :span="8" class="outer-item">
			  	<ul class="inner-list">
						<li class="inner-item" v-for="item in districtItems" :key="item.value" v-bind:class="{ 'is-selected': item.checkedValue }">
							<div class="clearfix b-a select-item">
								<el-checkbox class="city" v-model="item.checkedValue" v-on:change="changeDistrict(item)">
									<span v-text="item.label"></span>
								</el-checkbox>
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
			  </el-col>
			</el-row>
		</div>
		<div class="m-t-lg text-lg"><span class="text-muted m-l-sm m-r-sm">已选定了</span>
			<span class="text-primary" v-text="selectedCity.name"></span>
		</div>
		<div class="m-t-lg">
			<el-button v-show="cityMoreEnable" type="primary" size="small" @click="add">确定添加，下一步</el-button>
			<p v-show="!cityMoreEnable" >需开启更多城市请联系管理员</p>
		</div>

	</div>
		<!-- 设置管理员 -->
		<el-dialog class="ukao-dialog"
		  :title="formTitle"
		  :visible.sync="dialogVisible"
		  size="small">
		  <div>
				<el-form :model="ruleForm" ref="ruleForm" label-width="160px" class="demo-ruleForm">
					<el-form-item class="dis-inline" label="登录账号"  prop="account" :rules="[
							{ required: true, message: '登录账号不能为空'},
							{ min: 3, max: 15, message: '长度在3到15个长度', trigger: 'blur' }
					]">
							 <div class="dis-inline w-md">
								 <el-input v-model="ruleForm.account" placeholder="数字、字母">
								<template slot="append">{{ruleForm.symbol}}</template>
							</el-input>
							 </div>
						 </el-form-item>
					<el-form-item label="登录密码" prop="pwd" :rules="[
							{ required: true, message: '登录密码不能为空'},
							{ min: 6, max: 16, message: '长度在6到16个长度', trigger: 'blur' }
					]">
							 <div class="dis-inline w-xl">
								<el-input type="password" v-model="ruleForm.pwd" placeholder="6到16个长度密码"></el-input>
							 </div>
					</el-form-item>

				  <el-form-item label="管理员姓名" prop="name" :rules="[
				    { required: true, message: '管理员姓名不能为空'},
				    { min: 1, max: 15, message: '长度在1到15个长度', trigger: 'blur' }
				  ]">
	          <div class="dis-inline w-xl">
	            <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
	          </div>
				  </el-form-item>
					<el-form-item label="管理员手机号" prop="phone" :rules="[
							{ required: true, message: '请输入有效的手机号',  },
							{ min: 11, max: 11, message: '请输入有效的手机号', trigger: 'blur' }
					]">
          <div class="dis-inline w-xl">
  			  	<el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
          </div>
			  	</el-form-item>

					<el-form-item label="客服电话" prop="tel" :rules="[
					  { required: true, message: '请输入有效的客服电话',  },
					  {min: 6, max: 20,  message: '请输入有效的客服电话', trigger: 'blur' },
					]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.tel" placeholder="请输入有效的客服电话"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="支付账号" prop="payType" :rules="[
					  { required: true, message: '请选择' },
					]">
						<el-radio class="radio" v-model="ruleForm.payType" label="1">总部支付账号</el-radio>
						<el-radio class="radio" v-model="ruleForm.payType" label="2">自定义支付账号</el-radio>
					</el-form-item>

					<el-form-item label="微信店铺" prop="isShopOpen" :rules="[
							{ required: true, message: '请选择' },
						]">
						<el-radio class="radio" v-model="ruleForm.isShopOpen" label="1">启用</el-radio>
						<el-radio class="radio" v-model="ruleForm.isShopOpen" label="0">不启用</el-radio>
					</el-form-item>
					<el-form-item v-if="enableInitProduct">
						<div class="dis-inline w-xl">
							<el-checkbox v-model="initTmpProduct">初始化系统预设产品数据</el-checkbox>
						</div>
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
	import consts from '@/utils/consts'
	import regional from '@/utils/regional'
	import auth from '@/utils/auth'
	import msg from '@/utils/msg'
	import md5 from '@/utils/md5'

	export default {
    data: function() {
			return {
				cityMoreEnable: false,
				message: '',
			  default: {
					provinceId: '',
					cityId: '',
					districtId: '',
        },
				selectedCity: {
				  id: '',
				  name : ''
				},
				provinceItems: [],
				cityItems: [],
				districtItems: [],
				dialogVisible: false,
				formTitle: '',
				ruleForm: {
					symbol: '',
					regionalId: '',
					cityName : '',
					phone: '',
					account: '',
					name: '',
					password: '',
					tel:'',
					pwd: '',
					payType:'1',
					isShopOpen:'1',
					latitude:'',
					longitude:''
				},
        initTmpProduct:true,
        enableInitProduct: false
			}
		},
		created() {
			this.queryCityMore()
			this.init()
			this.getCityInfo()
      this.enableInit()
		},
		methods: {
		  init (){
				this.provinceItems = regional.getProvince()
			},
      enableInit(){
        this.$store.dispatch('post', {
          uri: 'tmpProductInfo/enableInit'
        }).then((res) => {
          this.enableInitProduct = res.data.data == 1;
        })
      },
      initProduct(cityId) {
        this.$store.dispatch('post', {
          uri: 'tmpProductInfo/initProduct',
					data: {cityId}
        })
      },
			queryCityMore(){
				this.$store.dispatch('post', {
					uri : 'mercInfo/cityMore',
					data: {}
				}).then((res) =>{
						this.cityMoreEnable = res.data.data
				})
			},
			getCityInfo (){
				let mercInfo = auth.getMercInfo()
				if(mercInfo && mercInfo.regionalId){
				  this.ruleForm.symbol = mercInfo.symbol
					let regionalId = mercInfo.regionalId
					var provinceId = '', cityId = '', districtId = ''
					var regionals = regional.getRegionalById(regionalId)
					var regionalInfo = regionals && regionals.length != 0 ? regionals[0] : null
					if(regionalInfo) {
					  if((regionalInfo.parentId + '').length == 2) {
              this.cityItems = regional.getCity(regionalInfo.parentId)
              this.districtItems = regional.getArea(regionalInfo.parentId, regionalInfo.value)
              this.provinceItems.forEach(function (item) {
                item.selected = !(regionalInfo.parentId !== item.value)
              })
            }else if((regionalInfo.parentId + '').length > 2){
							var citys = regional.getRegionalById(regionalInfo.parentId)
							var cityInfo = citys && citys.length != 0 ? citys[0] : null
							var plist = regional.getProvince(cityInfo.parentId)
							var pInfo = plist && plist.length != 0 ? plist[0] : null
							this.provinceItems.forEach(function (item) {
             			item.selected = !(pInfo.value !== item.value)
           		})
							this.cityItems = pInfo.children || []
						}
          }
        }
			},
			chooseProvince: function(selectedItem) {
				this.provinceItems.forEach( function (item, index) {
					item.selected = false
				});
				selectedItem.selected = true
				this.cityItems = regional.getCity(selectedItem.value)
				this.districtItems.length = 0
			},
			changeCity: function(selectedItem) {
				this.cityItems.forEach( function (item, index) {
						item.checkedValue =  !(selectedItem.value !== item.value)
				})
				this.districtItems = regional.getArea(selectedItem.parentId, selectedItem.value)
				this.districtItems.forEach( function (item, index) {
					item.checkedValue = false
				});
				this.selectedChanged(selectedItem);

			},
			changeDistrict: function(selectedItem) {
				this.districtItems.forEach( function (item, index) {
					item.checkedValue = !( selectedItem.value !== item.value)
				})
				this.selectedChanged(selectedItem);
				this.cityItems.forEach( function (item, index) {
					item.checkedValue = false
				})
			},
			// 已选中城市函数
			selectedChanged: function(item) {
		    if(item && item.checkedValue){
					this.selectedCity.id = item.value
					this.selectedCity.name = item.label
					var lat = Number(item.latitude)
					var parentId = item.parentId
					if(!lat && parentId){
					  //地区坐标为0，取上级坐标
						var city = regional.getCity(Number(parentId.toString().substr(0, 2)), parentId)[0]
						if(city) {
              this.selectedCity.latitude = city.latitude
              this.selectedCity.longitude = city.longitude
            }
					}else {
            this.selectedCity.latitude = item.latitude
            this.selectedCity.longitude = item.longitude
          }
				}else{
					this.selectedCity.id = ''
					this.selectedCity.name = ''
					this.selectedCity.longitude = ''
					this.selectedCity.latitude = ''
				}
			},
			add (){
			  if(this.selectedCity.id){
					this.ruleForm.symbol = auth.getMercInfo() ? auth.getMercInfo().symbol : this.ruleForm.symbol
					this.formTitle = '添加城市（' + this.selectedCity.name + '）管理员'
					this.dialogVisible = true
			  }else{
					msg.warning('请选择城市');
				}
			},
			submitForm (formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.ruleForm.regionalId = this.selectedCity.id
						this.ruleForm.cityName = this.selectedCity.name
						this.ruleForm.latitude = this.selectedCity.latitude
						this.ruleForm.longitude = this.selectedCity.longitude
						this.ruleForm.password = md5.hex_md5(this.ruleForm.pwd)
            this.$store.dispatch('post', {
              uri: 'mercCity/add',
              data: this.ruleForm
            }).then((res) => {
              if (this.enableInitProduct && this.initTmpProduct) {
                this.initProduct(res.data.data)
              }
              msg.success();
              this.$router.push({path: '/mcity/list'})
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
	.add-city {
		text-align: center;
	}
	.city-tree {
		width: 800px;
		margin: 50px auto 0;
	}
	.outer-item {
		height: 500px;
		text-align: center;
		padding-top: 30px;
		padding-bottom: 30px;
		overflow: auto;
	}
	.inner-list {
		display: inline-block;
	}
	.inner-item {
		margin-bottom: 20px;
		text-align: left;
	}
	.inner-item.selected .select-item {
		background-color: #8492a6;
		color: #fff;
	}
	.inner-item.is-selected .select-item {
		border-color: #20a0ff;
		color: #20a0ff;
	}
	.select-item {
		width: 160px;
		color: #8492a6;
		position: relative;
		border-radius: 5px;
		background-color: #f4f5f9;
		position: relative;
		overflow: hidden;
		z-index: 1;
	}
	.select-item:hover {
		border-color: #eeeeef;
		background-color: #f4f4f4;
		color: #909090;
	}
	.select-item .city {
		vertical-align: middle;
		line-height: 20px;
		display: block;
		padding: 6px 12px;
	}
	.select-item .city {
		color: #8492a6;
	}
	.inner-item.selected .select-item .city {
		color: #fff;
	}
	.inner-item.is-selected .select-item .city {
		color: #20a0ff;
	}
	.select-item:hover .city {
		color: #909090;
	}
	.select-item .icon {
		vertical-align: middle;
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		line-height: 20px;
		z-index: -1;
	}

</style>
