<template>
	<div>
		<el-breadcrumb class="link-back"
		               separator="/">
			<el-breadcrumb-item to="list">
				<i class="el-icon-arrow-left icon-smaller"></i>门店列表</el-breadcrumb-item>
			<el-breadcrumb-item>新建门店</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clearfix m-t-lg ">
			<div class="ukao-el-form-container pull-left">
				<el-form :model="ruleForm"
				         ref="ruleForm"
				         label-width="160px"
				         class="demo-ruleForm">
					<el-form-item label="门店名称"
					              prop="name"
					              :rules="[
			    { required: true, message: '名称不能为空'},
			    { min: 1, max: 25, message: '长度在1到25个长度', trigger: 'blur' }
			  ]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.name"
							          auto-complete="off"
							          placeholder="请输入门店名称"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="店长姓名"
					              prop="wkName"
					              :rules="[
						{ required: true, message: '请填写姓名'},
						{ min: 1, max: 8, message: '请输入1至8位长度', trigger: 'blur'}
					]">
						<div class="w-lg">
							<el-input v-model="ruleForm.wkName"
							          auto-complete="off"
							          placeholder="请输入姓名"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="店长手机号"
					              prop="wkPhone"
					              :rules="[
						{ required: true, message: '请填写手机号'},
						{ min: 11, max: 11, message: '请输入手机号格式错误', trigger: 'blur'}
					]">
						<div class="w-lg">
							<el-input v-model="ruleForm.wkPhone"
							          auto-complete="off"
							          placeholder="请输入手机号"></el-input>
						</div>
					</el-form-item>

					<el-form-item label="店长登录账号"
					              prop="acc"
					              :rules="[
						{ required: true, message: '账号不能为空'},
						{ min: 3, max: 15, message: '长度在3到15个长度', trigger: 'blur' }
				]">
						<div class="dis-inline w-md">
							<el-input v-model="ruleForm.acc"
							          placeholder="请输入门店店长登录账号">
								<template slot="append">{{ruleForm.symbol}}</template>
							</el-input>
						</div>
					</el-form-item>
					<el-form-item label="店长登录密码"
					              prop="pwd"
					              :rules="[
						{ required: true, message: '密码不能为空'},
						{ min: 6, max: 16, message: '长度在6到16个长度', trigger: 'blur' }
				]">
						<div class="dis-inline w-xl">
							<el-input type="password"
							          v-model="ruleForm.pwd"
							          placeholder="请输入门店店长登录密码"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="所在省市区"
					              :rules="[
			    	{ required: true, message: '所在省市区不能为空'}
			  ]">
						<div class="dis-inline w-xl">
							<el-cascader v-model="selectedOptions"
							             placeholder="请选择/搜索"
							             :options="options"
							             filterable
							             :clearable="true"
							             @change="selected"></el-cascader>
						</div>
					</el-form-item>
					<el-form-item label="详细地址"
					              prop="addrDesc"
					              :rules="[
						{ min: 0, max: 255, message: '长度在0到255个长度', trigger: 'blur' }
				]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.addrDesc"
							          placeholder="请输入门店详细地址"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="门店服务电话"
					              prop="tel"
					              :rules="[
							{min: 6, max: 20,  message: '请输入有效的服务电话' }
					]">
						<div class="dis-inline w-xl">
							<el-input v-model="ruleForm.tel"
							          placeholder="请输入服务电话"></el-input>
						</div>
					</el-form-item>
					<el-form-item label="坐标（经度，纬度）">
						<div class="w-sm dis-inline">
							<el-input v-model="ruleForm.latitude" placeholder="纬度"
												:rules="[{ min: 10, max: 20, message: '长度在10到20个长度', trigger: 'blur' }]"></el-input>
						</div>，
						<div class="w-sm dis-inline">
							<el-input v-model="ruleForm.longitude" placeholder="经度"
												:rules="[{ min: 10, max: 20, message: '长度在10到20个长度', trigger: 'blur' }]">
							</el-input>
						</div>
						<a class="text-primary"
						   target="_blank"
						   href="https://lbs.qq.com/tool/getpoint/">拾取坐标</a>
					</el-form-item>
					<el-form-item label="门店属性"
					              prop="type"
					              :rules="[
						{ required: true, message: '门店不能为空'},
				]">
						<div>
							<template>
								<el-select v-model="ruleForm.type">
									<el-option label="实体店"
									           value="1"></el-option>
									<el-option label="虚体店"
									           value="2"></el-option>
								</el-select>
							</template>
						</div>
					</el-form-item>
					<el-form-item v-if="enableInitProduct">
						<div class="dis-inline w-xl">
							<el-checkbox v-model="initTmpProduct">初始化系统预设产品数据</el-checkbox>
						</div>
					</el-form-item>
					<el-form-item>
						<div>
							<router-link to="/store/list">
								<el-button>取消</el-button>
							</router-link>
							<el-button type="primary"
							           @click="submitForm('ruleForm')">保存</el-button>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>


<script>
import consts from "@/utils/consts";
import auth from "@/utils/auth";
import msg from "@/utils/msg";
import regional from "@/utils/regional";
import md5 from "@/utils/md5";

export default {
  data: function() {
    return {
      ruleForm: {
        name: "",
        cityId: "",
        account: "",
        acc: "",
        password: "",
        pwd: "",
        regionalId: "",
        regionalDesc: "",
        addrDesc: "",
        symbol: "",
        tel: "",
        longitude: "",
        latitude: "",
        wkName: "",
        wkPhone: "",
        type: ""
      },
      initTmpProduct: true,
      enableInitProduct: false,
      mercInfo: {},
      selectedOptions: [], //默认选择省市区
      options: [] //选择地区
    };
  },
  created() {
    this.init();
    this.getRegional();
    this.enableInit();
  },
  methods: {
    init() {
      this.mercInfo = auth.getMercInfo();
      this.ruleForm.symbol = this.mercInfo.symbol;
    },
    getRegional() {
      this.options = regional.all();
    },
    enableInit() {
      this.$store
        .dispatch("post", {
          uri: "tmpProductInfo/enableInit"
        })
        .then(res => {
          this.enableInitProduct = res.data.data == 1;
        });
    },
    initProduct(storeId) {
      this.$store.dispatch("post", {
        uri: "tmpProductInfo/initProduct",
        data: { storeId }
      });
    },
    selected(val) {
      if (val.length == 3) {
        this.ruleForm.regionalId = val[2];
        let province = regional.getProvince(val[0]);
        let city = regional.getCity(val[0], val[1]);
        let area = regional.getArea(val[0], val[1], val[2]);
        this.ruleForm.regionalDesc =
          province[0].label + city[0].label + area[0].label;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.password = md5.hex_md5(this.ruleForm.pwd);
          this.ruleForm.account = this.ruleForm.acc;
          this.$store
            .dispatch("post", {
              uri: "storeInfo/add",
              data: this.ruleForm
            })
            .then(res => {
              if (this.enableInitProduct && this.initTmpProduct) {
                this.initProduct(res.data.data);
              }
              msg.success();
              this.$router.push({ path: "/store/list" });
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.cash-register {
  margin-left: 640px;
  overflow: hidden;
}
.cash-register-img {
  max-width: 100%;
  height: auto;
}
.bg-cash {
  background: #f7f7f7;
}
</style>