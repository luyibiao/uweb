<template>
	<div>
		<div>
			<v-tab-nav v-bind:tab-nav-list="tabsNavList"></v-tab-nav>
		</div>
		<div class="m-t-lg">
			<el-row class="bg-message">
			  <el-col :span="6">
			  	<div class="text-center wrapper m-t m-b b-r-dashed">
						<p class="m-b-sm text-primary">0</p>
						<p>待接待的客户</p>
			  	</div>
			  </el-col>
			  <el-col :span="6">
			  	<div class="text-center wrapper m-t m-b b-r-dashed">
						<p class="m-b-sm text-primary">0</p>
						<p>我接待的客户</p>
			  	</div>
			  </el-col>
			  <el-col :span="6">
			  	<div class="text-center wrapper m-t m-b b-r-dashed">
						<p class="m-b-sm text-primary">0</p>
						<p>我的客户</p>
			  	</div>
			  </el-col>
			  <el-col :span="6">
			  	<div class="text-center wrapper m-t m-b">
						<p class="m-b-sm">0</p>
						<p>我未回复的客户</p>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table"
		    :data="tableData"
		    style="width: 100%">
		    <el-table-column
		    	label="会员">
		      <template slot-scope="scope">
		      	<img class="thumb" v-bind:src="scope.row.img" alt="">
		        <a class="v-top m-l-sm text-primary">{{ scope.row.name }}</a>
		      </template>
		    </el-table-column>
		    <el-table-column
		    	label="信息">
		      <template slot-scope="scope">
		        <p>{{ scope.row.name }}</p>
		        <el-button type="text">快速回复</el-button>
		      </template>
		    </el-table-column>
		    <el-table-column
		    	label="时间">
		      <template slot-scope="scope">
		        <p>{{ scope.row.date }}</p>
		        <p>{{ scope.row.day }}</p>
		      </template>
		    </el-table-column>
		    <el-table-column
		    	label="操作">
		      <template slot-scope="scope">
		        <el-button>操作</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="text-right m-t-sm">
		  	<el-pagination
		      :page-size="100"
		      layout="total, prev, pager, next"
		      :total="1000">
		    </el-pagination>
		  </div>
		</div>
	</div>
</template>

<script>
	import vTabNav from '../Common/tab_nav.vue';
	export default {
		components: {
			vTabNav
		},
		data: function() {
			return {
				tabsNavList: [
					{ text: '我的所有信息' },
					{ text: '未读消息' },
					{ text: '未回复' },
					{ text: '有备注' }
				],
				tableData: [
//					{
//	        	img: '/static/img/avatar.jpg',
//	        	name: '张三',
//	        	type: '洗衣',
//	        	date: '2017-02-07',
//	        	day: '09:52:31'
//	        },
//	        {
//	        	img: '/static/img/avatar.jpg',
//	        	name: '李四',
//	        	type: '洗衣',
//	        	date: '2017-02-07',
//	        	day: '09:52:31'
//	        }
        ]
			}
		}
	}
</script>

<style scoped>
	.bg-message {
		background-color: #f3f7ff;
	}
	.b-r-dashed {
		border-right: 1px dashed #bababa;
	}
	.m-b-sm {
		font-size: 32px;
	}

</style>