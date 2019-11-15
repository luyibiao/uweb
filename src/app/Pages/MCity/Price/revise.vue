<template>
	<div>
		<div class="m-l-xxl">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			  <el-form-item class="w-xxl" label="产品名称" prop="name">
			    <el-input v-model="ruleForm.name"></el-input>
			  </el-form-item>
			  <el-form-item class="w-lg" label="所属类别" prop="category">
			  	<el-select v-model="ruleForm.category" placeholder="请选择所属类别">
			      <el-option label="上装" value="上装"></el-option>
			      <el-option label="下装" value="下装"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item class="w-lg" label="所属类别" prop="priceStyle">
			  	<el-select v-model="ruleForm.priceStyle" placeholder="请选择计价方式">
			      <el-option label="按件" value="按件"></el-option>
			      <el-option label="按件" value="按件"></el-option>
			    </el-select>
			  </el-form-item>
		  	<el-form-item label="服务及价格">
		  		<div class="price-item" v-for="item in priceList">
		  			<el-checkbox v-model="item.checkbox" :label="item.name"></el-checkbox>
		  			<el-input v-model="item.input" placeholder="请输入价格"></el-input>元
		  		</div>
			  </el-form-item>
			  <el-form-item class="w-lg" label="折扣" prop="discount">
			  	<el-select v-model="ruleForm.discount" placeholder="请选择折扣">
			      <el-option label="会员折扣" value="会员折扣"></el-option>
			      <el-option label="黄钻" value="黄钻"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item class="w-lg" label="输送线" prop="line">
			  	<el-select v-model="ruleForm.line" placeholder="请选择输送线">
			      <el-option label="输送线" value="输送线"></el-option>
			      <el-option label="折叠区" value="折叠区"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item class="w-xxl" label="首字母" prop="initialLetter">
			    <el-input v-model="ruleForm.initialLetter"></el-input>
			  </el-form-item>
			  <el-form-item class="w-xxl" label="序号" prop="orderNum">
			    <el-input v-model="ruleForm.orderNum"></el-input>
			  </el-form-item>
			  <el-form-item label="产品图片" prop="img">
			  	<p class="text-muted text-xs">建议尺寸为246像素*224像素，大小不超过500kb</p>
			    <el-upload
					  class="u-avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="imageUrl" :src="imageUrl" class="u-avatar">
					  <i v-else class="el-icon-plus u-avatar-uploader-icon"></i>
					</el-upload>
			  </el-form-item>
			  <el-form-item>
			  	<el-button>取消</el-button>
			    <el-button type="primary">保存</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				dialogImageUrl: '',
        dialogVisible: false,
				priceList: [
					{ checkbox: false, input: '20', name: '普洗' },
					{ checkbox: false, input: '', name: '单烫' },
					{ checkbox: false, input: '', name: '洗衣护理' }
				],
				ruleForm: {
          name: '洗衣',
          img: '/static/img/avatar.jpg',
          category: '上装',
          priceStyle: '',
          discount: '黄钻',
          line: '输送线',
          initialLetter: 'XY',
          orderNum: '01'
        },
        rules: {
          name: [
            { required: true, message: '请输入产品名称', trigger: 'blur' }
          ],
         	category: [
            { required: true, message: '请选择所属类别', trigger: 'change' }
          ],
          priceStyle: [
            { required: true, message: '请选择计价方式', trigger: 'change' }
          ],
          discount: [
            { required: true, message: '请选择会员', trigger: 'change' }
          ],
          line: [
            { required: true, message: '请选择输送线', trigger: 'change' }
          ],
          initialLetter: [
            { message: '请输入首字母', trigger: 'blur' },
            { min: 1, max: 1, message: '长度位1个字符', trigger: 'blur' }
          ],
          orderNum: [
            { message: '请输入序号', trigger: 'blur' }
          ],
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
	.price-item {
		margin-bottom: 15px;
	}
	.price-item:last-child {
		margin-bottom: 0;
	}
	.price-item .el-checkbox {
		width: 120px;
	}
	.price-item .el-input {
		width: 120px;
		margin-right: 10px;
	}

	
</style>