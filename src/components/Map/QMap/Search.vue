<style>
.marker {
  border-bottom: 1px solid #bbb;
}
.marker li {
  padding-bottom: 20px;
  padding-top: 10px;
  background-color: #fff;
}
.marker li:hover {
  background-color: #eef1f6;
}
.marker li .row-idx {
  width: 25px;
  float: left;
  height: 55px;
  text-align: center;
}
</style>
<template>
  <div>
    <el-row>
      <el-col :lg="24"
              :md="24">
        <div>
          <div>
            <p>联系人</p>
            <el-input placeholder=""
                      v-model="paramsObj.name" style="width:50%;"></el-input>
          </div>
          <div>
            <p>联系电话</p>
            <el-input placeholder=""
                      v-model="paramsObj.phone" style="width:50%;"></el-input>
          </div>
          <div>
            <p>所在地区</p>
            <el-cascader
              v-model="selectedOptions"
              placeholder="请选择/搜索"
              :options="options"
              filterable
              :clearable="true"
              @change="selected"
            ></el-cascader>
          </div>
          <div>
            <p>具体位置</p>
            <el-input placeholder="请输入地址"
                      v-model="user.site"
                      id="keyword"
                      style="width:95%;"
                      @keyup.enter.native="searchKeyword">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="searchKeyword"></el-button>
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top:20px;">
      <el-col :lg="24">
        <div id="main"
             style="width:100%; height:400px; border:1px solid #e5e5e5">
          <div>
            <!--<div v-show="!markers || markers.length <= 0">搜索查询</div>-->
            <div id="left"
                 style="float:left; width:25%; height:400px;border: 1px solid #bbb;overflow:auto">
              <ul v-for="(item,index) in markers" v-if="item.show"
                  class="marker">
                <li @click="addName(item)">
                  <div class="row row-idx">
                    <div>{{index+ 1}}</div>
                  </div>
                  <div class="row row-addr">
                    <div class="text-primary">{{item.name}}</div>
                    <div>地址：{{item.address}}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div style="float:left; width:74%; height:400px">
              <div id="container"
                   style="width:100%; height:100%;"></div>
            </div>
          </div>

        </div>
        <div style="height:40px; width:100%;margin-top:20px; text-align:center">
          <el-button size="min" @click="cancel(callbackCancel)">取 消</el-button>
          <el-button type="primary"
                     size="min"
                     @click="addSearch">保 存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
