<template>
	<div>
		<div class="text-right">
			<div class="w dis-inline">
		  	<el-input placeholder="请输入会员卡号" v-model="searchKey.searchValue">
			    <el-button slot="append" icon="el-icon-search" @click="list"></el-button>
			  </el-input>
		  </div>
		</div>
	  <div class="m-t-lg">
	  	<el-table class="ukao-el-table ukao-v-loading"
				v-loading="loading"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="退卡时间">
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
		      label="退卡金额">
		      <template slot-scope="scope">
		        <div>{{ scope.row.info.amount | amtFormat}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作人">
		      <template slot-scope="scope">
		        <div>{{ scope.row.opr.name }}</div>
		      </template>
		    </el-table-column>
		  </el-table>
	  </div>
	  <div class="m-t-sm text-right">
			<el-pagination
	      :page-size="tableData.pagination.size"
        :current-page="page"
	      layout="total, prev, pager, next"
	      :total="tableData.pagination.total" @current-change="handleCurrentChange">
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
        page: 1,
        searchKey: {
          searchValue:''
        },
        tableData: {
          list : [],
          pagination : {
            size: consts.PAGE_SIZE,
            total: 0
          }
        }
			}
		},
    created () {
      this.list();
    },
    filters : {
      getDate(value) {
        return time.getDate(value);
      },
      getTime(value) {
        return time.getTime(value);
      }
    },
    methods: {
      handleCurrentChange (val){
        this.list((val-1) * this.tableData.pagination.size)
      },
      list (start) {
        this.loading = true;
        let p = start| 0;
        this.page = p + 1;
        this.$store.dispatch('post', {
          uri : 'userCardRefund/list',
          data: {
            searchValue: this.searchKey.searchValue,
            startRow: p,
            pageSize: this.tableData.pagination.size
          }
        }).then((res) =>{
          this.tableData.list = res.data.data.list || []
          this.tableData.pagination.total = res.data.data.total || 0
          this.loading = false;
        })
      }
    }
	}
</script>