<template>
<div class="ukao-pt-lg active_code-exchange box-ft">
  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/finance/service_order/service_market">
            <i class="el-icon-arrow-left icon-smaller"></i>服务市场</el-breadcrumb-item>
          <el-breadcrumb-item>激活码兑换</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
  <el-row>
    <el-col :lg="12" :md="12" :xl="12" :offset="6">
      <div class="box">
        <p>兑换服务</p>
        <el-select style="width:100%" placeholder="请选择要兑换的门店" filterable v-model="storeId1">
          <el-option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <el-input placeholder="请输入激活码" class="box-input" v-model="code"></el-input>
        <el-button type="primary" size="large" @click="useBtn" :loading="shiyongBtnStatus">立即使用</el-button>
      </div>
    </el-col>
  </el-row>
  <el-dialog :visible.sync="dialogVisible" title="兑换激活码">
    <div class="diahead">
      <span style="margin-left:10px;"><label class="text-danger">提醒：</label>激活码一旦激活使用概不支持退票哦~</span>
    </div>
    <div class="diacontent">
        <p>兑换门店：<strong>{{stroeName}}</strong></p>
        <p>服务期限：<strong>通洗门店软件服务期{{detail.cnt}}个月</strong></p>
        <p><label style="visibility: hidden;">立即兑换：</label>
          <el-button type="primary" @click="btnExchange" :loading="duihuanBtnStatus">立即兑换</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </p>
    </div>
  </el-dialog>
</div>  
</template>
<script>
import msg from "@/utils/msg";
export default {
  data () {
    return {
      dialogVisible:false,
      storeList:[],//门店列表
      storeId:"",//获取传过来的门店id
      storeId1:"",//门店下拉框的id
      code:"",
      shiyongBtnStatus:false,
      duihuanBtnStatus:false,
      detail:{},
      stroeName:""
    }
  },
  created () {
     this.getId(this.getStroelist());
  },
  methods: {
     //门店列表
    getStroelist(){
      this.$store.dispatch('post',{
        uri:"storeInfo/list",
        data:{}
      }).then(res=>{
        let _this=this;
        if(this.storeId!==""){
          _this.storeId1=parseInt(_this.storeId);
        }
         this.storeList=res.data.data.list;
      })
    },

     //  获取门店管理传过来的id值
    getId(callback){
      if(this.$route.query.storeId && this.$route.query.storeId!==""){
        this.storeId=this.$route.query.storeId;
      }
      if(typeof callback==="function"){
        callback();
      }
      
    },
    useBtn(){
      this.shiyongBtnStatus=true;
      this.$store.dispatch('post',{
        uri:'activationCode/detail',
        data:{
          code:this.code
        },
        forceResolve:true,
      }).then(res=>{
        if(res.data.httpCode===200){
          this.shiyongBtnStatus=false;
          for(let i=0;i<this.storeList.length;i++){
            if(this.storeList[i].id===this.storeId1){
              this.stroeName=this.storeList[i].name;
            }
          }
          this.detail=res.data.data
          this.dialogVisible=true
        }
        else{
          msg.error(res.data.msg);
          this.shiyongBtnStatus=false;
        }
      })
    },
    btnExchange(){
      this.duihuanBtnStatus=true;
      this.$store.dispatch('post',{
        uri:"activationCode/activation",
        data:{
          storeId:this.storeId1,
          code:this.code
        },
         forceResolve:true,
      }).then(res=>{
        if(res.data.httpCode===200){
          msg.success('操作成功');
          this.$router.push({path:'/finance/service_order/my_service'});
        }
        else{
          this.duihuanBtnStatus=false;
          msg.error(res.data.msg)
        }
      })
      // this.$router.push({path:'./my_service'})
    },

  }
}
</script>

<style lang="less">
.active_code-exchange{
  .box{
     width: 50%;
    margin: 100px auto;
    text-align: center;
    .el-input__inner{
      height: 50px;
    }
    .box-input{
      width: 100%;
      margin: 30px 0px;
    }
    &>:first-child{
      margin-bottom: 30px;
      font-weight: 600;
    }
  }
  .diahead{
    width: 100%;
    background-color: #fff8ca;
    padding: 10px 0px;
  }
  .diacontent{
    width: 500px;
    margin:40px auto 50px;
    & p+p{
      margin-top: 10px;
    }
    &>:last-child{
      margin-top: 40px;
    }
  }
  .el-dialog--small{
    width: 700px;
  }
}

</style>
