<template>
  <div>
    <el-breadcrumb class="link-back m-b-md"
                   separator="/">
      <el-breadcrumb-item to="/marketing/code">
        <i class="el-icon-arrow-left icon-smaller"></i>收款码</el-breadcrumb-item>
      <el-breadcrumb-item>新建收款码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="160px"  v-loading="form.loading">
      <el-form-item label="收款码名称："
                    prop="name">
        <el-input class="w m-r-xs"
                  placeholder="请输入名称"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="收款码类型："
                    required
                    prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1" :disabled="form.radio">自助收款码</el-radio>
          <el-radio :label="2" :disabled="form.radio">指定金额收款码</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="收款码金额："
                    :required="form.type === 2"
                    prop="amount"
                    v-if="form.type===2">
        <el-input class="w m-r-xs"
                  placeholder="请输入金额"
                  v-model="form.amount"></el-input>元
      </el-form-item>
      <el-form-item label="设置标签："
                    prop="tagId">
        <el-select v-model="form.tagId"
                   filterable
                   :placeholder="form.placeholder"
                   multiple>
          <el-option v-for="item in params.tags" :label="item.name" :key="item.id" :value="item.id+':'+item.name"></el-option>
        </el-select>
        <!-- <el-input class="w m-r-xs"
                  placeholder="请选择"
                  v-model="form.ddddd"></el-input> -->
        <router-link class="text-primary"
                     to="label">管理标签</router-link>
      </el-form-item>
      <el-form-item label="收银台优惠："
                    prop="benefitId">
        <el-select v-model="form.benefitId"
                   placeholder="请选择">
          <el-option v-for="item in params.couppns" :label="item.coupon" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm" :disabled="form.btnstatu">取消</el-button>
        <el-button type="primary"
                   :loading="saving"
                   @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import validate from "@/utils/helpers/validate";
export default {
  data() {
    return {
      saving: false,
      form: {
        name: "",
        type: 1,
        amount: "",
        tagId:[],
        tags:[],
        benefitId: '',
        id:'',
        radio:'',
        placeholder:'请选择',
        btnstatu:false,
        loading:false
      },
      params:{
        tags:[],
        couppns:[],
      },
      rules: {
        name: [
          { required: true, message: "请输入名称" },
          { min: 2, max: 24, message: "长度在 2 到 24 个字符", trigger: "blur" }
        ],
        amount: [
          {
            validator: (rule, value, callback) => {
              this.form.type === 2
                ? validate.amount(value, 2, 0.01, 999999)
                  ? callback()
                  : callback(new Error("金额格式错误"))
                : callback();
            }
          }
        ]
      }
    };
  },
  created(){
    this.getTags();
    this.getCoupon();
    if(this.$route.query.id){
      this.form.id=this.$route.query.id
      this.form.loading=true
      this.form.radio=true;
      this.form.btnstatu=true;
      this.getDataEdit();
    }
    else{
      this.form.radio=false;
    }
  },
  methods: {
    getDataEdit(){
      this.$store.dispatch('post',{
        uri:'cashierCode/detail',
        data:{
          id:this.form.id
        }
      }).then(res=>{
        let item=res.data.data;
        this.form.name=item.name;
        this.form.type=item.type;
        this.form.amount=item.amount || ""; 
        this.setEditTags(item);
        this.form.benefitId=item.benefitId;
      })
    },
    setEditTags(item){
       this.form.loading=false
      let tagArr=eval(item.tags);
      let _this=this
      for(let i=0;i<tagArr.length;i++){
        _this.form.tagId[i]=tagArr[i].id+''+':'+tagArr[i].name || ""
      }
      // _this.onChange();
      if(this.form.tagId!==null && this.form.tagId.length!==0){
         this.form.placeholder='';
      }
    },
    // 提交
    submit() {
      this.$refs.form.validate(value => {
        if (value) {
          this.createCode();
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },
    // 创建二维码
    createCode() {
      this.saving = true;
        let _this=this;
        _this.form.tags = [];
       _this.form.tagId.forEach(function(item){
         let arr = item.split(":");
         let data = {};
         data.id=arr[0];
         data.name = arr[1];
         _this.form.tags.push(data);
       })
      if( _this.form.tagId===null && _this.form.tagId.length===0 ){
        this.form.placeholder='请选择'
      }
      _this.$store
        .dispatch("post", {
          uri:_this.form.id ? 'cashierCode/update' :"cashierCode/add",
          data: {
            id:_this.form.id ? _this.form.id:'',
            name:_this.form.name,
            type:_this.form.type,
            tags:JSON.stringify(_this.form.tags),
            amount:_this.form.amount,
            benefitId:_this.form.benefitId
          }
        })
        .then(res => {
          msg.success();
          _this.resetForm();
          _this.saving = false;
          _this.$router.push({path:'/marketing/code/list'});
        });
    },
    
    getTags(){
      let _this=this
      this.$store.dispatch('post',{
        uri:'cashierTag/list',
      }).then(res=>{
        this.params.tags=res.data.data.list ||[];
      })
    },
    getCoupon(){
      this.$store.dispatch('post',{
        uri:'cashierBenefit/list'
      }).then(res=>{
        this.params.couppns=res.data.data.list || [];
        this.params.couppns.forEach(function(item){
          item.coupon='满'+item.fullAmount+'元减'+item.amount+'元'
        })
      })
    },
    
  }
};
</script>
