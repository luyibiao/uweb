<template>
	<div class="clearfix ukao-v-loading" v-loading="loading">
		<vBanner :isShow="cityInfo.isShopOpen===0"></vBanner>

		<div class="main" >
			<div class="text-right">
				<el-select class="ukao-el-select m-r" v-model="tableData.businessId" clearable placeholder="所有经营项目">
					<el-option
						v-for="item in businessList" :key="item.id"
						:label="item.name"
						:value="item.businessId">
					</el-option>
				</el-select>
			  <el-input class="ukao-el-input m-r-lg" placeholder="请输入内容" v-model="tableData.keywords" @keyup.enter.native="updateUrl(1)">
					<el-button slot="append" icon="el-icon-search" @click="updateUrl(1, true)"></el-button>
			  </el-input>
				<auth perm="setting.copy.read">
			  	<span class="m-rmsm"><el-button @click="$router.push('/setting/copy')">去拷贝价格数据</el-button></span>
				</auth>
				<auth perm="weixin.price.list.update">
			  	<router-link to="/weixin/price/new"><el-button type="primary">新建产品</el-button></router-link>
				</auth>
			</div>
			<div class="m-t-lg table-container">
				<div class="table-right b-a">
			  	<ul class="b-b">
			  		<li v-for="(item,index) in productTypeTotalList" @click="chooseCategory(item)" :key="index" :class="{ 'is-active': item.typeId == tableData.typeId }">
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
				      width="100">
				      <template slot-scope="scope">
								<img class="thumb" :src="scope.row.imgPath || '/static/img/product/wxdef.png'" alt="">
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="名称">
				      <template slot-scope="scope">
								<span class="text-primary">
									<router-link :to="'/weixin/price/info/'+scope.row.id" target="_blank">
										{{scope.row.name}}
									</router-link>
								</span>
				      </template>
				    </el-table-column>
				    <!-- <el-table-column
				      prop="code"
				      label="编号">
				    </el-table-column> -->
				    <el-table-column
				      label="所属经营项目">
							<template slot-scope="scope">
								<div v-if="scope.row.exp">
									<p v-text="scope.row.exp.mercBusinessName"></p>
									<!--<p v-if="scope.row.exp.mercBusinessName != scope.row.exp.businessName">-->
										<!--（{{scope.row.exp.businessName}}）-->
									<!--</p>-->
								</div>
							</template>
				    </el-table-column>
				    <el-table-column
				      label="价格"
							min-width="200">
				      <template slot-scope="scope"  v-if="scope.row.serviceList">
								<p v-for="(item,index) in scope.row.serviceList" :key="index">
									<span>{{item.serviceName}}</span>:
									<span>{{item.price | amtFormat}}</span>
									<span>{{scope.row.exp.unit}}</span>
									<span class=" m-l-xs text-danger" v-if="mercInfo.isOpenVipPrice && typeof(item.vipPrice)=='number'">会员价:{{item.vipPrice | amtFormat}}{{scope.row.exp.unit}}</span>
								</p>
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="所属产品类别" prop="exp.typeName">
				    </el-table-column>
				    <el-table-column
							prop="exp.tranTypeName"
				      label="输送类型">
				    </el-table-column>
				    <el-table-column
				      prop="firstWord"
				      label="首字母">
				    </el-table-column>
				    <el-table-column
				      prop="sortNo"
				      label="序号">
				    </el-table-column>
				    <el-table-column
				      label="折扣">
							<template slot-scope="scope">
								<p>{{ scope.row.exp.saleTypeName }}</p>
								<p v-if="scope.row.saleType == 2">{{ scope.row.discount }}%</p>
							</template>
				    </el-table-column>
						<el-table-column
							label="状态"
							width="70">
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
			<div class="text-right m-t-sm clearfix">
				<div class="pull-left">
					<auth perm="weixin.price.list.update">
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
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import helpers from '@/utils/helpers/base'
	import vBanner from '../banner.vue'
  import product from "@/utils/mixins/product_detail";

	export default {
    mixins: [product],
		components: {
			vBanner
		},
		data: function() {
			return {
			  loading:true,
				page:1,
				tableData: {
					businessId: '',
					typeId: '',
					keywords : '',
					list : [],
					expList: [],	//扩展内容
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0,
						page: 1,
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
				cityInfo:{}
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
		  this.init()
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
          this.tableData.typeId = data.typeId || '';
          this.tableData.keywords = data.keywords || '';
				}
			},
      updateUrl(page = 1, removeTypeId) {
   			if(removeTypeId)  this.tableData.typeId = '';
        this.$router.push({
          path: '/weixin/price/list',
					query: {
            page: page,
            businessId: this.tableData.businessId || '',
            typeId: this.tableData.typeId || '',
            keywords: this.tableData.keywords || ''
					}
        });
			},
			init (){
				this.$store.dispatch('post', {
					uri : 'mercCity/info',
					data: {}
				}).then((res) => {
          this.cityInfo = res.data.data
        })
			},
      list (page){

        if (page) this.page = parseInt(page || 1);
        let startRow = (this.page - 1) * this.tableData.pagination.size;

				this.loading = true
        var _this = this
        this.$store.dispatch('getList', {
          uri: 'productInfo/cityList',
          data: {
            startRow: startRow,
            pageSize: this.tableData.pagination.size,
            businessId: this.tableData.businessId || '',
						typeId: this.tableData.typeId || '',
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
          });
          this.getProductTypeTotalList();
          this.tableData.list = list
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
					uri: 'productInfo/cityTypeTotal',
					data: {
            businessId:this.tableData.businessId || ''
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
		padding-left: 20px;
		line-height: 40px;
	}
	.table-right ul li.is-active,
	.table-right ul li:hover {
		background-color: #f8f8f8;
	}
</style>