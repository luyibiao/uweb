<template>
<div class="box-ft" v-loading="divloading">
  <div v-for="item in tableData" class="box-wrap">
    <div v-if="item.enable ">
      <div class="bill_detail" :class="item.freeze===1 ? 'bill-w-t' : 'bill-w-f'" v-if="item.id && item.freeze<1 && detail.notPayAmt">
        <div class="bill_detail-t">
          <div>
            <p>{{detail.notPayTime}}月账单</p>
            <p class="text-danger text-money">￥{{detail.notPayAmt | amtFormat}}</p>
            <p><router-link :to="'/marketing/serviceShop/trade_find'" class="text-primary">查看账单明细</router-link></p>
          </div>
          <div class="ver-position2">
            <p>请您按照与通洗签订的协议将上月款项付给通洗，如已支付，请忽略</p>
          </div>
        </div>
      </div>
      <div v-if="!countFlag && !item.id" class="bill-dong">
        <p>未开通服务商</p>
      </div>
      <div v-if="item.freeze===1" class="bill-dong">
        <p>由于未及时把上月款项付给通洗，您的取送服务商功能已被冻结，如需启用，请联系客服开通</p>
      </div>
    </div>
  <div class="wrap" :class="{'w-th-disabled':countFlag,'w-th-enable':!countFlag}">
    <div class="box">
      <div>
        <img src="/static/img/marketing/sf_logo.png">
        <!--<div class="a-btn" v-if="item.id && item.freeze===0 && item.enable">-->
           <!--<el-radio-group v-model="item.expressAuto" size="mini" @change="updateAuto(item)">-->
            <!--<el-radio :label="0" border>手动派单</el-radio>-->
            <!--<el-radio :label="1" border>自动派单</el-radio>-->
          <!--</el-radio-group>-->
        <!--</div>-->
      </div>
      <div>
        <div class="row_first">
          <label class="title">{{item.type | getValText('EXPRESS_TYPE')}}</label>
          <span :class="{'text-success':item.status===1,'text-danger':item.status===0}" v-if="item.id && item.enable && item.freeze<1">{{item.id && item.status ?  '使用中' :'已暂停使用'}}</span>
          <el-button type="text" @click="$router.push({path:'/marketing/serviceShop/carriage',query:{type:item.type}})">设置取送费</el-button>
          <div class="pull-right" style="text-align:right">
            <span v-if="!item.id || !item.enable"> 
              <p>如需启用，请微信扫码联系客服开通</p>
              <img src="/static/img/marketing/code.png">
            </span>
            <span> <el-button type='primary'  @click="openDialog(item)">修改地址</el-button></span>
            <span v-if="item.id && item.freeze<1 && item.enable">
              <el-button :type="item.status ? 'danger' :'success'"  @click="enabDis(item)">{{item.status ? '暂停' : '恢复'}}使用</el-button>
            </span>
            <span v-else-if="item.freeze===1" class="frozen">
              <img src="/static/img/marketing/frozen.png">
            </span>
          </div>
        </div>
        <div class="row_two" v-if="!item.enable || countFlag">
          <p>月结类型：</p>
          <p v-if="item.isAgent===0">月结账号：</p>
          <p>收件人姓名：</p>
          <p>收件人联系方式：</p>
          <p>收件人地址：</p>
          <p v-if="item.isAgent===1">保证金：</p>
        </div>
        <div class="row_two" v-else>
          <p>月结类型：<label>{{item.isAgent!==null ? item.isAgent===0 ? '自有月结账号' :'通洗月结账号' : ""}}</label></p>
          <p v-if="!item.id || item.isAgent===0">月结账号：<label>{{item.settleNum}}</label></p>
          <p>收件人姓名：<label>{{item.pickupName}}</label></p>
          <p>收件人联系方式：<label>{{item.pickupPhone}}</label></p>
          <p>收件人地址：<label v-if="item.id">{{`${item.pickupRegionalDesc+item.pickupDetail}`}}</label></p>
          <p v-if="!item.id || item.isAgent===1">保证金：<label>{{item.deposit | amtFormat}}<span v-if="item.id">元</span></label></p>
          <p v-if="updateRemark">
            <el-input class="u-lg" v-model="item.remark" @blur="changeRemark(item)" v-focus="updateRemark" @keyup.enter.native="changeRemark(item)"></el-input>
          </p>
          <p v-if="!updateRemark">派单备注：
            <label>{{item.remark}}</label>
            <el-button class="pull-right btn-small" small="size" @click="updateRemark=true" v-if="item.id && item.freeze===0">修改</el-button>
          </p>
        </div>
      </div>
    </div>
   </div>
  </div>
   <div class="card_detail" v-if="countFlag">
    <el-tabs type="border-card">
      <el-tab-pane label="详情">
        <div class="detail_img">
        </div>
      </el-tab-pane>
      <el-tab-pane label="教程">配置管理</el-tab-pane>
    </el-tabs>
  </div>
  <el-dialog  title="修改地址" :visible.sync="dialogVisible">
    <div class="form">
      <el-form :model="ruleForm" label-width="110px" ref="ruleForm" label-position="left">

        <el-form-item label="收件人姓名" :rules="[{required:true,message:'姓名不能为空',trigger:'blur'}]" prop="pickupName">
          <el-input class="w-lg" placeholder="请输入收件人姓名" v-model="ruleForm.pickupName" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人手机号" :rules="[{required:true,message:'手机号不能为空'},{ validator: checkPhone, message: '请输入正确的手机号', trigger: 'blur' }]" prop="pickupPhone">
          <el-input class="w-lg" v-model="ruleForm.pickupPhone" placeholder="请输入收件人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人地址：" prop="pickupRegionalDesc" :rules="[{required:true,message:'收件地址不能为空',trigger:'change'}]" class="add-res">
          <div class="add-w-lg w-lg">
            <p @click="selecetAddres"><el-input v-model="ruleForm.pickupRegionalDesc" readonly="readonly" :class="{'b-t-none':addresShow }"  placeholder="请选择所在地区，如：湖南省 长沙市 岳麓区" ></el-input></p>
            <!-- {{}} -->
            <div class="ul-wrap" v-show="addresShow">
              <a class="a-btns" :class="{'curr-active':addActive===1}" @click="onAbtn(1)">{{addresName.provinceName || '省/直辖市'}}</a>
              <a class="a-btns" :class="{'curr-active':addActive===2,'curr-hidden':!recordAddes.city}" @click="onAbtn(2)">{{addresName.cityName || '请选择'}}</a>
              <a class="a-btns" :class="{'curr-active':addActive===3,'curr-hidden':!recordAddes.distri}" @click="onAbtn(3)">{{addresName.districtName || '请选择'}}</a>
              <div class="ul">
                <ul v-if="addActive===1">
                  <li v-for="item in provinceItems" :key="item.value"><a @click="chooseProv(item)" :class="{'is-selected':item.selectProm}" :title="item.label">{{item.label}}</a></li>
                </ul>
                <ul v-else-if="addActive===2">
                  <li v-for="item in cityItems" :key="item.value"><a @click="chooseCity(item)" :class="{'is-selected':item.selectCity}" :title="item.label">{{item.label}}</a></li>
                </ul>
                <ul v-else-if="addActive===3">
                  <li v-for="item in districtItem" :key="item.value"><a @click="chooseDis(item)" :class="{'is-selected':item.selectDistri}" :title="item.label">{{item.label}}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-input v-model="ruleForm.pickupDetail" class="w-lg" placeholder="请填写所在街道及详细地址" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="updatePickup">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</div>  
