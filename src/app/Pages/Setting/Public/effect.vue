<template>
	<div>
		<div class="clearfix text-right">
			<span id="public-data" class="text-md pull-left l-h36">预计效果（公共数据）</span>
		  <div class="w dis-inline m-l m-r-lg">
				<el-input placeholder="请输入内容" v-model="dataTemplate.keywords" @keyup.enter.native="templateSearch">
		    	<el-button slot="append" icon="el-icon-search" @click="templateSearch"></el-button>
		  	</el-input>
		  </div>
		</div>

		<div class="m-t-lg">
			<el-table class="ukao-el-table"
				v-loading="dataTemplate.loading"
		    ref="multipleTable"
				:data="dataTemplate.list"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      label="预计效果名称">
		      <template slot-scope="scope">{{ scope.row.name }}</template>
		    </el-table-column>
		    <!-- <el-table-column
		      label="编号">
		      <template slot-scope="scope">{{ scope.row.code }}</template>
		    </el-table-column> -->
		    <el-table-column
		      label="首字母">
		      <template slot-scope="scope">{{ scope.row.firstWord }}</template>
		    </el-table-column>
		    <el-table-column
		      label="序号">
		      <template slot-scope="scope">{{ scope.row.sortNo }}</template>
		    </el-table-column>
		  </el-table>

			<div class="m-t-sm text-right">
				<el-pagination
					:page-size="dataTemplate.pagination.size"
		      layout="total, prev, pager, next"
					:total="dataTemplate.pagination.total"
					@current-change="handleCurrentChangeTemplate">
		    </el-pagination>
			</div>
		</div>

		<div class="m-t-vl claerfix text-right">
			<span id="private-data" class="text-md pull-left l-h36">预计效果（私有数据）</span>
		  <div class="w dis-inline m-l m-r-lg">
				<el-input placeholder="请输入内容" v-model="tableData.keywords" @keyup.enter.native="search">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
			  </el-input>
		  </div>
			<auth perm="setting.public.data.project.update">
		  	<el-button @click="addForm('ruleForm')" type="primary"><i class="el-icon-plus m-r-xs"></i>添加预计效果</el-button>
			</auth>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table"
				v-loading="tableData.loading"
		    ref="multipleTable"
		    :data="tableData.list"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      label="预计效果名称">
		      <template slot-scope="scope">{{ scope.row.name }}</template>
		    </el-table-column>
		    <!-- <el-table-column
		      label="编号">
		      <template slot-scope="scope">{{ scope.row.code }}</template>
		    </el-table-column> -->
		    <el-table-column
		      label="首字母">
		      <template slot-scope="scope">{{ scope.row.firstWord }}</template>
		    </el-table-column>
		    <el-table-column
		      label="序号">
		      <template slot-scope="scope">{{ scope.row.sortNo }}</template>
		    </el-table-column>
				<el-table-column
					label="状态">
					<template slot-scope="scope">
						<el-tooltip v-if="scope.row.status == 1" effect="dark" content="已启用" placement="right">
							<i class="t-state t-state-success"></i>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == 0" effect="dark" content="未启用" placement="right">
							<i class="t-state"></i>
						</el-tooltip>
						<el-tooltip v-if="scope.row.status == -1" effect="dark" content="已删除" placement="right">
							<i class="t-state"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<auth perm="setting.public.data.project.update">
							<el-button type="text" size="small" @click="detailForm(scope.row)">编辑</el-button>
						</auth>
					</template>
				</el-table-column>
		  </el-table>

			<div class="m-t-sm claerfix text-right">
				<div class="pull-left">
					<auth perm="setting.public.data.project.update">
						<el-button size="small" :disabled="btn.enable" type="success" @click="updateStatusEnable">启用</el-button>
						<el-button size="small" :disabled="btn.disable" type="danger" @click="updateStatusDisable">停用</el-button>
						<el-button size="small" :disabled="btn.delete" type="danger" @click="updateStatusDelete">删除</el-button>
					</auth>
				</div>
				<el-pagination
		      :page-size="tableData.pagination.size"
		      layout="total, prev, pager, next"
		      :total="tableData.pagination.total"
					@current-change="handleCurrentChange">
		    </el-pagination>
			</div>
		</div>

		<el-dialog class="ukao-dialog"
		  :title="formTitle"
		  :visible.sync="dialogVisible"
		  size="small">
		  <div>
		  	<el-form :model="ruleForm" ref="ruleForm" label-width="160px">
				  <el-form-item
				    label="预计效果名称"
				    prop="name"
				    :rules="[
				      { required: true, message: '请填写预计效果名称'},
				      { min: 1, max: 8, message: '长度在1到8个字', trigger: 'blur' }
				    ]">
					  <div class="w-lg">
					  	<el-input v-model="ruleForm.name" auto-complete="off"></el-input>
					  </div>
				  </el-form-item>
					<!-- <el-form-item label="编号" prop="code" :rules="[
							{ required: true, message: '编号不能为空'},
							{ min: 2, max: 8, message: '长度在2到8个长度', trigger: 'blur' }
						]">
						<div class="w-lg"><el-input v-model="ruleForm.code"></el-input></div>
			  	</el-form-item> -->
					<el-form-item label="序号" prop="sortNo" :rules="[
						{ type:'number', required: false, message: '序号必须为整数'}
					]">
						<div class="w-lg"><el-input v-model.number="ruleForm.sortNo"></el-input></div>
				  </el-form-item>
				  <el-form-item>
				    <el-button @click="dialogVisible=false">取消</el-button>
				    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				  </el-form-item>
				</el-form>
		  </div>
		</el-dialog>
	</div>
