<template>
	<div class="ukao-pt-lg">
		<el-table class="ukao-el-table m-t ukao-v-loading"
	    :data="tableData.list"
	    style="width: 100%">
	    <el-table-column
	      label="类型">
        <template slot-scope="scope">
          {{scope.row.tradeType | getValText('TRADE_TYPE')}}
				</template>
	    </el-table-column>
	    <el-table-column
	      label="流水号"
	      prop="seq">
	    </el-table-column>
	    <el-table-column
	      label="金额（元）">
        <template slot-scope="scope">
          {{scope.row.amount | amtFormat}}
				</template>
	    </el-table-column>
	    <el-table-column
	      label="交易发生时间">
	      <template slot-scope="scope">
          <div>{{ scope.row.createTime | getDate}}</div>
          <div>{{ scope.row.createTime | getTime}}</div>
	      </template>
	    </el-table-column>
	    <!--<el-table-column-->
	      <!--label="说明">-->
	      <!--<template slot-scope="scope">-->
	        <!--<div>{{ scope.row.remark }}</div>-->
	      <!--</template>-->
	    <!--</el-table-column>-->
    </el-table>
    <div class="text-right m-t-sm clearfix">
      <el-pagination
        :page-size="tableData.pagination.size"
        layout="total, prev, pager, next"
        :total="tableData.pagination.total"
        :current-page.sync="tableData.pagination.page"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
	</div>
</template>

<script>

  import consts from '@/utils/consts'

	export default {
		data: function() {
			return {
        tableData: {
          list: [],
          pagination: {
            size: consts.PAGE_SIZE,
            total: 0,
            page:1,
          }
        }
			}
		},
    created() {
      this.initParams();
      this.list();
    },
    methods: {
      handleCurrentChange (val){
        this.updateUrl(val)
      },
      // 初始化参数
      initParams(){
        let data = this.$route.query;
        if(JSON.stringify(data) !== '{}'){
          this.tableData.pagination.page = parseInt(data.page || 1);
        }
      },
      // 更新url
      updateUrl(page = 1){
        this.$router.push({
          path: this.$route.path,
          query:{
            page: page
          }
        })
      },
      list(page) {
        this.loading = true;
        if (page) this.tableData.pagination.page = parseInt(page || 1);
        this.$store.dispatch('post', {
          uri: 'tradeFreeze/merc/list',
          data: {
            startRow: (this.tableData.pagination.page - 1) * this.tableData.pagination.size,
            pageSize: this.tableData.pagination.size
          }
        }).then((res) => {
          this.tableData.list = res.data.data.list || [];
          this.tableData.pagination.total = res.data.data.total || 0;
          this.loading = false;
        });
      }
    }
	}
</script>

<style scoped>
	
</style>