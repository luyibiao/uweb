<template>
	<div>
		<div class="clearfix ukao-v-loading" v-loading="loading">
			<div class="main">
				<div>
					<el-select class="ukao-el-select m-r" v-model="tableData.storeId" clearable placeholder="所属门店">
						<el-option
							v-for="item in storeList" :key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
					<el-select class="ukao-el-select m-r" v-model="tableData.businessId" clearable placeholder="所有经营项目">
						<el-option
							v-for="item in businessList" :key="item.id"
							:label="item.name"
							:value="item.businessId">
						</el-option>
					</el-select>

					<div class="w dis-inline m-l m-r-lg">
						<el-input placeholder="请输入名称、首字母" prefix-icon="el-icon-search" v-model="tableData.keywords" @keyup.enter.native="updateUrl(1)">
								<!--<el-button slot="append" icon="el-icon-search" @click="search"></el-button>-->
						</el-input>
					</div>
					<el-button type="primary" @click="updateUrl(1,true)">筛选</el-button>
					<p class="pull-right">
						<auth perm="setting.copy.read">
							<span class="m-r-sm"><router-link :to="'/setting/copy'"><el-button>去拷贝价格数据</el-button></router-link></span>
						</auth>
						<auth perm="store.price.update">
							<router-link to="/store/new_price"><el-button type="primary">新建产品</el-button></router-link>
						</auth>
					</p>
				</div>
				<div class="m-t-lg table-container">
					<div class="table-right b-a">
						<ul class="b-b ofa">
							<li v-for="(item,index) in productTypeTotalList" :key="index" @click="chooseCategory(item)" :class="{ 'is-active': item.typeId == tableData.typeId }">
								<span v-text="item.typeName"></span>
								(<span v-text="item.cnt"></span>)
							</li>
						</ul>
					</div>
					<div class="table-left">
						<el-table class="ukao-el-table"
							:data="tableData.list"
							tooltip-effect="dark"
							style="width: 100%" @selection-change="handleSelectionChange">
							<el-table-column
								type="selection"
								width="55">
							</el-table-column>
							<el-table-column
								label="图片"
								width="80">
								<template slot-scope="scope">
									<img class="thumb" :src="scope.row.imgPath || '/static/img/product/def.png'"  alt="">
								</template>
							</el-table-column>
							<el-table-column
								label="名称" >
									<template slot-scope="scope">
										<span class="text-primary">
											<router-link :to="'/store/price_info/'+scope.row.id" target="_blank">
												{{scope.row.name}}
											</router-link>
										</span>
									</template>
							</el-table-column>
							<el-table-column
								label="所属门店" prop="storeName">
							</el-table-column>
							<el-table-column
								label="所属经营项目" prop="exp.mercBusinessName">
							</el-table-column>
							<el-table-column
								label="价格" min-width="180px">
								<template slot-scope="scope">
									<p v-for="item in scope.row.serviceList" v-if="scope.row.serviceList">
										<span>{{item.serviceName}}</span>:
										<span>{{item.price | amtFormat}}</span>
										<span>{{scope.row.exp.unit}}</span>
										<span class="m-l-xs text-danger" v-if="mercInfo.isOpenVipPrice && typeof(item.vipPrice)=='number'">会员价:{{item.vipPrice | amtFormat}}{{scope.row.exp.unit}}</span>
									</p>
								</template>
							</el-table-column>
							<el-table-column
								label="所属产品类别" prop="exp.typeName">
							</el-table-column>
							<el-table-column
								prop="firstWord" label="首字母">
							</el-table-column>
							<el-table-column
								label="序号" >
								<template slot-scope="scope" >
									<p @click="openDialog(scope.row)" style="cursor:pointer">{{scope.row.sortNo}}</p>
								</template>
							</el-table-column>
							<el-table-column label="输送类别" prop="exp.tranTypeName"></el-table-column>
							<el-table-column
								label="折扣">
								<template slot-scope="scope">
									<p>{{ scope.row.exp.saleTypeName }}</p>
									<p v-if="scope.row.saleType == 2">{{ scope.row.discount }}%</p>
								</template>
							</el-table-column>
							<el-table-column
								label="状态">
								<template slot-scope="scope">
									<el-tooltip v-if="scope.row.status == 1" effect="dark" content="已启用" placement="right">
										<i class="t-state t-state-success"></i>
									</el-tooltip>
									<el-tooltip v-if="scope.row.status == 0" effect="dark" content="未启用" placement="right">
										<i class="t-state"></i>
									</el-tooltip>
									<el-tooltip v-if="scope.row.status == -1" effect="dark" content="已删除" placement="right">
										<i class="t-state"></i>
									</el-tooltip>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				<div class="text-right m-t-sm">
					<div class="pull-left">
						<auth perm="store.price.update">
							<el-button size="small" :disabled="btn.enable" type="success" @click="updateStatusEnable">启用</el-button>
							<el-button size="small" :disabled="btn.disable" type="danger" @click="updateStatusDisable">停用</el-button>
							<el-button size="small" :disabled="btn.delete" type="danger" @click="updateStatusDelete">删除</el-button>
						</auth>
					</div>
					<el-pagination
						:page-size="tableData.pagination.size"
						layout="total, prev, pager, next"
						:total="tableData.pagination.total"
						:current-page.sync = "tableData.pagination.page"
						@current-change="handleCurrentChange">
					</el-pagination>
				</div>
			</div>


		</div>
		<el-dialog class="ukao-dialog"
							 title="修改序号"
							 :visible.sync="dialog.visible"
							 size="small">
			<div>
				<el-form :model="ruleForm"
								 ref="ruleForm"
								 label-width="150px">
					<el-form-item class="w-xxl"
												label="序号"
												prop="sortNo"
												:rules="[
									{ type:'number', required: false, message: '序号必须为整数'}]">
						<el-input v-model.number="ruleForm.sortNo"
											type="number"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button @click="dialog.visible=false">取消</el-button>
						<el-button type="primary"
											 @click="saveForm">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import helpers from '@/utils/helpers/base'
  import product from "@/utils/mixins/product_detail";
	export default {
    mixins: [product],
		data: function() {
			return {
			  loading:true,
        page: 1,
				tableData: {
					businessId: '',
					typeId: '',
					storeId: '',
					keywords : '',
					list : [],
					expList: [],	//扩展内容
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0,
            page: 1
					}
				},
				businessList:[],	//所属经营项目
				multipleSelection: [],	//多选列表
				btn: {		//操作btn
					enable: true,		//启用
					disable: true,	//停用
					delete: true		//删除
				},
				productTypeTotalList: [],		//所属产品类别合计
				saleTypeList:[],	//折扣
				unitList:[],		//单位,
				storeList:[],
        ruleForm:{
			    id:'',
          sortNo:''
				},
        dialog:{
			    visible:false
			  }
			}
		},
		created () {
		  var _this = this;
      _this.initParams();
		  this.getProductBusiness(function () {
				_this.list(0);
      })
    },
		mounted(){
			//this.getProductTypeTotalList()
			this.getStoreList()

		},
		watch :{		//监听选择改变
			'multipleSelection' () {
				let bl = !(this.multipleSelection && this.multipleSelection.length > 0)
				this.btn = {
					enable: bl,
					disable: bl,
					delete: bl
				}
			},
      '$route' () {
        this.initParams();
        this.list();
      }
		},
		filters: {  //数据过滤器
			numFormat:function(value){
			  return helpers.numFormat({value, fixed:2})
			}
		},
		methods: {
      initParams() {
        let data = this.$route.query;
        if (JSON.stringify(data) !== '{}') {
          this.tableData.pagination.page = parseInt(data.page || 1);
          this.page = parseInt(data.page || 1);
          this.tableData.businessId = parseInt(data.businessId) || '';
          this.tableData.storeId = parseInt(data.storeId) || '';
          this.tableData.typeId = data.typeId || '';
          this.tableData.keywords = data.keywords || '';
        }
      },
      updateUrl(page = 1, removeTypeId) {
				if(removeTypeId)  this.tableData.typeId = '';
        this.$router.push({
          path: '/store/price',
          query: {
            page: page,
            storeId: this.tableData.storeId || '',
            businessId: this.tableData.businessId || '',
            typeId: this.tableData.typeId || '',
            keywords: this.tableData.keywords || ''
          }
        });
      },
      list (page){

        if (page) this.page = parseInt(page || 1);
        let startRow = (this.page - 1) * this.tableData.pagination.size;

        var _this = this
				this.loading = true
        this.$store.dispatch('getList', {
          uri: 'productInfo/storeList',
          data: {
            startRow: startRow,
            pageSize: this.tableData.pagination.size,
            businessId: this.tableData.businessId || '',
						typeId: this.tableData.typeId || '',
						storeId: this.tableData.storeId ,
            keywords: this.tableData.keywords || ''
          }
        }).then((res) => {
          let list = res.data.data.list || []
					let expList = res.data.expList || []
					let productServiceList = res.data.productServiceList || []
          list.forEach(function (item, index) {
						item.exp = _this.filterData(expList, item.id)
						productServiceList.forEach(function (sitem) {
						  if(sitem.info.id == item.id){
								item.serviceList = sitem.serviceRelExp || []
								return false
							}
            })
          })
          this.getProductTypeTotalList();
          this.tableData.list = list;
          this.tableData.pagination.total = res.data.data.total || 0;
          this.tableData.pagination.page = this.page;

					this.loading = false
        })
      },
			chooseCategory (item){
				this.tableData.typeId = item.typeId || ''
				this.updateUrl()
			},
      getProductBusiness (fn){
        this.$store.dispatch('getList', {
          uri: 'mercBusiness/list',
          data: {}
        }).then((res) => {
          this.businessList = res.data.data.list || []
          this.businessList.unshift({
            name: '所有经营项目',
            id: ''
          })
          if (typeof (fn) === 'function') {
            fn()
          }
        })
      },
			getProductTypeTotalList (fn){
				this.$store.dispatch('getList', {
					uri: 'productInfo/storeTypeTotal',
					data: {
            businessId:this.tableData.businessId || '',
            storeId: this.tableData.storeId || ''
					}
				}).then((res) => {
					let list = res.data.data || []
					let cnt = 0
					if(list && list.length >= 0){
						list.forEach(function (item) {
							cnt += item.cnt
            })
					}
				  this.productTypeTotalList = list
					this.productTypeTotalList.unshift({
					  typeName: '所有产品类别',
					  cnt: cnt,
					  typeId: '',
					  id: ''
				  })
					if (typeof (fn) === 'function') {
						fn()
					}
				})
			},
      filterData (list, id){	//数据过滤
        if (!list && id != '') return
        let tmpItem = null
        list.forEach(function (item) {
          if (id && item.id === id) {
            tmpItem = item
            return false
          }
        })
        return tmpItem;
      },
      updateStatusEnable (){		//启用
        let list = this.multipleSelection
        let ids = this.selectionIds(list)
        this.$store.dispatch('batch', {
          uri: 'productInfo/enableBatch',
          data: {
            ids: ids
          }
        }).then((res) => {
          msg.success();
          this.list(this.tableData.pagination.page)
        })
      },
      updateStatusDisable (){		//停用
        let list = this.multipleSelection
        let ids = this.selectionIds(list)
        this.$store.dispatch('batch', {
          uri: 'productInfo/disableBatch',
          data: {
            ids: ids
          }
        }).then((res) => {
          msg.success();
          this.list(this.tableData.pagination.page)
        })
      },
      updateStatusDelete (){		//删除
				var _this = this
        msg.confirm({
          msg: '此操作将永久删除选中项, 是否继续?', confirmFn: function () {
            let list = _this.multipleSelection
            let ids = _this.selectionIds(list)
						_this.$store.dispatch('batch', {
              uri: 'productInfo/deleteBatch',
              data: {
                ids: ids
              }
            }).then((res) => {
              msg.success();
							_this.list(_this.tableData.pagination.page)
            })
          }
        })
      },
			getStoreList (){
				 this.$store.dispatch('getList', {
					 uri: 'storeInfo/list',
					 data: {}
				 }).then((res) => {
					 this.storeList = res.data.data.list || []
				 })
			 },
      selectionIds (list){	//获取选择id
        let ids = []
        list.forEach(function (item) {
          ids.push(item.id)
        })
        return ids.join(',')
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
			handleCurrentChange (val){
        this.updateUrl(val);
		  },
      openDialog(item){
			  this.dialog.visible = true;
			  this.ruleForm.id = item.id;
			  this.ruleForm.sortNo = item.sortNo;
			},
			saveForm(){
        this.$store
          .dispatch("post", {
            uri: "productInfo/updateSortNo",
            data: {...this.ruleForm}
          })
          .then(res => {
            this.dialog.visible = false;
            this.list();
            msg.success();
          });
			}
    }
	}
</script>

<style scoped>
	.main {
		height: 400px;
	}
	.t-state {
		display: inline-block;
		vertical-align: middle;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #cfcfcf;
	}
	.t-state.t-state-success {
		background-color: #36c924;
	}
	.table-container {
		position: relative;
	}
	.table-left {
		margin-right: 200px;
	}
	.table-right {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 180px;
		overflow: hidden;
	}
	.table-right ul li {
		padding:0 20px;
		line-height: 40px;
	}
	.table-right ul li.is-active,
	.table-right ul li:hover {
		background-color: #f8f8f8;
	}
	.ofa{
		overflow: auto;
    height: 100%;
    margin-right: -20px;
	}
</style>