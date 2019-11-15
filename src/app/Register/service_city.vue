<template>
	<div>
		<!-- <div class="wrapper-lg b-b text-xl text-black text-center ft-size">设定开通服务的城市</div> -->
		<div class="box">
			<div class="validate-containers">
				<div class="validate-boxp">如果你的店是在“市”一级，选择市即可，例如：长沙。<span class="text-danger">不需要选择区、县</span></div>
			</div>

			<div class="validate-containerx pull-right">
				<div class="validate-boxp">如果你的店是在“县”这一级，选择县即可，例如，望城县。</div>
			</div>
			<div class="box-citydiv">
				<div class="cityDiv outer-item">
					<ul class="inner-list">
						<li class="inner-item"
						    v-for="item in provinceItems"
						    :key="item.value"
						    v-bind:class="{ selected: item.selected }"
						    v-on:click="chooseProvince(item)">
							<div class="clearfix b-a select-item">
								<span class="city"
								      v-text="item.label"></span>
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
				</div>
				<div class="cityDiv outer-item">
					<ul class="inner-list">
						<li class="inner-item"
						    v-for="item in cityItems"
						    :key="item.value"
						    v-bind:class="{ 'is-selected': item.checkedValue }">
							<div class="clearfix b-a select-item"
							     v-on:click="changeCity(item)">
								<!-- <el-checkbox class="city" v-model="item.checkedValue" v-on:change="changeCity(item)"> -->
								<span v-text="item.label"
								      class="city"></span>
								<!-- </el-checkbox> -->
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
				</div>
				<div class="cityDiv outer-item u-is-error">
					<ul class="inner-list">
						<li class="inner-item"
						    v-for="item in districtItems"
						    :key="item.value"
						    v-bind:class="{ 'is-selected': item.checkedValue }">
							<div class="clearfix b-a select-item"
							     v-on:click="changeDistrict(item)">
								<!-- <el-checkbox class="city" v-model="item.checkedValue" v-on:change="changeDistrict(item)"> -->
								<span v-text="item.label"
								      class="city"></span>
								<!-- </el-checkbox> -->
								<i class="icon el-icon-arrow-right pull-right text-xs"></i>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="m-t-lg text-lg text-center min-and">
				<span class="text-muted m-l-sm m-r-sm">已选定了</span>
				<span class="text-primary"
				      v-text="selectedCity.name"></span>
				<div class="min-and-btn">
					<el-button type="primary"
					           style="margin-top:20px;"
                     class="register_login_btn"
										 @click="confirm">确定，下一步</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import consts from "@/utils/consts";
