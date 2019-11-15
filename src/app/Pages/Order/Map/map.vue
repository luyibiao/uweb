<template>

  <div>
    <div class="ukao-v-loading" >
      <orderDraw :callback="draw"></orderDraw>
    </div>

    <el-dialog class="ukao-dialog"
               title="订单详情"
               :visible.sync="dialogFlag"
               :close-on-click-modal="false"
               :before-close="closeDialog"
               size="small">
      <div style="padding: 0px 35px 35px;">
        <div class="m-b-sm" style=" display: flex;justify-content:space-between;align-items: center;">
          <span>订单号：<a :href="'/order/list/detail/'+detail.id"
                       class="text-primary" target="_blank">{{detail.orderNo}}</a></span>
          <span class="text-danger">{{detail.statusText}}</span>
        </div>
          <div style="padding: 10px;border: 1px dashed #167efb; background-color: #ecf5ff;" v-if="detail.takeMode ==2" class="m-b-sm">
            <p>{{(detail.takePhone ||'')}} &nbsp; {{(detail.takeName || '')}}</p>
            <p>{{(detail.takeAddress || '')}}<template v-if="detail.isEnableUpdateTakeAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(0, detail)"> - 修改</a></auth></template></p>
            <p>取件时间：{{detail.takeDate}} &nbsp;{{detail.takeTimeStart}}-{{detail.takeTimeEnd}}<template v-if="detail.isEnableUpdateTakeAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(0, detail)"> - 修改</a></auth></template></p>
            <p class="text-xs m-t-xs" v-if="detail.takeMode == 2">
              <span class="tx ts-icon">取</span>
              <span>自营取送：</span>
              <span v-if="detail.takeWorkName"><img style="height:20px; border-radius: 50%;" :src="detail.takeWorkImgPath  || '/static/img/work/def.png'"/></span>
              <span>{{detail.takeWorkName || "未指派"}}</span>
              <span v-if="!detail.takeExpressType && detail.statusVal < 5"><auth perm="order.list.assign"> - <a class="text-primary" @click="startCheckStaff(0, detail)">指派</a></auth></span>
            </p>
            <p class="text-xs m-t-xs" v-if="detail.takeMode == 2">
              <span class="tx ts-icon">取</span>
              <span>取送服务商：</span>
              <template v-if="detail.takeExpressType">
                <img class="img-circle" style="width: 20px;" src="/static/img/marketing/sf_logo.png" alt="">
                {{detail.takeExpressNo || ''}}
              </template>
              <template v-else>
                未指派<span v-if="detail.statusVal < 5 || detail.expressStatus == -1"><auth perm="order.list.assign"> - <a class="text-primary" @click="showExpress(1, detail)">指派</a></auth></span>
              </template>
            </p>
          </div>
          <div style="margin-top: 5px;padding: 10px;border: 1px dashed #3dc700;background-color: #f0f9ea;" v-if="detail.sendMode ==2" class="m-b-sm m-t-sm">
            <p>{{(detail.sendPhone ||'')}} &nbsp; {{(detail.sendName || '')}}</p>
            <p>{{(detail.sendAddress || '')}} <template v-if="detail.isEnableUpdateSendAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(1, detail)"> - 修改</a></auth></template></p>
            <p>送件时间：{{detail.sendDate}} &nbsp;{{detail.sendTimeStart}}-{{detail.sendTimeEnd}}<template v-if="detail.isEnableUpdateSendAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(1, detail)"> - 修改</a></auth></template></p>
            <p class="text-xs m-t-xs" v-if="detail.sendMode == 2">
              <span class="sx ts-icon">送</span>
              <span>自营取送：</span>
              <span  v-if="detail.sendWorkName"><img style="height:20px;border-radius: 50%;" :src="detail.sendWorkImgPath || '/static/img/work/def.png'"/></span>
              <span>{{detail.sendWorkName || "未指派"}}</span>
              <span v-if="!detail.sendExpressType && detail.statusVal < 41"><auth perm="order.list.assign"> - <a class="text-primary" @click="startCheckStaff(1, detail)">指派</a></auth></span>
            </p>
            <p class="text-xs m-t-xs" v-if="detail.sendMode == 2">
              <span class="sx ts-icon">送</span>
              <span>取送服务商：</span>
              <template v-if="detail.sendExpressType">
                <img class="img-circle" style="width: 20px;" src="/static/img/marketing/sf_logo.png" alt="">{{detail.sendExpressNo}}
              </template>
              <template v-else>
                未指派
              </template>
            </p>
          </div>
      </div>
    </el-dialog>

    <!-- 地址修改弹窗 -->
    <el-dialog :title="editAddress?'请选择送件地址':'请选择取件地址'" :visible.sync="addressbox" :lock-scroll='false'>
      <div class="scrollbox">
        <el-row :gutter="0" class="b-b">
          <el-col :span="4"><div class="grid-content">联系人</div></el-col>
          <el-col :span="6"><div class="grid-content">手机/电话</div></el-col>
          <el-col :span="6"><div class="grid-content">地址</div></el-col>
          <el-col :span="8"><div class="grid-content">详细地址</div></el-col>
        </el-row>
        <el-row class="b-b" :gutter="0" v-for="(item,index) in addressList" :key="index" @click.native="checkedAddress(item)">
          <el-col :span="4"><div class="grid-content">{{item.name}}</div></el-col>
          <el-col :span="6"><div class="grid-content"><span>{{item.phone}}</span></div></el-col>
          <el-col :span="6"><div class="grid-content">{{item.regionalDesc}}</div></el-col>
          <el-col :span="6"><div class="grid-content">{{item.detail}}</div></el-col>
          <el-col :span="2"><div class="grid-content"><i class="el-icon-circle-check" :class="item.checked?'text-success':' text-muted'"></i></div></el-col>
        </el-row>
      </div>
      <div class="footer text-right" slot="footer">
        <el-button @click="addressbox = false">取消</el-button>
        <el-button type="primary" @click="subAddress">确认</el-button>
      </div>
    </el-dialog>

    <!-- 时间弹窗 -->
    <el-dialog :title="editTime?'请选择送件时间':'请选择取件时间'" :visible.sync="timebox" :lock-scroll='false'>
      <div class="timebox">
        <div class="m-b-md">
          <span class="time-item" :class="{'selected':selectedTimes.dayIndex == index}" v-for="(item,index) in daysList" :key="index" @click="selectedDay(item,index)">{{item}}</span>
        </div>
        <div>
          <span class="time-item" :class="{'disable':(!item.status || timeIsLapse(item)),'selected':selectedTimes.id == item.id}" v-for="(item,index) in timeBoxList" :key="index" @click="selectedTimeSlot(item)">{{item.timeStart}}-{{item.timeEnd}}</span>
        </div>
      </div>
      <div class="footer text-right" slot="footer">
        <el-button @click="timebox = false">取消</el-button>
        <el-button type="primary"  @click="subTimes">确认</el-button>
      </div>
    </el-dialog>

    <!-- 指定派送收人员弹窗 -->
    <el-dialog :title="editStatus?'请指定送件员':'请指定收件员'" :visible.sync="personbox" :lock-scroll='false'>
      <div class="scrollbox">
        <div class="staff-item" @click="checkedStaff(item)" :class="{selected:item.checked}" v-for="(item,index) in staffList" :key="index">
          <div class="user-logo">
            <img :src="item.imgPath?item.imgPath:'/static/img/user/def.png'" alt="">
            <div class="mask text-center">
              <i class="el-icon-check text-xl"></i>
            </div>
          </div>
          <p class="text-center">
            <span class="name">{{item.name}}</span>
          </p>
        </div>
      </div>
      <div class="footer text-right" slot="footer">
        <el-button @click="personbox = false">取消</el-button>
        <el-button type="primary" @click="subStaff">确认</el-button>
      </div>
    </el-dialog>

    <!-- 指定取送服务商 -->
    <el-dialog :title="expressMode==1?'指定取件服务商':'指定送件服务商'" :visible.sync="expressbox" :lock-scroll='false' :width="dialogWidth"  style="height: 100%">

      <div class="new_scrollbox">
        <div class="staff-item" @click="checkedExpress(item)" :class="{selected:item.checked}" v-for="(item,index) in expressList" :key="index">
          <div class="user-logo">
            <img src="/static/img/marketing/sf_logo.png" alt="">
            <div class="mask text-center">
              <i class="el-icon-check text-xl"></i>
            </div>
          </div>
          <p class="text-center">
            <span class="name">{{item.type | getValText('EXPRESS_TYPE')}}</span>
          </p>
        </div>
        <div style="border-top:1px dotted #e5e5e5; margin:10px"></div>
        <div v-if="expressObj">
          <el-form label-width="130px" class ="el-frin-express">
            <!--<p class="text-center">-->
            <!--<span class="name">收件人：{{expressObj.pickupName}} {{expressObj.pickupPhone}}</span>-->
            <!--</p>-->
            <!--<p class="text-center">-->
            <!--<span class="name">收件地址：{{expressObj.pickupRegionalDesc}} {{expressObj.pickupDetail}}</span>-->
            <!--</p>-->
            <el-form-item class="m-b-none input_width" label="寄件人姓名：">
              <el-input  type="text" v-model="orderInfo.takeName"></el-input>
            </el-form-item>
            <el-form-item class="m-b-none input_width" label="寄件人手机号：">
              <el-input type="text"  v-model="orderInfo.takePhone"></el-input>
            </el-form-item>
            <!--<el-form-item class="m-b-none input_width" label="寄件人地址：">-->
            <!--<el-input type="text" v-model="orderInfo.takeAddressHead"> </el-input>-->
            <!--<el-input type="text" class="input_width" style="width: 100%;text-align:right" v-model="orderInfo.takeAddressTrail"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="收件人地址：" style="margin-bottom:0px" :rules="{required:!orderInfo.takeAddressHead,message:'收件地址不能为空',trigger:'change'}">
              <div class="add-w-lg w-lg">
                <p @click="selecetAddres"><el-input v-model="orderInfo.takeAddressHead" readonly="readonly" :class="{'b-t-none':addresShow }" style="margin-top: 15px;" placeholder="请选择所在地区，如：湖南省-长沙市-岳麓区" ></el-input></p>
                <!-- {{}} -->
                <div class="ul-wrap" v-show="addresShow">
                  <a class="a-btn" :class="{'curr-active':addActive===1}" @click="onAbtn(1)">{{addresName.provinceName || '省/直辖市'}}</a>
                  <a class="a-btn" :class="{'curr-active':addActive===2,'curr-hidden':!recordAddes.city}" @click="onAbtn(2)">{{addresName.cityName || '请选择'}}</a>
                  <a class="a-btn" :class="{'curr-active':addActive===3,'curr-hidden':!recordAddes.distri}" @click="onAbtn(3)">{{addresName.districtName || '请选择'}}</a>
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
                <el-input type="text" class="input_width" style="width: 100%"  v-model="orderInfo.takeAddressTrail"></el-input>
              </div>

            </el-form-item>
            <el-form-item class="m-b-none input_width" label="客户下单取件时间：">
              <p>{{orderInfo.takeDate}} &nbsp;{{orderInfo.takeTimeStart}}-{{orderInfo.takeTimeEnd}}<template><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(0, orderInfo)"> - 修改</a></auth></template></p>
            </el-form-item>
            <el-form-item class="m-b-none input_width"  :rules="{validator: checkTime, required:true, trigger:'change'}" label="发送顺丰取件时间：" prop="expressTakeDate">
              <el-date-picker
                @change="changeTakeDate"
                v-model="expressTakeDate"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                sizr="large"
                :default-value="expressTakeDate"
                placeholder="选择日期时间">
              </el-date-picker>
              <!--<p v-show="takeDateErrFlag" class="text-danger express-take-err" >已过客户下单取件时间，请联系客户修改取件时间后再指派</p>-->
            </el-form-item>
          </el-form>
          <el-form  style="float: right; width: 50%" label-width="120px">
            <el-form-item class="m-b-none input_width" label="收件人：">
              <el-input  type="text" disabled v-model="expressObj.pickupName"></el-input>
            </el-form-item>
            <el-form-item class="m-b-none input_width" label="收件人手机号：">
              <el-input type="text" disabled v-model="expressObj.pickupPhone"></el-input>
            </el-form-item>
            <el-form-item class="m-b-none  input_width" label="收件人地址：">
              <el-input type="text" disabled v-model="expressObj.pickupRegionalDesc"> </el-input>
              <el-input type="text" disabled class="input_width" style="width: 100%;" v-model="expressObj.pickupDetail"></el-input>
            </el-form-item>
            <el-form-item class="m-b-none input_width" label="备注：">
              <!--<div >-->
              <el-input type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        v-model="expressRemark"
                        auto-complete="off"></el-input>
              <!--</div>-->
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="footer text-right" slot="footer">
        <el-button @click="expressbox = false">取消</el-button>
        <el-button type="primary" @click="subExpress" :loading="expressIng" :disabled="takeDateErrFlag">确认</el-button>
      </div>

    </el-dialog>


  </div>
