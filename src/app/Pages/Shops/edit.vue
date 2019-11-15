<template>
  <div>
    <el-breadcrumb separator="/"
                   class="m-b">
      <el-breadcrumb-item :to="{ path: '/shops/list' }">
        <i class="el-icon-arrow-left icon-smaller"></i>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{id ? '编辑商品' : "新建商品"}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- tabs -->
    <el-row class="relase-tabs m-b-lg">
      <el-col :span="8">
        <div @click="changeStep(1)"
             class="relase-tabs-item"
             :class="{'is-active':step === 1}">1.选择商品类目</div>
      </el-col>
      <el-col :span="8">
        <div @click="changeStep(2)"
             class="relase-tabs-item"
             :class="{'is-active':step === 2}">2.编辑基本信息</div>
      </el-col>
      <el-col :span="8">
        <div @click="changeStep(3)"
             class="relase-tabs-item"
             :class="{'is-active':step === 3}">3.编辑商品详情</div>
      </el-col>
    </el-row>
    <div v-loading="categorysLoading ||instockLoading|| loading || saving"
         :element-loading-text="saving ?'拼命保存中' :''">
      <!-- step1 选择类别-->
      <categorys v-show="step === 1"
                 v-model="categoryId"
                 @loaded="categorysLoading = false"
                 @change="item=> categoryName = item.name"
                 class="m-b-md"></categorys>
      <!-- step2 -->
      <div class="info-box"
           v-show="step === 2">
        <basicInfo ref="basic"
                   :categoryName="categoryName"
                   :groupIds="groupIds"
                   :type="type"
                   @getNeedSend = 'getNeedSend'/>
        <instockInfo ref="instock"
                     :store="store"
                     :seq="seq"
                     :specsTypeList="specsTypeList"
                     :specsList="specsList"
                     @loaded="instockLoading = false"
                     @priceChange="priceChange"
                     @instockChange="instockChange"></instockInfo>
        <goodsInfo ref="goods"
                   :name="name"
                   :miniPrice="miniPrice"
                   :mktprice="mktprice"
                   :cost="cost"
                   :imgList="imgList"
                   :disabledPrice="disabledPrice"></goodsInfo>
        <otherInfo ref="other"
                   :payLimitList="payLimitList"
                   :paymentConfig="paymentConfig"
                   :carriage="carriage"
                   :buyNum="buyNum"
                   :couponId="couponId"
                   :type="type"
                   :needSend="needSend"></otherInfo>
        <flashSale  ref="flash"
                    :type="type"
                    :flashSaleFlag="flashSaleFlag"
                    :cardValid="cardValid"
                    :timeStartList="timeStartList"
                    ></flashSale>
      </div>
      <!-- step3 -->
      <detailInfo ref="detail"
                  v-show="step === 3"
                  :detail="detail"></detailInfo>
      <div class="text-center m-t-lg step-btn-bg">
        <el-button @click="prevStep"
                   v-if="step > 1">上一步</el-button>
        <el-button type="primary"
                   @click="nextStep"
                   v-if="step < 3">下一步</el-button>
        <el-button type="primary"
                   @click="saveGoodsInfo(1)"
                   v-if="step == 3">上架</el-button>
        <el-button @click="saveGoodsInfo(0)"
                   v-if="step == 3">下架</el-button>
        <!-- <el-button>预览</el-button> -->
      </div>
    </div>
  </div>