</template>


<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'

	export default {
		data: function() {
			return {
				value: '',
				tableData: {
					loading: true,
					keywords : '',
					pageStart: 0,
					list : [],
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
				dataTemplate: {
					loading: true,
					keywords: '',
					pageStart: 0,
					list : [],
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
				multipleSelection: [],	//多选列表
				btn: {		//操作btn
					enable: true,		//启用
					disable: true,	//停用
					delete: true		//删除
				},
        dialogVisible: false,
				formTitle : '',
        ruleForm: {
          id: '',
          name: '',
					// code: '',
					sortNo: ''
        }
			}
		},
		created () {
			this.templateList()
			setTimeout(() => {
				this.list()
			}, 500);
    },
		watch :{		//监听选择改变
			'multipleSelection' () {
				let bl = !(this.multipleSelection && this.multipleSelection.length > 0)
				this.btn = {
					enable: bl,
					disable: bl,
					delete: bl
				}
			}
		},
		methods: {
			list (start) {
				var _this = this
				this.$store.dispatch('getList', {
					uri : 'productEffect/list',
					params: {
						startRow: start || 0,
						pageSize: _this.tableData.pagination.size,
						keywords: this.tableData.keywords || ''
					}
				}).then((res) =>{
						this.tableData.list = res.data.data.list || []
						this.tableData.pagination.total = res.data.data.total || 0
						this.tableData.loading = false
				})
    	},
			templateList (start){
				var _this = this
				this.$store.dispatch('getTemplateList', {
					uri : 'productEffect/template/list',
					params: {
						startRow: start || 0,
						pageSize: _this.dataTemplate.pagination.size,
						keywords: this.dataTemplate.keywords || ''
					}
				}).then((res) => {
            this.dataTemplate.list = res.data.data.list || []
            this.dataTemplate.pagination.total = res.data.data.total || 0
						this.dataTemplate.loading = false
				})
			},
			templateSearch (){
				this.templateList(0);
			},
			search (){
				this.list(0);
			},
			handleCurrentChangeTemplate (val){
			  this.dataTemplate.pageStart = (val-1) * this.dataTemplate.pagination.size
				this.templateList(this.dataTemplate.pageStart)
			},
			handleCurrentChange (val){
				this.tableData.pageStart = (val-1) * this.tableData.pagination.size
				this.list(this.tableData.pageStart)
			},
			updateStatusEnable (){		//启用
					let list = this.multipleSelection
					let ids = this.selectionIds(list)
          this.$store.dispatch('batch', {
            uri: 'productEffect/enableBatch',
            params: {
              ids: ids
            }
          }).then((res) => {
							msg.success();
							this.list(this.tableData.pageStart)
          })
			},
			updateStatusDisable (){		//停用
				let list = this.multipleSelection
				let ids = this.selectionIds(list)
					this.$store.dispatch('batch', {
						uri: 'productEffect/disableBatch',
						params: {
							ids: ids
						}
					}).then((res) => {
						msg.success();
						this.list(this.tableData.pageStart)
        })
			},
			updateStatusDelete (){		//删除
				this.$confirm('此操作将永久删除选中项, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let list = this.multipleSelection
					let ids = this.selectionIds(list)
						this.$store.dispatch('batch', {
							uri: 'productEffect/deleteBatch',
							params: {
								ids: ids
							}
						}).then((res) => {
							msg.success();
							this.list(this.tableData.pageStart)
	        })
				})
			},
			selectionIds (list){	//获取选择id
				let ids = []
				list.forEach(function (item) {
					ids.push(item.id)
				})
				return ids.join(',')
			},
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
			addForm (formName){
       	this.ruleForm = {
					id: '',
					name: '',
					// code: '',
					sortNo: ''
			}
			this.formTitle = '添加预计效果'
			this.dialogVisible = true
				 try {
					 this.$refs[formName].resetFields();
				 }catch (e){}
			},
			detailForm (item){
				this.formTitle = '修改预计效果'
				this.$store.dispatch('post', {
					uri: 'productEffect/detail',
					params: {
						id: item.id
					}
				}).then((res) => {
					let data = res.data.data
						 if(!data){
							 msg.error("记录不存在")
							 return
						 }
					this.ruleForm = {
						id: data.id,
						name: data.name,
						// code: data.code,
						sortNo: data.sortNo
					}
					this.dialogVisible = true
				})
			},
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$store.dispatch('add', {
							uri: this.ruleForm.id ? 'productEffect/update': 'productEffect/add',
							params: this.ruleForm
						}).then((res) => {
							this.dialogVisible = false
							msg.success();
							this.list(this.tableData.pageStart)
						})
					} else {
						return false;
					}
        });
      }
    }
	}
</script>
