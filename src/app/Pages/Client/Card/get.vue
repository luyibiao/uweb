<template>
	<div>
		<div class="text-right">
			<div class="w dis-inline">
		  	<el-input placeholder="请输入会员卡号" v-model="searchKey.searchValue">
			    <el-button slot="append" icon="el-icon-search" @click="searchDate"></el-button>
			  </el-input>
		  </div>
		</div>
	  <div class="m-t-lg">
	  	<el-table class="ukao-el-table ukao-v-loading"
        v-loading="loading"
		    :data="tableData"
		    style="width: 100%">
		    <el-table-column
		      label="领取时间">
		      <template slot-scope="scope">
		        <div>{{ scope.row.info.createTime | getDate }}</div>
            <div>{{ scope.row.info.createTime | getTime}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="会员卡号">
		      <template slot-scope="scope">
		        <div>{{ scope.row.info.cardNo }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="会员">
		      <template slot-scope="scope">
		        <div>{{ scope.row.userInfo.name }}</div>
		        <div class="text-primary">{{ scope.row.userInfo.phone }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="会员卡">
		      <template slot-scope="scope">
		        <div>{{ scope.row.card.name }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作人">
		      <template slot-scope="scope">
		        <div>{{ scope.row.opr ? scope.row.opr.name : '用户' }}</div>
		      </template>
		    </el-table-column>
		  </el-table>
	  </div>
	  <div class="m-t-sm text-right">
			<el-pagination
	      :page-size="pagination.size"
        :current-page.sync="pagination.page"
	      layout="total, prev, pager, next"
        :total="pagination.total" 
				@current-change="updateUrl">
	    </el-pagination>
		</div>
	</div>
</template>

<script>
  import consts from '@/utils/consts'
  import time from '@/utils/helpers/timeLite'

	export default {
		data () {
			return {
        loading: true,
				searchKey: {
          searchValue:''
				},
				tableData:[],
				pagination : {
					size: consts.PAGE_SIZE,
					total: 0,
					page: 1,
				}
			}
		},
		watch: {
			'$route'(){
				this.initParams();
				this.list();
			}
		},
    created () {
			this.initParams();
      this.list();
    },
    methods: {
      searchDate (){
        this.pagination.page > 1 ? (this.pagination.page = 1) : this.updateUrl();
			},
			initParams(){
				let data = this.$route.query;
				if(JSON.stringify(data) != '{}'){
					this.searchKey.searchValue = data.searchValue;
					this.pagination.page = parseInt(data.page) || 1;
				}
			},
			updateUrl(){
				this.$router.push({
					path: this.$route.path,
					query:{
						searchValue: this.searchKey.searchValue,
						page: this.pagination.page
					}
				})
			},
      list () {
        this.loading = true;
        this.$store.dispatch('post', {
          uri : 'userCardObtain/list',
          data: {
            searchValue: this.searchKey.searchValue,
            startRow: (this.pagination.page -1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        }).then((res) =>{
          this.tableData = res.data.data.list || []
          this.pagination.total = res.data.data.total || 0
          this.loading = false;
        })
      }
    }
	}
</script>