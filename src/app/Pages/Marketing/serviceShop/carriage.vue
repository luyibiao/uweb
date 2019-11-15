// 取送费
<style lang="less">
.carriage-content-money{
  @bg:#f8f8f8;
  @bd:#e5e5e5;
  .wrap{
    margin: 70px auto; 
    width: 1000px;
  }
  .head-set{
    display: flex;
    width: 100%;
    padding: 30px 0px;
    justify-content: space-between;
    background-color: @bg;
    &>*{
      align-self: center;
      margin: 0px 10px;
    }
    .span-p p+p{
      margin-top: 5px;
    }
  }
  .content-set{
    margin-top: 30px;
    width: 100%;
  }
  .content-set table{
    width: 100%;
    border: 1px solid @bd;
    &>tr:first-child{
      height: 40px;
      background-color: @bg;
    }
    & td:first-child{
      width: 10%;
      padding-left: 24px;
      box-sizing: border-box;
      overflow: hidden;
    }
    & td:last-child{
      width: 10%;
    }
    & td+td{
     width: 26%;
    }
  }
  .content-set>table>tr:nth-child(2){
    border-bottom: 1px solid @bd;
  }
  .tr-he{
    height: 80px;
  }
  .tr-add{
    height: 30px;
    & span:nth-child(2){
      margin-left: 15px;
    }
  }
  .ipt{
    width: 80px;
    margin-right: 8px;
  }
  .cu-left{
    margin-left: 8px;
  }
  .el-input__inner{
    padding: 0px 0px 0px 15px;
  }
  
  .btn-fotter{
    margin-top: 30px;
  }
  .position-span{
    position: relative;
    &>p{
      position: absolute;
      left: 20px;
    }
  }
}

</style>
<template>
  <div class="carriage-content-money" v-loading="loading">
    <div class="header-nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="./service_shop">
          <i class="el-icon-arrow-left icon-smaller"></i>取送服务商</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.query.type | getValText('EXPRESS_TYPE')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrap">
      <div class="head-set">
        <span class="span-p">
          <p>取送费设置</p>
          <p class="text-muted">启用后商家可设置订单金额的取件费及送件费</p>
        </span>
        <span>
           <el-switch class="text-base" v-model="open" active-color="#13ce66" inactive-color="#dcdcdc" active-text="开启" inactive-text="关闭" ></el-switch>
        </span>
      </div>
      
      <div class="content-set">
        <table>
          <tr>
            <td>层级</td>
            <td>订单总额</td>
            <td>取件费</td>
            <td>送件费</td>
            <td>操作</td>
          </tr>
          <tr class="tr-he">
            <td>
              1
            </td>
            <td>
              <span>
                   未满<el-input class="ipt cu-left" :min="0" :max="9999" type="number"  v-model="form.freeCarriageAmt1" :disabled="!open"></el-input>元
              </span>
              <!-- <span v-if="index && index>=1" class="position-span">
                   满{{form.fullTotal}}元， 未满<el-input class="ipt cu-left" :min="form.freeCarriageAmt0" :max="9999" type="number"  v-model="form.freeCarriageAmt+index"></el-input>元
                   <p v-if="textFlag" class="text-danger box-ft">未满金额不能少于一级未满金额</p>
              </span> -->
            </td>
            <td>
              <span>
                 <el-input class="ipt" :min="0" :max="9999"  type="number" v-model="form.takeCarriage1" :disabled="!open"></el-input>元
              </span>
            </td>
            <td>
              <span>
                 <el-input class="ipt" :min="0" :max="9999"  type="number" v-model="form.sendCarriage1" :disabled="!open"></el-input>元
              </span>
            </td>
            <td>
            </td>
          </tr>
          <tr class="tr-add" v-if="add && open">
            <td colspan="5">
              <el-button class="text-primary" type="text" @click="addfn">+新增一级运费</el-button>
              <span class="text-muted">最多可设置两个层级</span>
            </td>
          </tr>
          <tr class="tr-he" v-for="(item,index) in listcur" v-if="listcur.length>0">
            <td>
              {{index+2}}
            </td>
            <td>
              <span class="position-span">
                满{{form.freeCarriageAmt1}}元， 未满<el-input class="ipt cu-left" :min="form.freeCarriageAmt1" :max="9999" type="number"  v-model="form.freeCarriageAmt2" :disabled="!open"></el-input>元
                <p v-if="textFlag.textfres" class="text-danger box-ft">未满金额不能少于一级未满金额</p>
              </span>
            </td>
            <td>
              <span>
                 <el-input class="ipt" :min="0" :max="9999"  type="number" v-model="form.takeCarriage2" :disabled="!open"></el-input>元
              </span>
            </td>
            <td>
              <span>
                 <el-input class="ipt" :min="0" :max="9999"  type="number" v-model="form.sendCarriage2" :disabled="!open"></el-input>元
              </span>
            </td>
            <td>
              <el-button type="text" class="text-primary" @click="deleteFn(item)" v-if="list.length>1" :disabled="!open">删除</el-button>
            </td>
          </tr>
        </table>
      </div>

      <div class="btn-fotter">
        <el-button @click="$router.push('/weixin/cancel')" >取消</el-button>
        <el-button type="primary" @click="save" >保存</el-button>
      </div>
    </div>
  </div>  
