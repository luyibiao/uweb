<template>
	<div>
		<div class="m-t-lg" v-loading="loading">
			<p class="title text-black">产品详情</p>
			<div class="ukao-tb-default">
				<table class="ukao-table b-t" style="width: 100%">
					<tbody>
						<tr>
							<td style="width: 30%">所属经营项目</td>
							<td v-if="ruleForm.exp">
								<span>{{ruleForm.exp.mercBusinessName}}</span>
							 <span v-if="ruleForm.exp.mercBusinessName != ruleForm.exp.businessName">（{{ruleForm.exp.businessName}}）</span>
							</td>
							<td style="width: 20%">
							</td>
						</tr>
						<tr>
							<td>产品图片</td>
							<td>
								<img class="thumb" :src="productInfo.imgPath || '/static/img/product/def.png'"  alt="">
							</td>
							<td>
								<el-button size="small" @click="update('imgPath','产品图片')" >修改</el-button>
							</td>
						</tr>
						<tr>
							<td>产品名称</td>
							<td>{{productInfo.name}}</td>
							<td>
								<el-button size="small" @click="update('name','产品名称')">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>编号</td>
							<td>{{productInfo.code}}</td>
							<td>
								<el-button size="small" @click="update('code','编号')">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>所属类别</td>
							<td>
								<span v-if="productInfo.exp">{{productInfo.exp.typeName}}</span>
							</td>
							<td>
								<el-button size="small" @click="update('type','所属类别')">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>计价方式</td>
							<td>
								<span v-if="productInfo.exp">{{productInfo.exp.unitName}}</span>
							</td>
							<td>
								<el-button size="small" @click="update('unit','计价方式')">修改</el-button>
							</td>
						</tr>
						<tr v-if="productServiceList && productServiceList.length > 0"
								v-for="(item, index) in productServiceList"
								:key="item.index" >
							<td>&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}</td>
							<td>{{item.price}} {{item.unit || '元'}}</td>
							<td>
								<el-button size="small"  @click="updateService(index)">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>折扣</td>
							<td>
								<span v-if="productInfo.exp">{{productInfo.exp.saleTypeName}}</span>
								<span v-if="productInfo.saleType == 2">（{{productInfo.discount}}%）</span>
							</td>
							<td>
								<el-button size="small" @click="update('saleType','折扣')">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>输送类别</td>
							<td>
								<span v-if="productInfo.exp">{{productInfo.exp.tranTypeName}}</span>
							</td>
							<td>
								<el-button size="small" @click="update('tranType','输送类别')">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>自定义数量</td>
							<td>
								<span v-if="productInfo.isCustomNum">是</span>
								<span v-if="!productInfo.isCustomNum">否</span>
							</td>
							<td>
								<el-button size="small" @click="update('isCustomNum','自定义数量')">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>序号</td>
							<td>{{productInfo.sortNo}}</td>
							<td>
								<el-button size="small" @click="update('sortNo','序号')">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>状态</td>
							<td><span v-if="productInfo.exp">{{productInfo.exp.statusName}}</span></td>
							<td>
								<el-button size="small" @click="update('status','状态')">修改</el-button>
							</td>
						</tr>
						<tr>
							<td>创建时间</td>
							<td><span>{{productInfo.createTime}}</span></td>
							<td>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- 修改-->
			<el-dialog class="ukao-dialog"
				 v-loading = "dialog.loading"
				:title="dialog.title"
				:visible.sync="dialog.visible"
				size="small">
				<div>
					<el-form :model="ruleForm"  ref="ruleForm" label-width="150px">
						<el-form-item label="所属门店" prop="storeId" v-if="dialog.attr === 'store'"
							:rules="[{ required: true, message: '请选择门店' }]">
							<el-select v-model="ruleForm.storeId" clearable placeholder="请选择/搜索">
								<el-option style="height: 46px" :label="item.name" :value="item.id" :key="item.id"  v-for="item in storeList" >
									<p>{{ item.name }}</p>
									<p style="color: #8492a6; font-size: 12px">{{item.addrDesc|| item.regionalDesc}}</p>
								</el-option>
				    	</el-select>
						</el-form-item>

						<el-form-item class="w-xxl" label="产品名称" prop="name" v-if="dialog.attr === 'name'"
							:rules="[
							{ required: true, message: '请输入产品名称', trigger: 'blur' },
							{ min: 1, max: 8, message: '长度在1到8个长度' } ]">
				    <el-input v-model="ruleForm.name"></el-input>
				  </el-form-item>

						<el-form-item class="w-xxl" label="编号" prop="code"  v-if="dialog.attr === 'code'" :rules="[
							{ required: true, message: '编号不能为空', trigger: 'blur'},
							{ min: 2, max: 8, message: '长度在2到8个长度' }
						]">
					    <el-input v-model="ruleForm.code"></el-input>
					  </el-form-item>

					  <el-form-item class="w-lg" label="所属类别" prop="typeId" v-if="dialog.attr === 'type'"
										:rules="[{ required: true, message: '请选择所属类别'}]">
					  	<el-select v-model="ruleForm.typeId" clearable placeholder="请选择所属类别" @change="selectedProductType">
								<el-option :label="item.name" :value="item.id" :key="item.id"  v-for="item in productTypeList" ></el-option>
					    </el-select>
					  </el-form-item>

						<el-form-item class="w-lg" label="计价方式" prop="unit" v-if="dialog.attr === 'type' || dialog.attr === 'unit'"
									:rules="[{ required: true, message: '请选择计价方式' }]">
					  	<el-select v-model="ruleForm.unit" placeholder="请选择计价方式"  @change="selectedUnit">
								<el-option :label="item.showText" :value="item.val" :key="item.id"  v-for="item in unitList" ></el-option>
					    </el-select>
					  </el-form-item>

						<!-- 修改服务项-->
						<div v-if="dialog.attr === 'type' ">
							<div v-loading="priceLoading"></div>
							<div class="price-item"  v-if="ruleForm.priceList && ruleForm.priceList.length > 0">
								<el-form-item class="w-xxl" :label="item.name" :key="item.index"
										v-for="(item, index) in ruleForm.priceList" :prop="'priceList.' + index + '.showPrice'"
										:rules="[
										{ required: true, message: '请输入价格' },
										{ type: 'number', message: '请输入有效价格' },
										{validator: checkAmount, min:0, max:99999, message: '有效金额0至99999', trigger: 'blur'}
									]">
									<el-input v-model.number="item.showPrice" type="number" placeholder="请输入价格"></el-input>
									<span>{{unit || item.unit || '元'}}</span>
									<!--<el-radio v-model="item.isShow">作为显示参考价格</el-radio>-->
								</el-form-item>
							</div>
						</div>
						<!-- 修改服务项-->

					  <el-form-item class="w-lg" label="折扣" prop="saleType" v-if="dialog.attr === 'saleType'" :rules="[
							{ required: true, message: '请选择折扣' }]">
					  	<el-select v-model="ruleForm.saleType" placeholder="请选择折扣">
								<el-option :label="item.showText" :value="item.val" :key="item.id"  v-for="item in saleTypeList" ></el-option>
					    </el-select>
					  </el-form-item>

						<div v-if="dialog.attr === 'saleType'">
							<div class="price-item" v-if="ruleForm.saleType == 2">
								<el-form-item class="w-xxl" label="折扣比例" prop="discount" :rules="[
									{ required: true, message: '请输入折扣比例' },
									{ type: 'number', message: '折扣比例1至100之间的整数' },
								]">
									<el-input v-model.number="ruleForm.discount" type="number" placeholder="请输入折扣比例"></el-input><span>%</span>
								</el-form-item>
							</div>
						</div>

					  <el-form-item class="w-lg" label="输送类别" prop="tranType" v-if="dialog.attr === 'tranType'" :rules="[
					    { required: true, message: '请选择输送类别' }
					  ]">
					  	<el-select v-model="ruleForm.tranType" placeholder="请选择输类别">
								<el-option :label="item.showText" :value="item.val" :key="item.id"  v-for="item in tranTypeList" ></el-option>
					    </el-select>
					  </el-form-item>

						<el-form-item label="自定义数量" prop="isCustomNumVal"  v-if="dialog.attr === 'isCustomNum'">
							<el-switch
								active-color="#13ce66" v-model="isCustomNumVal"
								inactive-color="#dcdcdc" :width="74"
								on-text="是" off-text="否" @change="updateCustomNum">
							</el-switch>
							<p class="text-muted text-xs">门店入库选择服务项是否允许自定义数量</p>
						</el-form-item>

					  <el-form-item class="w-xxl" label="序号" prop="sortNo" v-if="dialog.attr === 'sortNo'" :rules="[
								{ type:'number', required: false, message: '序号必须为整数'}]">
					    <el-input v-model.number="ruleForm.sortNo" type="number"></el-input>
					  </el-form-item>

						<el-form-item label="状态" prop="statusVal"  v-if="dialog.attr === 'status'">
							<el-switch
								active-color="#13ce66" v-model="statusVal"
								inactive-color="#dcdcdc" :width="74"
								on-text="已启用" off-text="已停用" @change="updateStatus">
							</el-switch>
						</el-form-item>

					  <el-form-item label="产品图片" prop="imgPath" v-if="dialog.attr === 'imgPath'">
					  	<p class="text-muted text-xs">建议尺寸为246像素*224像素，大小不超过500kb</p>
					    <el-upload
							  class="u-avatar-uploader"
							  action="https://jsonplaceholder.typicode.com/posts/"
							  :show-file-list="false">
							  <img v-if="ruleForm.imgPath" :src="ruleForm.imgPath" class="u-avatar">
							  <i v-else class="el-icon-plus u-avatar-uploader-icon"></i>
							</el-upload>
					  </el-form-item>

						<el-form-item>
							<el-button @click="dialog.visible=false">取消</el-button>
							<el-button type="primary"  @click="submitForm('ruleForm')">保存</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-dialog>
			<!--end 修改-->

			<!-- 修改单项服务项-->
			<el-dialog class="ukao-dialog"
				:title="dialogPrice.title"
				:visible.sync="dialogPrice.visible"
				size="small">

				<el-form :model="rulePriceForm"  ref="rulePriceForm" label-width="150px">
					<div class="price-item">
						<el-form-item class="w-xxl" :label="dialogPrice.label"  prop="showPrice" :rules="[
								{ required: true, message: '请输入价格' },
								{ type: 'number', message: '请输入有效价格' },
								{validator: checkAmount, min:0, max:99999, message: '有效金额0至99999', trigger: 'blur'}
							]">
							<el-input v-model.number="rulePriceForm.showPrice" type="number" placeholder="请输入价格"></el-input>
							<span v-if="productInfo.exp">{{productInfo.exp.unit || '元'}}</span>
							<!--<el-radio v-model="item.isShow">作为显示参考价格</el-radio>-->
						</el-form-item>
					</div>
					<el-form-item>
						<el-button @click="dialogPrice.visible=false">取消</el-button>
						<el-button type="primary"  @click="submitPriceForm('rulePriceForm')">保存</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
			<!--end 修改单项服务项-->
		</div>
	</div>
