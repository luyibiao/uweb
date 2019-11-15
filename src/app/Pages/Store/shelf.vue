<template>
  <div class="ukao-padder ukao-pt-lg">
    <div class="module-public-sidebar b-r">
      <ul class="nav ofa">
        <li :class="item.id == id ? 'is-active':''" @click="handleClick(item)" v-for="item in storeInfoList" :key="item.id">{{item.name}}</li>
      </ul>
    </div>
    <div class="module-public-content" v-loading="loading">

      <div class="head-type wrap-rve p-type">
        <div class="item-abs-colum-center">
          <p>类型</p>
        </div>
        <div style="left:40%" class="item-abs-colum-center">
          <template v-if="detailData.tranType == 50">输送线</template>
          <template v-else-if="detailData.tranType == 1">
            滑杆
            <span style="color: #98a6ad;">（滑杆号由系统自动生成，累计到9999后自动从1开始）</span>
          </template>
        </div>
        <div class="item-abs-colum-center" style="right:10px"><el-button @click="showUpdateTypeDialog()" size="small" class="m-l-md" type="primary" plain>修改</el-button></div>
      </div>

      <template v-if="detailData.tranType == 50">
      <div class="text-left search-input">
        <el-input placeholder="挂点、衣物条码" v-model="keywords" class="e-lg" prefix-icon="el-icon-search" clearable></el-input>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>

      <div v-if="dialog.ruleForm.tranConfig.length">
        <div class="table-detail" v-for="(item,index) in dialog.ruleForm.tranConfig">
          <div class="table-detail-head p-type wrap-rve">
            <div class="point-detail">
              <ul>
                <li>第{{index+1}}层：{{index+1}}-1至{{index+1}}-{{item.maxNum}}</li>
                <li>挂点：{{item.maxNum}}</li>
                <li>占用{{layerCnt[index].useCnt|| 0}}个，空闲{{layerCnt[index].emptyCnt|| 0}}个</li>
              </ul>
            </div>
            <div class="item-abs-colum-center" style="right:10px;">
              <el-button size="small" @click="onSetPoint(index+1)" type="primary" plain>修改挂点</el-button>
              <el-button v-if="index === dialog.ruleForm.tranConfig.length - 1" size="small" @click="deleteLayer" type="danger" plain>删除</el-button>
            </div>
          </div>
          <div class="flex-wrap text-center ">
            <div class="arrow disabed-arrow wrap-rve" v-if="item.pageNum/10<2">
              <p class="item-abs-center"><img src="/static/svg/up-arrow.svg"></p>
            </div>
            <div class="arrow enable-arrow wrap-rve" v-else @click="onArrowUp(index)">
              <p class="item-abs-center"><img src="/static/svg/up-arrow.svg"></p>
            </div>
            <div  class="point-list">
              <ul>
                <li v-for="(itemNum) in item.maxNum" class="wrap-rve" @click="onChoosePoint(index, itemNum)" v-if="(itemNum>item.pageNum-10) && (itemNum<=item.pageNum)" :class="{'li-point-active':dialog.ruleForm.strList[0]==index+1 && dialog.ruleForm.strList[1]==itemNum}">
                  <span>{{index+1}}-{{itemNum}}</span>
                  <span :ref="'num-' + (index+1) + '-' + itemNum" class="text-none item-abs-center text-danger"></span>
                </li>
              </ul>
            </div>
            <div class="arrow disabed-arrow wrap-rve" v-if="item.maxNum<=item.pageNum">
              <p class="item-abs-center">
                <img src="/static/svg/next-arrow.svg">
              </p>
            </div>
            <div class="arrow enable-arrow wrap-rve" v-else @click="onArrowNext(index)">
              <p class="item-abs-center"><img src="/static/svg/next-arrow.svg"></p>
            </div>
          </div>
          <div class="point-content">
            <div class="p-type point-content-main wrap-rve" v-if="proDetail && dialog.ruleForm.strList.length > 0 && dialog.ruleForm.strList[0]==index+1">
              <div class="point-content-main-cloth">
                <div class="flex-wrap flex-item-justify">
                  <div>{{proDetail.productName}}</div>
                  <div>{{proDetail.serviceName}}<template v-if="proDetail.colorList.length> 0">，<span v-for="col in proDetail.colorList">{{col.name}} </span></template></div>
                  <div class="order-user">单号：<router-link class="text-primary" target="_blank" :to="'/order/list/detail/'+proDetail.orderId">{{proDetail.orderNo}}</router-link></div>
                </div>
                <div class="flex-wrap flex-item-justify">
                  <div>衣物条码：<router-link class="text-primary" target="_blank" :to="'/product/detail/'+proDetail.id">{{proDetail.scanCode}}</router-link></div>
                  <div class="order-user">客户：<router-link class="text-primary" target="_blank" :to="'/client/list/'+proDetail.userId+'/basic'">{{proDetail.userPhone}} {{proDetail.userName}}</router-link></div>
                </div>
                <div class="flex-wrap flex-item-justify" v-if="proDetail.bindCode">
                  <div>绑定条码：<router-link class="text-primary" target="_blank" :to="'/product/detail/'+proDetail.id">{{proDetail.bindCode}}</router-link></div>
                </div>
              </div>
              <div class="item-abs-colum-center point-content-main-btn">
                <el-button type="danger" @click="releaseTran">释放</el-button>
              </div>
            </div>
            <div class="p-type point-content-main" v-else>
              <template v-if="dialog.ruleForm.strList.length > 0 && dialog.ruleForm.strList[0]==index+1">
                此挂点暂无衣物
              </template>
              <template v-else>
                请选择挂点
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="table-detail" v-else>
        <div class="table-detail-head p-type wrap-rve">
          <div class="point-detail">
            <ul>
              <li>第1层：0至0</li>
              <li>挂点：0</li>
              <li>占用0个，空闲0个</li>
            </ul>
          </div>
          <div class="item-abs-colum-center" style="right:10px;">
            <el-button size="small" @click="onSetPoint(1, true)" type="primary" plain>设置挂点</el-button>
          </div>
        </div>
        <div></div>
        <div class="point-content">
          <div class="p-type point-content-main">
            暂无挂点，请设置挂点
          </div>
        </div>
      </div>

      <div v-if="dialog.ruleForm.tranConfig.length">
        <el-button type="text" class="text-primary" @click="onSetPoint(dialog.ruleForm.tranConfig.length + 1, true)">+新增一层输送线</el-button>
      </div>
      </template>

    </div>

    <el-dialog class="ukao-dialog" width="650px" size="small"
               :visible.sync="dialog.visible"
               title="修改上架号类型">
      <div>
        <el-form label-width="150px"  style="padding: 30px 35px;">
          <el-radio-group v-model="dialog.ruleForm.tranType">
            <el-radio :label="50">输送线
                    <div style="margin-left: 25px; margin-top: 5px;color: #98a6ad;">
              可自定义输送线挂点以及层数
            </div>
            </el-radio>
            <el-radio :label="1">滑杆
                  <div style="margin-left: 25px; margin-top: 5px;color: #98a6ad;">滑杆号由系统自动生成，累计到9999后自动从1开始</div>
            </el-radio>
          </el-radio-group>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="updateTranType">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="updateDialog.title" :visible.sync="updateDialog.visible">
      <div>

        <div>
          <el-form :model="updateDialog.ruleForm" @submit.native.prevent ref="numForm" label-width="120px">
            <el-form-item label="输送线层数：">
              <div>第{{updateDialog.ruleForm.layerNo}}层</div>
            </el-form-item>
            <el-form-item label="总挂点：" prop="maxNum" :rules="valiCnt">
              <el-input placeholder="请输入挂点" class="d-lg" v-model="updateDialog.ruleForm.maxNum" :maxlength="4" :min="1" :max="9999"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click="updateDialog.visible=false">取消</el-button>
              <el-button size="small" type="primary" @click="editPoint">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import consts from '@/utils/consts'
  import msg from '@/utils/msg'
  import validate from '@/utils/helpers/validate'
  import base from '@/utils/helpers/base'

  export default {
    data: function() {
      return {
        keywords:"",
        storeInfoList:[],
        id:'',
        radio:1,
        pageNum: 10,
        loading:false,
        dialog: {
          visible: false,
          ruleForm:{
            tranType: '',
            number:1,
//            tranConfig:[{maxNum:150,pageNum:10},{maxNum:35,pageNum:10}],
            tranConfig:[],
            active:-1,
            strList:[]
          },
        },
        updateDialog:{
          visible:false,
          title:"设置输送线挂点",
          ruleForm:{
            isNew: false,
            layerNo: 1,
            maxNum:""
          }
        },
        detailData:{
          tranType:'',
          tranConfig: ''
        },
        layerCnt: [],
        proDetail: '',
        layerNumList: [],
        valiCnt: {
          validator: (rule, value, callback) => {
            validate.amount(value, 0, 1, 9999) ? callback() : callback(new Error('挂点为1~9999整数'))
          },
          required: true,
          trigger: 'blur'
        }
      }
    },
    created () {
      this.id = this.$route.query.storeId;
      this.getStoreInfoList();
    },
    methods : {
      handleClick: function(i) {
        this.id = i.id;
        this.dialog.ruleForm.strList=[];
        this.keywords = '';
        this.getDetail();
        this.$router.push({path: this.$route.path, query: {storeId: this.id}});
      },
      getStoreInfoList(){
        this.$store.dispatch('get', {
          uri : 'storeInfo/queryForSelect'
//          params: {type: 1}
        }).then((res) =>{
          this.storeInfoList = res.data.data || [];
          if (!this.id && this.storeInfoList.length > 0) {
            this.id = this.storeInfoList[0].id;
          }
          this.getDetail();
        })
      },
      getDetail(){
        if (!this.id) {
          return;
        }
        this.loading=true
        this.$store.dispatch('post', {
          uri : 'storeParam/detail',
          data:{
            id: this.id
          }
        }).then((res) =>{
          let storeParam = res.data.data;
          this.detailData = storeParam;
          let tranConfig = [];
          if (storeParam.tranType == 50 && storeParam.tranConfig) {
            tranConfig = JSON.parse(storeParam.tranConfig);
            let pageNum = this.pageNum;
            let layerCnt = [];

            this.layerNumList.length = tranConfig.length;
            for (let i = 0; i < tranConfig.length; i++) {
              var item = tranConfig[i];
              item.pageNum = pageNum;
              layerCnt.push({useCnt:0, emptyCnt:0});
              this.numDetails(i + 1, 1);
              this.queryLayerCnt(i + 1);
            }
            this.layerCnt = layerCnt;
          }
          this.loading=false
          this.dialog.ruleForm.tranConfig = tranConfig;
        });
      },
      queryLayerCnt(layerNo) {
        this.$store.dispatch('post', {
          uri : 'orderProductPoint/queryCnt',
          data:{
            storeId: this.id,
            layerNo
          }
        }).then((res)=> {
          this.layerCnt.splice(layerNo - 1, 1, res.data.data);
        });
      },
      numDetails(layerNo, startNumber) {
        let numbers = '';
        for (let i = 0; i < this.pageNum; i ++) {
          numbers += (startNumber + i) + ",";
        }

        return this.$store.dispatch('post', {
          uri : 'orderProductPoint/queryDetails',
          data:{
            storeId: this.id,
            numbers,
            layerNo
          }
        }).then((res)=>{
          let numList = res.data.data;
//          console.log(numList);
          for (let i in numList) {
            let num = numList[i];
            if (num.orderProId == -1) {
//              console.log('-->',this.$refs['num-'+layerNo+'-'+ num.number][0]);
              this.$refs['num-'+layerNo+'-'+ num.number][0].innerHTML='空';
            } else {
              this.$refs['num-'+layerNo+'-'+ num.number][0].innerHTML='';
            }
          }
          this.layerNumList.splice(layerNo - 1, 1, res.data.data);
//          console.log('numDetails ->>', this.layerNumList);
        });
      },
      queryProDetail(proId) {
        this.$store.dispatch('post', {
          uri : 'orderProductRel/queryInfo',
          data:{id: proId}
        }).then((res)=> {
          let proDetail = res.data.data;
          proDetail.colorList = proDetail.colorDesc ? JSON.parse(proDetail.colorDesc):[];
//          console.log('queryProDetail', proDetail);
          this.proDetail = proDetail;
          this.queryUserById(proDetail.userId);
        })
      },
      queryUserById(userId) {
        this.$store.dispatch('post', {
          uri : 'userInfo/queryById',
          data:{id: userId}
        }).then((res) => {
          let userInfo = res.data.data;
          this.$set(this.proDetail, "userName", userInfo.name);
          this.$set(this.proDetail, "userPhone", userInfo.phone);
        });
      },
      showUpdateTypeDialog(){
        this.dialog.ruleForm.tranType = this.detailData.tranType;
        this.dialog.visible = true;
      },
      onSetPoint(layerNo, isNew){
        if (this.$refs['numForm']) {
          this.$refs['numForm'].resetFields();
        }
        this.updateDialog.visible=true;
        this.updateDialog.ruleForm.layerNo = layerNo;
        this.updateDialog.ruleForm.maxNum = isNew ?  '' : this.dialog.ruleForm.tranConfig[layerNo-1].maxNum;
        this.updateDialog.ruleForm.isNew = isNew|false;
      },
      editPoint() {
        this.$refs['numForm'].validate((valid) => {
          if (valid) {

            let uri = 'storeParam/updateTranConfig';
            if (this.updateDialog.ruleForm.isNew) {
              uri = 'storeParam/addTranLayerNo';
            }

            this.$store.dispatch('post', {
              uri : uri,
              data:{id: this.id, layerNo: this.updateDialog.ruleForm.layerNo, maxNum: this.updateDialog.ruleForm.maxNum}
            }).then((res) => {
              this.updateDialog.visible=false;
              this.getDetail();
            });
          }
        });
      },
      deleteLayer() {
        let _this = this;
        msg.confirm({
          msg: '确定删除?',
          confirmFn: function () {
            _this.$store.dispatch('post', {
              uri: 'storeParam/deleteTranLayerNo',
              data: {id: _this.id}
            }).then((res) => {
              msg.success();
              _this.getDetail();
            })
          }
        });
      },
      //点击向右的箭头
      onArrowNext(index){
        let startNum = this.dialog.ruleForm.tranConfig[index].pageNum;
        this.numDetails(index + 1, startNum + 1);
        this.proDetail = '';
        this.dialog.ruleForm.strList=[];
        this.dialog.ruleForm.tranConfig[index].pageNum += this.pageNum;
      },
      //点击向左的箭头
      onArrowUp(index){
        let startNum = this.dialog.ruleForm.tranConfig[index].pageNum;
        this.numDetails(index + 1, startNum + 1 - 2 * this.pageNum);
        this.proDetail = '';
        this.dialog.ruleForm.strList=[];
        this.dialog.ruleForm.tranConfig[index].pageNum -= this.pageNum;
      },
      //点击搜索
      async onSearch(){
        if (!this.keywords) {
          return;
        }
        let strList = this.keywords.split("-");

        if (strList.length == 1) {
          let tranNum = await this.queryProByCode(this.keywords);
          if (tranNum == -1) {
            return;
          }
          strList = tranNum.split("-");
        }

        if (strList.length != 2) {
          msg.error("暂无此挂点");
          return;
        }
        this.dialog.ruleForm.strList = strList;

        let list=this.dialog.ruleForm.tranConfig;
        if(strList[1]>list[strList[0]-1].maxNum){
          msg.error("暂无此挂点");
          return;
        }

        let currentPage = Math.ceil(strList[1]/10);
        this.$set(this.dialog.ruleForm.tranConfig[strList[0]-1],"pageNum",this.pageNum*currentPage)

        // 选择挂点-初始化状态后再查询衣物详情
        await this.numDetails(strList[0], (currentPage - 1) * this.pageNum + 1);
        this.onChoosePoint(strList[0] - 1, strList[1]);
      },
      async queryProByCode(code) {
        let tranNum = '';
        await this.$store.dispatch('post', {
          uri : 'orderProductRel/queryByCode',
          forceResolve:true,
          data:{
            storeId: this.id,
            scanCode: code
          }
        }).then((res) =>{
          if (res.data.httpCode == 200) {
            let pro = res.data.data;
            if (pro.tranType == 50) {
              tranNum = pro.tranNum;
            }
          } else {
            msg.error(res.data.msg || consts.ERROR_MSG);
            tranNum = -1;
          }
        });
        return tranNum;
      },
      //选择挂点
      onChoosePoint(index, currentNum){
        this.dialog.ruleForm.strList=[];
        this.dialog.ruleForm.strList.push(index+1);
        this.dialog.ruleForm.strList.push(currentNum);

        let i = parseInt(currentNum % this.pageNum);
        if (i === 0) {
          i = 10;
        }
        i -= 1;
//        console.log('onChoosePoint:' + index + '-' + i, this.layerNumList[index][i]);
        let orderProId = this.layerNumList[index][i].orderProId;
//        console.log('onChoosePoint: orderProId ', orderProId);
        if (orderProId > -1) {
          this.queryProDetail(orderProId);
        } else {
          this.proDetail = '';
        }
      },
      updateTranType(){
        this.$store.dispatch('post', {
          uri : 'storeParam/update',
          data:{
            id: this.id,
            tranType: this.dialog.ruleForm.tranType
          }
        }).then((res) =>{
          msg.success();
          this.dialog.visible = false;
          this.detailData.tranType = this.dialog.ruleForm.tranType;
          if (this.detailData.tranType == 50) {
            this.getDetail();
          }
        });
      },
      updateTranConfig(){
        let tranConfig = base.arrayToJson(this.dialog.ruleForm.tranConfig);
        this.$store.dispatch('post', {
          uri : 'storeParam/updateTranConfig',
          data:{
            id: this.id,
            tranConfig: tranConfig
          }
        }).then((res) =>{
          msg.success();
          this.getDetail();
        });
      },
      releaseTran() {
        let _this = this;
        let layerNo = this.dialog.ruleForm.strList[0];
        let number = this.dialog.ruleForm.strList[1];
        msg.confirm({
          msg: '确定释放当前衣物挂点?',
          confirmFn: function () {
            _this.$store.dispatch('post', {
              uri: 'orderProductPoint/release',
              data: {storeId: _this.id, layerNo, number}
            }).then((res) => {
              msg.success();
              let i = parseInt(number % _this.pageNum);
              if (i === 0) {
                i = 10;
              }
              i -= 1;
              _this.layerNumList[layerNo - 1][i].orderProId = -1;
              _this.$refs['num-'+layerNo+'-'+ number][0].innerHTML='空';
              _this.layerCnt[layerNo - 1].useCnt -= 1;
              _this.layerCnt[layerNo - 1].emptyCnt += 1;
              _this.proDetail = '';
            })
          }
        });
      }
    }
  }
