<template>
  <div>
    <div class="m-b-sm ">
      <span class="">
        <el-input class="uk-search-content w-md m-r-xs"
                  prefix-icon="el-icon-search"
                  :clearable="true"
                  v-model="searchValue"
                  placeholder="订单号、手机号、地址、取送员"></el-input>
        <el-date-picker
          class="m-r-xs"
          v-model="takeOrSendDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <el-select v-model="type" placeholder="请选择" style="width: 100px" class="m-r-xs">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="updateUrl()">查询</el-button>
      </span>
      <span style="margin-left: 60px">
        <span>取件 <span class="text-primary font-bold">{{takeNum}}</span> 单</span>
        <span>,送件 <span class="text-success font-bold">{{sendNum}}</span> 单</span>
      </span>

      <span class="pull-right">
        <span class="m-r-sm">{{timestamp | getDate }} {{timestamp | getTime}}</span>
        <el-button  @click="updateUrl()">刷新</el-button>
      </span>
    </div>
    <div id="container"
         style=" width:100%; height: 800px;"></div>

    <div id="infoWinTemplate" ref="infoWinTemplate" style="display: none" >
      <div class="order-info-css {0}" id="openDialog_{1}" style="cursor:pointer">
        <div>
          <span>{2}</span>
          <img style="height: 22px;border-radius: 50%;" src="{3}"/>
        </div>
        <div>{4}</div>
      </div>

    </div>


  </div>






</template>

