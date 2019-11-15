<template>
	<div v-loading="loading">
		<div >
			<ul class="uk-search">
				<li class="uk-search-item">
					<storeSelect v-model="tableData.storeId"></storeSelect>
				</li>
				<li class="uk-search-item">
					<factorySelect v-model="tableData.factoryId"></factorySelect>
				</li>
				<li class="uk-search-item">
					<div class="uk-search-label">角色：</div>
					<el-select class="thumb-xl" v-if="roleList && roleList.length > 0"  v-model="tableData.roleId" placeholder="请选择角色" clearable filterable>
						<el-option
							 v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</li>
				<li class="uk-search-item">
					<div class="uk-search-label">RFID工卡：</div>
						<el-select class="thumb-xl"  v-if="bindingList && bindingList.length > 0"  v-model="tableData.isBinding" placeholder="请选择" clearable filterable>
							<el-option
								 v-for="item in bindingList" :key="item.val" :label="item.text" :value="item.val">
							</el-option>
						</el-select>
				</li>
				<li class="uk-search-item">
					<div class="uk-search-label">关键字：</div>
					<el-input placeholder="请输入姓名、手机号、工号" prefix-icon="el-icon-search" v-model="tableData.keywords" @keyup.enter.native="search" class="ukao-el-input .el-input">
					</el-input>
				</li>
				<li class="uk-search-item">
					<el-button type="primary" @click="search()">筛选</el-button>
				</li>
			</ul>

			<auth perm="worker.list.update">
				<router-link to="/worker/new">
					<el-button class="pull-right" type="primary"><i class="el-icon-plus m-r-xs"></i>新建员工</el-button>
				</router-link>
			</auth>
		</div>

		<div class="m-t-lg">
			<el-table class="ukao-el-table"
		    ref="multipleTable"
		    :data="tableData.list"
		    tooltip-effect="dark"
		    style="width: 100%">
		    <el-table-column
		      label="头像"
		      width="76">
		      <template slot-scope="scope">
	      		<img class="thumb-sm"  :src="scope.row.imgPath || '/static/img/work/def.png' " alt="">
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="员工名称">
		      <template slot-scope="scope">
		      	<div><router-link :to="'detail/'+scope.row.id" class="text-primary">{{ scope.row.name }}</router-link></div>
		      	<div><router-link :to="'detail/'+scope.row.id" class="text-primary">{{ scope.row.phone }}</router-link></div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="角色">
		      <template slot-scope="scope">{{ scope.row.roleName }}
		      	<template v-if="scope.row.wapExtend">
						-兼<template v-if="scope.row.roleId == 3">店员</template>
						<template v-else>取送员</template>
						</template>
						<span class="text-danger" v-if="(scope.row.roleId == 3 || scope.row.wapExtend) && !scope.row.isRest">-休息中</span>
					</template>
		    </el-table-column>
				<el-table-column
		      label="登录账号">
		      <template slot-scope="scope">{{ scope.row.workAccount || '-' }}</template>
		    </el-table-column>
		    <el-table-column
		      label="工号">
		      <template slot-scope="scope">{{ scope.row.code }}</template>
		    </el-table-column>
		    <el-table-column
		      label="所属门店">
		      <template slot-scope="scope" >
						<p>
							{{ scope.row.workStore || '-'}}
						</p>
					</template>
		    </el-table-column>

				<el-table-column label="所属中转站" prop="workTransfer"></el-table-column>
				
				<el-table-column
		      label="所属工厂">
		      <template slot-scope="scope" >
						<p>
							{{ scope.row.workFactory || '-' }}
						</p>
					</template>
		    </el-table-column>
				<el-table-column
		      label="RFID工卡">
		      <template slot-scope="scope" >
						<div v-if="scope.row.isBinding == 1"> 已绑定 </div>
						<div v-else class="text-muted"> 未绑定 </div>
					</template>
		    </el-table-column>

				<el-table-column
					label="创建时间">
					<template slot-scope="scope">
						<div>{{ scope.row.createTime | getDate }}</div>
						<div>{{ scope.row.createTime | getTime }}</div>
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

			<div class="m-t-sm text-right">
				<el-pagination
		      :page-size="tableData.pagination.size"
		      :current-page.sync="tableData.pagination.current"
		      layout="total, prev, pager, next"
		      :total="tableData.pagination.total" @current-change="handleCurrentChange">
		    </el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import time from '@/utils/helpers/timeLite'
	import md5 from '@/utils/md5'
	import auth from '@/utils/auth'
	import validate from '@/utils/helpers/validate'
	import Uploader from '@/components/Uploader'
	import keyval from '@/utils/dickeyval'
	import storeSelect from '@/components/DropDownList/store'
	import factorySelect from '@/components/DropDownList/factory'

	export default {
		components: {
			Uploader,storeSelect, factorySelect
		},
		data() {
			return {
				loading: true,
				tableData: {
					isBinding: '',
					roleId: '',
					storeId: '',
					factoryId: '',
					keywords : '',
					pageStart: 0,
					list : [],
					pagination : {
						current: 1,
						size: consts.PAGE_SIZE,
						total: 0,
						roleId:''
					}
				},
				bindingList:keyval['BINDING_TYPE'],
				roleList:[],
				storeInfoList: [],	//门店
				factoryInfoList: [],	//工厂
				roleList: [],	//角色
        dialogVisible: false,
        ruleForm: {
          name: '',
          phone: '',
					password: '',
					pwd: '',
					roleType: '',
					roleId: '',
					storeId: '',
					factoryId: '',
					imgPath: '',
        },
			}
		},
		created () {
			this.init();
    	this.getRoleList()
		},
		watch : {		//监听选择改变
			'$route'(){
				this.init();
			}
		},
		methods: {
			search (page = 1){
				this.$router.push({
					path:'/worker/list',
					query:{
						current: page,
						isBinding: this.tableData.isBinding || '',
						roleId: this.tableData.roleId || '',
						storeId: this.tableData.storeId || '',
						factoryId: this.tableData.factoryId || '',
						keywords: this.tableData.keywords || ''
					}
				})
			},
			init(){
				let data = this.$route.query;
				if(JSON.stringify(data) !== '{}'){
					this.tableData.isBinding = data.isBinding || "";
					this.tableData.roleId = data.roleId || "";
					this.tableData.keywords = data.keywords || "";
					this.tableData.storeId = parseInt(data.storeId) || '';
					this.tableData.factoryId = parseInt(data.factoryId) || '';
					this.tableData.pagination.current = parseInt(data.current) || 1;
				}
				this.list();
			},
			list (){
				this.loading = true
				let start = (this.tableData.pagination.current -1) *this.tableData.pagination.size;
				this.$store.dispatch('getList', {
					uri : 'workerInfo/list',
					params: {
						startRow: start,
						pageSize: this.tableData.pagination.size,
						isBinding: this.tableData.isBinding || '',
						roleId: this.tableData.roleId || '',
						storeId: this.tableData.storeId || '',
						factoryId: this.tableData.factoryId || '',
						keywords: this.tableData.keywords || ''
					}
				}).then((res) =>{
					this.tableData.list = res.data.data.list || []
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false
				})
			},
			getRoleList (){
				this.$store.dispatch('getList', {
					uri : 'wkRole/queryForSelect',
				}).then((res) =>{
					let list = res.data.data.list || []
					this.roleList = list
				})
			},
			handleCurrentChange (val){
				this.search(val)
			},
		}
	}
</script>
<style scoped>
	.filter-list li {
		float: left;
		width: 320px;
		margin-right: 30px;
		margin-bottom: 10px;
	}
</style>