<template>
	<div class="ukao-pt-md">
			<v-list-top></v-list-top>
		<div class="m-t-lg clearfix">
			<v-list-tab-nav v-bind:nav-key="'8'"></v-list-tab-nav>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table m-t ukao-v-loading" v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
				<el-table-column
					label="时间">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime | getDate}}</span>
						<span>{{ scope.row.createTime | getTime}}</span>
					</template>
				</el-table-column>
		    <!--<el-table-column-->
		      <!--label="联系方式">-->
		      <!--<template slot-scope="scope">-->
						<!--<div>{{ scope.row.phone }}</div>-->
		      <!--</template>-->
		    <!--</el-table-column>-->
		    <el-table-column
		      label="内容">
		      <template slot-scope="scope">
						<div>{{ scope.row.content }}</div>
		      </template>
		    </el-table-column>
		    <!--<el-table-column-->
		      <!--label="操作">-->
		      <!--<template slot-scope="scope">-->
			      <!--<div></div>-->
		      <!--</template>-->
		    <!--</el-table-column>-->
		  </el-table>
		</div>
		<div class="text-right m-t-sm">
	  	<el-pagination
	      :page-size="tableData.pagination.size"
	      layout="total, prev, pager, next"
	      :total="tableData.pagination.total" @current-change="handleCurrentChange">
	    </el-pagination>
	  </div>

	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import regional from '@/utils/regional'
  import validate from '@/utils/helpers/validate'
	import vListTop from '@/app/Pages/Client/List/listtop';
	import vListTabNav from '@/app/Pages/Client/List/listtabnav';

	export default {
		components: {
			vListTop, vListTabNav
		},
		data: function() {
			return {
				loading: false,
				tableData: {
					list : [],
					pagination : {
					 size: consts.PAGE_SIZE,
					 total: 0
					}
				},
			}
		},
    created () {
      this.list();
    },
		methods: {
		  getUserId: function(){
		    return this.$route.params.id;
      },
      list(start) {
        let id = this.getUserId();
				this.$store.dispatch('post', {
						uri: 'userFeedback/user/list',
						data:{
						  userId:id,
							startRow: start || 0,
							pageSize: this.tableData.pagination.size
						}
				}).then((res) => {
						this.tableData.list = res.data.data.list || [];
						this.tableData.pagination.total = res.data.data.total || 0
						this.loading = false;
				})
			},
			handleCurrentChange (val){
				 this.list((val-1) * this.tableData.pagination.size)
			},
      del(id) {
		    let _this = this;
		    msg.confirm({msg:'确定删除?', confirmFn: ()=>{
          _this.$store.dispatch('post', {
            uri: 'userAddress/delete',
            data: {id}
          }).then((res)=>{
            msg.success();
            _this.list();
          })
        }});
      },
		}

	}
</script>