<template>
<div>
	<div class="clearfix">
		<div class="main">
			<div class="text-right">
				<el-select class="ukao-el-select m-r" v-model="value" clearable placeholder="选择城市">
			    <el-option
			      v-for="item in cityList" :key="item.id"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			 	<el-select class="ukao-el-select m-r" v-model="value2" clearable placeholder="所有经营项目">
			    <el-option
			      v-for="item in options" :key="item.id"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			  <el-input class="ukao-el-input m-r" placeholder="请输入内容"  v-model="input">
			    <el-button slot="append" icon="el-icon-search"></el-button>
			  </el-input>
			  <el-button @click="$router.push('/setting/copy')">去拷贝价格数据</el-button>
			  <router-link to=""><el-button type="primary">新建产品</el-button></router-link>
			</div>
			<div class="m-t-lg table-container">
				<div class="table-right b-a">
			  	<ul class="b-b">
			  		<li v-for="item in categoryList" @click="chooseCategory(item)" :class="{ 'is-active': item.isActive }">
			  			<span v-text="item.name"></span>
			  			(<span v-text="item.num"></span>)
			  		</li>
			  	</ul>
			  </div>
				<div class="table-left">
					<el-table class="ukao-el-table"
				    :data="tableData3"
				    tooltip-effect="dark"
				    style="width: 100%">
				    <el-table-column
				      type="selection"
				      width="55">
				    </el-table-column>
				    <el-table-column
				      label="图片"
				      width="120">
				      <template slot-scope="scope">
				        <img class="thumb" :src="scope.row.img" alt="">
				      </template>
				      
				    </el-table-column>
				    <el-table-column
				      label="产品">
				      <template slot-scope="scope">
				      	<span class="text-primary">{{ scope.row.product }}</span>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="num"
				      label="编号">
				    </el-table-column>
				    <el-table-column
				      prop="belongto"
				      label="所属经营项目">
				    </el-table-column>
				    <el-table-column
				      label="价格">
				      <template slot-scope="scope">
				      	<p v-for="item in scope.row.priceList">{{item.price}}</p>
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="所属产品类别">
				      <template slot-scope="scope">
				      	<el-dropdown @command="handleCommand">
								  <span class="el-dropdown-link">
								    {{scope.row.category}}<i class="el-icon-caret-bottom el-icon--right"></i>
								  </span>
								  <el-dropdown-menu slot="dropdown" >
								    <el-dropdown-item v-for="item in categoryList" :key="item.id" :command="JSON.stringify({pid:scope.row.id, id :item.id })">{{item.name}}</el-dropdown-item>
								  </el-dropdown-menu>
								</el-dropdown>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="initialLetter"
				      label="首字母">
				    </el-table-column>
				    <el-table-column
				      prop="orderNum"
				      label="序号">
				    </el-table-column>
				    <el-table-column
				      prop="discount"
				      label="折扣">
				    </el-table-column>
				    <el-table-column
				      label="状态">
				      <template slot-scope="scope">
					      <el-tooltip v-if="scope.row.state" class="item" effect="dark" content="已启用" placement="right">
						      <i class="t-state t-state-success"></i>
						    </el-tooltip>

						    <el-tooltip v-else class="item" effect="dark" content="未启用" placement="right">
						      <i class="t-state"></i>
						    </el-tooltip>
					    </template>
				    </el-table-column>
				  </el-table>
			  </div>
			</div>
			<div class="text-right m-t-sm">
				<div class="pull-left">
					<el-button type="success" size="small">启用</el-button>
					<el-button type="danger" size="small">停用</el-button>
				</div>
		  	<el-pagination
		      :page-size="100"
		      layout="total, prev, pager, next"
		      :total="1000">
		    </el-pagination>
		  </div>
		</div>
	</div>
</div>
	
</template>

<script>
	export default {
		data: function() {
			return {
				options: [
					{
	          value: '选项1',
	          label: '洗衣'
	        }, {
	          value: '选项2',
	          label: '洗鞋'
	        }, {
	          value: '选项3',
	          label: '家纺'
	        }
        ],
        cityList: [
        	{
	          value: '选项1',
	          label: '长沙'
	        }, {
	          value: '选项2',
	          label: '武汉'
	        }, {
	          value: '选项3',
	          label: '北京'
	        }
        ],
        value: '',
        value2: '',
        input: '',
        selected: '',
        tableData3: [
	        {
	        	id : 101,
	        	img: '/static/img/avatar.jpg',
	          product: '衬衣',
	          num: '001',
	          belongto: '洗衣',
	          priceList: [
	          	{ price: '普洗：￥15.00' }, 
	          	{ price: '单烫：￥6.00' }
	          ],
	          category: '上衣',
	          initialLetter: 'XYZ',
	          orderNum: 1,
	          discount: '会员折扣',
	          state: true
	        },
	        {
	        	id : 102,
	        	img: '/static/img/avatar.jpg',
	          product: '衬衣',
	          num: '002',
	          belongto: '洗鞋',
	          priceList: [
	          	{ price: '普洗：￥15.00' }, 
	          	{ price: '单烫：￥6.00' }
	          ],
	          category: '上衣',
	          initialLetter: 'XYZ',
	          orderNum: 2,
	          discount: '会员折扣',
	          state: false
	        }
        ],
        categoryList: [
      		{ id: 111,name: '上衣', num: 20, isActive: false },
      		{ id: 112,name: '裙装配饰', num: 63, isActive: false },
      		{ id: 113,name: '大衣外套', num: 8, isActive: false },
      		{ id: 114,name: '家纺', num: 19, isActive: false },
      		{ id: 115,name: '皮具护理', num: 20, isActive: false },
      		{ id: 116,name: '爆款', num: 6, isActive: false }
      	],
        multipleSelection: []
			}
		},
		methods: {
			handleCommand: function(data) { 
				var data = JSON.parse(data);
				var pid  = data.pid;
				var id = data.id;
				var tableData3 = this.tableData3 || [];
				var categoryList = this.categoryList || [];
				tableData3.forEach(function(item, index) {
			 		if(item.id == pid){
		 				categoryList.forEach(function(item1, index1){
 							if(item1.id == id){
 								item.category = item1.name;
 								return false;
 							}
		 				});
			 		}
			 });
			},
			chooseCategory: function(selectedItem) {
				this.categoryList.forEach(function(item, index) {
					if(item != selectedItem) {
						item.isActive = false;
					}
				})
				selectedItem.isActive = true;
				console.log(1)
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