<script>

  import base from '@/utils/helpers/base'
  import time from '@/utils/helpers/timeLite'
  import msg from "@/utils/msg";

  export default{
    props: ['callback'],
    components :{

    },
    data:function () {
      return {
        sendNum:0,
        takeNum: 0,
        timestamp: '',
        loading: false,
        type: '0',
        core: {
          //默认中心点的位置
          lng: 112.88108,
          lat: 28.21732
        },
        takeOrSendDate:'',
        searchValue:'',
        QMap: {
          map: {}, //地图对象
          infoWin:{}
        },
        orderMarkerIcon:{},
        workerMarkerIcon:{},
        cityInfo:{},

        markerList:[],
        infoWinList:[],
        divIds:[],
        options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '取件'
        }, {
          value: '2',
          label: '送件'
        }],
      }

    },
    created(){

      this.initMarkerIcon();
      this.initCity();
    },
    mounted(){

    },
    methods:{
      initMarkerIcon(){
        var anchor = new qq.maps.Point(10, 10),
          size = new qq.maps.Size(20, 20),
          origin = new qq.maps.Point(0, 0);
        this.orderMarkerIcon = new qq.maps.MarkerImage(
          "/static/img/blue_circle.png",
          size,
          origin,
          anchor
        );
        this.workerMarkerIcon = new qq.maps.MarkerImage(
          "/static/img/red_circle.png",
          size,
          origin,
          anchor
        );
      },
      initMap() {
        var _this = this;
        var center = new qq.maps.LatLng(_this.core.lat, _this.core.lng);
        this.QMap.map = new qq.maps.Map(document.getElementById("container"), {
          center: center,
          zoom: 13
        });
        var infoWin = new qq.maps.InfoWindow({
          map: this.QMap.map
        });
        this.orderList();
        this.workerList();
      },
      initCity() {
        var _this = this;
        this.$store
          .dispatch("post", {
            uri: "mercCity/city",
            data: {}
          })
          .then(res => {
            _this.takeOrSendDate = time.getDate(res.data.timestamp);
            _this.cityInfo = res.data.data || {};
            if (_this.cityInfo.lng && _this.cityInfo.lat) {
              _this.core.lng = _this.cityInfo.lng;
              _this.core.lat = _this.cityInfo.lat;
            }
            this.initMap();
          });

      },
      orderList(){
        //let statusVals = this.type == 0 ? '1,3,41': this.type == 1 ? '1,3': '41'
        let statusVals = '1,3,41';
        this.$store.dispatch('post', {
          uri : 'orderInfo/list',
          data: {
            takeOrSendDate: this.takeOrSendDate,
            statusVals: statusVals,
            takeMode: 2,
            sendMode: 2,
            searchValue:this.searchValue
          }
        }).then((res) =>{
          this.timestamp = res.data.timestamp;
          let list = res.data.data.list || [];
          this.sendNum = 0;
          this.takeNum = 0;
          this.closeMarkerAndInfo();
          this.createMarker(list);

          //this.addBtnEvent(list);

        })
      },
      workerList(){
        this.$store.dispatch('get', {
          uri : 'workerInfo/takeAndSendLocation/list'
        }).then((res) =>{
          let list = res.data.data || [];
          this.createMarker(list, true);
        })
      },
      getLatAndLng(item , isWorker){
        let lat, lng;
        if(isWorker){
          lat = item.lat;
          lng = item.lng;
        }else{
          if((item.statusVal == 1 ||item.statusVal == 3)&& item.takeDate == this.takeOrSendDate){
            lat = item.takeLat;
            lng = item.takeLng;
          }else{
            lat = item.sendLat;
            lng = item.sendLng;
          }
        }
        return {'lat':lat,'lng':lng};
      },
      createMarker(list, isWorker){
        if(list.length <= 0){
          return;
        }
        let _this = this;
        let map =  this.QMap.map;
        let workerMarkerIcon = this.workerMarkerIcon;
        list.forEach(function (item) {
          let latAndLng =  _this.getLatAndLng(item, isWorker);
          if(latAndLng.lat && latAndLng.lng){
            var center = new qq.maps.LatLng(latAndLng.lat,latAndLng.lng);
            var marker = new qq.maps.Marker({
              position: center,
              map: map,
            });
            var infoWin = new qq.maps.InfoWindow({
              map: map
            });

            infoWin.open();
            if(isWorker){//是员工图标
              marker.setIcon(workerMarkerIcon);
              item.imgPath = item.imgPath || '/static/img/work/def.png';
              let html =
                ` <div class="worker-info-css">
                     <img style="height: 40px;border-radius: 50%;" src="${item.imgPath}"/>
                </div>`;
              //tips  自定义内容
              infoWin.setContent(html);
              infoWin.setPosition(center);
            }else{//是订单标签
              _this.addOrderMarker(item, center, marker, infoWin);
            }
          }
        })
      },
      addOrderMarker(item, center, marker, infoWin){

        let date , time, workImgPath,winCss;
        if((item.statusVal == 1 ||item.statusVal == 3) && item.takeDate == this.takeOrSendDate && (this.type == 0 || this.type == 1)){
          this.takeNum += 1;
          date =item.takeDate.substr(item.takeDate.indexOf("-")+1,item.takeDate.length);
          time = item.takeTimeStart +'-'+ item.takeTimeEnd;
          workImgPath =item.takeWorkName ? item.takeWorkImgPath || '/static/img/work/def.png' : '';
          workImgPath = item.takeExpressType == 'SF' ? '/static/img/marketing/sf_logo.png' : workImgPath;
          winCss = 'take-color'
        }else if(item.sendDate == this.takeOrSendDate && (this.type == 0 || this.type == 2)){
          this.sendNum += 1;
          date =item.sendDate.substr(item.sendDate.indexOf("-")+1,item.sendDate.length);
          time = item.sendTimeStart +'-'+ item.sendTimeEnd;
          workImgPath = item.sendWorkName ?  item.sendWorkImgPath || '/static/img/work/def.png' : '';
          workImgPath = item.sendExpressType == 'SF' ? '/static/img/marketing/sf_logo.png' : workImgPath;
          winCss = 'send-color'
        }else{
          marker.setMap(null);
          return;
        }
        marker.setIcon(this.orderMarkerIcon);
        var infoWinTemplate = this.$refs.infoWinTemplate.innerHTML
        infoWinTemplate = infoWinTemplate.toString().format(winCss,item.id,date, workImgPath, time)
        //tips  自定义内容
        infoWin.setContent(infoWinTemplate);
        infoWin.setPosition(center);
        let divId = 'openDialog_' + item.id;
        setTimeout(() => {
          let detailBtn = document.getElementById(divId);
          this.addBtnEventListener(detailBtn, item, marker, infoWin)
        },500)
        this.markerList.push(marker);
        this.infoWinList.push(infoWin);
        this.divIds.push(divId);
      },
//      addBtnEvent(list){
//        var _this = this;
//        setTimeout(() => {
//          list.forEach(function (item) {
//            let detailBtn = document.getElementById('openDialog_' + item.id);
//            _this.addBtnEventListener(detailBtn, item)
//          })
//        },500)
//      },
      //给绘画层btn添加事件
      addBtnEventListener(btn, params, marker, infoWin){
        if(!btn){
          return
        }
        var _this = this
        btn.addEventListener('click', function(btnObj){
          //格式<btton><span>text</span></button>
          //或<btton>text</button>
          //console.log('but', val.target, val.target.parentElement.id || '-', id)
         // var btnId = btnObj.target.parentElement.id || btnObj.target.id
          //回调方法
          _this.callback({
            data: params, fn: function () {
              _this.updateUrl();
            }
            , closeFn: function () {
              infoWin.close();
              marker.setMap(null);
            }
          })
        })

      },
      updateUrl(){
        if(!this.takeOrSendDate){
          msg.error("查询时间不能为空");
          return ;
        }
        this.orderList();
      },
      closeMarkerAndInfo(){
        if(this.markerList.length){
          this.markerList.forEach(function (item) {
            item.setMap(null);
          });
        }

        if(this.infoWinList.length){
          this.infoWinList.forEach(function (item) {
            item.close();
          })
          this.infoWinList = [];
        }

        this.divIds.forEach(function (item) {
          var box = document.getElementById(item);
          if(box){
            box.parentNode.removeChild(box);
          }
        })
        this.divIds = [];


      }
    }
  }

  //字符串占位符替换
  String.prototype.format = function() {
    if(arguments.length == 0) return this;
    for(var s = this, i = 0; i < arguments.length; i++)
      s = s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
    return s;
  }
</script>

<style lang="less" scoped>


  .worker-info-css{
    width: 10px;
  }
  .order-info-css{
    width: 80px;
    /*padding-top: 10px;*/
  }
.send-color{
  background-color: #f0f9ea;
  color: #27c24c;
}
  .take-color{
    background-color: #ecf5ff;
    color: #20a0ff;
  }
</style>