import regional from "@/utils/regional";
import auth from "@/utils/auth";
import msg from "@/utils/msg";
import md5 from "@/utils/md5";
import storagelite from '@/utils/helpers/storageLite'
export default {
  data: function() {
    return {
      // cityMoreEnable: false,
      message: "",
      default: {
        provinceId: "",
        cityId: "",
        districtId: ""
      },
      selectedCity: {
        id: "",
        name: ""
      },
      provinceItems: [],
      cityItems: [],
      districtItems: [],
      dialogVisible: false,
      formTitle: "",
      ruleForm: {
        symbol: "",
        regionalId: "",
        cityName: "",
        phone: "",
        account: "",
        name: "",
        password: "",
        tel: "",
        pwd: "",
        payType: "1",
        isShopOpen: "1",
        latitude: "",
        longitude: ""
      },
      initTmpProduct: true
      // enableInitProduct: false
    };
  },
  created() {
    // this.queryCityMore()
    this.init();
    this.getCityInfo();
    // this.enableInit()
  },
  methods: {
	 confirm(){
      if(!this.selectedCity.id){
        	msg.warning('请选择城市');
          return;
      }
      this.ruleForm.regionalId = this.selectedCity.id
			let _this = this;
			let obj={};
			obj=storagelite.sessionGet("RIGISTER_INFO");
			obj.current="storen"
			obj.cityName=this.selectedCity.name;
      obj.regionalId= this.ruleForm.regionalId;
      obj.headContent='创建第一个门店'
			this.$emit("childToParentMsg", obj);
		},
    init() {
      this.provinceItems = regional.getProvince();
    },
    initProduct(cityId) {
      this.$store.dispatch("post", {
        uri: "tmpProductInfo/initProduct",
        data: { cityId }
      });
    },
    getCityInfo() {
      let mercInfo = auth.getMercInfo();
      if (mercInfo && mercInfo.regionalId) {
        this.ruleForm.symbol = mercInfo.symbol;
        let regionalId = mercInfo.regionalId;
        var provinceId = "",
          cityId = "",
          districtId = "";
        var regionals = regional.getRegionalById(regionalId);
        var regionalInfo =
          regionals && regionals.length != 0 ? regionals[0] : null;
        if (regionalInfo) {
          if ((regionalInfo.parentId + "").length == 2) {
            this.cityItems = regional.getCity(regionalInfo.parentId);
            this.districtItems = regional.getArea(
              regionalInfo.parentId,
              regionalInfo.value
						);
					
            this.provinceItems.forEach(function(item) {
              item.selected = !(regionalInfo.parentId !== item.value);
            });
          } else if ((regionalInfo.parentId + "").length > 2) {
            var citys = regional.getRegionalById(regionalInfo.parentId);
            var cityInfo = citys && citys.length != 0 ? citys[0] : null;
            var plist = regional.getProvince(cityInfo.parentId);
            var pInfo = plist && plist.length != 0 ? plist[0] : null;
            this.provinceItems.forEach(function(item) {
              item.selected = !(pInfo.value !== item.value);
            });
            this.cityItems = pInfo.children || [];
          }
        }
      }
    },
    chooseProvince: function(selectedItem) {
      this.provinceItems.forEach(function(item, index) {
        item.selected = false;
      });
      selectedItem.selected = true;
      this.cityItems = regional.getCity(selectedItem.value);
      this.districtItems.length = 0;
    },
    changeCity: function(selectedItem) {
      this.cityItems.forEach(function(item, index) {
        item.checkedValue = !(selectedItem.value !== item.value);
			});
      this.districtItems = regional.getArea(
        selectedItem.parentId,
        selectedItem.value
      );
			let Arr=[...this.districtItems];
			this.districtItems=[];
			let _this=this
      Arr.forEach(function(item, index) {
				if(!item.label.includes("区",item.label.length-1)){
					_this.districtItems.push(item);
				}
        item.checkedValue = false;
      });
      this.selectedChanged(selectedItem);
    },
    changeDistrict: function(selectedItem) {
      this.districtItems.forEach(function(item, index) {
        item.checkedValue = !(selectedItem.value !== item.value);
      });
      this.selectedChanged(selectedItem);
      this.cityItems.forEach(function(item, index) {
        item.checkedValue = false;
      });
    },
    // 已选中城市函数
    selectedChanged: function(item) {
      if (item && item.checkedValue) {
        this.selectedCity.id = item.value;
        this.selectedCity.name = item.label;
        var lat = Number(item.latitude);
        var parentId = item.parentId;
        if (!lat && parentId) {
          //地区坐标为0，取上级坐标
          var city = regional.getCity(
            Number(parentId.toString().substr(0, 2)),
            parentId
          )[0];
          if (city) {
            this.selectedCity.latitude = city.latitude;
            this.selectedCity.longitude = city.longitude;
          }
        } else {
          this.selectedCity.latitude = item.latitude;
          this.selectedCity.longitude = item.longitude;
        }
      } else {
        this.selectedCity.id = "";
        this.selectedCity.name = "";
        this.selectedCity.longitude = "";
        this.selectedCity.latitude = "";
      }
    },
    add() {
      if (this.selectedCity.id) {
        this.ruleForm.symbol = auth.getMercInfo()
          ? auth.getMercInfo().symbol
          : this.ruleForm.symbol;
        this.formTitle = "添加城市（" + this.selectedCity.name + "）管理员";
        this.dialogVisible = true;
      } else {
        msg.warning("请选择城市");
      }
    }
  }
};
</script>

<style scoped>
.box {
  /* width: 600px; */
  /* height: 150px; */
  position: relative;
  padding: 0 50px;
  margin: 40px auto;
  display: table;
  /* background-color: yellow; */
}
.u-is-error {
  margin-top: 10px;
}

