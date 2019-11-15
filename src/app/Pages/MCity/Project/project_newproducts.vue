<template>
	<div>
		<el-breadcrumb class="link-back" separator="/">
		  <el-breadcrumb-item :to="'/mcity/project/'+cityInfo.id"><i class="el-icon-arrow-left icon-smaller"></i>经营项目</el-breadcrumb-item>
		  <el-breadcrumb-item :to="'/mcity/project/detail/' + cityInfo.id + '/' + mercBusiness.id">{{mercBusiness.name}}</el-breadcrumb-item>
		  <el-breadcrumb-item :to="'/mcity/project/products/' + cityInfo.id + '/' + mercBusiness.id">服务产品</el-breadcrumb-item>
		  <el-breadcrumb-item>新建产品</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="m-t-lg m-l-xxl">
			<el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item class="w-xxl" label="所属经营项目">
					<span v-text="mercBusiness.name"></span>
				</el-form-item>
				<el-form-item class="w-xxl" label="产品名称" prop="name" :rules="[
					{ required: true, message: '请输入产品名称', trigger: 'blur' },
					{ min: 1, max: 8, message: '长度在1到8个长度' }
				]">
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>
				<el-form-item class="w-xxl" label="编号" prop="code"  :rules="[
					{ required: true, message: '编号不能为空', trigger: 'blur'},
					{ min: 2, max: 8, message: '长度在2到8个长度' }
				]">
					<el-input v-model="ruleForm.code"></el-input>
				</el-form-item>
				<el-form-item class="w-lg" label="所属类别" prop="typeId"
								:rules="[{ required: true, message: '请选择折扣'}]">
					<el-select v-model="ruleForm.typeId" clearable placeholder="请选择所属类别" >
						<el-option :label="item.name" :value="item.id" :key="item.id"  v-for="item in productTypeList" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="w-lg" label="计价方式" prop="unit"
							:rules="[{ required: true, message: '请选择折扣' }]">
					<el-select v-model="ruleForm.unit" placeholder="请选择计价方式" @change="selectedUnit">
						<el-option :label="item.showText" :value="item.val" :key="item.id"  v-for="item in unitList" ></el-option>
					</el-select>
				</el-form-item>
				<div class="price-item"  v-if="ruleForm.priceList && ruleForm.priceList.length > 0">
					<el-form-item class="w-xxl" :label="item.name" :key="item.index"
							v-for="(item, index) in ruleForm.priceList" :prop="'priceList.' + index + '.showPrice'"
							:rules="[
							{ required: true, message: '请输入价格' },
							{ type: 'number', message: '请输入有效价格' },
							{validator: checkAmount, min:0, max:99999, message: '有效金额0至99999', trigger: 'blur'}
						]">
						<el-input v-model.number="item.showPrice" type="number" placeholder="请输入价格"></el-input>
						<span>{{item.unit || '元'}}</span>
						<!--<el-radio v-model="item.isShow">作为显示参考价格</el-radio>-->
					</el-form-item>
				</div>
				<el-form-item class="w-lg" label="折扣" prop="saleType" :rules="[
					{ required: true, message: '请选择折扣' }]
				">
					<el-select v-model="ruleForm.saleType" placeholder="请选择折扣">
						<el-option :label="item.showText" :value="item.val" :key="item.id"  v-for="item in saleTypeList" ></el-option>
					</el-select>
				</el-form-item>
				<div class="price-item" v-if="ruleForm.saleType == 2">
					<el-form-item class="w-xxl" label="折扣比例" prop="discount" :rules="[
						{ required: true, message: '请输入折扣比例' },
						{ type: 'number', message: '折扣比例1至100之间的整数' },
					]">
						<el-input v-model.number="ruleForm.discount" type="number" placeholder="请输入折扣比例"></el-input><span>%</span>
					</el-form-item>
				</div>
				<el-form-item class="w-lg" label="输送类别" prop="tranType" :rules="[
					{ required: true, message: '请选择输送类别' }
				]">
					<el-select v-model="ruleForm.tranType" placeholder="请选择输类别">
						<el-option :label="item.showText" :value="item.val" :key="item.id"  v-for="item in tranTypeList" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="自定义数量" prop="isCustomNum" :rules="[
					{required: true, message: '请选择输送线'}
				]">
					<el-switch
						active-color="#13ce66" v-model="ruleForm.isCustomNumVal"
						inactive-color="#dcdcdc" :width="74"
						on-text="是" off-text="否" >
					</el-switch>
					<p class="text-muted text-xs">门店入库选择服务项是否允许自定义数量</p>
				</el-form-item>

				<el-form-item class="w-xxl" label="序号" prop="sortNo" :rules="[
						{ type:'number', required: false, message: '序号必须为整数'}]">
					<el-input v-model.number="ruleForm.sortNo" type="number"></el-input>
				</el-form-item>
				<el-form-item label="产品图片" prop="imgPath">
					<p class="text-muted text-xs">建议尺寸为246像素*224像素，大小不超过500kb</p>
					<el-upload
						class="u-avatar-uploader"
						action="https://jsonplaceholder.typicode.com/posts/"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload">
						<img v-if="ruleForm.imgPath" :src="ruleForm.imgPath" class="u-avatar">
						<i v-else class="el-icon-plus u-avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<router-link :to="'/mcity/project/products/'+cityInfo.id+'/'+mercBusiness.id">
						<el-button>取消</el-button>
					</router-link>
					<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import helpers from '@/utils/helpers/base'
	import msg from '@/utils/msg'
	import calculation from '@/utils/helpers/calculation'
	import validate from '@/utils/helpers/validate'

	export default {
		data: function() {
			return {
				cityInfo:{
					id: this.$route.params.cityId,
				},
				mercBusiness: {
					id: this.$route.params.businessId,
					name: '洗涤'
				},
				productTypeList: [],		//所属产品类别
				unitList: [],				//产品单位计价方式
				saleTypeList:[],		//折扣
				tranTypeList:[],		//输送线
				productServiceList: [],	//服务项及价格
				productServiceRuleList:[],	//服务项及价格操作规则
				ruleForm: {
				  cityId: '',
          name: '',
					code: '',
					businessId : '',
          typeId: '',
					unit: '',
					saleType: '',
					tranType: '',
					isCustomNum: 1,
					isCustomNumVal: true,
					discount: '',
					sortNo: '',
          priceList:[],	//{id:'', serviceId: '',prop: '', name: '', price:'',showPrice: '', isShow:''}
					prices:{},
					imgPath: '',
        }
			}
		},
		created () {
		  let _this = this
			this.ruleForm.cityId = this.cityInfo.id
		  this.getBusinessInfo(function () {
				_this.getProductTypeList()
				_this.getSaleTypeList()
				_this.getTranTypeList()
				_this.getUnitList()
      })
    },
		watch : {		//监听选择改变
			'ruleForm.typeId' () {
				this.getProductServiceList()
      },
      'ruleForm.isCustomNumVal' (val){
    	  	this.ruleForm.isCustomNum = val ? 1 : 0
			}
		},
		methods: {
		  getBusinessInfo(fn){
		    let _this = this
				this.$store.dispatch('post', {
					uri: 'mercBusiness/detail',
					data: {id: _this.mercBusiness.id}
				}).then((res) => {
				  let mercBusiness = res.data.data
					this.mercBusiness.name = mercBusiness.name || '洗涤'
					this.ruleForm.businessId = mercBusiness.businessId
					if(typeof (fn) == 'function'){
				    fn()
					}
				})
			},
			getProductTypeList(){			//所属类别
				this.$store.dispatch('getList', {
					uri: 'productType/list',
					data: {
						sysMercId: '-1',
						businessId: this.ruleForm.businessId
					}
				}).then((res) => {
					this.productTypeList = res.data.data.list || []
				})
			},
			getProductServiceList(){		//服务及价格
				this.$store.dispatch('getList', {
					uri: 'productService/list',
					data: {
						sysMercId: '-1',
						businessId: this.ruleForm.businessId
					}
				}).then((res) => {
						let _this = this
						let tmpPriceList = []
						this.productServiceList = res.data.data.list || []
						this.productServiceList.forEach(function (item, index) {
							tmpPriceList.push(
								{index:index, serviceId: item.id ,name: item.name, price:'', showPrice: '', isShow:0, unit:item.unit}
							)
						})
						this.ruleForm.priceList = tmpPriceList
						this.selectedUnit(this.ruleForm.unit)
				})
			},
			getSaleTypeList (){
				let _this = this
				this.getDictList('SALE_TYPE', function (list) {
					_this.saleTypeList = list
				})
			},
			getTranTypeList () {
				let _this = this
				this.getDictList('TRAN_TYPE', function (list) {
					_this.tranTypeList = list
				})
			},
			getUnitList(){
				let _this = this
				this.getDictList('PRODUCT_UNIT', function (list) {
					_this.unitList = list
				})
			},
			getDictList (code, fn){		//获取字典
				if(!code) return
				this.$store.dispatch('getList', {
					uri: 'sysDicVal/valList',
					data: {
						code: code
					}
				}).then((res) => {
					let list = res.data.data || []
					if(typeof (fn) === 'function'){
							fn(list)
					}
				})
			},
			selectedUnit (val){		//设置单位
				var _this = this
				let unit = '元'
				this.unitList.forEach(function (item) {
					if(item.val == val){
						unit = item.attr1
						return false
					}
				})
				let list = []
				this.ruleForm.priceList.forEach(function (item) {
					item.unit = unit
					list.push(item)
				})
				this.ruleForm.priceList = list
			},
			priceTrans (price){
				return calculation.accMul(price, 100)
			},
			checkAmount(rule, value, callback) {
			  if (!validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)) {
				 callback(new Error());
			  } else {
				  callback();
			  }
			},
			submitForm (formName){
				let _this = this
				this.ruleForm.priceList.forEach(function (item) {
					 item.price = _this.priceTrans(item.showPrice)
				})
				this.ruleForm.prices = helpers.arrayToJson(this.ruleForm.priceList)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$store.dispatch('post', {
							uri: 'productInfo/add',
							data: this.ruleForm
						}).then((res) => {
								msg.success();
								this.$router.push({ path: '/mcity/project/products/'+this.cityInfo.id+'/'+this.mercBusiness.id })
						})
					}else{
						return false
					}
				})
			},
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			}
		}
	}
</script>

<style scoped>
	.price-item {
		margin-bottom: 15px;
	}
	.price-item:last-child {
		margin-bottom: 0;
	}
	.price-item .el-checkbox {
		width: 120px;
	}
	.price-item .el-input {
		width: 120px;
		margin-right: 10px;
	}

	
</style>