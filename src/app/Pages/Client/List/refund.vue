<template>
	<div class="ukao-pt-md">
		<v-list-top></v-list-top>
		<div class="m-t-lg">
			<v-list-tab-nav v-bind:nav-key="'7'"></v-list-tab-nav>
		</div>

		<div class="m-t-lg">
			<el-table class="ukao-el-table ukao-v-loading"
				v-loading="loading"
		    :data="tableData.list"
		    tooltip-effect="dark"
		    style="width: 100%">
		    <el-table-column
		      label="退卡时间">
		      <template slot-scope="scope">
		      	<span>{{ scope.row.info.createTime | getDate}}</span>
		      	<span>{{ scope.row.info.createTime | getTime}}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="会员卡号">
		      <template slot-scope="scope">
		      	<span>{{ scope.row.info.cardNo }}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="退卡余额（元）">
		      <template slot-scope="scope">
		      	<span class="text-danger">{{ scope.row.info.amount | amtFormat}}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="会员卡">
		      <template slot-scope="scope">
		      	<span>{{ scope.row.card.name }}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作人">
		      <template slot-scope="scope">
		      	<span>{{ scope.row.opr.name }}</span>
		      </template>
		    </el-table-column>
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
	import vListTop from '@/app/Pages/Client/List/listtop';
	import vListTabNav from '@/app/Pages/Client/List/listtabnav';
  import consts from '@/utils/consts'
  import time from '@/utils/helpers/timeLite'
	export default {
		components: {
			vListTop, vListTabNav
		},
		data: function() {
			return {
        loading: true,
        page: 1,
        tableData: {
          list : [],
          pagination : {
            size: consts.PAGE_SIZE,
            total: 0
          }
        }
			}
		},
    filters : {
      getDate(value) {
        return time.getDate(value);
      },
      getTime(value) {
        return time.getTime(value);
      }
    },
    created () {
      this.list();
    },
    methods: {
      handleCurrentChange (val){
        this.list((val-1) * this.tableData.pagination.size)
      },
      list (start) {
        let id = this.$route.params.id;
        this.loading = true;
        let p = start| 0;
        this.page = p + 1;
        this.$store.dispatch('post', {
          uri : 'userCardRefund/list',
          data: {
            userId:id,
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