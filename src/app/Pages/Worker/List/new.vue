<template>
  <div v-loading="loading" class="ukao-v-loading">
    <div style="margin-bottom: 50px">
 				<el-breadcrumb class="link-back" separator="/">
 					<el-breadcrumb-item to="/worker/list"><i class="el-icon-arrow-left icon-smaller"></i>员工列表</el-breadcrumb-item>
 					<el-breadcrumb-item>新建员工</el-breadcrumb-item>
 				</el-breadcrumb>
 			</div>

    <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
      <el-form-item
        label="角色"  prop="roleId" filterable :rules="[
          { required: true, message: '请选择员工角色'}
        ]">
        <el-select class="w-lg" v-model="ruleForm.roleId" placeholder="请选择" v-if="roleList && roleList.length > 0" @change="selectdropList">
          <el-option
             v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属中转站" prop="transferIds" :rules="[{required:ruleForm.required == 1,message:'中转站不能为空'}]" v-if="dropFlag">
        <el-select v-model="form.transferIds"  multiple collapse-tags>
           <el-option v-for="item in dropList" :label="item.name" :key="item.id" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="ruleForm.roleType == 2 && ruleForm.roleId == 3 " filterable
                    label="所属智柜"  prop="cupboardIds" :rules="[
          { required: ruleForm.required == 1, message: '请选择智柜'}
        ]">
        <el-select class="w-lg" v-model="form.cupboardIds" placeholder="请选择智柜"
                   multiple filterable clearable  v-if="cupboardInfoList && cupboardInfoList.length > 0">
          <el-option
            v-for="item in cupboardInfoList" :key="item.id"  :label="item.name"  :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="ruleForm.roleType == 2" filterable
        label="所属门店"  prop="storeIds" :rules="[
          { required: ruleForm.required == 1, message: '请选择门店'}
        ]">
        <el-select class="w-lg" v-model="form.storeIds" placeholder="请选择门店"
           multiple filterable clearable  v-if="storeInfoList && storeInfoList.length > 0">
          <el-option
              v-for="item in storeInfoList" :key="item.id"  :label="item.name"  :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="ruleForm.roleType == 3" filterable
        label="所属工厂"  prop="factoryIds" :rules="[
          { required: ruleForm.required == 1, message: '请选择工厂'}
        ]">
        <el-select class="w-lg" v-model="form.factoryIds" placeholder="请选择工厂"  v-if="factoryInfoList && factoryInfoList.length > 0"
                   multiple filterable clearable>
          <el-option 
              v-for="item in factoryInfoList" :key="item.id"  :label="item.name"  :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item
        label="姓名" prop="name" :rules="[
          { required: true, message: '请填写姓名'},
          { min: 1, max: 8, message: '请输入1至8位长度', trigger: 'blur'}
        ]">
        <div class="w-lg">
          <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
        </div>
      </el-form-item>
      <el-form-item
        label="手机号"  prop="phone"  :rules="[
          { required: true, message: '请填写手机号'},
          { min: 11, max: 11, message: '请输入手机号格式错误', trigger: 'blur'}
        ]">
        <div class="w-lg">
          <el-input v-model="ruleForm.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </div>
      </el-form-item>
      <el-form-item
        label="登录账号"  prop="account"  :rules="[
          { required: true, message: '请填写登录账号'},
          { min: 6, max: 16, message: '请输入6至16位长度', trigger: 'blur'}
        ]">
        <div class="dis-inline w-md">
          <el-input v-model="ruleForm.account" auto-complete="off" placeholder="数字、字母">
            <template slot="append">{{mercInfo.symbol}}</template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item
        label="登录密码" prop="pwd"  :rules="[
          { required: true, message: '请填写登录密码'},
          { min: 6, max: 16, message: '请输入6至16位长度', trigger: 'blur'},
        ]">
        <div class="w-lg">
          <el-input v-model="ruleForm.pwd" type="password" auto-complete="off" placeholder="请输入6至16位长度登录密码"></el-input>
        </div>
      </el-form-item>
      <el-form :ref="brokerage.refName" :model="brokerage.form" v-if="ruleForm.roleId == 3" label-width="160px">
        <el-form-item label="取件提成类型">
          <el-radio-group v-model="brokerage.form.takeType">
            <el-radio :label="1">比例(%)</el-radio>
            <el-radio :label="2">固定金额(元)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="取件提成" prop="take" :rules="brokerage.takeRule">
          <el-input class="w-md" v-model="brokerage.form.take"></el-input>
        </el-form-item>
        <el-form-item label="送件提成类型">
          <el-radio-group v-model="brokerage.form.sendType">
            <el-radio :label="1">比例(%)</el-radio>
            <el-radio :label="2">固定金额(元)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="送件提成" prop="send" :rules="brokerage.sendRule">
          <el-input class="w-md" v-model="brokerage.form.send"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item label="头像" >
        <Uploader
          class="u-avatar-uploader"
          tip="尺寸为300像素*300像素，大小不超过2M"
          :beforeFn="beforeAvatarUpload"
          :changeFn="handleAvatarChange"
          :successFn="handleAvatarSuccess"
          :saveSuccessFn="handleSaveSuccess"/>
      </el-form-item>
      <el-form-item>
        <router-link to="/worker/list">
          <el-button>取消</el-button>
        </router-link>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="saveLoading">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import consts from '@/utils/consts'
 	import msg from '@/utils/msg'
 	import time from '@/utils/helpers/timeLite'
 	import md5 from '@/utils/md5'
 	import auth from '@/utils/auth'
 	import validate from '@/utils/helpers/validate'
 	import Uploader from '@/components/Uploader'
	import calculation from "@/utils/helpers/calculation";
  import { mapState } from "vuex";

  export default {
    components: {
      Uploader
    },
    computed: {
      ...mapState(["workInfo"])
    },
    data() {
      return {
        loading: true,
        dropFlag:false,
        mercInfo:{},
        roleList:[],
        dropList:[],
        storeInfoList:[],
        cupboardInfoList:[],
        factoryInfoList:[],
        ruleForm: {
          transferIds:'',
          name: '',
          phone: '',
					password: '',
					pwd: '',
					roleType: '',
					roleId: '',
					storeIds: '',
          cupboardIds: '',
					factoryIds: '',
          imgPath: '',
          required: 1
        },
        brokerage:{
					takeRule:[ 
						{required: true, message: '请输入提成' },
						{validator:(rule,value,callback)=>{
							this.checkBrokerage('takeType',value,callback);
						},trigger:'blur'}
					],//表单验证
					sendRule:[ 
						{required: true, message: '请输入提成' },
						{validator:(rule,value,callback)=>{
							this.checkBrokerage('sendType',value,callback);
						},trigger:'blur'}
					],//表单验证
          form:{
            takeType:1, //提成类型
            sendType:1, //提成类型
					  take:0, //取
					  send:0,//送
          },
					refName:'brokerage',
        },
        saveLoading:false, //保存中
        form:{
          storeIds:[],
          cupboardIds:[],
          factoryIds:[],
          transferIds:[],
          // transfer:[],
        }
      }
    },
    created () {
      this.mercInfo = auth.getMercInfo();
    },
    watch : {		//监听选择改变
      'ruleForm.roleId' (id){
        this.ruleForm.factoryId = ''
        this.ruleForm.storeId = ''
        this.ruleForm.cupboardId = ''
        var item = this.filterData(this.roleList, id)
        if(item) {
          if (item.type == 2 && this.storeInfoList.length == 0) {
            this.getStoreInfoList()
          }
          if (item.type == 3 && this.factoryInfoList.length == 0) {
            this.getFactoryInfoList()
          }
          if(item.type == 2 && item.id == 3 && this.cupboardInfoList.length == 0){
            this.getCupboardInfoList();
          }
          this.ruleForm.roleType = item.type
          this.ruleForm.required = item.required
        }
      },
      'form.storeIds'(val){
        this.ruleForm.storeIds = val.join(',')
        this.ruleForm.factoryIds=''
      } ,
      'form.cupboardIds'(val){
        this.ruleForm.cupboardIds = val.join(",");
        this.ruleForm.factoryIds='';
      },
      'form.factoryIds'(val){
        this.ruleForm.factoryIds = val.join(',')
        this.ruleForm.storeIds=''
      },
      'form.transferIds'(val){
        this.ruleForm.transferIds=val.join(',')
      }
    },
    mounted(){
      this.getRoleList()
      setTimeout(()=>{
        this.loading = false
      },300)
    },
    methods: {
      selectdropList(val){
        let Arr=this.roleList;
        let _this=this;
        let flag=false;
        for(let i=0;i<Arr.length;i++){
          if(Arr[i].id===val && Arr[i].type===6){
            _this.gdropList();
            flag=true
            break;
          }
        }

        if(flag){
          this.dropFlag=true;
        }
        else{
          this.dropFlag=false
        }
      },
      gdropList(){
        this.$store.dispatch('post',{
          uri:'transferInfo/dropList',
        }).then(res=>{
          this.dropList=res.data.data.list;
        })
      },
      getRoleList (){
        this.$store.dispatch('post', {
          uri : 'wkRole/queryForSelect',
          data: {isShow: 1}
        }).then((res) =>{
          let list = res.data.data.list || []
          let rList = [];
          if (this.workInfo.roleId === 1 || this.workInfo.roleId === 4 ||
            this.workInfo.roleId === 5 || this.workInfo.roleId === 6) {
            for (let i = 0 ; i < list.length; i ++) {
              if (list[i].level == 2) {
                rList.push(list[i]);
              }
            }
          } else {
            rList = list;
          }
          this.roleList = rList
        })
      },
      getStoreInfoList (){
        this.$store.dispatch('getList', {
          uri : 'storeInfo/queryForSelect',
          data: {}
        }).then((res) =>{
          this.storeInfoList = res.data.data || []
        })
      },
      getCupboardInfoList (){
        this.$store.dispatch('getList', {
          uri : 'cupboardInfo/queryForSelect',
          data: {status: 1}
        }).then((res) =>{
          this.cupboardInfoList = res.data.data || []
        })
      },
      getFactoryInfoList (){
        this.$store.dispatch('getList', {
          uri : 'factoryInfo/queryForSelect',
          data: {}
        }).then((res) =>{
          this.factoryInfoList = res.data.data || []
        })
      },
      filterData (list, id){	//数据过滤
        if (!list && id != '') return
        let tmpItem = null
        list.forEach(function (item) {
         if (id && item.id === id) {
           tmpItem = item
           return false
         }
        })
        return tmpItem;
      },
      async submitForm (formName){
        //校验表单格式
        let flag = false;
        this.$refs[formName].validate((valid) => {
          flag = valid;
        })
        if(!flag || (this.ruleForm.roleId == 3 && !this.brokerageRight())){
          return false;
        }

        // 通过则开始发送请求
        this.saveLoading = true;
        this.ruleForm.password = md5.hex_md5(this.ruleForm.pwd)
        flag = true;
        let msgData = "";
        let result1 = await this.$store.dispatch('post', {
            uri: 'workerInfo/add',
            data: this.ruleForm,
            forceResolve: true
          }).then(
          res=>{
            if(200 === res.data.httpCode){
              if(this.ruleForm.roleId == 3){
                let result2 =  this.addBrokerage(res.data.data.id);
              }
              msg.success();
              this.saveLoading = false;
              this.$router.push({ path: '/worker/list' });
            }else{
              msgData = res.data.msg;
              msg.error(res.data.msg || consts.ERROR_MSG);
              this.saveLoading = false;
            }
          }
        );
      },
      //图片上传模块
       handleAvatarChange(file){
         var _this = this
       },
       handleAvatarSuccess(fileNames) {
         var _this = this
         if (fileNames && fileNames[0]) {
           _this.ruleForm.imgPath = fileNames[0]
         }
       },
       handleSaveSuccess(att){
         this.ruleForm.imgPath = att && att.path ? att.path : this.ruleForm.imgPath
       },
       beforeAvatarUpload(file) {
         const isImg = validate.image(file.type)
         if (!isImg) {
           msg.error('上传文件不是图片！');
         }
         const isLt2M = file.size / 1024 / 1024 < 2;
         if (!isLt2M) {
           msg.error('上传图片大小不能超过 2MB!');
         }
         return isImg && isLt2M;
       },
      //  增加取送员提成
       addBrokerage(id){
				return this.$store.dispatch('post',{
					uri:'workerProfits/add',
					data:{
						workId: id,
						takeType: this.brokerage.form.takeType,
						sendType: this.brokerage.form.sendType,
						take: calculation.accMul(this.brokerage.form.take , 100),
						send: calculation.accMul(this.brokerage.form.send , 100),
					}
				})
      },
      // 取送员提成表单格式是否正确
       brokerageRight(){
        let flag = false;
        this.$refs[this.brokerage.refName].validate((valid) => {
          flag = valid;
        })
        return flag;
       },
       // 校验提成金额
			checkBrokerage(typeName, value, callback){
				let type = this.brokerage[typeName];
				let max = 0,err = '';
				if(type === 1){
					max = 100;
					err = '请输入0-100的数字，最多保留2位小数'
				}else{
					max = 999999;
					err = '请输入0-999999的数字，最多保留2位小数'
				}
				validate.amount(value,2,0,max)
					? callback()
					: callback(new Error(err));
			},
    }
  }

</script>