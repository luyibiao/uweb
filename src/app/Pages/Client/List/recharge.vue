<template>
	<div class="ukao-pt-md">
		<v-list-top></v-list-top>
		<div class="m-t-lg">
			<v-list-tab-nav v-bind:nav-key="'4'"></v-list-tab-nav>
		</div>
		<div class="m-t-lg"  v-loading="loading">
			<el-table class="ukao-el-table"
		    :data="tableData.list"
		    tooltip-effect="dark"
		    style="width: 100%">
		    <el-table-column
		      label="充值时间">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.tradeTime | getDate }}</div>
		      	<div>{{ scope.row.tradeTime | getTime}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="paySceneText"
		      label="充值渠道">
		    </el-table-column>
		    <el-table-column
		      label="支付方式|支付流水号">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.payMethodText }}<template v-if="scope.row.agentPay==1"> - 代销</template></div>
		      	<div>{{ scope.row.seq }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="支付金额（元）">
		      <template slot-scope="scope">
		      	<div class="text-success">{{ (scope.row.amount || 0) | amtFormat }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="赠送金额（元）">
		      <template slot-scope="scope">
		      	<div class="text-success">{{ (scope.row.giftAmount || 0) | amtFormat }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="充值后余额（元）">
		      <template slot-scope="scope">
		      	<div class="text-warning">{{ scope.row.balance| amtFormat }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="描述">
		      <template slot-scope="scope">
						<div v-if="!scope.row.remark || scope.row.remark.length <= 0"><el-button @click="openDialog(scope.row.id)" style="padding: 5px 15px">备注</el-button></div>
		      	<div v-else>{{ scope.row.remark }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作人">
		      <template slot-scope="scope">
		      	<div>{{ scope.row.workName }}</div>
		      </template>
		    </el-table-column>
		  </el-table>
		</div>
		<div class="text-right m-t-sm">
			<el-pagination class="pull-right"
				:page-size="tableData.pagination.size"
				layout="total, prev, pager, next"
				:total="tableData.pagination.total"
				@current-change="handleCurrentChange" >
			</el-pagination>
	  </div>

		<el-dialog class="ukao-dialog"
							 title="修改备注"
							 :visible.sync="showDialog"
							 size="small">
			<div>
				<el-form :model="formData" ref="editForm" label-width="60px">
					<el-form-item class="m-b-none input_width" label="备注：">
						<!--<div >-->
						<el-input type="textarea"
											:autosize="{ minRows: 4, maxRows: 6}"
											v-model="formData.remark"
											auto-complete="off"></el-input>
						<!--</div>-->
					</el-form-item>
				</el-form>
			</div>
			<div class="footer text-right" slot="footer">
				<el-button @click="showDialog = false">取消</el-button>
				<el-button type="primary"  @click="update">确认</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import msg from '@/utils/msg'
	import consts from '@/utils/consts'
  import base from '@/utils/helpers/base'
  import time from '@/utils/helpers/timeLite'
	import vListTop from '@/app/Pages/Client/List/listtop';
	import vListTabNav from '@/app/Pages/Client/List/listtabnav';

	export default {
		components: {
			vListTop, vListTabNav
		},
		data: function() {
			return {
        showDialog: false,
				loading: true,
				tableData: {
					list: [],
					userId: this.$route.params.id,
					pagination: {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
        start:"",
        formData:{
          id:'',
          remark:''
				}
			}
		},
		created () {
			this.list()
    },
		methods: {
			list (start) {
			  this.start = start;
				this.loading = true;
				this.$store.dispatch('post', {
					uri : 'userRecharge/list',
					data: {
						startRow: start| 0,
						userId: this.tableData.userId || 0,
						pageSize: this.tableData.pagination.size,
					}
				}).then((res) =>{
					const list = res.data.data.list || []
					setTimeout(() => {
						this.tableData.pagination.total = res.data.data.total || 0
						this.tableData.list = list
						this.loading = false;
					}, 800);
				})
			},
			handleCurrentChange (val){
				this.list((val-1) * this.tableData.pagination.size)
			},
      openDialog(id){
			  this.showDialog = true;
			  this.formData.id = id;
			},
			update(){
        this.$store.dispatch('post', {
          uri : 'userRecharge/update',
          data: {
						...this.formData
          }
        }).then((res) =>{
          msg.success()
          this.showDialog = false;
          this.list(this.start);
				})
			}

    }
	}
</script>
<style>
	.input_width{
		width: 84%;
		margin-top: 15px;
	}

</style>