</template>
<script>
import msg from "@/utils/msg";
import calculation from "@/utils/helpers/calculation";

let strJson={
         "id":'',
         "freeCarriageAmt":'',
          "takeCarriage":'',
          "sendCarriage":''
      }
export default {
  data() {
    return {
      loading:true,
      open: false, //是否开启取送费
      form: {
        freeCarriageAmt1:0,
        takeCarriage1:0,
        sendCarriage1:0,
        freeCarriageAmt2:0,
        takeCarriage2:0,
        sendCarriage2:0  
      },
      textFlag:{
        textfres:false,
      },
      mercCityInfo: null, //运费信息
      add:true,
      list:[],
      listcur:[],
    };
  },
  watch: {
    listcur(){
       if(this.listcur.length>0){
         this.add=false
         return;
       }
       this.add=true;
    }
  },
  created() {
    this.getList();
    this.getMercCityInfo();
  },
  methods: {
    addfn(){
       this.listcur.push(strJson)
    },
    getList(){
      this.$store.dispatch('post',{
        uri:'mercCityCarriage/list',
        data:{
          carriagePerch:2,
          type:this.$route.query.type
        }
      }).then(res=>{
        this.list=res.data.data.list;
         this.listcur=[];
         this.formatMoney(this.list,'accDiv');
        if(this.list.length>=2){
          this.listcur.push(this.list[1]);
          this.form.freeCarriageAmt2=this.list[1].freeCarriageAmt;
          this.form.takeCarriage2=this.list[1].takeCarriage;
          this.form.sendCarriage2=this.list[1].sendCarriage;
        }
        this.loading=false;
        if(this.list.length===0){
          this.list.push(strJson);
          this.open=false;
          return;     
        }
        this.open=parseInt(this.list[0].flag)===1 ? true :false;
        this.form.freeCarriageAmt1=this.list[0].freeCarriageAmt;
        this.form.takeCarriage1=this.list[0].takeCarriage;
        this.form.sendCarriage1=this.list[0].sendCarriage;
      })
    },

    save() {
      function queryNum(data){
        data=parseInt(data)
        if(data<0 || data>9999){
          return false
        }
        return true;
      }
      let _this=this;

      function queryNumTwo(data,str=''){
        if(!_this.add){
          data=parseInt(data)
         if(str==='this.form.freeCarriageAmt2'){
             if(data < 0 || data > 9999 || data<=_this.form.freeCarriageAmt1){
               _this.textFlag.textfres=true
               return false
             }
             else{
                 _this.textFlag.textfres=false;
             }
          }
          if(data < 0 || data > 9999){
            return false
          }
          return  true
        }
        return true
      }
      if(queryNum(this.form.freeCarriageAmt1) && queryNum(this.form.takeCarriage1) && queryNum(this.form.sendCarriage1)&&queryNumTwo(this.form.freeCarriageAmt2,'this.form.freeCarriageAmt2')
        &&queryNumTwo(this.form.takeCarriage2)&&queryNumTwo(this.form.sendCarriage2)
      ){
       
        let Arr=[];
        let str={...strJson};
        str.id=this.list[0].id;
        str.freeCarriageAmt=this.form.freeCarriageAmt1;
        str.takeCarriage=this.form.takeCarriage1;
        str.sendCarriage=this.form.sendCarriage1
        Arr.push(str);
        if(this.listcur.length===1){
          let str1={...this.listcur[0]};
          str1.id=this.listcur[0].id;
          str1.freeCarriageAmt=this.form.freeCarriageAmt2;
          str1.takeCarriage=this.form.takeCarriage2;
          str1.sendCarriage=this.form.sendCarriage2
          Arr.push(str1);
          // return;
        }
        _this.formatMoney(Arr,'accMul');
      }
    },
    setexpres(Arr){
      this.$store.dispatch('post',{
        uri:'mercCityCarriage/save',
        data:{
          carriagePerch:2,
          flag:this.open ? 1 :0,
          type:this.$route.query.type,
          jsonData:JSON.stringify(Arr)
        }
      }).then(
        res=>{
          msg.success();
          this.getList();
        }
      )
    },

    formatMoney(Arr,type,fn){

      if(type==='accMul'){
         for(let i=0;i<Arr.length;i++){
          Arr[i].freeCarriageAmt=calculation.accMul(Arr[i].freeCarriageAmt,100);
          Arr[i].takeCarriage=calculation.accMul(Arr[i].takeCarriage,100);
          Arr[i].sendCarriage=calculation.accMul(Arr[i].sendCarriage,100);
        }
       this.setexpres(Arr);
      }
      else{
        for(let i=0;i<Arr.length;i++){
          Arr[i].freeCarriageAmt=calculation.accDiv(Arr[i].freeCarriageAmt,100);
          Arr[i].takeCarriage=calculation.accDiv(Arr[i].takeCarriage,100);
          Arr[i].sendCarriage=calculation.accDiv(Arr[i].sendCarriage,100);
        }
      }
    },
    deleteFn(item){
      msg.confirm({
        msg: "确认删除？",
        confirmFn: _ => {
          this.$store
            .dispatch("post", {
              uri: "mercCityCarriage/delete",
              data: {
                id:item.id
              }
            })
            .then(res => {
              msg.success();
              this.getList();
            });
        }
      });
    },
    getMercCityInfo() {
      //获取运费相关信息
      this.$store
        .dispatch("get", {
          uri: "mercCityParam/detail"
        })
        .then(res => {
          this.mercCityInfo = res.data.data; //获取数据
          this.mercCityInfo.freeCarriageAmt = this.mercCityInfo.freeCarriageAmt || 0;
          this.mercCityInfo.takeCarriage = this.mercCityInfo.takeCarriage || 0;
          this.mercCityInfo.sendCarriage = this.mercCityInfo.sendCarriage || 0;
          this.setFormInfo(); // 设置输入表单金额数据
        });
    },
    setMercCityInfo() {
      //设置取送费信息
      this.$store
        .dispatch("post", {
          uri: "mercCityParam/setCarriage",
          data: {
            isCarriage: this.open ? 1 : 0, //是否计算运费 1.是 0.否
          }
        })
        .then(res => {
          msg.success();
        });
    },
    setFormInfo() {
      //设置输入表单金额数据
      this.form.fullTotal = calculation.accDiv(this.mercCityInfo.freeCarriageAmt , 100);
      this.form.take = calculation.accDiv(this.mercCityInfo.takeCarriage , 100);
      this.form.send = calculation.accDiv(this.mercCityInfo.sendCarriage , 100);
    },
  }
};
</script>
