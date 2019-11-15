<template>
	<div>
		<div>
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="/merchant/list"><i class="el-icon-arrow-left icon-smaller"></i>商家管理</el-breadcrumb-item>
			  <el-breadcrumb-item to="/merchant/cabinet">智柜列表</el-breadcrumb-item>
			  <el-breadcrumb-item>新建商家</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="m-l-xl m-t-lg">
			<el-form ref="form" :model="form" label-width="160px">
			  <el-form-item label="所属商家">
				  <div class="w-xl">
				  	友靠生活
				  </div>
			  </el-form-item>
			  <el-form-item label="智柜名称" required>
				  <div class="w-xl">
				  	<el-input v-model="form.name"></el-input>
				  </div>
			  </el-form-item>
			  <el-form-item label="智柜型号" required>
				  <div class="w-xl">
				  	<el-select v-model="form.model" placeholder="请选择型号">
				      <el-option label="UKAO-S1" value="UKAO-S1"></el-option>
				      <el-option label="UKAO-S2" value="UKAO-S2"></el-option>
				    </el-select>
				  </div>
			  </el-form-item>
			  <el-form-item label="所在地区" :rules="[
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
			  </el-form-item>
			  <el-form-item label="详细地址" required>
				  <div class="w-xl">
				    <el-input v-model="form.name"></el-input>
			    </div>
			  </el-form-item>
			  <el-form-item label="坐标（经度/纬度）" required>
				  <div class="w-md m-r dis-inline">
				    <el-input v-model="form.name"></el-input>
			    </div>
					<a class="text-primary"
						 target="_blank"
						 href="https://lbs.qq.com/tool/getpoint/">拾取坐标</a>
			  </el-form-item>
			  <el-form-item>
				  <div class="w-xl">
				    <el-button>取消</el-button>
				    <el-button type="primary">保存</el-button>
			    </div>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import consts from '@/utils/consts'
	import msg from '@/utils/msg'
	import regional from '@/utils/regional'
	import md5 from '@/utils/md5'

	export default {
		data() {
			return {
			  form: {
			  	name: '',
			  	regionalId: '',
			  	regionalDesc: '',
			  	model: ''
				},
				imageUrl: '',
				selectedOptions: [],	//默认选择省市区
        options: []	//选择地区
			}
		},
		created () {
			this.init()
			this.getRegional()
    },
		methods: {
			init (){
				this.$store.dispatch('get', {
					 uri: 'mercInfo/detail',
					 data:{}
				}).then((res) => {
				  	let data = res.data.data
						let param = res.data.param
				})
			},
			getRegional (){
				this.options = regional.all()
			},
			selected (val){
				if(val.length == 3){
					this.form.regionalId = val[2]
					let province = regional.getProvince(val[0])
					let city = regional.getCity(val[0], val[1])
					let area = regional.getArea(val[0], val[1], val[2])
					this.form.regionalDesc = province[0].label + city[0].label + area[0].label
				}
			},
		}
	}
</script>