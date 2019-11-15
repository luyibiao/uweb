<template>
	<div class="ukao-pt-md">
		<v-list-top></v-list-top>
		<div class="m-t-lg clearfix">
			<auth perm="client.list.all.address">
				<el-button class="pull-right" type="primary" size="medium" @click="preAdd" v-show="total < 20">新增地址</el-button>
			</auth>
			<v-list-tab-nav v-bind:nav-key="'2'"></v-list-tab-nav>
		</div>
		<div class="m-t-lg">
			<el-table class="ukao-el-table m-t ukao-v-loading" v-loading="loading"
		    :data="tableData"
		    style="width: 100%">
		    <el-table-column
		      label="联系人">
		      <template slot-scope="scope">
						<div>{{ scope.row.name }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="手机/电话">
		      <template slot-scope="scope">
						<div>{{ scope.row.phone }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="所在地区">
		      <template slot-scope="scope">
						<div>{{ scope.row.regionalDesc }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="详细地址">
		      <template slot-scope="scope">
						<div>{{ scope.row.detail }}</div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="性别">
		      <template slot-scope="scope">
						<div>
							<span v-if="scope.row.sex == 0">未知</span>
							<span v-if="scope.row.sex == 1">男</span>
							<span v-if="scope.row.sex == 2">女</span>
						</div>
		      </template>
		    </el-table-column>
				<el-table-column
					label="操作">
					<template slot-scope="scope">
						<div>
							<auth perm="client.list.all.address">
								<span class="dis-inline m-r-sm m-b-xs"><el-button type="primary" size="mini" @click="preUpdate(scope.row.id)">编辑</el-button></span>
								<span class="dis-inline m-r-sm m-b-xs"><el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button></span>
								<span v-if="scope.row.def == 1" class="dis-inline m-b-xs">默认地址</span>
								<span v-else class="dis-inline m-b-xs"><el-button size="mini" @click="setDefault(scope.row)">设为默认</el-button></span>
							</auth>
						</div>
					</template>
				</el-table-column>
		  </el-table>
		</div>

		<el-dialog class="ukao-dialog"
		  :title="editDialog.title"
		  :visible.sync="editDialog.show"
		  size="small">
		  <div>
		  	<el-form ref="editForm" :model="formData" label-width="100px">
				  <el-form-item label="联系人" prop="name" required :rules="{required: true, message: '请输入联系人姓名', trigger: 'blur'}">
					  <div class="w-xl">
					  	<el-input v-model="formData.name" :maxlength="16"></el-input>
					  </div>
				  </el-form-item>
				  <el-form-item label="性别" prop="sex" required :rules="{required: true, message: '请选择性别', trigger: 'blur'}">
					  <el-radio class="radio" v-model="formData.sex" label="1">男</el-radio>
  					<el-radio class="radio" v-model="formData.sex" label="2">女</el-radio>
  					<el-radio class="radio" v-model="formData.sex" label="0">未知</el-radio>
				  </el-form-item>
				  <el-form-item label="联系电话" prop="phone" required :rules="{validator:checkTel, ignoreEmpty:false, message: '请输入正确的手机号', trigger: 'blur'}">
					  <div class="w-xl">
					  	<el-input v-model="formData.phone" :maxlength="16"></el-input>
					  </div>
				  </el-form-item>
				  <!-- <el-form-item label="所在地区" prop="regionalId" :rules="[
			    	{ required: true, message: '所在省市区不能为空'}
				  ]" required>
	          <div class="dis-inline w-xl">
	  			    <el-cascader
								v-model="selectedOptions"
								placeholder="请选择/搜索"
	  					  :options="options"
								filterable
								:clearable="true"
								@change="selected"
	  					></el-cascader>
	          </div>
				  </el-form-item> -->
					<el-form-item label="所在区">
						 <div class="w-xl">
							 <el-input disabled v-model="formData.regionalDesc"></el-input>
						 </div>
					</el-form-item>
				  <el-form-item label="详细地址" prop="detail" :rules="[
			    	{ required: true, message: '所在省市区不能为空'}
				  ]">
					  <div class="w-xl dis-inline m-r-sm" @click="selectAddress">
					  	<el-input v-model="formData.detail" type="textarea"></el-input>
					  </div>
					  <el-checkbox v-model="def" @change="changeDef">设为默认地址</el-checkbox>
				  </el-form-item>
				</el-form>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialog.show = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm">确 定</el-button>
		  </span>
		</el-dialog>

		 <el-dialog title="添加地址"
               :visible.sync="innerVisible"
               size="small">
      <mapAdd :paramsObj="mapObj.params"
              :callback="mapCallbackFn"
							:callbackCancel="callbackCancel"></mapAdd>
    </el-dialog>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import regional from '@/utils/regional'
	import validate from '@/utils/helpers/validate'
	import mapAdd from "@/components/Map/QMap/Search";
	import vListTop from '@/app/Pages/Client/List/listtop';
	import vListTabNav from '@/app/Pages/Client/List/listtabnav';

	export default {
		components: {
			vListTop, vListTabNav,mapAdd
		},
		data: function() {
			return {
				innerVisible:false,
				loading: false,
				tableData: [],
        total: 0,
				mapObj: {
        	params: {
          userId: "",
          name: "",
          phone: "",
					sex: "0",
					flag:true,
					// longitude:'',
					// latitude:'',
        }
      },
        editDialog : {
          title:'新建地址',
          show:false
        },
        formData: {
				  userId: '',
					name: '',
					phone: '',
					sex: '0',
					regionalId: '',
			  	regionalDesc: '',
          detail: '',
			  	def: 0,
					longitude:'',
					latitude:'',
				},
				def: false,
				// selectedOptions: [],	//默认选择省市区
        options: []	//选择地区
			}
		},
    created () {
      this.list();
      this.getRegional();
    },
		methods: {
			selectAddress(){
				this.mapObj.params.userId=this.formData.userId;
				this.mapObj.params.name=this.formData.name;
				this.mapObj.params.phone=this.formData.phone;
				this.innerVisible=true;
			},
			 // 保存用户地址回调函数
			 mapCallbackFn(obj) {
				this.innerVisible = false;
				if(obj.detail===""){
					return;
				}
				this.formData.detail=obj.detail;
				this.formData.longitude=obj.longitude;
				this.formData.latitude=obj.latitude;
				this.formData.regionalId=obj.regionalId;
				this.formData.regionalDesc=obj.regionalDesc;
				this.formData.name=obj.name;
				this.formData.phone=obj.phone;
				// this.selectedOptions = [
				//       regional.getProvinceId(this.formData.regionalId),
				//       regional.getCityId(this.formData.regionalId),
				//       this.formData.regionalId
				//     ];
			},
      callbackCancel(){
				this.innerVisible=false
			},
		  getUserId: function(){
		    return this.$route.params.id;
      },
			setDefault: function(row) {
				this.tableData.forEach(function(item) {
					item.def = 0;
				});
        row.def = 1;

        this.$store.dispatch('post', {
          uri: 'userAddress/updateDefault',
          data:{id:row.id}
        })
			},
      list() {
        let id = this.getUserId();
				this.$store.dispatch('post', {
						uri: 'userAddress/list',
						data:{
						  userId:id,
              startRow:  0,
              pageSize: consts.PAGE_SIZE20
						}
				}).then((res) => {
						this.tableData = res.data.data.list || [];
						this.total = res.data.data.total;
				})
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
			preAdd() {
        this.formData = {
          userId: this.getUserId(),
          name: '',
          phone: '',
          sex: '0',
          regionalId: '',
          regionalDesc: '',
          detail: '',
          def: 0
        };
        if (this.$refs['editForm']) {
          this.$refs['editForm'].resetFields();
        }
			  this.editDialog.title = '新建地址';
			  this.editDialog.show = true;
      },
			preUpdate(id) {
        this.$store.dispatch('post', {
          uri: 'userAddress/detail',
          data:{id}
        }).then((res) => {
          let formData = res.data.data;
          // let regId = formData.regionalId;
          // this.selectedOptions = [
          //   regional.getProvinceId(regId),
          //   regional.getCityId(regId),
          //   regId
          // ];
          this.def = formData.def == 1;

          formData.sex = formData.sex.toString();
          this.formData = {...formData};

          if (this.$refs['editForm']) {
            this.$refs['editForm'].resetFields();
          }
          this.editDialog.title = '修改地址';
          this.editDialog.show = true;
        })
			},
			getRegional (){
				this.options = regional.all()
			},
			// selected (val){
			// 	console.log(val,'val');
			// 	if(val.length == 3){
			// 		this.formData.regionalId = val[2]
			// 		let province = regional.getProvince(val[0])
			// 		let city = regional.getCity(val[0], val[1])
			// 		let area = regional.getArea(val[0], val[1], val[2]);
			// 		this.formData.regionalDesc = province[0].label + city[0].label + area[0].label
			// 	}
			// },
      checkTel(rule, value, callback) {
        if (!validate.tel(value, rule.ignoreEmpty)) {
          callback(new Error());
        } else {
          callback();
        }
      },
      changeDef(event){
        if (event.target.checked) {
          this.formData.def = 1
        } else {
          this.formData.def = 0
        }
      },
      submitForm() {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
//            console.log({...this.formData});
//            return;
            this.formData.createTime = null;
            this.formData.updateTime = null;
            this.$store.dispatch('post', {
              uri: this.formData.id?'userAddress/update':'userAddress/add',
              data: {...this.formData}
            }).then((res)=>{
              this.editDialog.show = false;
              msg.success();
              this.list();
            })
          }
        });
      },
		}

	}
</script>