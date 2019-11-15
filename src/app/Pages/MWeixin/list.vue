<template>
	<div>
		<div class="ukao-v-loading" v-loading="loading">
			<el-tabs type="card">
		    <el-tab-pane>
			    <span slot="label">图文消息</span>
			    <div>
						<div class="text-right">
							<router-link to="/mweixin/material/new"><el-button type="primary">新建图文</el-button></router-link>
						</div>
						<div class="m-t">
							<el-table class="ukao-el-table"
						    :data="tableData"
						    style="width: 100%">
						    <el-table-column
						    	label="图片">
						      <template slot-scope="scope">
						      	<img class="thumb" v-bind:src="scope.row.img" alt="">
						      </template>
						    </el-table-column>
						    <el-table-column
						    	label="标题">
						      <template slot-scope="scope">
										<div>{{scope.row.title}}</div>
						      </template>
						    </el-table-column>
						    <el-table-column
						    	label="创建时间">
						      <template slot-scope="scope">
										<div>{{scope.row.time}}</div>
						      </template>
						    </el-table-column>
						    <el-table-column
						    	label="操作">
						      <template slot-scope="scope">
										<router-link to="/mweixin/material/new"><el-button type="text">编辑</el-button></router-link>
										<el-button type="text" @click="handleDelete0(scope.$index)">删除</el-button>
						      </template>
						    </el-table-column>
						  </el-table>
						</div>
					</div>
			  </el-tab-pane>
			  <el-tab-pane>
			    <span slot="label">图片消息</span>
			    <div>
						<div class="text-right">
							<el-button type="primary">上传图片</el-button>
						</div>
						<div class="m-t">
							<el-table class="ukao-el-table"
						    :data="tableData2"
						    style="width: 100%">
						    <el-table-column
						    	label="图片">
						      <template slot-scope="scope">
						      	<img class="thumb" v-bind:src="scope.row.img" alt="">
						      </template>
						    </el-table-column>
						    <el-table-column
						    	label="名称">
						      <template slot-scope="scope">
										<div>{{scope.row.name}}</div>
						      </template>
						    </el-table-column>
						    <el-table-column
						    	label="创建时间">
						      <template slot-scope="scope">
										<div>{{scope.row.time}}</div>
						      </template>
						    </el-table-column>
						    <el-table-column
						    	label="操作">
						      <template slot-scope="scope">
										<el-button type="text" @click="handleEdit(scope.$index)">编辑名称</el-button>
										<el-button type="text" @click="handleDelete(scope.$index)">删除</el-button>
						      </template>
						    </el-table-column>
						  </el-table>
						</div>
					</div>
			  </el-tab-pane>
		  </el-tabs>
		</div>

		<el-dialog class="ukao-dialog"
		  title="编辑名称"
		  :visible.sync="dialogVisible"
		  size="small">
		  <div>
		  	<el-input v-model="inputContent"></el-input>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="confirm">确 定</el-button>
		  </span>
		</el-dialog>

		<el-dialog class="ukao-dialog"
		  title="删除确认"
		  :visible.sync="dialogVisible2"
		  size="small">
		  <div>
		  	您确认删除此项？删除后将不可恢复
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible2 = false">取 消</el-button>
		    <el-button type="primary" @click="confirm2">确 定</el-button>
		  </span>
		</el-dialog>

		<el-dialog class="ukao-dialog"
		  title="删除确认"
		  :visible.sync="dialogVisible0"
		  size="small">
		  <div>
		  	您确认删除此项？删除后将不可恢复0
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible0 = false">取 消</el-button>
		    <el-button type="primary" @click="confirm0">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				tableData: [
					{ img: '/static/img/avatar.jpg', title: '第一条图文消息', time: '2017-05-10 10:15' },
					{ img: '/static/img/avatar.jpg', title: '第一条图文消息', time: '2017-05-10 10:15' }
				],
				tableData2: [
					{ img: '/static/img/avatar.jpg', name: 'avatar.jpg', time: '2017-05-10 10:15' },
					{ img: '/static/img/avatar.jpg', name: 'avatar.jpg', time: '2017-05-10 10:15' }
				],
				dialogVisible0: false,
				dialogVisible: false,
				dialogVisible2: false,
				index: '',
				inputContent: '',
			}
		},
		methods: {
			handleEdit(index) {
				this.dialogVisible = true;
				this.index = index
      },
      handleDelete0(index) {
      	this.dialogVisible0 = true;
      	this.index = index
      },
      handleDelete(index) {
      	this.dialogVisible2 = true;
      	this.index = index
      },
      confirm0() {
				this.tableData.splice(this.index, 1);
      	this.dialogVisible0 = false
      },
      confirm() {
				this.tableData2[this.index].name = this.inputContent;
      	this.dialogVisible = false
      },
      confirm2() {
				this.tableData2.splice(this.index, 1);
      	this.dialogVisible2 = false
      }
		}
	}
</script>


<style>
	.el-tabs__item.is-active {
		color: #48576a;
	}
	.el-tabs__item {
		color: #20a0ff;
	}
</style>