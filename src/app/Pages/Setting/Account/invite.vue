<template>
<div class="box-ft">
  <el-row>
    <el-col :lg="24" :md="24" :xl="24">
      <div class="wrap">
        <div class="head">
          <p class="title">我的推广</p>
          <div class="head_btn">
            <a class="current-a" :class="{'is-active':cuType===1}" @click="currentType(1)">我的推广链接和二维码</a>
            <a :class="{'is-active':cuType===2}" class="current-a" @click="currentType(2)">我的推广码</a>
          </div>
        </div>
        <div class="first_main">
          <div v-if="cuType===1" class="certypeFirst">
            <div>
              <div ref="ahref">
                <p>我的推广链接</p>
                <!-- <p><el-input disabled class="w-lg" v-model="spreadCodeHref"></el-input></p> -->
                <p><input type="text" class="w-lg w-st" :readonly="disabled" :class="{'dis-act':disabled}" id="js_url" :value="spreadCodeHref"/></p>
                <p><el-button type="text" @click="copyUrl">复制链接</el-button></p>
              </div>
              <div class="qcode">
                <p>我的推广二维码</p>
                <p>
                  <!-- <img src="/static/img/marketing/notice.png"> -->
                  <Qrcode  :value="spreadCodeHref" :options="{ size: 90 }" id="qrcode"></Qrcode>
                </p>
                 <a id="downloadLink"></a>
                <p><el-button type="text" @click="downCode">下载二维码</el-button></p>
              </div>
          </div>
          <div class="first_main-fott">
            <p>推广小提示：</p>
            <p>好友通过您分享的链接或者二维码登录或者注册通洗，他的门店订购或者提前续费通洗软件即为推广成功</p>
            <p>可邀请身边计划开洗衣店的好友，或者任意有实体店的商家</p>
          </div>
          </div>
          <div class="curtypeTwo" v-else>
            <p>除了分享推广链接，您还可以发送自己的推广码哦</p>
            <p>我的推广码：</p>
            <p>{{spreadCode}}</p>
            <p>门店在订购或者续费通洗软件时填写您的邀请码即为邀请成功</p>
          </div>
        </div>
        <div class="two_main">
           <div class="two_main_content">
             <p class="title">我的奖励</p>
             <div>
               <span>累计邀请注册商家<label class="shop-num">{{detail.mercNum || 0}}</label>个，邀请订购门店<label class="shop-num">{{detail.stroeNum || 0}}</label>个</span>
               <span class="pull-right" style="line-height:32px;">累计获得<label class="shop-num">{{detail.coinNum || 0}}</label>个通洗币</span>
             </div>
             <p class="title_vice">奖励记录</p>
             <div class="table">
               <table border="0">
                 <tr>
                   <th>邀请商家</th>
                   <th>邀请门店</th>
                   <th>获得时间</th>
                   <th>奖励原因</th>
                   <th>奖励通洗币</th>
                 </tr>
                 <tr v-for="item in tableData">
                   <td>{{item.inviteMercName}}</td>
                   <td>{{item.inviteStoreName}}</td>
                   <td>{{item.createTime |getDate}} {{item.createTime | getTime}}</td>
                   <td>{{item.bizType | getValText('DEFINE')}}<span v-if="(item.bizType===-1 || item.bizType===1 || item.bizType===2) && item.extData">({{item.extData.cnt}}个月)</span></td>
                   <td>{{item.coin}}</td>
                 </tr>
                 <tr v-if="tableData.length<1">
                   <td colspan="5">还没有邀请好友哦</td>
                 </tr>
               </table>
               <div class="pull-right" style="margin-top:20px;">
                <el-pagination :current-page.sync="pagination.current"
                                :page-size="pagination.size"
                                layout="total, prev, pager, next"
                                :total="pagination.total"
                                @current-change="nextPage">
                  </el-pagination>
              </div>
             </div>
           </div>
        </div>
      </div>
    </el-col>
  </el-row>
