<template>
	<div class="ukao-pt-md ukao-padder">
		<div class="text-center m-b-xl" v-if="!loading && !scList || scList.length == 0">
			<div class="no-data">暂无拷贝价格数据源对象，去添加<a class="text-primary" href="/store/price">门店产品价格</a>或者<a class="text-primary" href="/weixin/price/list">微信店铺产品价格</a>。</div>
		</div>

		<div class="price-copy-container clearfix" v-loading="loading">
			<div v-if="scList && scList.length > 0">
				<div class="pull-left w-lg m-t-xs">
					<div class="u-select v-middle m-r-lg">
						<div class="u-selected-item" @click="showSelectList = !showSelectList">
							<span>{{selectedText}}</span><i class="u-select-icon el-icon-caret-bottom"></i>
						</div>
						<transition name="fade">
							<div class="u-select-list" v-if="showSelectList">
								<ul>
									<li v-for="(item,index) in scList" :key="index" :class="{'active' : item.active }" @click="chooseSelectItem(item)" >{{item.name}}({{item.typeText}})</li>
								</ul>
							</div>
						</transition>
					</div>
				</div>
				<div class="dis-inline text-center v-middle m-r pull-left w-xs">
					<img class="thumb" src="/static/img/price_copy.jpg" alt="">
					<p class="text-success">拷贝至</p>
				</div>
				<div class="text-left" style="margin-left: 400px;">
					<ul class="sc-selected-list" style="overflow:hidden;">
						<li v-for="(item,index) in scSelectedList" :key="index" v-if="item.selected">
							<div class="item" :title="item.typeText">{{item.name}}<a @click="removeItem(item)">移除</a></div>
						</li>
					</ul>
					<div class="m-t-sm m-b-sm u-add">
						<el-button type="text" @click="onAddList" :disabled="addBtnState"><i class="el-icon-plus m-r-xs"></i>添加</el-button>
						<div v-if="showAddList" class="u-add-list">
							<ul>
								<li v-for="(item,index) in scSelectedList" :key="index">
									<el-checkbox  :checked="item.checked" @change="onBoxChange(item)" :disabled="item.active">{{item.name}}({{item.typeText}})</el-checkbox>
								</li>
							</ul>
							<div class="u-add-btn b-t">
								<el-button size="small" type="success" @click="confirmAdd">确定</el-button>
								<el-button size="small" @click="cancelAdd">取消</el-button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="b-t-dashed m-t-lg m-b-xl"></div>
		<div style="width: 80%; margin: 0 auto;">
			<el-button style="margin-left: 400px" type="primary" :disabled="copyBtnState" @click="dialogVisible=true">开始拷贝</el-button>
		</div>

		<div class="m-t-xl" >
			<p class="text-md m-b-sm">拷贝记录</p>
			<el-table class="ukao-el-table"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.createTime | getDate }}</div>
		        <div>{{ scope.row.createTime | getTime }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="源对象">
		      <template slot-scope="scope">
						<!--<div v-if="scope.row.fromMercName">{{ scope.row.fromMercName }}</div>-->
						<div v-if="scope.row.fromStoreName">{{ scope.row.fromStoreName }}(门店)</div>
						<div v-else-if="scope.row.fromUnionName">{{ scope.row.fromUnionName }}(集团)</div>
						<div v-else>{{ scope.row.fromCityName }}(微信店铺)</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="目标对象">
		      <template slot-scope="scope">
		        <!--<div v-if="scope.row.toMercName">{{ scope.row.toMercName }}</div>-->
						<div v-if="scope.row.toStoreName">{{ scope.row.toStoreName }}(门店)</div>
						<div v-else-if="scope.row.toUnionName">{{ scope.row.toUnionName }}(集团)</div>
						<div v-else>{{ scope.row.toCityName }}(微信店铺)</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作人">
		      <template slot-scope="scope">
		        <div>{{ scope.row.createWorkName }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="状态">
		      <template slot-scope="scope">
		      	<div v-if="scope.row.status===1">成功</div>
		        <div v-else-if="scope.row.status===2">拷贝中</div>
		        <div v-else class="text-muted">失败</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作">
		      <template slot-scope="scope">
		        <div class="text-muted">无产品备份记录</div>
		      </template>
		    </el-table-column>
		  </el-table>
			<div class="m-t-sm text-right">
				<el-pagination
		      :page-size="tableData.pagination.size"
		      :current-page="tableData.pagination.current"
		      layout="total, prev, pager, next"
		      :total="tableData.pagination.total" @current-change="handleCurrentChange">
		    </el-pagination>
			</div>
		</div>
		<div :class="{ 'ukao-mask': showMask}">
			<div style="color: #fff;text-align: center">正在拷贝中....</div>
		</div>

		<el-dialog title="拷贝价格数据" :visible.sync="dialogVisible" right>
			<div class="dia-div">
					<span class="dia-div-span">
						<label class="text-success cong">从 </label>{{selectedText}}
						<div class="dis-inline text-center v-middle m-r w-xs i-l">
							<img class="thumb" src="/static/img/price_copy.jpg" alt="">
							<p class="text-success">拷贝至</p>
						</div>
					</span>
					<div class="dis-inline dia-div-ul">
						<ul>
							<li v-for="item in selectStore" :key="item.id" v-if="item.selected">{{item.name}}({{item.typeText}})</li>
						</ul>
					</div>
			</div>
			<div class="text-t">
				<p class="text-danger">拷贝后将替换为 <strong>{{selectedText}}</strong> 的价格数据，是否拷贝</p>
			</div>
			<div slot="footer" class="dialog-footer fotter-d">
				<el-button @click="dialogVisible=false">取消</el-button>
				<el-button type="primary" @click="productCopy">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import time from '@/utils/helpers/timeLite'

	export default {
		data() {
			return {
				loading: false,
				selectedText: '请选择',
				showSelectList: false,
				dialogVisible:false,
				selectStore:[],
				scList: [], // 要拷贝的智柜列表
				showAddList: false,
				scSelectedList: [  // 拷贝至的智柜列表
				],  // checked表示多选框状态，active表示左侧选中，selected表示选中并显示的sc
				tempObj: {
					toList:[]			//{id:'', type:''}
				},
				addBtnState: true,
				copyBtnState: true,
				tableData: {
					pageStart: 0,
					list : [],
					pagination : {
						current: 0,
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
        productCopyObj:{
          fromId: '',
          fromType:'',      //2城市，3门店，4智柜, 5集团
					toList:''		// [{id:'', type:''}]
        },
				showMask: false
			}
		},
    created(){
      this.queryCityUnionStoreList()
		},
		mounted(){
      this.list(0)
		},
		methods: {
			list(start){
				this.$store.dispatch('getList', {
					uri : 'bakProductPriceVersion/list',
					params: {
						startRow: start || 0,
						pageSize: this.tableData.pagination.size
					}
				}).then((res) =>{
					var list = res.data.data.list || []
					this.tableData.list = list
					this.tableData.pagination.total = res.data.data.total || 0
					this.tableData.pagination.current = 1
				})
			},
			handleCurrentChange (val){
			  this.tableData.pageStart = (val-1) * this.tableData.pagination.size
				this.list(this.tableData.pageStart)
			},
			queryCityUnionStoreList(){
        this.loading = true
				this.$store.dispatch('getList', {
					uri : 'productInfo/cityUnionStoreList',
					params: {}
				}).then((res) =>{
					var fromList = res.data.data.fromList || []
					var toList = res.data.data.toList || []
					this.scList = fromList
					toList.forEach(function (item) {
            item.checked = item.selected = item.active = false
          })
					this.scSelectedList = toList
//					this.showSelectList = toList.length > 0
          this.loading = false
				})
			},
			onAddList(){
				this.showAddList = true
			},
      onBoxChange(item){
				item.checked =  !item.checked
      },
			chooseSelectItem: function(i) {
				var _this = this;
				this.scList.forEach(function(item) {    // 在下拉框选择要拷贝的智柜
					if (item.id !== i.id) {
						item.active = false;
					} else {
						i.active = true;
						_this.selectedText =`${i.name}(${i.typeText})`
						_this.addBtnState = false;
            _this.productCopyObj.fromId = item.fromId;
						_this.productCopyObj.fromType = item.type;
        }
				});

				this.scSelectedList.forEach(function(item) {    // 在拷贝到的智柜列表中排除要拷贝的智柜
					if(item.type === i.type){
						if(item.id == i.fromId){
							item.active = true;
							item.selected = false;
						}else{
							item.active = false;
							item.selected = item.checked
						}
					}else{
						item.active = false;
						item.selected = item.checked
					}
				});
				setTimeout(function(){
					_this.showSelectList = false;
				}, 50)
			},
			removeItem(i) {  // 移除选中
        this.scSelectedList.forEach(function(item) {    // 在拷贝到的智柜列表中排除要拷贝的智柜
            if (item.id === i.id) {
              item.selected = false;
							item.checked = false;
              return false;
            }
					});
				
			},
			confirmAdd() {  // 确认添加
        var _this = this;
        _this.scSelectedList.forEach(function(item) {
					item.selected = item.checked && !item.active
          if(item.selected){
					  return false
          }
				})
				_this.selectStore=[..._this.scSelectedList];
        _this.showAddList = false;
			},
			cancelAdd() {  // 取消添加
				this.showAddList = false;
			},
      productCopy(){
				var _this = this;
        _this.tempObj.toList.length = 0
        this.scSelectedList.forEach(function(item) {
          if(item.selected) {
            _this.tempObj.toList.push({id: item.id, type: item.type})
          }
        });

				_this.showMask = true
				_this.productCopyObj.toList = JSON.stringify(_this.tempObj.toList)
//				console.log(_this.productCopyObj);
//				return ;
				_this.$store.dispatch('post', {
          uri : 'bakProductPriceVersion/productCopyBatch',
          forceResolve: true,
          data: _this.productCopyObj
        }).then((res) =>{
          if(res && res.data.httpCode == 200) {
						msg.success();
						_this.dialogVisible=false
          }else {
            msg.error(res.data.msg || consts.ERROR_MSG)
          }
					_this.showMask = false
					_this.list(0)
					this.resetData()
        })
      },
			resetData(){
				var _this = this;
				_this.productCopyObj.toList = []
				_this.scSelectedList.forEach(function (item) {
					item.selected = false
					item.checked = false
        })
			}
		},
		updated() {
			var count = 0;
			// 控制copyBtnState和copyBtnState按钮的状态
			this.scSelectedList.forEach(function(item) {
				if(item.selected) {
					count++;
				}
			})
			if(!this.addBtnState && count) {
				this.copyBtnState = false;
			} else {
				this.copyBtnState = true;
			}
		}
	}
</script>

<style scoped>
	.no-data {
		background: #f3f7ff;
		display: inline-block;
		width: 40%;
		min-width: 360px;
		padding: 20px 0;
		border-radius: 10px;
	}

	.u-select {
		position: relative;
		display: inline-block;
		min-width: 240px;
	}
	.u-selected-item {
		padding: 8px 30px 8px 10px;
		border: 1px solid #3d97ee;
		background: #cde8fb;
		border-radius: 6px;
		position: relative;
		/*overflow: hidden;*/
	}
	.u-select-icon {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
	}
	.u-select-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 42px;
    z-index: 1001;
    border: 1px solid #d1dbe5;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);
    box-sizing: border-box;
    margin: 5px 0;
    overflow: hidden;
    transform-origin: 0% 0% 0;
	}
	.u-select-list ul {
		padding: 6px 0;
		max-height: 300px;
		overflow-y: auto;
		box-sizing: border-box;
	}
	.u-select-list ul li {
		padding: 8px 10px;
		line-height: 20px;
		white-space: nowrap;
	}
	.u-select-list ul li:hover {
		background: #e4e8f1;
	}
	.u-select-list ul li.active {
		background: #20a0ff;
		color: #fff;
	}
	.u-select-list ul li.active:hover {
		background: #1c8de0;
	}

	.sc-selected-list li {
		float: left;
		padding-right: 50px;
		margin-bottom: 15px;
	}
	.sc-selected-list .item {
		position: relative;
		padding: 8px 20px;
		line-height: 20px;
		background: #fceeee;
		border: 1px solid #f64643;
		border-radius: 6px;
	}
	.sc-selected-list li .item > a {
		display: none;
		position: absolute;
		top: 0;
		right: -34px;
		color: #f56866;
	}
	.sc-selected-list li:hover .item > a {
		display: block;
	}

	.u-add {
		position: relative;
	}
	.u-add-list {
		position: absolute;
		left: 0;
		top: 42px;
    z-index: 1001;
    border: 1px solid #d1dbe5;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);
    box-sizing: border-box;
    margin: 5px 0;
    overflow: hidden;
    transform-origin: 0% 0% 0;
    padding-bottom: 50px;
	}
	.u-add-list .u-add-btn {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px 10px;
	}
	.u-add-list ul {
		min-width: 240px;
		padding: 6px 0;
		max-height: 300px;
		overflow-y: auto;
		box-sizing: border-box;
	}
	.u-add-list ul li {
		padding: 8px 10px;
		line-height: 20px;
		white-space: nowrap;
	}
	.price-copy-container {
		width: 80%;
		margin: 0 auto;
	}

	.fade-enter-active  {
	  transition: transform .2s;
	}
	.fade-leave-active {
		transform: scaleY(0);
		transition: transform .2s;
	}
	.fade-enter {
		transform: scaleY(0);
	}
	.b-t-dashed {
		border-top: 1px dashed #d9d9d9;;
	}
	.dia-div{
		position: relative;
		width: 80%;
		margin: 0 auto;
		min-height: 75px;
		/* text-align: right; */
	}
	.dia-div-span{
		position: absolute;
		top: 0;
		left: 0;
	}
	.dia-div-ul{
		margin-left: 280px;
	}
	.i-l{
		margin-left: 30px;
	}
	.text-t{
		width: 80%;
		margin: 20px auto 30px;
	}
	.cong{
		margin-right:7px; 
		font-size: 14px;
	}
</style>