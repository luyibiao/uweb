<template>
  <div v-loading="loading">
    <el-breadcrumb class="link-back"
                   separator="/">
      <el-breadcrumb-item :to="'/marketing/group/detail/'+ruleForm.unionId">
        <i class="el-icon-arrow-left icon-smaller"></i>产品列表</el-breadcrumb-item>
      <el-breadcrumb-item>新建产品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="m-l-xxl  m-t-lg m-r-xxl">
      <el-form :model="ruleForm"
               ref="ruleForm"
               label-width="100px"
               class="clearfix">
        <div class="pull-left"
             style="width:40%;">
          <el-form-item class="w-xxl"
                        label="产品名称"
                        prop="name"
                        :rules="[
						{ required: true, message: '请输入产品名称', trigger: 'blur' },
						{ min: 1, max: 8, message: '长度在1到8个长度' }
					]">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <!-- <el-form-item class="w-xxl" label="编号" prop="code"  :rules="[
						{ required: true, message: '编号不能为空', trigger: 'blur'},
						{ min: 2, max: 8, message: '长度在2到8个长度' }
					]">
						<el-input v-model="ruleForm.code"></el-input>
					</el-form-item> -->
          <el-form-item class="w-lg"
                        label="所属类别"
                        prop="typeId"
                        :rules="[{ required: true, message: '请选择折扣'}]">
            <el-select v-model="ruleForm.typeId"
                       clearable
                       placeholder="请选择所属类别"
                       @change="selectedProductType">
              <el-option :label="item.name + '(' + item.businessName + ')'"
                         :value="item.id"
                         :key="item.id"
                         v-for="item in productTypeList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="w-lg"
                        label="计价方式"
                        prop="unit"
                        :rules="[{ required: true, message: '请选择折扣' }]">
            <el-select v-model="ruleForm.unit"
                       placeholder="请选择计价方式"
                       @change="selectedUnit">
              <el-option :label="item.showText"
                         :value="item.val"
                         :key="item.id"
                         v-for="item in unitList"></el-option>
            </el-select>
          </el-form-item>
          <div class="price-item"
               v-if="ruleForm.priceList && ruleForm.priceList.length > 0">
            <el-form-item class="w-fohg"
                          :label="item.name"
                          :key="item.index"
                          v-for="(item, index) in ruleForm.priceList"
                          :prop="'priceList.' + index + '.showPrice'"
                          :rules="[
								{ required: true, message: '请输入价格' },
								{ type: 'number', message: '请输入有效价格' },
								{validator: checkAmount, min:0, max:99999, message: '有效金额0至99999', trigger: 'blur'}
							]">
              <el-input style="margin-right: 0px" v-model.number="item.showPrice" type="number" placeholder="请输入价格"></el-input>
              <span class="m-r-md ">{{item.unit || '元'}}</span>
              <span v-if="mercInfo.isOpenVipPrice && mercInfo.isOpenVipPrice == 1">
								<span>会员价</span>
								<el-input style="margin-right: 0px"  v-model.number="item.showVipPrice" type="number" placeholder="请输入价格"></el-input>
								<span >{{item.unit || '元'}}</span>
							</span>

              <!--<el-radio v-model="item.isShow">作为显示参考价格</el-radio>-->
            </el-form-item>
          </div>
          <el-form-item label="折扣"
                        prop="saleType"
                        :rules="[
						{ required: true, message: '请选择折扣' }]
					">
            <!-- <el-select v-model="ruleForm.saleType" placeholder="请选择折扣">
							<el-option :label="item.showText" :value="item.val" :key="item.id"  v-for="item in saleTypeList" ></el-option>
						</el-select> -->
            <el-radio-group v-model="ruleForm.saleType">
              <el-radio :key="item.id"
                        v-for="item in saleTypeList"
                        :label="item.val">{{item.showText}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="price-item"
               v-if="ruleForm.saleType == 2">
            <el-form-item class="w-xxl"
                          label="折扣比例"
                          prop="discount"
                          :rules="[
							{ required: true, message: '请输入折扣比例' },
							{ type: 'number', message: '折扣比例1至100之间的整数' },
						]">
              <el-input v-model.number="ruleForm.discount"
                        type="number"
                        placeholder="请输入折扣比例"></el-input>
              <span>%</span>
            </el-form-item>
          </div>
          <el-form-item label="输送类别"
                        prop="tranType"
                        :rules="[
						{ required: true, message: '请选择输送类别' }
					]">
            <el-radio-group v-model="ruleForm.tranType">
              <el-radio :label="item.val"
                        :key="item.id"
                        v-for="item in tranTypeList">{{item.showText}}</el-radio>
            </el-radio-group>
            <!-- <el-select v-model="ruleForm.tranType" placeholder="请选择输类别">
							<el-option :label="item.showText" :value="item.val" :key="item.id"  v-for="item in tranTypeList" ></el-option>
						</el-select> -->
          </el-form-item>
          <el-form-item label="自定义数量"
                        prop="isCustomNum"
                        :rules="[
						{required: true, message: '请选择输送线'}
					]">
            <el-switch active-color="#13ce66"
                       v-model="ruleForm.isCustomNumVal"
                       inactive-color="#dcdcdc"
                       :width="74"
                       on-text="是"
                       off-text="否">
            </el-switch>
            <p class="text-muted text-xs">入库时是否可以自定义产品数量</p>
          </el-form-item>
        </div>
        <div class="pull-left"
             style="width:60%;">
          <el-form-item label="可使用图片"
                        prop="imgPath">
            <uploadImg v-model="availableImgItem"
                       :keywords="ruleForm.name"
                       @selected="selectedAvailableImgs"></uploadImg>
          </el-form-item>
          <el-form-item label="自定义图片"
                        prop="imgPath">
            <Uploader class="u-avatar-uploader"
                      ref="upload"
                      tip="尺寸为300像素*300像素，大小不超过2M"
                      :manual="true"
                      :beforeFn="beforeAvatarUpload"
                      :changeFn="handleAvatarChange"
                      :successFn="handleAvatarSuccess"
                      :saveSuccessFn="handleSaveSuccess" />
          </el-form-item>
          <el-form-item class="w-xxl"
                        label="序号"
                        prop="sortNo"
                        :rules="[
							{ type:'number', required: false, message: '序号必须为整数'}]">
            <el-input v-model.number="ruleForm.sortNo"
                      type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <router-link to="/weixin/price/list">
              <el-button>取消</el-button>
            </router-link>
            <el-button type="primary"
                       @click="submitForm('ruleForm')"
                       :loading="saveLoading">{{saveLoading?'保存中':'保存'}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import helpers from "@/utils/helpers/base";
import msg from "@/utils/msg";
import calculation from "@/utils/helpers/calculation";
import validate from "@/utils/helpers/validate";
import Uploader from "@/components/Uploader";
import uploadImg from "@/components/Product/upload_img";
import auth from '@/utils/auth';

export default {
  components: {
    Uploader,
    uploadImg
  },
  data: function() {
    return {
      loading: true,
      businessList: [], //所属经营项目
      productTypeList: [], //所属产品类别
      unitList: [], //产品单位计价方式
      saleTypeList: [], //折扣
      tranTypeList: [], //输送线
      productServiceList: [], //服务项及价格
      productServiceRuleList: [], //服务项及价格操作规则
      mercInfo: auth.getMercInfo(),
      ruleForm: {
        unionId: this.$route.params.id,
        name: "",
        // code: '',
        businessId: "",
        typeId: "",
        unit: "",
        saleType: "",
        tranType: "",
        isCustomNum: 0,
        isCustomNumVal: false,
        discount: "",
        sortNo: "",
        priceList:[],	//{tmpId:'', serviceId: '',prop: '', name: '', price:'', showPrice: '', vipPrice:'', showVipPrice, isShow:''}
        prices: {},
        imgPath: ""
      },
      saveLoading: false, //保存中
      availableImgs: [], //可使用图片
      availableImgItem: null //当前选择的可使用图片对象
    };
  },
  created() {
    this.getProductBusinessList();
    this.getSaleTypeList();
    this.loading = false;
  },
  mounted() {
    this.getTranTypeList();
    this.getUnitList();
    this.querySortNo();
  },
  watch: {
    //监听选择改变
    "ruleForm.businessId"() {
      this.getProductServiceList();
    },
    "ruleForm.typeId"() {
      //				this.getProductServiceList()
    },
    "ruleForm.isCustomNumVal"(val) {
      this.ruleForm.isCustomNum = val ? 1 : 0;
    }
  },
  methods: {
    selectedAvailableImgs() {
      //选择可使用图片
      this.$refs.upload.imgPath = ""; //清除上传图片组件图片路径
    },
    getProductBusinessList() {
      //所属经营项目
      this.$store.dispatch("getList", {
          uri: "mercBusiness/list"
        })
        .then(res => {
          this.businessList = res.data.data.list || [];
          this.getProductTypeList();
        });
    },
    getProductTypeList() {
      //所属类别
      this.$store
        .dispatch("getList", {
          uri: "productType/list",
          data: {
            sysMercId: "-1"
          }
        }).then(res => {
          let typeList = res.data.data.list || [];
          let _this = this;
          typeList.forEach(function (item) {
            for (let i = 0; i < _this.businessList.length; i ++) {
              if (item.businessId == _this.businessList[i].businessId) {
                item.businessName = _this.businessList[i].name;
              }
            }
          });
          this.productTypeList = typeList;
        });
    },
    getProductServiceList() {
      //服务及价格
      this.$store
        .dispatch("getList", {
          uri: "productService/list",
          data: {
            sysMercId: "-1",
            businessId: this.ruleForm.businessId
          }
        })
        .then(res => {
          let _this = this;
          let tmpPriceList = [];
          this.productServiceList = res.data.data.list || [];
          this.productServiceList.forEach(function(item, index) {
            tmpPriceList.push({
              index: index,
              serviceId: item.id,
              name: item.name,
              price: "",
              showPrice: "",
              vipPrice: '',
              showVipPrice: '',
              isShow: 0,
              unit: item.unit
            });
          });
          this.ruleForm.priceList = tmpPriceList;
          this.selectedUnit(this.ruleForm.unit);
        });
    },
    getSaleTypeList() {
      let _this = this;
      this.getDictList("SALE_TYPE", function(list) {
        _this.saleTypeList = list;
      });
    },
    getTranTypeList() {
      let _this = this;
      this.getDictList("TRAN_TYPE", function(list) {
        _this.tranTypeList = list;
      });
    },
    getUnitList() {
      let _this = this;
      this.getDictList("PRODUCT_UNIT", function(list) {
        _this.unitList = list;
      });
    },
    getDictList(code, fn) {
      //获取字典
      if (!code) return;
      this.$store
        .dispatch("getList", {
          uri: "sysDicVal/valList",
          data: {
            code: code
          }
        })
        .then(res => {
          let list = res.data.data || [];
          if (typeof fn === "function") {
            fn(list);
          }
        });
    },
    querySortNo() {
      this.$store
        .dispatch("getList", {
          uri: "productInfo/querySortNo",
          data: {}
        })
        .then(res => {
          this.ruleForm.sortNo = res.data.data.maxSortNo || "1";
        });
    },
    selectedProductType(val) {
      var _this = this;
      this.productTypeList.forEach(function(item) {
        if (item.id == val) {
          _this.ruleForm.businessId = item.businessId;
          return false;
        }
      });
    },

    selectedUnit(val) {
      //设置单位
      var _this = this;
      let unit = "元";
      this.unitList.forEach(function(item) {
        if (item.val == val) {
          unit = item.attr1;
          return false;
        }
      });
      let list = [];
      this.ruleForm.priceList.forEach(function(item) {
        item.unit = unit;
        list.push(item);
      });
      this.ruleForm.priceList = list;
    },
    priceTrans(price) {
      return calculation.accMul(price, 100);
    },
    checkAmount(rule, value, callback) {
      if (
        !validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)
      ) {
        callback(new Error());
      } else {
        callback();
      }
    },
    saveForm() {
      //保存表单数据
      this.$store
        .dispatch("post", {
          uri: "productInfo/add",
          forceResolve:true,
          data: this.ruleForm
        })
        .then(res => {
          this.saveLoading = false;
          if (res.data.httpCode == 200) {
            msg.success(); //成功后提醒并跳转
            this.$router.push({
              path: "/marketing/group/detail/" + this.ruleForm.unionId
            });
          } else {
            msg.error(res.data.msg);
          }
        });
    },
    submitForm(formName) {
      //提交表单
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.priceList.forEach(function(item) {
            item.price = _this.priceTrans(item.showPrice);
            item.vipPrice = _this.priceTrans(item.showVipPrice);
          });
          this.ruleForm.prices = helpers.arrayToJson(this.ruleForm.priceList);
          this.saveLoading = true;
          if (this.$refs.upload.imgPath) {
            //是否使用上传图片
            this.$refs.upload.$children[0].submit(); //是则上传图片后保存
          } else {
            //否则直接保存
            if (this.availableImgItem) {
              //是否使用了可选择的图片
              let tags = JSON.parse(this.availableImgItem.tags) || [];
              if (tags.indexOf(this.ruleForm.name) < 0) {
                //判断产品名是否在标签中   不在则手动加入并保存
                tags.push(this.ruleForm.name);
                this.updateTags(this.availableImgItem.id, tags);
              }
            }
            this.ruleForm.imgPath = this.availableImgItem
              ? this.availableImgItem.path
              : "";
            this.saveForm();
          }
        } else {
          return false;
        }
      });
    },
    updateTags(id, tags) {
      //更新标签
      this.$store.dispatch("post", {
        uri: "attachment/updateTag",
        data: {
          id: id,
          tags: JSON.stringify(tags)
        }
      });
    },
    //图上上传模块
    handleAvatarChange(file) {
      //文件改变
      this.availableImgItem = null; //改变则删除已选中的可使用图片
    },
    handleAvatarSuccess(fileNames) {
      //图片上传成功后回调函数
      var _this = this;
      if (fileNames && fileNames[0]) {
        _this.ruleForm.imgPath = fileNames[0]; //保存图片地址
      }
    },
    handleSaveSuccess(att) {
      //保存成功后调用
      let tags = JSON.parse(att.data.tags) || [];
      if (tags.indexOf(this.ruleForm.name) < 0) {
        //判断产品名是否在标签中   不在则手动加入并保存
        tags.push(this.ruleForm.name);
        this.updateTags(att.data.id, tags);
      }
      this.saveForm(); //保存数据
    },
    beforeAvatarUpload(file) {
      //上传前判断
      const isImg = validate.image(file.type);
      if (!isImg) {
        msg.error("上传文件不是图片！");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        msg.error("上传图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    }
  }
};
</script>

<style lang="less" scoped>
.usable-img {
  width: 90px;
  height: 90px;
  border: 1px solid transparent;
  cursor: pointer;
  & > img {
    width: 100%;
    height: 100%;
  }
  &:last-child {
    margin-right: 0;
  }
}

.selected-img {
  border: 1px solid #00c800;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    border: 14px solid;
    border-color: transparent #00c800 #00c800 transparent;
  }
  &::after {
    content: "\E608";
    font-family: element-icons !important;
    position: absolute;
    right: 0;
    bottom: -12px;
    color: #fff;
    font-size: 12px;
  }
}
.price-item {
  margin-bottom: 15px;
}
.price-item:last-child {
  margin-bottom: 0;
}
.price-item .el-checkbox {
  width: 120px;
}
.price-item .el-input {
  width: 120px;
  margin-right: 10px;
}
.w-fohg{
  width: 520px;
}
</style>