import base from "@/utils/helpers/base";
import regional from "@/utils/regional";
export default {
  props: {
    paramsObj: {
      userId: "",
      name: "",
      phone: "",
      sex: "",
      flag:"",
      // longitude:'',
      // latitude:'',
    },
    callback: null,
    callbackCancel:null,
  },
  data: function() {
    return {
      loading: false,
      core: {
        //默认中心点的位置
        lng: 112.88108,
        lat: 28.21732
      },
      QMap: {
        map: {} //地图对象
      },
      user: {
        name: "",
        phone: "",
        site: "",
        lng: "",
        lat: ""
      },
      selectedRegion: {
        radius: 1000
      },
      tableData: {
        name: ""
      },
      searchService: [],
      cityLocation: null,
      markers: [],
      selectedOptions:[],
      options:[],
      search: {
        province: "",
        cityId: ""
      },
      cityInfo: {},
      address: {
        userId: "",
        phone: "",
        detail: "",
        regionalId: "",
        regionalDesc: "",
        longitude: "",
        latitude: "",
        name: "",
        sex: "0",
        def: "1"
      }
    };
  },
  created() {
    this.selectedOptions = [];
    this.init();
    this.initCity();
//    console.log(this.splitRegional("山东省青岛市市南区旌德路26号-颐中·高山")); //湖南省株洲市攸县上云桥镇
  },
  mounted() {
    this.getRegional();
    if (this.center && this.center.lng && this.center.lat) {
      this.core.lng = this.center.lng;
      this.core.lat = this.center.lat;
    }
    setTimeout(() => {
      this.init();
    }, 1500);
  },
  methods: {
    cancel(callback){
      if(typeof callback==="function"){
        callback();
      }
    },
    getRegional (){
      this.options = regional.all()
    },
   selected (val){
    if(val.length == 3){
      let city = regional.getCity(val[0], val[1])
      this.cityLocation.searchCityByName(city[0].label);
    }
    this.user.site = "";
   },
    initCity() {
      var _this = this;
      this.$store
        .dispatch("post", {
          uri: "mercCity/city",
          data: {}
        })
        .then(res => {
          _this.cityInfo = res.data.data || {};
          if (_this.cityInfo.lng && _this.cityInfo.lat) {
            _this.core.lng = _this.cityInfo.lng;
            _this.core.lat = _this.cityInfo.lat;
          }
        });
    },
    initMap() {
      var _this = this;
      var center = new qq.maps.LatLng(_this.core.lat, _this.core.lng);
      return new qq.maps.Map(document.getElementById("container"), {
        center: center,
        zoom: 13
      });
    },
    init() {
      var _this = this;
      _this.user.userId = this.paramsObj.userId || "";
      _this.user.name = this.paramsObj.name || "";
      _this.user.phone = this.paramsObj.phone || "";
      _this.user.sex = this.paramsObj.sex || "";

      _this.QMap.map = _this.initMap();
      var latlngBounds = new qq.maps.LatLngBounds();

      _this.cityLocation = new qq.maps.CityService({
        complete : function(results){
          _this.QMap.map.setCenter(results.detail.latLng);
          _this.core = results.detail.latLng;
        }
      });

      _this.searchService = new qq.maps.SearchService({
        //进行回调
        complete: function(results) {

          var pois = results.detail.pois;

          if (_this.markers.length > 0) {
            for (let i = 0; i < _this.markers.length; i++ ) {
              let mk = _this.markers[i];
              mk.show = false;
              mk.obj.setVisible(false);
            }
          }

          for (var i = 0, l = pois.length; i < l; i++) {
            var poi = pois[i];
            latlngBounds.extend(poi.latLng);

            if (i >= _this.markers.length) {
              var marker = new qq.maps.Marker({
                map: _this.QMap.map,
                position: poi.latLng
              });
              marker.setTitle(i + 1 + '.' +poi.name);

              let mkItem = {
                name: poi.name,
                address: poi.address,
                lat: poi.latLng.lat,
                lng: poi.latLng.lng,
                show: true,
                obj: marker
              };

              _this.markers.push(mkItem);

              qq.maps.event.addListener(marker, 'click', function (){
                _this.addName(mkItem)
              });
            } else {
              let item = _this.markers[i];
              item.name = poi.name;
              item.address = poi.address;
              item.lat = poi.latLng.lat;
              item.lng = poi.latLng.lng;
              item.show = true;
              _this.markers[i].obj.setPosition(poi.latLng);
              _this.markers[i].obj.setTitle(i + 1 + '.' +poi.name);
              _this.markers[i].obj.setVisible(true);
            }
          }
          _this.QMap.map.fitBounds(latlngBounds);
        }
      });
    },
    searchKeyword() {
      var keyword = this.user.site;
      let region = new qq.maps.LatLng(this.core.lat, this.core.lng);
      this.searchService.setPageCapacity(10); //设置数量
      this.searchService.searchNearBy(
        keyword,
        region,
        this.selectedRegion.radius
      ); //根据中心点坐标、半径和关键字进行周边检索。
      this.loading = true;
    },
    addName(item) {
      this.user.site = item.address+'-'+item.name;
      this.user.lng = item.lng;
      this.user.lat = item.lat;
    },
    addSearch() {
      let regionals = this.splitRegional(this.user.site);
      this.address.userId = this.user.userId;
      this.address.phone = this.paramsObj.phone;
      this.address.name = this.paramsObj.name;
      this.address.sex = this.user.sex || "0";
      this.address.detail = regionals.detail;
      this.address.regionalId = regionals.regional_id;
      this.address.regionalDesc = regionals.regional_desc;
      this.address.longitude = this.user.lng;
      this.address.latitude = this.user.lat;
      if(this.paramsObj.flag && typeof this.callback==="function"){
        this.callback(this.address);
        this.user.site="";
        return;
      }
      if (this.address.userId) {
        this.$store
          .dispatch("post", {
            uri: "userAddress/add",
            data: this.address
          })
          .then(res => {
            if (typeof this.callback === "function") {
              this.callback(this.address);
               this.user.site="";
            }
          });
      } else {
        if (typeof this.callback === "function") {
          this.callback(this.address);
        }
      }
    },
    splitRegional(site) {
      let _this = this;
      let list = regional.getProvince();
      let regionals = [];
      regionals = _this.xunhuan(site, list, regionals);
      let obj = {
        regional_desc: ""
      };
      if(regionals.length){
        regionals.forEach(function(item) {
          obj.detail = item.site;
          obj.regional_desc += item.label + " ";
          obj.regional_id = item.id;
         });
      }else{
          obj.detail = site;
          obj.regional_desc = "";
          obj.regional_id = '';
      }
     
      return obj; //this.xunhuan(site,list,regionals);
    },
    xunhuan(site, list, data, index) {
      if (!index) {
        index = 0;
      }
      var arrList = [];
      var _this = this;
      var flag = true;
      var regional = {
        label: "",
        id: "",
        site: ""
      };
      /* var regional2 = {
          label : '',
          id : '',
        };*/

      var label = "";
      var arrs = ["省", "市", "区", ""];
      list.every(function(item) {
        label = item.label;
        for (var i = index; i < arrs.length; i++) {
          if (site.indexOf(label + arrs[i]) === 0) {
            index = i;
            site = site.replace(label + arrs[i], "");
            arrList = item.children;
            if (arrList && arrList.length == 1) {
              regional.label = label;
              regional.id = item.value;
              regional.site = site;
              data.push(regional);
              regional = new Object();
              regional.label = label + arrs[i];
              regional.id = arrList[0].value;
              regional.site = site;
              data.push(regional);
            } else {
              regional.label = label + arrs[i];
              regional.id = item.value;
              regional.site = site;
              data.push(regional);
            }
            flag = false;
          }
        }
        return flag;
      });
      if (arrList && arrList.length) {
        return (data = _this.xunhuan(site, arrList, data, index));
      } else {
        return data;
      }
    }
  }
};
</script>