</template>
<script>
import msg from "@/utils/msg";
import regional from '@/utils/regional'
import validate from '@/utils/helpers/validate'

export default {
  data () {
    return {
      ruleForm:{
        id:'',//信息id
        pickupName:'',//收件人姓名
        pickupPhone:'',//收件人手机号
        pickupRegionalDesc:'',//收件人地址
        pickupDetail:'',//详细地址
        pickupRegionalId:''
      },
      recordAddes:{//记录省市菜单是否被选择过
        city:false,
        distri:false
      },
      addresName:{//存储城市名字
        provinceName:'',
        cityName:'',
        districtName:''
      },
      provinceItems:[],//省份选择
      cityItems:[],//城市选择
      districtItem:[],//区域选择
      divloading:'',
      addActive:1,//选择地址进度标志
      addresShow:false,//地址选择框出现
      updateRemark:false,
      expressAuto:'',
      countFlag:false,//是否开通了服务商
      dialogVisible:false,
      already:true,//当是自有通结账号且点击了已付款时

      detail:{},
      tableData:[],
    }
  },
  created () {
    this.init();
    this.getList();
  },
  directives: {
    focus:{
      inserted(el){
         el.children[0].focus(); //默认选中
      }
    }
  },
  methods: {
    init(){
      let Arr=regional.getProvince();
      Arr.forEach(function(item){
        item.selectProm=""
      })
      this.provinceItems = Arr;
    },
    getList(){
      this.divloading=true;
      this.$store.dispatch('post',{
        uri:'expressParam/config/list',
      }).then(res=>{
        let Arr=res.data.data;
        if(Arr.length>0){
           Arr.forEach(ele => {
          // ele.url=this.$options.filters.getValText()
          ele.id && !ele.freeze ? this.getStatus(ele.status) :'';
          });
        }
        if((Arr.length===1 && !Arr[0].id)){
          this.countFlag=true;
        }
         this.divloading=false;
         this.tableData=Arr;
      })
    },
    getStatus(type){
      this.$store.dispatch('post',{
        uri:'expressBill/queryNotPayAmt'
      }).then(res=>{
        this.detail=res.data.data;
      })
    },
    enabDis(item){
      this.$store.dispatch('post',{
        uri:'expressParam/updateStatus',
        data:{
          id:item.id,
          status:item.status ? 0:1,
        }
      }).then(res=>{
        msg.success();
        this.getList();
      })
    },
    changeRemark(item){
      this.updateRemark=false;
      let remark=item.remark
      this.$store.dispatch('post',{
        uri:'expressParam/update',
        data:{
          id:item.id,
          remark:remark,
        }
      }).then(res=>{        
        msg.success();
        this.getList();
      }
      )
    },
    updateAuto(item){
      this.$store.dispatch('post',{
        uri:'expressParam/update',
        data:{
          id:item.id,
          expressAuto:item.expressAuto
        }
      }).then(res=>{        
        msg.success();
        this.getList();
      }
      )
    },
    updatePickup(){
      this.$store.dispatch('post',{
        uri:'expressParam/update',
        data:{
          ...this.ruleForm
        }
      }).then(res=>{
          msg.success();
          this.dialogVisible = false;
          this.getList();
        }
      )
    },
    openDialog(item){
      this.ruleForm.id = item.id || '';
      this.ruleForm.pickupName = item.pickupName || '';
      this.ruleForm.pickupPhone = item.pickupPhone || '';
      this.ruleForm.pickupRegionalDesc = item.pickupRegionalDesc || '';
      this.ruleForm.pickupDetail = item.pickupDetail || '';
      this.dialogVisible = true

    },
    selecetAddres(){
      this.addresShow=true
    },
    chooseProv(selectedItem){
      this.recordAddes.city=true
      this.provinceItems.forEach( function (item, index) {
        item.selectProm = false
      });
      selectedItem.selectProm = true;
      let Arr=regional.getCity(selectedItem.value);
      Arr.forEach(function(item){
        item.selectCity=""
      })
      if(!this.addresName.provinceName.includes(selectedItem.label)){
        this.addresName.cityName="";
        this.addresName.districtName=""
      }
      this.addresName.provinceName=selectedItem.label
      this.cityItems = Arr;
      this.addActive=2;
      this.cheak();
    },
    chooseCity(selectedItem){
      this.cityItems.forEach( function (item, index) {
        item.selectCity = false
      });
      selectedItem.selectCity = true;
      let Arr=regional.getArea(selectedItem.parentId, selectedItem.value);
      Arr.forEach(function(item){
        item.selectDistri=""
      })
      // if(!this.addresName.cityName.includes(selectedItem.label)){
      //   this.addresName.districtName=""
      // }
      this.addresName.cityName=selectedItem.label
      this.districtItem = Arr
      if(Arr.length<=0){
        this.addresShow=false;
        this.addresName.districtName=""
        this.ruleForm.pickupRegionalId=selectedItem.parentId
        return;
      }
      this.recordAddes.distri=true;
      this.addActive=3;
      this.cheak();
    },
    cheak(){
      this.ruleForm.pickupRegionalDesc  = this.addresName.provinceName+(this.addresName.cityName==="" ? "" : '-'+this.addresName.cityName)+(this.addresName.districtName==="" ? "" : '-'+this.addresName.districtName)
    },
    chooseDis(selectedItem){
      this.districtItem.forEach( function (item, index) {
        item.selectDistri = false
      });
      selectedItem.selectDistri = true;
      this.addresName.districtName=selectedItem.label;
      this.addresShow=false;
      this.ruleForm.pickupRegionalId=selectedItem.parentId
      this.cheak();
    },
    onAbtn(type){
      this.addActive=type
    },
    checkPhone(rule, value, callback) {
      if (!validate.tel(value)) {
        callback(new Error());
      } else {
        callback();
      }
    },
  },
  watch:{
    addresShow:{
      handler(){
        if(!this.addresShow){
          this.addActive=1;
          this.ruleForm.pickupRegionalDesc=`${this.addresName.provinceName}-${this.addresName.cityName}${this.addresName.districtName==="" ? "" : "-"+this.addresName.districtName}`
        }
      }
    },
    dialogVisible:{
      handler(){
        if(!this.dialogVisible){
          this.addresShow=false;
          return;
        }

      }
    }
  }
}
</script>

