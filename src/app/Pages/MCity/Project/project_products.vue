<template>
	<div class="clearfix ukao-v-loading" v-loading="loading">
		<div class="main" >
			<div class="text-right clearfix">
				<el-breadcrumb class="pull-left link-back" separator="/">
					<el-breadcrumb-item :to="'/mcity/project/'+cityInfo.id"><i class="el-icon-arrow-left icon-smaller"></i>经营项目</el-breadcrumb-item>
				<el-breadcrumb-item :to="'/mcity/project/detail/'+cityInfo.id+'/'+mercBusiness.id">{{mercBusiness.name}}</el-breadcrumb-item>
					<el-breadcrumb-item>服务产品</el-breadcrumb-item>
				</el-breadcrumb>

				<div class="w dis-inline m-l m-r-lg">
				<el-input placeholder="请输入内容" v-model="tableData.keywords" @keyup.enter.native="search">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
			  </el-input>
		  </div>
			  <span class="m-r-sm"><el-button>去拷贝价格数据</el-button></span>
			  <router-link :to="'/mcity/project/newproducts/'+cityInfo.id+'/'+mercBusiness.id"><el-button type="primary">新建产品</el-button></router-link>
			</div>
			<div class="m-t-lg table-container">
				<div class="table-right b-a">
			  	<ul class="b-b">
			  		<li v-for="item in productTypeTotalList" @click="chooseCategory(item)" :class="{ 'is-active': item.typeId == tableData.typeId }">
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
				      width="120">
				      <template slot-scope="scope">
				        <img class="thumb" :src="scope.row.imgPath || '/static/img/product/def.png'" alt="">
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="名称" >
								<template slot-scope="scope">
									<span class="text-primary">
										<router-link :to="'/mcity/project/products/info/'+cityInfo.id+'/'+mercBusiness.id+'/'+scope.row.id">
											{{scope.row.name}}
										</router-link>
									</span>
								</template>
				    </el-table-column>
				    <el-table-column
				      label="编号" prop="code">
				    </el-table-column>
				    <el-table-column
				      label="所属经营项目" >
							<template slot-scope="scope">
								<div v-if="scope.row.exp">
									<p v-text="scope.row.exp.mercBusinessName"></p>
									<p v-if="scope.row.exp.mercBusinessName != scope.row.exp.businessName">
										（{{scope.row.exp.businessName}}）
									</p>
								</div>
							</template>
				    </el-table-column>
				    <el-table-column
				      label="价格">
				      <template slot-scope="scope">
				      	<p v-for="item in scope.row.serviceList" v-if="scope.row.serviceList">
									<span>{{item.serviceName}}</span>:
									<span>{{item.price /100 | numFormat}}</span>
									<span>{{scope.row.exp.unit}}</span>
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
				      prop="sortNo" label="序号">
				    </el-table-column>
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
					<el-button size="small" :disabled="btn.enable" type="success" @click="updateStatusEnable">启用</el-button>
					<el-button size="small" :disabled="btn.disable" type="danger" @click="updateStatusDisable">停用</el-button>
					<el-button size="small" :disabled="btn.delete" type="danger" @click="updateStatusDelete">删除</el-button>
				</div>
		  	<el-pagination
		      :page-size="tableData.pagination.size"
		      layout="total, prev, pager, next"
		      :total="tableData.pagination.total"
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

	export default {
		data: function() {
			return {
			  loading:true,
				cityInfo: {
			    id: this.$route.params.cityId,
				},
				mercBusiness: {
					id: this.$route.params.id,
					name: ''
				},
				tableData: {
					businessId: '',
					typeId: '',
					keywords : '',
					pageStart: 0,
					list : [],
					expList: [],	//扩展内容
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
				multipleSelection: [],	//多选列表
				btn: {		//操作btn
					enable: true,		//启用
					disable: true,	//停用
					delete: true		//删除
				},
				productTypeTotalList: [],		//所属产品类别合计
				saleTypeList:[],	//折扣
				unitList:[]		//单位
			}
		},
		created () {
		  var _this = this
			_this.info(function () {
				_this.list(0)
				_this.getProductTypeTotalList()
      })
    },
		watch :{		//监听选择改变
			'multipleSelection' () {
				let bl = !(this.multipleSelection && this.multipleSelection.length > 0)
				this.btn = {
					enable: bl,
					disable: bl,
					delete: bl
				}
			}
		},
		filters: {  //数据过滤器
			numFormat:function(value){
			  return helpers.numFormat({value, fixed:2})
			}
		},
		methods: {
		  info (fn){
				this.$store.dispatch('batch', {
					uri: 'mercBusiness/detail',
					data: {
						id: this.mercBusiness.id
					}
				}).then((res) => {
				  let mercBusiness = res.data.data
				  this.mercBusiness = mercBusiness
					this.tableData.businessId = mercBusiness.businessId
					if(typeof (fn) === 'function'){
				    fn()
					}
    		})
			},
      list (start){
        var _this = this
				if(!_this.tableData.businessId) {
          return
        }
				this.$store.dispatch('getList', {
					uri: 'productInfo/cityList',
					data: {
						startRow: start || 0,
						pageSize: this.tableData.pagination.size,
						businessId: this.mercBusiness.businessId || '',
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
							if (sitem.info.id == item.id) {
								item.serviceList = sitem.serviceRelExp || []
								return false
							}
						})
					})
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
      },
      search (){
        this.list(0);
      },
			chooseCategory (item){
				this.tableData.typeId = item.typeId || ''
				this.search()
			},
			getProductTypeTotalList (fn){
				if(!this.tableData.businessId) {
          return
        }
				this.$store.dispatch('getList', {
					uri: 'productInfo/cityTypeTotal',
					data: {
						businessId: this.mercBusiness.businessId,
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
          this.list(this.tableData.pageStart)
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
          this.list(this.tableData.pageStart)
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
							_this.list(_this.tableData.pageStart)
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
			  this.tableData.pageStart = (val-1) * this.tableData.pagination.size
			  this.list(this.tableData.pageStart)
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