.box-citydiv > :first-child,
.box-citydiv > :nth-child(2) {
  border-right: none;
  /* background-color: yellow; */
  margin-left: 0px;
}
.cityDiv {
  position: relative;
  border: 1px solid #dcdcdc;
  margin-right: -4px;
  /* background-color: yellow */
}
.add-city {
  text-align: center;
}
/* .city-tree {
  width: 800px;
  margin: 50px auto 0;
} */
.outer-item {
  height: 250px;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 30px;
  overflow: auto;
}
.inner-list {
  display: inline-block;
}
.inner-item {
  margin-bottom: 20px;
  text-align: left;
}
.inner-item.selected .select-item {
  background-color: #8492a6;
  color: #fff;
}
.inner-item.is-selected .select-item {
  background-color: #20a0ff;
  border-color: #20a0ff;
  color: white;
}
.select-item {
  width: 160px;
  color: #8492a6;
  position: relative;
  border-radius: 5px;
  background-color: #f4f5f9;
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.select-item:hover {
  border-color: #eeeeef;
  background-color: #f4f4f4;
  color: #909090;
}
.select-item .city {
  vertical-align: middle;
  line-height: 20px;
  display: block;
  padding: 6px 12px;
}
.select-item .city {
  color: #8492a6;
}
.inner-item.selected .select-item .city {
  color: #fff;
}
.inner-item.is-selected .select-item .city {
  color: white;
}
.select-item:hover .city {
  color: #909090;
}
.select-item .icon {
  vertical-align: middle;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  line-height: 20px;
  z-index: -1;
}
.validate-containers {
  position: relative;
}
.validate-containerx {
	position: absolute;
	right: 82px;
	top: 0;
}
.validate-boxp{
	padding: 10px;
  /* text-align: center; */
	max-width: 200px;
	min-height: 60px;
  /* display: table; */
  background: #FFF8CA;
  border: 1px solid #FFD48C;
  border-radius: 4px;
  margin: 0 auto;
}
.validate-boxp:before {
  border-top: 6px solid #fff8ca;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  z-index: 3;
}
.validate-boxp:after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-top: 6px solid #FFD48C;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  z-index: 2;
}
.select-item .icon{
  right: 3px;
}
.min-and-btn{
  margin-bottom: 40px;
}
@media screen and (min-width: 1921px) {
   .cityDiv {
    display: inline-block;
    width: 330px;
  }
  .select-item {
    width: 160px;
  }
}
@media only screen and (min-width: 1600px) and (max-width: 1920px) {
  .cityDiv {
    display: inline-block;
    width: 330px;
  }
  .select-item {
    width: 160px;
  }
}
@media only screen and (min-width: 1366px) and (max-width: 1600px) {
  .cityDiv {
    display: inline-block;
    width: 300px;
  }
  .select-item {
    width: 140px;
	}
	.validate-containerx {
		top: 0px;
		right: 60px;
	}
}
@media only screen and (min-width: 1024px) and (max-width: 1366px) {
  .cityDiv {
    display: inline-block;
    width: 250px;
  }
  .select-item {
    width: 140px;
	}
	 .validate-boxp {
    max-width: 160px;
	}
	
}
@media only screen and (min-width: 735px) and (max-width: 1024px) {
  .cityDiv {
    display: inline-block;
    width: 210px;
  }
  .select-item {
    width: 120px;
	}
	 .validate-boxp {
      min-height: 80px;
    max-width: 150px;
	}
}
@media only screen and (min-width: 640px) and (max-width: 734px) {
  .cityDiv {
    display: inline-block;
    width: 180px;
  }
  .select-item {
    width: 120px;
	}
	 .validate-boxp {
    max-width: 130px;
	}
	.validate-containerx {
		top: 0px;
		right: 64px;
	}
}
@media screen and (max-width: 640px) {
  .ft-size{
		font-size: 18px
	}
	.wrapper-lg{
		padding: 15px;
	}
  .cityDiv {
    display: inline-block;
    width: 130px;
    margin-top: 5px;
  }
  .outer-item{
    height: 180px;
  }
  .m-t-lg{
    margin-top: 10px;
  }
  .select-item {
    width: 85px;
	}
  .validate-boxp {
    min-height: 80px;
    max-width: 100px;
	}
	.validate-containerx {
		top: 0px;
		right: 54px;
	}
}
@media screen and (max-width: 493px) {
  .cityDiv {
    display: inline-block;
    width: 110px;
	}
	 .box {
		margin:0 auto;
    padding: 8px;
  }
  .validate-boxp {
		max-width: 100px;
		font-size: 10px;
	}
	.validate-containerx {
		top: 8px;
		right: 3px;
	}
	.u-is-error {
  margin-top: 2px;
}
}
@media screen and (max-width: 433px) {
  .cityDiv {
    display: inline-block;
    width: 110px;
  }
  .select-item {
    width: 85px;
  }
  .box {
		margin:0 auto;
    padding: 8px;
	}
	.validate-containerx {
		top: 8px;
		right: 3px;
	}
  .validate-boxp {
		max-width: 90px;
		font-size: 10px;
	}
	.validate-containerx {
		top: 11px;
	}
	.u-is-error {
  margin-top: 2px;
}
}
@media screen and (max-width: 350px) {
  .cityDiv {
    display: inline-block;
    width: 90px;
  }
  .select-item {
    width: 65px;
    font-size: 8px;
  }
  .box {
		margin:0 auto;
    padding: 4px;
	}
	.validate-containerx {
		top: 8px;
    right: 3px;
    
	}
  .validate-boxp {
    max-width: 70px;
    height: 115px;
    font-size: 8px;
    padding: 5px;
	}
	.validate-containerx {
    top: 5px;
	}
	.u-is-error {
   margin-top: 2px;
}
}
@media screen and (max-width: 280px) {
  .cityDiv {
    display: inline-block;
    width: 60px;
  }
  .select-item {
    width: 50px;
    font-size: 8px;
  }
  .box {
		margin:0 auto;
    padding: 4px;
	}
	.validate-containerx {
		top: 8px;
    right: 3px;
    
	}
  .validate-boxp {
    max-width: 50px;
    height: 147px;
    font-size: 8px;
    padding: 1px;
	}
	.validate-containerx {
    top: 5px;
	}
	.u-is-error {
   margin-top: 2px;
}
.min-and{
  margin-top: 3px;
}
.min-and-btn{
  margin-top:-10px;
}
}
</style>

