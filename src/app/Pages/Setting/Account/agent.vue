<template>
	<div>
		<div>
			<el-breadcrumb class="link-back" separator="/">
			  <el-breadcrumb-item to="basic"><i class="el-icon-arrow-left icon-smaller"></i>基本设置</el-breadcrumb-item>
			  <el-breadcrumb-item>主体信息认证</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="tip-info m-t-lg">
			<p>通洗认证说明：</p>
			<p>个人认证：大陆身份证默认进行实时快速认证； 其他证件类型可进行人工认证，审核周期为1个工作日；</p>
			<p>企业认证：适合公司经营者，真假可提现至公司银行账户，审核周期为1个工作日；</p>
		</div>
		<div class="m-t-lg">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
				<el-form-item label="主体信息" prop="radio">
					<el-radio-group v-model="ruleForm.radio">
			      <el-radio label="个人"></el-radio>
			      <el-radio label="公司"></el-radio>
				  </el-radio-group>
				</el-form-item>
				<div v-if="ruleForm.radio == '个人'">
					<el-form-item label="真实姓名" prop="name">
				    <span class="w-xl dis-inline"><el-input v-model="ruleForm.name"></el-input></span>
				  </el-form-item>
				  <el-form-item label="身份证号" prop="name">
				    <span class="w-xl dis-inline"><el-input v-model="ruleForm.name" placeholder="准备填写银行卡公司名称，否则无法提现"></el-input></span>
				  </el-form-item>
				</div>
				<div v-else>
					<el-form-item label="企业名称" prop="name">
				    <span class="w-xl dis-inline"><el-input v-model="ruleForm.name"></el-input></span>
				  </el-form-item>
				  <el-form-item label="法人" prop="name">
				    <span class="w-xl dis-inline"><el-input v-model="ruleForm.name"></el-input></span>
				  </el-form-item>
				  <el-form-item label="法人证件" prop="name">
					  <div>
					    <div class="dis-inline w-xl m-r-xl">
					    	<p class="text-muted">身份证正面（仅支持png、jpg,大小不超过4M）</p>
					    	<el-upload
								  class="u-avatar-uploader"
								  action="https://jsonplaceholder.typicode.com/posts/"
								  :show-file-list="false"
								  :on-success="handleAvatarSuccess"
								  :before-upload="beforeAvatarUpload">
								  <img v-if="imageUrl" :src="imageUrl" class="u-avatar">
								  <i v-else class="el-icon-plus u-avatar-uploader-icon id-card"></i>
								</el-upload>
					    </div>
					    <div class="dis-inline">
					    	<p class="text-muted">示例</p>
					    	<img style="width:200px; height: 140px;" src="/static/img/sc_map001.png" alt="">
					    </div>
				    </div>
				    <div class="m-t">
					    <div class="dis-inline w-xl m-r-xl">
					    	<p class="text-muted">身份证反面（仅支持png、jpg,大小不超过4M）</p>
					    	<el-upload
								  class="u-avatar-uploader"
								  action="https://jsonplaceholder.typicode.com/posts/"
								  :show-file-list="false"
								  :on-success="handleAvatarSuccess"
								  :before-upload="beforeAvatarUpload">
								  <img v-if="imageUrl" :src="imageUrl" class="u-avatar">
								  <i v-else class="el-icon-plus u-avatar-uploader-icon id-card"></i>
								</el-upload>
					    </div>
					    <div class="dis-inline">
					    	<p class="text-muted">示例</p>
					    	<img style="width:200px; height: 140px;" src="/static/img/sc_map001.png" alt="">
					    </div>
				    </div>
				  </el-form-item>
				  <el-form-item label="营业执照" prop="name">
				    <div>
					    <div class="dis-inline w-xl m-r-xl">
					    	<p class="text-muted">仅支持png、jpg,大小不超过4M</p>
					    	<el-upload
								  class="u-avatar-uploader"
								  action="https://jsonplaceholder.typicode.com/posts/"
								  :show-file-list="false"
								  :on-success="handleAvatarSuccess"
								  :before-upload="beforeAvatarUpload">
								  <img v-if="imageUrl" :src="imageUrl" class="u-avatar">
								  <i v-else class="el-icon-plus u-avatar-uploader-icon id-card"></i>
								</el-upload>
					    </div>
					    <div class="dis-inline">
					    	<p class="text-muted">示例</p>
					    	<img style="width:200px; height: 140px;" src="/static/img/sc_map001.png" alt="">
					    </div>
				    </div>
				  </el-form-item>
				  <el-form-item label="营业执照号" prop="name">
				    <span class="w-xl dis-inline"><el-input v-model="ruleForm.name"></el-input></span>
				  </el-form-item>
				</div>
			  
			  <el-form-item label="所在省市区">
			    <span class="w-xs m-r-sm dis-inline">
			    	<el-select v-model="ruleForm.region1" placeholder="请选择活动区域">
				      <el-option :label="option.name" :value="option.id" v-for="option in regionalList.provinceList" :key="option.id"></el-option>
				    </el-select>
			    </span>
			    <span class="w-xs m-r-sm dis-inline">
			    	<el-select v-model="ruleForm.region2" placeholder="请选择活动区域">
				      <el-option :label="option.name" :value="option.id" v-for="option in regionalList.cityList" :key="option.id"></el-option>
				    </el-select>
			    </span>
			    <span class="w-xs m-r-sm dis-inline">
			    	<el-select v-model="ruleForm.region3" placeholder="请选择活动区域">
				      <el-option :label="option.name" :value="option.id" v-for="option in regionalList.areaList" :key="option.id"></el-option>
				    </el-select>
			    </span>
			  </el-form-item>
			  <el-form-item label="详细地址" >
			    <span class="w-xl dis-inline"><el-input placeholder="请对照银行对账单填写完整支行信息"></el-input></span>
			  </el-form-item>
			  <el-form-item label="短信验证码" prop="name">
			  	<span class="w-xl dis-inline">
				    <el-input v-model="ruleForm.name">
				    	 <template slot="append">获取</template>
				    </el-input>
				  </span>
			    <p class="text-xs text-muted" style="margin-top: -10px; line-height: 20px;">验证短信将发送到您绑定的手机：18545678956，请注意查收</p>
			  </el-form-item>
			  <el-form-item>
			  	<el-button type="primary">提交认证</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				ruleForm: {
          name: '',
          bank: '',
          radio: '个人',
          region1: '',
          region2: '',
          region3: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
          ],
          bank: [
            { required: true, message: '请选择银行', trigger: 'change' }
          ],
          radio: [
            { required: true, message: '请选择主体信息', trigger: 'change' }
          ]
        },
        regionalList : {
					provinceList : [
						{id:11, name:'北京'},
						{id:31, name:'上海'},
						{id:44, name:'广东'},
						{id:34, name:'安徽'},
						{id:50, name:'重庆'},
						{id:35, name:'福建'},
						{id:46, name:'海南'},
						{id:13, name:'河北'},
						{id:41, name:'河南'},
						{id:23, name:'黑龙江'},
						{id:42, name:'湖北'},
						{id:43, name:'湖南'},
						{id:62, name:'甘肃'},
						{id:45, name:'广西'},
						{id:52, name:'贵州'},
						{id:22, name:'吉林'},
						{id:36, name:'江西'},
						{id:32, name:'江苏'},
						{id:21, name:'辽宁'},
						{id:15, name:'内蒙古'},
						{id:64, name:'宁夏'},
						{id:63, name:'青海'},
						{id:37, name:'山东'},
						{id:14, name:'山西'},
						{id:61, name:'陕西'},
						{id:51, name:'四川'},
						{id:12, name:'天津'},
						{id:54, name:'西藏'},
						{id:65, name:'新疆'},
						{id:53, name:'云南'},
						{id:33, name:'浙江'},
						{id:71, name:'台湾'},
						{id:81, name:'香港'},
						{id:82, name:'澳门'},
					],
						
					cityList : [
						{id:4301, name:'长沙', parentId:43},
						{id:4302, name:'株洲', parentId:43},
						{id:4303, name:'湘潭', parentId:43},
						{id:4304, name:'衡阳', parentId:43},
						{id:4305, name:'邵阳', parentId:43},
						{id:4306, name:'岳阳', parentId:43},
						{id:4307, name:'常德', parentId:43},
						{id:4308, name:'张家界', parentId:43},
						{id:4309, name:'益阳', parentId:43},
						{id:4310, name:'郴州', parentId:43},
						{id:4311, name:'永州', parentId:43},
						{id:4312, name:'怀化', parentId:43},
						{id:4313, name:'娄底', parentId:43},
						{id:4331, name:'湘西', parentId:43}
					],
					areaList : [
						{id:430102, name:'芙蓉区',parentId:4301},
						{id:430103, name:'天心区',parentId:4301},
						{id:430104, name:'岳麓区',parentId:4301},
						{id:430105, name:'开福区',parentId:4301},
						{id:430111, name:'雨花区',parentId:4301},
						{id:430121, name:'长沙县',parentId:4301},
						{id:430122, name:'望城县',parentId:4301},
						{id:430124, name:'宁乡县',parentId:4301},
						{id:430181, name:'浏阳市',parentId:4301}
					]
				},
				imageUrl: ''
			}
		},
		methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
	}
</script>

<style scoped>
	.tip-info {
		display: inline-block;
		padding: 10px 15px;
		border-radius: 10px;
		background: #f3f7ff;
	}
	.u-avatar-uploader-icon.el-icon-plus.id-card {
		width: 200px;
	  height: 140px;
	  line-height: 140px;
	}
</style>