</template>
<script>
import msg from "@/utils/msg";
import calculation from "@/utils/helpers/calculation";
import categorys from "./components/categorys"; //类目
import basicInfo from "./components/basic_info"; //基本信息
import goodsInfo from "./components/goods_info"; //商品信息
import otherInfo from "./components/other_info"; //其他
import flashSale from "./components/flash_sale"; //限时折扣
import instockInfo from "./components/instock_info.vue"; //库存规格
import detailInfo from "./components/detail_info"; //详情
export default {
  data() {
    return {
      categorysLoading: true, //加载类目数据中
      instockLoading: true, //加载库存数据中
      loading: false, //加载中
      saving: false, //保存中
      step: 1, //步骤
      id: "", //商品id
      categoryId: "", //分类id
      categoryName: "无", //分类名

      groupIds: [], //分组id
      type: "", //商品类型
      needSend:'', //是否需要物流

      store: 0, //总库存
      startSales: 0,//初始销量
      seq: "", //编号
      specsTypeList: [], //规格列表
      specsList: [], //库存列表

      buyNum: 0, //限购数量
      carriage: 0, //运费
      couponId: '', // 赠送优惠券信息
      paymentConfig: "100", //支付方式
      payLimitList: [], //支付限制客户分分组列表

      flashSaleFlag: '0', //是否限时
      cardValid: '', //卡券有效期
      timeStartList:[],//时间区间

      miniPrice: 0, //最小金额
      mktprice: "", //原价/建议价
      cost: "", //成本价

      name: "", //商品名
      imgList: [], //图片列表
      specsTypeList: [], //规格列表
      specsList: [], //库存列表
      disabledPrice: false, //商品信息禁止输入价格
      detail: "" //详情
    };
  },
  watch: {
    step(n) {
      this.$router.push({
        path: this.$route.path,
        query: {
          step: n
        }
      });
    }
  },
  created() {
    if (this.$route.params.id && this.$route.path.indexOf("edit") > -1) {
      this.id = this.$route.params.id;
      this.loading = true;
      this.getDetail().then(data => {
        this.initData(data);
        this.loading = false;
      });
      let step = parseInt(this.$route.query.step);
      if (step > 0 && step < 4) {
        this.step = step;
      }
    }
  },
  methods: {
    // 获取订单详情
    getDetail() {
      return this.$store
        .dispatch("post", {
          uri: "goodsInfo/detail",
          data: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          return res.data.data;
        });
    },
    // 初始化数据
    initData(data) {
      this.categoryId = data.categoryId;
      this.categoryName = data.categoryName;

      this.groupIds = data.groupIdList;
      this.type = data.type;
      this.needSend = data.needSend;

      this.store = data.store;
      this.startSales = data.startSales;
      this.seq = data.seq;

      this.name = data.name;
      this.miniPrice = calculation.accDiv(data.price, 100);
      this.mktprice = calculation.accDiv(data.mktprice, 100);
      this.cost = calculation.accDiv(data.cost, 100);
      this.imgList = data.imgList;

      this.buyNum = data.buyNum;
      this.carriage = calculation.accDiv(data.carriage, 100);
      this.paymentConfig = data.paymentConfig;
      this.payLimitList = data.payLimitList;
      this.detail = data.detail;

      this.flashSaleFlag = data.flashSale;
      this.cardValid = data.cardValid;
      this.timeStartList.push(data.saleTimeStart || '');
      this.timeStartList.push(data.saleTimeEnd || '');

      if (data.couponList && data.couponList.length > 0) {
        this.couponId = data.couponList[0].couponId;
      }

      // 获取规格列表
      let vals = []; //name,判断是否有重复的name
      let specsTypeList = [];
      if (data.specsTypeList) {
        data.specsTypeList.forEach(item => {
          let len = vals.indexOf(item.val);
          if (len < 0) {
            vals.push(item.val);
            specsTypeList.push({
              val: item.val,
              name: item.val,
              type: item.type,
              tagList: []
            });
            len = vals.length - 1;
          }
          if (specsTypeList[len].tagList.indexOf(item.name) < 0) {
            specsTypeList[len].tagList.unshift(item.name);
          }
        });
      }
      this.specsTypeList = specsTypeList;
      // 获取库存数据
      data.specsList.forEach(item => {
        item.specs = JSON.parse(item.specs);
        item.price = calculation.accDiv(item.price, 100);
        item.cost = calculation.accDiv(item.cost, 100);
        item.valiStore = true;
        item.valiPrice = true;
        item.valiCost = true;
      });
      this.specsList = data.specsList.reverse();

      this.disabledPrice = !!this.specsList.length;
    },
    // 步骤改变前先验证
    checkStep() {
      if (this.step >= 1) {
        if (!this.categoryId) {
          msg.warning("请选择商品类别");
          return false;
        }
      }
      if (this.step >= 2) {
        return this.checkForms();
      }
      return true;
    },
    // 直接改变步骤
    changeStep(i) {
      if (this.loading || this.saving) return false;
      if (i <= this.step) {
        this.step = i;
      } else if (this.checkStep()) {
        this.step = i;
      }
    },
    // 上一步
    prevStep() {
      if (this.loading || this.saving) return false;
      this.step--;
    },
    // 下一步
    nextStep() {
      if (this.checkStep() && this.step < 3) {
        this.step++;
      }
    },
    // 表单校验
    checkForms() {
      return (
        this.$refs.basic.validate() &&
        this.$refs.instock.validate() &&
        this.$refs.goods.validate() &&
        this.$refs.other.validate()&&
        this.$refs.flash.validate()
      );
    },
    // 单个规格商品价格变化
    priceChange(miniPrice) {
      this.miniPrice = miniPrice;
    },
    getNeedSend(e){
      this.needSend = e.needSend;
      this.type = e.type;
    },
    // 规格变化
    instockChange(len) {
      this.disabledPrice = !!len;
    },
    //提交  添加信息
    addGoodsInfo(data) {
      return this.$store.dispatch("post", {
        uri: "goodsInfo/add",
        data
      });
    },
    //提交  更新信息
    updateGoodsInfo(data) {
      return this.$store.dispatch("post", {
        uri: "goodsInfo/update",
        data
      });
    },
    //提交 保存规格
    saveBatchGoodsSpecs(data) {
      return this.$store.dispatch("post", {
        uri: "goodsSpecs/saveBatch",
        data: {
          specsList: data
        }
      });
    },
    // 提交 删除规格
    delGoodsSpecs(goodsId) {
      return this.$store.dispatch("post", {
        uri: "goodsSpecs/delete/all",
        data: {
          goodsId
        }
      });
    },
    // 保存成功！
    saveSuccess(text) {
      this.saving = false;
      msg.success(text);
    },
    // 保存商品(marketable：保存方式 1:上架，0：下架)
    async saveGoodsInfo(marketable) {
      this.saving = true;
      if (this.checkForms()) {
        let basicData = this.$refs.basic.getData(); //基本信息
        let goodsData = this.$refs.goods.getData(); //商品信息
        let instockData = this.$refs.instock.getData(); //库存
        let otherData = this.$refs.other.getData(); //其他信息
        let flashData = this.$refs.flash.getData();//显示抢购信息
        let detail = this.$refs.detail.getData(); //详情
        let data = {
          ...basicData,
          ...goodsData,
          ...otherData,
          ...detail,
          ...flashData
        };
        data.id = this.id; //商品id
        data.categoryId = this.categoryId;

        data.store = instockData.store; //总库存
        data.startSales = instockData.startSales;//初始销量
        data.seq = instockData.seq; //商品编号

        data.sort = 0; //序号
        data.marketable = marketable; //保存方式 1:上架，0：下架

        let successText = "商品" + (marketable ? "上架" : "下架") + "成功";
        let res = await (this.id ? this.updateGoodsInfo : this.addGoodsInfo)(
          data
        );
        // 如果有多个规格
        if (this.disabledPrice) {
          let list = [];
          instockData.list.forEach(item => {
            let { id, specs, sort, store, seq } = { ...item };
            let price = calculation.accMul(item.price, 100);
            let cost = calculation.accMul(item.cost, 100);
            let goodsId = item.goodsId || res.data.data.id;
            list.push({
              id,
              goodsId,
              specs,
              sort,
              store,
              price,
              cost,
              seq
            });
          });
          await this.saveBatchGoodsSpecs(JSON.stringify(list));
        } else if (this.id) {
          // 没有多个规格并且有id，则删除规格
          await this.delGoodsSpecs(this.id);
        }
        this.saveSuccess(successText);
        if (!this.id) this.$router.push(`/shops/list`);
      } else {
        this.saving = false;
      }
    }
    // 下架
    // UnderShelf() {
    // goodsInfo/load 上架 id detail:详情
    // goodsInfo/unload 下架 id detail:详情
    // }
  },
  components: {
    categorys,
    basicInfo,
    instockInfo,
    goodsInfo,
    otherInfo,
    flashSale,
    detailInfo
  }
};
</script>
<style lang="less">
@import url("./theme/edit.less");
// .relase-bg {
//   background-color: #f8f8f8;
// }
// .step-btn-bg {
//   background-color: #fdf1d5;
//   padding: 6px 0;
// }
// .relase-tabs {
//   &:extend(.relase-bg);
//   text-align: center;
//   border-top: 1px solid #dee5e7;
//   border-left: 1px solid #dee5e7;
//   .relase-tabs-item {
//     cursor: pointer;
//     padding: 10px;
//     border-right: 1px solid #dee5e7;
//     border-bottom: 1px solid #dee5e7;
//     &.is-active {
//       background-color: #fff;
//       border-bottom: 0;
//     }
//   }
// }
</style>

// 新增/编辑商品