</script>

<style scoped>
  .ukao-pt-lg{
    padding-top: 22px !important;
  }
  .module-public-sidebar {
    position: fixed;
    top: 90px;
    left: 0;
    bottom: 0;
    width: 200px;
    overflow: hidden;
  }
  .ofa{
    overflow: auto;
    height: 100%;
    margin-right: -20px;
  }
  .module-public-content {
    margin-left: 160px;
  }
  .nav {
    margin-top: 50px;
  }
  .nav li {
    padding: 10px 40px;
    border-bottom: 1px solid #e5e5e5;
  }
  .nav li:hover{
    cursor: pointer
  }
  .nav li.is-active {
    border-top-color: #b6dbf9;
    border-bottom-color: #b6dbf9;
    border-right-color: #e6f5ff;
    background: #e6f5ff;
    color: #20a0ff;
    margin-right: -1px;
  }
  .wrap-rve{
    position: relative;
  }
  .ukao-pt-lg{
    padding-top: 60px;
  }
  .p-type{
    padding: 0 10px;
    box-sizing: border-box;
  }
  .head-type{
    border: 1px solid #e7e7e7;
    background-color: #f7f7f7;
    height: 54px;
    width: 100%;
  }
  .head-type>div{
    line-height: 54px;
  }
  .e-lg{
    width: 310px;
  }
  .d-lg{
    width: 280px;
  }
  .search-input{
    margin: 20px 0;
  }
  .table-detail{
    border: 1px solid #e7e7e7;
    min-width: 660px;
  }
  .table-detail+.table-detail{
    margin-top: 20px;
  }
  .table-detail-head{
    height: 54px;
    background-color: #f7f7f7;
    width: 100%;
  }
  .point-list ul{
    list-style: none;
  }
  .point-list ul li {
    float: left;
    width: 10%;
    text-align: center;
    padding: 20px 0;
    cursor: pointer;
  }
  .point-list ul li:hover{
    background-color: #20a0ff;
    color: #fff
  }
  .text-none{
    top: 60%;
    left: 45%;
    transform: translateY(0);
    font-size: 12px;
  }
  .disabed-arrow{
    background-color: #dcdcdc;
  }
  .enable-arrow{
    background-color: #20a0ff;
    color: #fff
  }
  .enable-arrow:hover{
    background-color: #50bfff;
  }
  .li-point-active{
    background-color: #20a0ff;
    color: #fff;
  }
  .arrow img{
    width: 20px;
  }
  .arrow{
    -webkit-flex:  0 0 50px;        /* Chrome */
    -ms-flex:  0 0 50px;          /* IE 10 */
    -webkit-box-flex:  0 0 50px;    /* OLD - iOS 6-, Safari 3.1-6 */
    -moz-box-flex:  0 0 50px;
    flex: 0 0 65px;
    cursor: pointer;
  }
  .point-list{
    -webkit-flex:  0 0 50px;        /* Chrome */
    -ms-flex:  0 0 50px;             /* IE 10 */
    -webkit-box-flex:  0 0 50px;    /* OLD - iOS 6-, Safari 3.1-6 */
    -moz-box-flex:  0 0 50px;
    flex: 0 1 100%;
  }
  .point-detail{
    width: 435px;
    height: 54px;
  }
  .point-detail ul{
    list-style: none;
  }
  .point-detail ul li{
    float: left;
    width: 33.33%;
    line-height: 54px;
  }
  .point-content{
    border-top: 1px solid #e7e7e7;
    text-align: center;

  }
  .point-content-main{
    width: 60%;
    display: inline-block;
    min-width: 520px;
    max-width: 920px;
    padding: 15px 0;
    /* background-color: red; */
  }
  .point-content-main-cloth{
    width: 80%;
  }
  .point-content-main-cloth>div+div{
    margin-top: 5px;
  }
  .point-content-main-btn{
    right: 0;
  }

  .order-user{
    min-width: 180px;
    text-align: left;
  }

</style>