</template>

<script>
	import helpers from '@/utils/helpers/base'
	import msg from '@/utils/msg'
	import time from '@/utils/helpers/timeLite'
	import calculation from '@/utils/helpers/calculation'
	import validate from '@/utils/helpers/validate'

	export default {
    data: function() {
			return {
				loading: true,
				storeList: [], 		//门店
				businessList:[],	//所属经营项目
				productTypeList: [],		//所属产品类别
				unitList: [],				//产品单位计价方式
				saleTypeList:[],		//折扣
				tranTypeList:[],		//输送线
				productServiceList: [],	//服务项及价格
				productServiceRuleList:[],	//服务项及价格操作规则
				storeInfo:{
				  name:''
				},
				productInfo:{},
				dialog: {
					loading: false,
					title: '修改',
					visible: false,
					attr: ''
				},
				storeList: [],
				ruleForm: {
				  id:'',
					storeId: '',
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
					cabinetId: '0'
        },
				rulePriceForm: {		//修改单项服务项
				  id:'',
					price:'',
					showPrice: ''
				},
				statusVal: true,
				isCustomNumVal: true,
				priceLoading: false,
				dialogPrice: {		//修改服务价格单项窗口
					title: '修改',
					visible: false,
					label: ''
				},
				unit: ''	//单位
			}
		},
		created () {
			this.info()
    },
		watch : {		//监听选择改变
    	'ruleForm.businessId' (val) {
				this.getProductServiceList()
      }
		},
		methods: {
			info (){
				this.$store.dispatch('getList', {
					uri: 'productInfo/detail',
					data: {
					  id:this.$route.params.id
					}
				}).then((res) => {
					var _this = this
					var data = res.data.data
					var exp = res.data.exp
					var serviceRelList = res.data.serviceRel || []
					this.productInfo = data
					this.productInfo.createTime = time.getDateTime(data.createTime)
					this.productInfo.exp = exp
					this.productServiceList.length = 0
					serviceRelList.forEach(function (item, index) {
					  	let price = helpers.numFormat({value : item.price / 100, fixed:2})
							_this.productServiceList.push({
								id: item.id,
								serviceId: item.serviceId,
								index:index,
								name: item.serviceName,
								price: price,
								showPrice: Number(price),
								isShow: item.isShow,
								unit: exp.unit
							})
          })
					this.setRuleForm(data)
					this.loading = false
				})
      },
			setRuleForm(data){
				this.ruleForm = {...data}
				this.ruleForm.unit = this.ruleForm.unit + ''
				this.ruleForm.saleType = this.ruleForm.saleType + ''
				this.ruleForm.tranType = this.ruleForm.tranType + ''
				this.isCustomNumVal = this.ruleForm.isCustomNum == 1 ? true : false
				this.statusVal = this.ruleForm.status == 1 ? true : false
				this.ruleForm.priceList = this.productServiceList || []
			},
			update (attr, name){
				this.dialog.title = '修改'+ name
				this.dialog.attr = attr
				switch (attr){
					case 'store':
						this.getStoreList()
					  break
					case 'type':
						this.getProductTypeList()
						this.getUnitList()
					  break
					case 'saleType':
						this.getSaleTypeList()
					  break
					case 'tranType':
						this.getTranTypeList()
					  break
					case 'unit':
						this.getUnitList()
					  break
					default:
					  break
				}
				this.dialog.visible = true
			},
			updateStatus(val){
			  this.ruleForm.status = val ? 1 : 0
			},
			updateCustomNum(val){
			  this.ruleForm.isCustomNum = val ? 1 : 0
			},
			updateService(index){
			  let item = this.productServiceList[index]
				if(item) {
          this.dialogPrice.label = item.name
          this.dialogPrice.title = '修改' + item.name + '服务项'
          this.dialogPrice.attr = 'price'
          this.rulePriceForm.showPrice = item.showPrice
          this.rulePriceForm.id = item.id
          this.dialogPrice.visible = true
        }else {
			    msg.error('修改的记录不存在')
					this.info()
				}
			},
			getStoreList (){						//门店
				this.dialog.loading = true
			  if(this.storeList.length == 0) {
          this.$store.dispatch('post', {
            uri: 'storeInfo/list',
            data: {}
          }).then((res) => {
            this.storeList = res.data.data.list || []
						this.dialog.loading = false
          })
        }else{
					this.dialog.loading = false
				}
			},
			getProductTypeList(){			//所属类别
				if(this.productTypeList.length == 0) {
          this.$store.dispatch('post', {
            uri: 'productType/list',
            data: {
              sysMercId: '-1'
            }
          }).then((res) => {
            this.productTypeList = res.data.data.list || []
          })
        }
			},
			getSaleTypeList (){
				let _this = this
				if(_this.saleTypeList.length == 0) {
          this.getDictList('SALE_TYPE', function (list) {
            _this.saleTypeList = list
          })
        }
			},
		  getTranTypeList () {
			  let _this = this
			  if(_this.tranTypeList.length == 0) {
				  this.getDictList('TRAN_TYPE', function (list) {
					  _this.tranTypeList = list
				  })
			  }
			},
			getUnitList(){
			  let _this = this
				if(_this.unitList.length == 0) {
          this.getDictList('PRODUCT_UNIT', function (list) {
            _this.unitList = list
          })
        }
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
			getProductServiceList(fn){		//服务及价格
				this.priceLoading = true
				this.$store.dispatch('getList', {
					uri: 'productService/list',
					data: {
						sysMercId: '-1',
						businessId: this.ruleForm.businessId
					}
				}).then((res) => {
				  	let _this = this
						let tmpPriceList = []
						let list = res.data.data.list || []
						let productServiceList = _this.productServiceList || []
						if(list.length > 0) {
							list.forEach(function (item, index) {
							  let pitem = _this.filterData(productServiceList, item.id)
								let obj = {id: '', index:index, serviceId: item.id ,name: item.name, price:'',
													showPrice: '', isShow:0, unit:item.unit || '元'}
								if(pitem){
									obj = {id:'', index:index, serviceId: pitem.serviceId ,name: pitem.name,
											price:pitem.price, showPrice: pitem.showPrice, isShow:pitem.isShow || 0, unit:pitem.unit}
								}
                tmpPriceList.push(obj)
              })
              this.ruleForm.priceList = tmpPriceList
              this.selectedUnit(this.ruleForm.unit)
            }else{
							_this.ruleForm.priceList.length = 0
				  	  msg.warning('该类型未添加服务项')
						}
						setTimeout(() => {
							this.priceLoading = false
						}, 1000);
						if(typeof (fn) === 'function'){
				  	  fn()
						}
				})
			},
			selectedProductType(val){
			  var _this = this
				_this.productTypeList.forEach(function (item) {
					if(item.id === val){
						_this.ruleForm.businessId = item.businessId
						return false
					}
				})

			},
			selectedUnit (val){		//设置单位
				var _this = this
				this.unitList.forEach(function (item) {
					if(item.val === val){
						_this.unit = item.attr1
						return false
					}
			  })
			},
			filterData (list, id){	//数据过滤
				 if (!list && id != '') return
				 let tmpItem = null
				 list.forEach(function (item) {
					 if (id && item.serviceId === id) {
						 tmpItem = item
						 return false
					 }
				 })
				 return tmpItem;
			 },
			priceTrans (price){
				return calculation.accMul(price, 100)
			},
			submitForm (formName){
			  let _this = this
				this.ruleForm.priceList.forEach(function (item) {
					 item.price = _this.priceTrans(item.showPrice)
        })
				this.ruleForm.prices = helpers.arrayToJson(this.ruleForm.priceList)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.saveForm ()
					}else{
						return false
					}
				})
			},
			checkAmount(rule, value, callback) {
			 if (!validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)) {
				 callback(new Error());
			 } else {
				 callback();
			 }
			},
			submitPriceForm (formName){		//服务项单项修改保存
				this.rulePriceForm.price = this.priceTrans(this.rulePriceForm.showPrice)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$store.dispatch('post', {
							uri: 'productServiceRel/update',
							data: this.rulePriceForm
						}).then((res) => {
							this.dialogPrice.visible = false
							msg.success();
							this.info()
						})
					}else{
						return false
					}
				})
			},
			saveForm (){
				this.$store.dispatch('post', {
					uri: 'productInfo/update',
					data: this.ruleForm
				}).then((res) => {
					this.dialog.visible = false
				  msg.success();
					this.info()
				})
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