<style scoped lang="less">
.bill-w-f{
  width: 560px;
}
.bill-w-t{
  width: 300px;
}
.bill_detail{
  margin: 0px auto 30px;
  padding: 15px 20px;
  background-color: #fff8ca;
  border:1px solid #ffe0ab;
}
.bill-dong{
   margin: 0px auto 30px;
   width: 300px;
   padding: 15px 20px;
   background-color: #fff8ca;
}
.bill_detail-t{
  width: 100%;
  display: table;
}
.bill_detail-t>div{
  display: table-cell;
}
.bill_detail-t>div:first-child{
  padding-right: 20px;
  border-right: 2px solid #ffe9af;
  overflow: hidden;
  // background-color: pink;
}
.bill_detail-t>div:first-child>p+p{
  margin-top: 10px;
}
.bill_detail-t>div:last-child{
  // width: 72%;
  position: relative;
  p{
    margin-left: 25px;
  }
  .sf-p{
    margin-top: 15px;
  }
  .btn{
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
.ver-position1{
  vertical-align: top;
}
.ver-position2{
  vertical-align: middle;
}
.text-money{
  font-size: 22px;
}
.w-th-disabled{
 width: 100%;
}
.w-th-enable{
 width: 1000px;
}
.wrap{
  margin: 0 auto;
  padding: 20px 0px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
}
.box{
  position: relative;
  display: table;
  width: 96%;
  margin: 0px auto;
}
.box>div{
  display: table-cell
}
.box>div:first-child{
  width: 175px;
  img{
    vertical-align: top;
  }
}
.box>div:nth-child(2){
  vertical-align: top;
  .title{
    font-size: 21px;
    font-weight: 600;
  }
  p{
    margin-top: 20px;
    color: #9c9c9c;
  }
  label{
    font-size: 13px;
    color: #000;
  }
  .row_first p{
    margin-top: 0px;
  }
}
.frozen{
  position: absolute;
  top: -20px;
  right: -20px;
}
.card_detail{
  margin-top: 20px;
}
.detail_img{
  width: 100%;
  height: 600px;
  background: url('/static/img/marketing/service_detail.jpg') no-repeat center;
}
.el-tabs--border-card{
  -webkit-box-shadow: none;
  box-shadow: none; 
}
.box-wrap+.box-wrap{
  margin-top: 20px;
}
.btn-small{
  padding: 7px 14px;
}
.u-lg{
  width: 300px;
}
.el-radio.is-bordered+.el-radio.is-bordered{
  margin-left: 0px;
}
.el-radio.is-bordered{
   margin-top:10px;
}

.add-w-lg {
   width: 450 px;
  min-height: 40px;
}&>P{
    margin-top: 0px !important;
  }

.ul-wrap{
  max-width: 100%;
  padding: 0 30px;
  margin-top: -1px;
  overflow: hidden;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-top: none;
// border-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  .ul{
    border-top: 2px solid #20a0ff;
    ul{
      list-style: none;
    }
    ul li{
      float: left;
      width: 25%;
      text-align: center;
      font-size: 12px;
      height: 30px;
      a{
        display: inline-block;
        min-width: 40px;
        max-width: 60px;
        height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        line-height: 30px;
      }
      a:hover{
        background-color: #e9f3fd
      }
      a.is-selected{
        background-color: #20a0ff;
        color:#ffffff;
      }
    }
  }
}

.form{
  width: 80%;
  margin: 0 auto;
}

.a-btns{
  width: 33%;
  margin:0px -1px;
  text-align: center;
  display: inline-block;
  color: #20a0ff;
// overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
// background-color: #fff;
}
</style>
