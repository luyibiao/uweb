<template>
	<div >
		<div>
			<div class="pull-right">
				<ul class="filter-list clearfix">
					<li>
						<div class="ukao-form">
							<div class="ukao-form_label">
								关键字
							</div>
							<div class="ukao-form_content">
								<el-input class="ukao-el-input m-r" placeholder="请输入编号、名称" v-model="tableData.keyword" >
									<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
								</el-input>
							</div>
						</div>
					</li>
				</ul>
			</div>
		  <v-tab-nav v-bind:tab-nav-list="tabsNavList" v-bind:onClick="onClickTab"></v-tab-nav>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table"
	    :data="tableData.list"
	    style="width: 100%">
	    <el-table-column  label="智柜名称 | 编号 ">
	      <template slot-scope="scope">
					<div>
	        	<a class="text-primary" :href="'/cabinet/overall/'+scope.row.id">{{ scope.row.name }}</a>
					</div>
					<div>
	        	<a class="text-primary" :href="'/cabinet/overall/'+scope.row.id">{{ scope.row.code }}</a>
					</div>
	      </template>
	   		</el-table-column>
				<el-table-column  label="下单 | 回柜 | 异常">
				<template slot-scope="scope">
					<div>{{ scope.row.send }} / {{ scope.row.back }} / <span class="text-danger">{{ scope.row.danger }}</span></div>
				</template>
			</el-table-column>
	    <el-table-column  label="横 | 竖空箱">
				<template slot-scope="scope">
					<div>{{scope.row.hempty}} / {{scope.row.sempty}}</div>
				</template>
	    </el-table-column>

				<el-table-column  label="满箱 | 预警">
					<template slot-scope="scope">
						<div>
							<span v-if="scope.row.rate <= scope.row.remindRate" class="text-success">{{scope.row.rate}}%</span>
							<span v-else class="text-danger">{{scope.row.rate}}%</span>
							/ <template v-if="scope.row.remindRate">{{scope.row.remindRate}}%</template><template v-else>-</template>
						</div>
					</template>
				</el-table-column>

			<el-table-column label="分组 | 箱格">
				<template slot-scope="scope">
					<div>{{scope.row.groupCount || 0}} / {{scope.row.boxCount || 0}}</div>
				</template>
	    </el-table-column>
	    <el-table-column label="运行状态">
	      <template slot-scope="scope">
	        <div v-if="scope.row.runningState == -1" class="text-danger">异常</div>
	        <div v-if="scope.row.runningState == 0" class="text-success">重启中</div>
	        <div v-if="scope.row.runningState == 1" class="text-success">正常</div>
	      </template>
	    </el-table-column>

			<el-table-column  label="地址 | 坐标">
	      <template slot-scope="scope">
	        <div>{{scope.row.province}}{{scope.row.city}}{{scope.row.district}}{{scope.row.details}} </div>
	        <div >{{scope.row.longitude}},{{scope.row.latitude}}</div>
	      </template>
	    </el-table-column>
	  </el-table>
			<div class="text-right m-t-sm">
				<el-pagination class="pull-right"
					:page-size="tableData.pagination.size"
					layout="total, prev, pager, next"
					:total="tableData.pagination.total"
					:current-page.sync = "tableData.pagination.page"
							 @current-change="handleCurrentChange" >
				</el-pagination>
	    </div>
		</div>
	</div>
</template>

<script>
	import vTabNav from '../../Common/tab_nav.vue'
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'

	export default {
		components: {
			vTabNav
		},
		data: function() {
			return {
				tabsNavList: [
					{ val:'', text: '全部' },
					{ val:'1', text: '正常' },
					{ val:'-1', text: '异常' },
					{ val:'0', text: '重启中' }
				],
				tableData: {
					list: [],
					keyword:'',
					runningState:'',
					pagination: {
						size: consts.PAGE_SIZE,
						total: 0,
						page:1,
					}
				},
			}
		},
		created () {
			this.list(0)
    },
		methods: {
			search(){
				this.list(0)
			},
		  list(start){
				this.loading = true;
				this.$store.dispatch('post', {
					uri : 'cupboardInfo/list',
					data: {
						startRow: start|| 0,
						searchValue: this.tableData.keyword,
						runningState: this.tableData.runningState,
						pageSize: this.tableData.pagination.size,
					}
				}).then((res) =>{
					this.tableData.list = res.data.data.list || []
					this.tableData.pagination.total = res.data.data.total || 0
					this.loading = false;
				})
			},
			handleCurrentChange (val){
				this.list((val-1) * this.tableData.pagination.size)
			},
			onClickTab(item){
				this.tableData.runningState = item.val
				this.search()
			}
		}
	}
</script>