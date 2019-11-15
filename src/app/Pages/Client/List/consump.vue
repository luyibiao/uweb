<template>
	<div class="ukao-pt-md">
		<v-list-top></v-list-top>
		<div class="m-t-lg">
			<v-list-tab-nav v-bind:nav-key="'3'"></v-list-tab-nav>
		</div>
		<div class="m-t-lg">
      <el-table class="ukao-el-table ukao-v-loading"
        v-loading="loading"
		    :data="tableData.list"
		    tooltip-effect="dark"
		    style="width: 100%">
		    <el-table-column
		      label="支付时间">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.tradeTime | getDate}}</div>
		      	<div>{{ scope.row.tradeTime | getTime}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="下单渠道">
          <template slot-scope="scope">
            {{ scope.row.orderOriginText }}
          </template>
		    </el-table-column>
		    <el-table-column
		      label="订单号 | 支付流水号">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.orderNo }}</div>
		      	<div>{{ scope.row.seq }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="门店 | 智柜">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.storeName}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="金额（元）">
		      <template slot-scope="scope">
		      	<div class="text-success">+ {{ scope.row.amount | amtFormat}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="支付方式">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.payMethodText }}<template v-if="scope.row.agentPay==1"> - 代销</template></div>
		      </template>
		    </el-table-column>
				<el-table-column
		      label="备注">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.remark }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="状态">
		      <template slot-scope="scope">
		      	<div :class="scope.row.status == -1?'text-muted':''">{{scope.row.status | getValText('PAY_STATUS')}}</div>
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
          uri : 'tradeOrder/list',
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