</div>  
</template>
<script>
import consts from "@/utils/consts";
import Qrcode from "@xkeshi/vue-qrcode";
import msg from "@/utils/msg";
export default {
  components:{
    Qrcode
  },
  data () {
    return {
      cuType:1,
      pagination: {
      //分页信息
      size: consts.PAGE_SIZE/2,
      total: 0,
      current: 1
    },
    tableData:[],
    detail:{},
    spreadCode:'',
    spreadCodeHref:'',//推广码链接
    disabled:true,
    }
  },
   created () {
     this.getDetail();
     this.initParams();
     this.getList();
  },
   watch: {
    $route() {
        // 新建单位触发的修改不请求数据
        this.getList();
        //this.initParams();
      }
    },
  methods: {
    copyUrl(){
       let obj=this.$refs.ahref;
       let element = document.createElement("input");
       element.setAttribute(
        "value",
        `通洗，新时代互联网洗衣软件，扫码免费试用${this.spreadCodeHref}`
      );
      element.setAttribute("type", "text");
      obj.appendChild(element);
      element.select();
      document.execCommand("Copy");
      msg.success("复制成功");
      obj.removeChild(element)
    },
     downCode() {
      var qrcode = document.getElementById("qrcode");
      //构造url 
      var url = qrcode.toDataURL("image/png");
      // 构造a标签并模拟点击
      var downloadLink = document.getElementById("downloadLink");
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", "二维码.png");
      downloadLink.click();
      msg.success('下载成功')
    },
    getDetail(){
      this.$store.dispatch('post',{
        uri:'mercCoinBill/queryAwardCount',
        data:{}
      }).then(res=>{
        this.detail=res.data.awardCount
        this.spreadCode=res.data.spreadCode;
        this.spreadCodeHref=consts.M_URL+'/register?spreadCode='+this.spreadCode
      })
    },
    getList(){
      this.$store.dispatch('post',{
        uri:'mercCoinBill/queryAwardList',
        params: {
        startRow: (this.pagination.current - 1) * this.pagination.size,
        pageSize: this.pagination.size
      }
      }).then(res=>{
        let Arr=res.data.data.list
        for(let i=0;i<Arr.length;i++){
            if(Arr[i].extData){
              Arr[i].extData=JSON.parse(Arr[i].extData);
            }
          }
        this.pagination.total = res.data.data.total
        this.tableData=Arr;
      })
    },
    currentType(type){
      this.cuType=type;
    },
    initParams() {
    this.markNo = this.$route.params.markNo;
    //初始化分页数据
    if (this.$route.query.current) {
      this.pagination.current = parseInt(this.$route.query.current) || 1;
    }
  },
    updateUrl() {
    this.$router.push({
      path: this.$route.path,
      query: {
        current: this.pagination.current
      }
    });
  },
  nextPage() {
      // 新建单位触发的分页修改不执行
      this.updateUrl();
    },
  }
}
</script>

<style scoped lang="less">
.m-ln{
  margin: 0px 40px 20px;
}
.wrap{
  width: 1000px;
  margin: 0 auto;
}
.wrap .head{
  margin: 0px 40px 20px;
}
.title{
  font-size: 28px;
  font-weight: 500;
}
.title_vice{
  font-size: 22px;
  font-weight: 400;
}
.head_btn{
  margin: 20px 0px;
}
.head_btn a{
  width: 280px;
  margin-right: 20px;
  text-align: center;
  display: inline-block;
  padding: 12px 0px;
  color: #20a0ff;
  font-size: 16px;
  border: 1px solid #20a0ff;
}
.is-active.current-a{
   background-color: #20a0ff;
   color: white !important;
}
.head_btn a:hover{
  opacity: .8;
}
.first_main{
  width: 100%;
  padding: 40px 0px;
  border: 1px solid #e5e5e5;
  box-shadow: 2px 2px 15px #e5e5e5;
}
.first_main>.certypeFirst{
  position: relative;
  margin: 0px 40px;
}
.first_main>div:nth-child(1){
  width: 550px;
  /* background-color: pink; */
}
.first_main .certypeFirst p+p{
  margin-top: 10px; 
}
.qcode{
  position: absolute;
  top: 0;
  right: 0;
  text-align: center;
  .el-button{
    padding: 0px;
  }
}

.first_main-fott{
  margin-top: 30px !important;
  // display: table;
  min-width: 900px;
  p{
    letter-spacing: 2px;
  }
  p+p{
    margin-top: 5px;
  }
}
.curtypeTwo{
  margin: 0px 40px 50px;
  p{
    font-size: 17px;
    font-weight: 700;
  }
   p:nth-child(3){
     margin-top: 7px;
     color: #20a0ff;
  }
  p:nth-child(4){
    font-size: 12px;
    font-weight: 500
  }
  p+p{
    margin-top: 30px;
 }
}
.two_main{
  margin: 20px 0px;
  width: 100%;
  border: 1px solid #e5e5e5;
  box-shadow: 2px 2px 15px #e5e5e5;
}
.two_main_content{
  margin: 40px;
  &>div:nth-child(2){
    width: 60%;
    margin:20px 0px;
  }
  .table{
    margin: 20px 0px 120px;
  }
  table{
    border: 1px solid #e5e5e5;
    width: 100%;
    border-collapse: collapse;
  }
  table tr td,th{
    width: 20%;
    height: 30px;
    text-align: center;
    border: 1px solid #e5e5e5;
    border-collapse: collapse;
  }
}
.shop-num{
  margin: 0px 5px 0px 3px;
  font-size: 22px;
  font-weight: 600;
  color: #20a0ff;
}

.w-lg{
  width: 290px;
  height: 0px;
}
.w-st{
  height: 25px;
  border-radius: 6px;
  // background-color: #fff;
  border: 1px solid #e5e5e5;
  padding: 8px;
  // user-select:none;
  // -khtml-user-select:none
}
.dis-act{
  background-color: #e5e5e5;
}
.copy-hidden{
  display: none;
  background-color: #fff;
  height: 50px;
}
</style>