</template>

<script>

  import consts from '@/utils/consts'
  import msg from '@/utils/msg'
  import orderDraw from '@/components/Map/QMap/OrderMap'
  import coordinate from '@/utils/helpers/coordinate'
  import time from "@/utils/helpers/timeLite";
  import keyval from '@/utils/dickeyval';

  export default{
    components :{
      orderDraw
    },
    data:function () {
      return {
        refreshFlag :false,
        dialogWidth:'70%',
        takeDateErrFlag: false,
        loading: true,
        dialogFlag: false,
        expressIng: false,
        detail:{},
        orderInfo:{},

        staffList:[],  //取送人员列表
        personbox:false, //是否显示选人弹窗
        editStatus:0, //修改人员状态 0：收件员  1：送件员
        selectedStaff:null, // 当前选中的人员

        expressbox:false,		// 是否显示选择服务商列表
        expressList:[],			// 服务商列表
        expressMode: null, // 取送模式 1：收件  1：送件
        expressObj: null, // 当前选中的服务商
        expressRemark: '', // 快递备注
        expressTakeDate: '',//取送服务商指派时间
        addressList:[],  //地址列表
        addressbox:false, //是否显示地址选择弹窗
        editAddress:0, //修改地址状态 0：取件地址  1：送件地址
        selectedAddress: null, //当前选中的地址
        checked: true,

        timer:null, //当前时间
        daysList:null, //天列表
        takeTimeList:[],  //取件时间段列表
        sendTimeList:[],  //送件时间段列表
        timeBoxList:[],  //时间选择弹窗的时间段列表
        timebox: false, //是否显示时间选择弹窗
        editTime:0,  //修改时间  0:取件时间   1：送件时间
        selectedTimes:{ //选择的时间
          day:'',
          date:'',
          dayIndex:0,
          timeStart:'',
          timeEnd:'',
          id:0, //时间段id
        },
        options:[{
          value: "noAssignTakeWork",
          label: '未指派'
        },{
          value:"outOfRange",
          label:"超出取送范围"
        },{
          value:"overtime",
          label:"超期"
        }
        ],
        statusList:[],
        searchOptions: [
          { val: "", text: "全部" },
          { val: "1", text: "订单编号" },
          { val: "2", text: "客户电话" },
          { val: "3", text: "会员卡号" },
          { val: "4", text: "下单地址" },
          { val: "5", text: "下单联系人" },
          { val: "6", text: "下单电话" }
        ],
        dateOptions: [{ val: "1", text: "下单时间" }],
        pickerOptions0: {
          shortcuts: [
            {
              text: "今天",
              onClick(picker) {
                const date = new Date();
                picker.$emit("pick", [date, date]);
              }
            },
            {
              text: "昨天",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", [date, date]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        payStatusOptions: [],
        orderStatusOptions: [],
        orderTakeModeOptions: [],
        expressOptions:keyval['EXPRESS_TYPE'],
        creditStatusList: keyval['CREDIT_STATUS'],
        provinceItems: [],//省份选择
        cityItems:[],//城市选择
        districtItem:[],//区域选择
        addActive:1,//选择地址进度标志
        addresShow:false,//地址选择框出现
        addresName:{//存储城市名字
          provinceName:'',
          cityName:'',
          districtName:''
        },
        recordAddes:{//记录省市菜单是否被选择过
          city:false,
          distri:false
        },
        queryOrderListFn: function () {

        }
      }

    },
    created(){

    },
    mounted(){

    },
    methods:{
      draw(res){
        this.detail = res.data || {};
        console.log(res,"resres");
        this.queryOrderListFn = res.fn;
        this.dialogFlag = true;
      },
      // 开始选择收送件地址
      startCheckAddress(i, item){
        let _this = this
        _this.orderInfo = item
        _this.getAddressList(function () {
          _this.editAddress = i;
          _this.addressbox = true;
          _this.selectedAddress = null;
          _this.addressList.forEach(item=>{
            item.checked = false;
          })
        })

      },
      initExpressTakeDate(_this){
        let startDate = _this.orderInfo.takeDate+" "+_this.orderInfo.takeTimeStart+":00";
        let endDate = _this.orderInfo.takeDate+" "+_this.orderInfo.takeTimeEnd+":00";
        let addTime = time.difference(startDate, endDate, "minutes")/2;
        _this.expressTakeDate = time.format(time.add(startDate, addTime, "minutes"), "YYYY-MM-DD hh:mm");
      },
      // 开始修改时间
      startCheckTime(i, item){
        this.orderInfo = item
        this.editTime = i;
        this.selectedTimes = {
          day:'',
          date:'',
          dayIndex:0,
          timeStart:'',
          timeEnd:'',
          id:0, //时间段id
        }
        console.log(11111111111111)
        if(this.editTime && !this.sendTimeList.length){
          this.getSendTimeList().then(_=>{
            this.setDayList();
            this.timeBoxList = this.sendTimeList;
          });
        }else if(!this.takeTimeList.length){
          this.getTakeTimeList().then(_=>{
            this.setDayList();
            this.timeBoxList = this.takeTimeList;
          });
        }else{
          this.timeBoxList = this.editTime ? this.sendTimeList : this.takeTimeList;
        }
        this.timebox = true;
      },
      // 设置日期数组
      setDayList(){
        if(!this.daysList){
          this.daysList = Array.apply(null,Array(20)).map((item,i)=>{
            return new Date(this.timer+1000*60*60*24*i).getMonth()+1+ '-' + new Date(this.timer+1000*60*60*24*i).getDate();
          });
        }
      },
      getTakeTimeList(){
        return this.$store.dispatch('get',{
          uri:'serviceTime/take/list',
          params:{
            cityId:this.orderInfo.cityId
          }
        }).then(res=>{
          this.takeTimeList = res.data.data || [];
          this.timer = res.data.timestamp;
        })
      },
      getSendTimeList(){
        return this.$store.dispatch('get',{
          uri:'serviceTime/send/list',
          params:{
            cityId:this.orderInfo.cityId
          }
        }).then(res=>{
          this.sendTimeList = res.data.data || [];
          this.timer = res.data.timestamp;
        })
      },
      changeTakeDate(){
        let _this = this;
        if(!_this.expressTakeDate){
          _this.takeDateErrFlag = true;
          return ;
        }
        let startDate = _this.orderInfo.takeDate+" "+_this.orderInfo.takeTimeStart;
        let endDate = _this.orderInfo.takeDate+" "+_this.orderInfo.takeTimeEnd;
        let num = time.difference(startDate, _this.expressTakeDate, "minutes",  true);
        if(num < 0){
          _this.takeDateErrFlag = true;
          return ;
        }
        num = time.difference(endDate, _this.expressTakeDate, "minutes", true);
        if(num > 0){
          _this.takeDateErrFlag = true;
          return ;
        }
        _this.takeDateErrFlag = false;
      },
      // 获取地址列表
      getAddressList(fn){
        this.$store.dispatch('get',{
          uri:'userAddress/list',
          params:{
            userId:this.orderInfo.userId
          }
        }).then(res=>{
          this.addressList = res.data.data.list;
          this.addressList.forEach(item=>{
            this.$set(item,'checked',false);
          })
          if(typeof (fn) === 'function'){
            fn()
          }
        })
      },
      // 选取地址
      checkedAddress(val){
        val.checked = !val.checked;
        this.addressList.forEach(item=>{
          if(item.checked && item.id !=val.id) item.checked = false;
        })
        this.selectedAddress = val.checked? val:null;
      },
      // 提交地址
      subAddress(){
        if(this.selectedAddress){
          let uri = this.editAddress ? 'orderExt/updateSendAddress':'orderExt/updateTakeAddress';
          this.$store.dispatch('post',{
            uri,
            params:{
              id:this.orderInfo.id,
              addressId:this.selectedAddress.id
            }
          }).then(res=>{
            this.addressbox = false;
            msg.success()
            if(this.editAddress){
              this.detail.sendAddress = this.selectedAddress.regionalDesc +' '+ this.selectedAddress.detail;
              this.detail.sendName = this.selectedAddress.name;
              this.detail.sendPhone = this.selectedAddress.phone;
            }else{
              this.detail.takeAddress = this.selectedAddress.regionalDesc +' '+ this.selectedAddress.detail
              this.detail.takeName = this.selectedAddress.name;
              this.detail.takePhone = this.selectedAddress.phone;
            }
            this.refreshFlag
          })
        }else{
          msg.error('请选择地址');
        }
      },
      // 时间段是否失效
      timeIsLapse(item){
        return this.selectedTimes.dayIndex == 0 && (new Date(this.timer).getHours()+1) >= parseInt(item.timeEnd);
      },
      // 选择日期
      selectedDay(val,index){
        console.log(val, index,"val,index")
        this.selectedTimes.day = val;
        this.selectedTimes.date = new Date(this.timer+1000*60*60*24*index).getFullYear()+'-'+val;
        this.selectedTimes.dayIndex = index;
        if(index == 0){
          this.selectedTimes.id = 0;
        }
      },
      // 选择时间段
      selectedTimeSlot(item){
        if(item.status && !this.timeIsLapse(item)){
          this.selectedTimes.timeStart = item.timeStart;
          this.selectedTimes.timeEnd = item.timeEnd;
          this.selectedTimes.id = item.id;
        }
      },
      // 提交时间
      subTimes(){
        if(this.selectedTimes.id){
          if(!this.selectedTimes.date) this.selectedTimes.date = new Date(this.timer).getFullYear()+'-'+this.daysList[0];
          let uri = this.editTime ? 'orderExt/updateSendDate':'orderExt/updateTakeDate';
          this.$store.dispatch('post',{
            uri,
            data:{
              id:this.orderInfo.id,
              date : this.selectedTimes.date,
              timeStart : this.selectedTimes.timeStart,
              timeEnd : this.selectedTimes.timeEnd,
            }
          }).then(res=>{
            if(this.editTime){
              this.detail.sendDate = this.selectedTimes.date;
              this.detail.sendTimeStart = this.selectedTimes.timeStart;
              this.detail.sendTimeEnd = this.selectedTimes.timeEnd;
            }else{
              this.detail.takeDate = this.selectedTimes.date;
              this.detail.takeTimeStart = this.selectedTimes.timeStart;
              this.detail.takeTimeEnd = this.selectedTimes.timeEnd;
            }
            if(this.expressTakeDate){
              this.initExpressTakeDate(this);
            }
            this.timebox = false;
            this.refreshFlag = true;
          })
        }else{
          msg.error('请选择时间日期');
        }
      },
      // 开始选择收送件人员
      startCheckStaff(i, item){
        let _this = this
        _this.orderInfo = item
        _this.getStaffList(item.storeId, function () {
          _this.editStatus = i;
          _this.personbox = true;
          if(i){
            _this.staffList.forEach(item=>{
              item.checked = (item.id == _this.orderInfo.sendWorkId) ? true: false;
              if(item.checked){
                _this.selectedStaff = item;
              }
            })
          } else{
            _this.staffList.forEach(item=>{
              item.checked = (item.id == _this.orderInfo.takeWorkId) ? true: false;
              if(item.checked){
                _this.selectedStaff = item;
              }
            })
          }
        })
      },
      // 选取人员
      checkedStaff(val){
        this.staffList.forEach(item=>{
          if(item.checked) item.checked = false;
        })
        val.checked = true;
        this.selectedStaff = val;
      },

      // 提交修改的人员信息
      subStaff(){
        let id = this.editStatus ? this.orderInfo.sendWorkId : this.orderInfo.takeWorkId;
        if(this.selectedStaff.id != id){
          let uri = this.editStatus ? 'orderExt/assignSendWork':'orderExt/assignTakeWork';
          this.$store.dispatch('post',{
            uri,
            data:{
              id:this.orderInfo.id,
              workId:this.selectedStaff.id
            }
          }).then(res=>{
            this.personbox = false;
            msg.success()
            if(this.selectedStaff){
              this.detail.sendWorkImgPath = this.selectedStaff.imgPath;
              this.detail.sendWorkName = this.selectedStaff.name;
            }else{
              this.detail.takeWorkImgPath = this.selectedStaff.imgPath;
              this.detail.takeWorkName = this.selectedStaff.name;
            }
            this.refreshFlag = true;
          })
        }else{
          this.personbox = false;
        }
      },
      // 获取可指派的人员
      getStaffList(storeId, fn){
        this.$store.dispatch('get',{
          uri:'workerInfo/takeAndSend/list',
          data:{
            storeId: storeId
          }
        }).then(res=>{
          this.staffList = res.data.data || [];
          this.staffList.forEach(item=>{
            this.$set(item,'checked',false)
          })
          if(typeof (fn) === 'function'){
            fn()
          }
        })
      },
      showExpress(mode, item) {
        let _this = this;
        _this.takeDateErrFlag = false;
        _this.expressIng = false;
        _this.orderInfo = item;
        let headLength = item.takeAddress.indexOf("  ");
        _this.orderInfo.takeAddressHead = item.takeAddress.substr(0,headLength == -1 ? item.takeAddress.indexOf("区")+1 : headLength);
        _this.orderInfo.takeAddressTrail = item.takeAddress.substr(headLength == -1 ? item.takeAddress.indexOf("区") +2 : headLength +2, item.takeAddress.length);
        _this.initExpressTakeDate(_this);
        _this.expressMode = mode;
        _this.expressObj = null;
        _this.queryExpressList(item.cityId, function (item) {
          _this.expressbox = true;
          if(item){
            _this.checkedExpress(item);
          }
        });
      },
      queryExpressList(cityId, fn) {
        this.$store.dispatch('post',{
          uri:'expressParam/list',
          data:{
            cityId: cityId
          }
        }).then(res=>{
          this.expressList = res.data.data.list || [];
          this.expressList.forEach(item=>{
            this.$set(item,'checked',false)
          });
          if(typeof (fn) === 'function'){
            fn(res.data.data.list[0])
          }
        })
      },
      // 选取人员
      checkedExpress(val){
        this.expressList.forEach(item=>{
          if(item.checked) item.checked = false;
        })
        val.checked = true;
        this.expressObj = val;
        if (!this.expressRemark) {
          this.expressRemark = this.expressObj.remark;
        }
      },
      subExpress() {
        this.expressIng = true;
        let uri = this.expressMode == 1 ? 'expressInfo/assignTake':'';
        this.$store.dispatch('post',{
          uri,
          forceResolve:true,
          data:{
            orderId: this.orderInfo.id,
            type: this.expressObj.type,
            remark: this.expressRemark,
            expressTakeDate: time.getDateTime(this.expressTakeDate)
          }
        }).then(res=>{
          if (res.data.httpCode == 200) {
            this.expressbox = false;
            msg.success();
            if(this.expressMode){
              this.detail.takeExpressType =  this.expressObj.type;
            }else{
              this.detail.sendExpressType =  this.expressObj.type;
            }
            this.refreshFlag = true;
          } else {
            this.expressIng = false;
            msg.error(res.data.msg);
          }
        })
      },
      selecetAddres(){
        this.addresShow=true
      },
      onAbtn(type){
        this.addActive=type
      },
      checkTime(rule, value, callback){
        if (this.takeDateErrFlag && !value) {
          callback(new Error("请联系客户修改预约时间，或选择客户预约时段内再指派"));
        } else {
          callback();
        }
      },
      closeDialog(){
        if(this.refreshFlag){
          this.queryOrderListFn();
          this.refreshFlag = false;
        }
        this.dialogFlag = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  .scrollbox{
    max-height: 450px;
    overflow-y: auto;
  }

  .time-item{
    display: inline-block;
    line-height: 30px;
    padding: 0 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    cursor: pointer;
  &.disable{
     background-color: #ccc;
     color:#fff;
     cursor:no-drop;
   }
  &.selected{
     background-color: #27c24c;
     border-color: #27c24c;
     color: #fff;
   }
  }

  .staff-item {
    width: 90px;
    cursor: pointer;
    margin: 20px 10px 0;
    vertical-align: top;
    display: inline-block;
    .user-logo {
      margin: 0 auto;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
      }
      .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        line-height: 80px;
        display: none;
        background-color: rgba(0, 0, 0, .1);
        .el-icon-check {
          color: #fff;
        }
      }
    }
    .name {
      margin-top: 5px;
      line-height: 28px;
      display: inline-block;
      padding: 0 15px;
      border-radius: 14px;
      border: 1px solid transparent;
      max-width: 90px;
    }
    &.selected {
      .name {
        background-color: #d5e5ff;
        border-color: #20a0ff;
        color: #20a0ff;
      }
      .mask {
        display: block;
      }
    }
  }
  .input_width{
    width: 84%;
    margin-top: 15px;
  }

  .new_scrollbox{
    max-height: 600px;
    overflow-y: auto;
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
  .el-frin-express{
    height: 365px;
    float: left; width: 50%;
  }
  .curr-active{
    background-color: #20a0ff;
    color:#fff;
    visibility: visible !important;
  }
  .add-w-lg{
  // width: 450px;
    min-height: 40px;
  &>P{
      margin-top: 0px !important;
    }
  .el-input__inner{
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    border-color:#dcdfe6 !important;
  }
  .el-input__inner:focus{
    border-color:#dcdfe6;
  }
  .b-t-none input{
    border-bottom: none !important;
  }
  }
  .w-lg{
    width: 80%;
  }
</style>