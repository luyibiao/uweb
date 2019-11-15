<template>
	<div class="ukao-pt-md">
		<auth perm="client.label.update">
			<div class="text-right">
				<el-button type="primary" @click="preAdd()"><i class="el-icon-plus m-r-xs"></i>新建标签</el-button>
			</div>
		</auth>
		<div class="m-t">
			<el-table class="ukao-el-table"
		    :data="tableData.list"
		    style="width: 100%">
		    <el-table-column
		      label="标签名">
		      <template slot-scope="scope">
		        <div>{{ scope.row.name }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="客户数">
		      <template slot-scope="scope">
						<div class="text-primary" > <router-link class="text-primary" :to="'/client/list/all?tagId='+scope.row.id"> {{scope.row.cnt}}</router-link></div>
		      </template>
		    </el-table-column>
		    <el-table-column label="操作">
		      <template slot-scope="scope">
						<auth perm="client.label.update">
							<el-button size="small" v-if="scope.row.id" @click="detail(scope.row.id)">编辑</el-button>
							<el-button size="small" v-if="scope.row.id" type="danger" @click="del(scope.row.id)">删除</el-button>
						</auth>
		      </template>
		    </el-table-column>
		  </el-table>
			<div class="m-t-sm text-right">
				<el-pagination
		      :page-size="tableData.pagination.size"
		      layout="total, prev, pager, next"
		      :total="tableData.pagination.total"
					@current-change="handleCurrentChange">
		    </el-pagination>
			</div>
		</div>
		
		<el-dialog class="ukao-dialog"
		  :title="editDialog.title"
		  :visible.sync="editDialog.show"
		  size="small">
		  <div>
		  	<el-form :model="formData" :rules="rules" ref="editForm" label-width="120px">
			  <el-form-item label="标签名" prop="name">
				<div class="w-lg">
					<el-input v-model="formData.name"></el-input>
				</div>
			  </el-form-item>
			  <el-form-item>
				<el-button @click="editDialog.show=false">取消</el-button>
				<el-button type="primary" @click="submitForm">保存</el-button>
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
				tableData: {
					list : [],
					pagination : {
						size: consts.PAGE_SIZE,
						total: 0
					}
				},
				editDialog : {
				  	title:'新建标签',
					show:false
				},
				formData: {
				    id: '',
					name: ''
				},
				rules: {
					name: [
						{ required: true, message: '请输入标签名称', trigger: 'blur' }
					]
				}
			}
		},
		created () {
			this.list()
		},
		methods: {
			list (start) {
				this.$store.dispatch('post', {
					uri : 'userTag/list',
					data: {
						startRow: start || 0,
						pageSize: this.tableData.pagination.size
					}
				}).then((res) =>{
					this.tableData.list = res.data.data.list || []
					this.tableData.pagination.total = res.data.data.total || 0
				})
			},
			handleCurrentChange (val){
				this.list((val-1) * this.tableData.pagination.size)
			},
			preAdd() {
                if (this.$refs['editForm']) {
                    this.$refs['editForm'].resetFields();
                }
			    this.formData.name = '';
                this.editDialog.title = '新建标签';
			    this.editDialog.show = true;
			},
			detail(id) {
                this.editDialog.title = '修改标签';

                this.$store.dispatch('post', {
                    uri: 'userTag/detail',
                    data: {id}
                }).then((res)=>{
                    let dataInfo = res.data.data;
                    if (!dataInfo) {
                        msg.error("记录不存在");
						return
					}

                    if (this.$refs['editForm']) {
                        this.$refs['editForm'].resetFields();
                    }

                    this.formData.id = dataInfo.id;
                    this.formData.name = dataInfo.name;

                    this.editDialog.show = true;
				})
			},
            submitForm() {
                let _this = this;
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {

                        this.$store.dispatch('post', {
                            uri: this.formData.id?'userTag/update':'userTag/add',
							data: this.formData
                        }).then((res)=>{
                            _this.editDialog.show = false;
                            msg.success();
                            this.list();
						})
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
			},
            del(id) {
			    let _this = this;
                msg.confirm({
                    msg:'确定删除?',
                    confirmFn: function () {
                        _this.$store.dispatch('post', {
							uri: 'userTag/delete',
							data: {id:id}
                        }).then((res)=>{
                            msg.success();
                            _this.list();
						})
					}
				})
			}
		}
	}
</script>