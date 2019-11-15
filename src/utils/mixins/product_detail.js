import calculation from "@/utils/helpers/calculation";
import validate from "@/utils/helpers/validate";
import msg from "@/utils/msg";
import auth from '@/utils/auth';


export default {
  data() {
    return {
      loading: true,
      priceLoading: false,
      imgVisible: false, //显示图片修改弹窗
      exp: {},
      productInfo: {},
      serviceRel: [],
      unitList: [], //产品单位计价方式
      saleTypeList: [], //折扣
      tranTypeList: [], //输送线
      productTypeList: [], //所属产品类别
      mercInfo: auth.getMercInfo(),
      // 基础表单
      ruleForm: {
        id: "",
        storeId: "",
        prices: null,
        cabinetId: "0",
        unionId:"0",
        name: "",
        firstWord:'',
        code: "",
        businessId: "",
        typeId: "",
        unit: "",
        saleType: "",
        tranType: "",
        isCustomNum: 1,
        sortNo: "",
        imgPath: "",
        discount: "",
        priceList: [], //{id:'', serviceId: '',prop: '', name: '', price:'',showPrice: '', vipPrice:'', isShow:''}
        status: 1
      },
      //修改单项服务价格
      rulePriceForm: {
        id: "",
        price: "",
        vipPrice: "",
        isShow: ""
      },
      // 基础表单弹窗
      dialog: {
        loading: false,
        title: "修改",
        visible: false,
        attr: ""
      },
      //修改单项服务价格窗口
      dialogPrice: {
        title: "修改",
        visible: false,
        label: ""
      },
    }
  },
  methods: {
    // 获取详情
    getDetail(id) {
      return this.$store
        .dispatch("getList", {
          uri: "productInfo/detail",
          data: {
            id
          }
        })
    },
    //获取服务价格
    getServiceRel(businessId) {
      this.$store
        .dispatch("getList", {
          uri: "productService/list",
          data: {
            sysMercId: "-1",
            businessId
          }
        }).then(res => {
          this.ruleForm.priceList = res.data.data.list.map(item => {
            return {
              serviceName: item.name,
              serviceId: item.id,
              price: "",
              vipPrice: "",
              isShow: 1,
            };
          });
        })
    },
    getProductTypeList() {
      //所属类别
      if (this.productTypeList.length == 0) {
        this.$store.dispatch('getList', {
          uri: 'mercBusiness/list',
        }).then((res) => {
          let businessList = res.data.data.list || [];
          this.$store.dispatch("post", {
            uri: "productType/list",
            data: { sysMercId: "-1" }
          }).then(res => {
            let typeList = res.data.data.list || [];
            typeList.forEach(function (item) {
              for (let i = 0; i < businessList.length; i ++) {
                if (item.businessId == businessList[i].businessId) {
                  item.businessName = businessList[i].name;
                }
              }
            });
            this.productTypeList = typeList;
          });
        });
      }
    },
    // 获取折扣
    getSaleTypeList() {
      if (this.saleTypeList.length == 0) {
        this.getDictList("SALE_TYPE", list => {
          this.saleTypeList = list;
        });
      }
    },
    // 获取输送方式
    getTranTypeList() {
      if (this.tranTypeList.length == 0) {
        this.getDictList("TRAN_TYPE", list => {
          this.tranTypeList = list;
        });
      }
    },
    // 获取计价方式
    getUnitList() {
      if (this.unitList.length == 0) {
        this.getDictList("PRODUCT_UNIT", list => {
          this.unitList = list;
        });
      }
    },
    //获取字典
    getDictList(code, fn) {
      if (code) {
        this.$store
          .dispatch("getList", {
            uri: "sysDicVal/valList",
            data: {
              code: code
            }
          })
          .then(res => {
            fn && fn(res.data.data)
          });
      }

    },
    // 设置ruleform数据
    setRuleForm(data, priceList) {
      Object.keys(this.ruleForm).forEach(key => {
        if(key != "priceList"){
          this.ruleForm[key] = data[key];
        }
      });
      this.ruleForm.unit = this.ruleForm.unit + "";
      this.ruleForm.saleType = this.ruleForm.saleType + "";
      this.ruleForm.tranType = this.ruleForm.tranType + "";
      this.ruleForm.priceList = this.ruleForm.priceList.map(item => {
        return {
          id: this.selectPriceId(item.serviceId, priceList),
          price: calculation.accDiv(this.selectPrice(item.serviceName, priceList), 100),
          vipPrice: typeof(this.selectPriceList(item.serviceName, priceList).vipPrice)=='number' ? calculation.accDiv(this.selectPriceList(item.serviceName, priceList).vipPrice, 100) : "",
          isShow: item.isShow,
          serviceName: item.serviceName,
          serviceId: item.serviceId
        };
      });
    },
    selectPriceList(serviceName, priceList){
      if(priceList)
        for(var i = 0; i < priceList.length; i++){
          if(priceList[i].serviceName == serviceName){
            return priceList[i];
          }
        }
      return '';
    },
    selectPriceId(serviceId, priceList){
      if(priceList)
      for(var i = 0; i < priceList.length; i++){
        if(priceList[i].serviceId == serviceId){
          return priceList[i].id;
        }
      }
      return 0;
    },
    selectPrice(serviceName, priceList){
      if(priceList)
      for(var i = 0; i < priceList.length; i++){
        if(priceList[i].serviceName == serviceName){
         return priceList[i].price;
        }
      }
      return 0;
    },
    // 打开基础信息弹窗
    openBaseDialog(title, attr, fn) {
      this.dialog.title = "修改" + title;
      this.dialog.attr = attr;
      fn && fn();
      // 初始化表单值
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
      this.setRuleForm(this.productInfo, this.serviceRel);
      this.dialog.visible = true;
    },
    // 修改单项服务价格
    openPriceDialog(item) {
      this.rulePriceForm.price = calculation.accDiv(item.price, 100);
      this.rulePriceForm.vipPrice = typeof(item.vipPrice) == 'number' ? calculation.accDiv(item.vipPrice, 100) : "";
      this.rulePriceForm.id = item.id;
      this.rulePriceForm.isShow = item.isShow || 0;
      this.dialogPrice.label = item.serviceName;
      this.dialogPrice.title = "修改" + item.serviceName + "服务项";
      this.dialogPrice.visible = true;
    },
    // 编辑所属类别前
    beforeEditType() {
      this.getProductTypeList();
      this.getUnitList();
    },
    // 选择所属类别
    selectedProductType(val) {
      let data = this.productTypeList.filter(item => item.id === val);
      // if (data && data[0] && this.ruleForm.businessId != data[0].businessId) {
        this.ruleForm.businessId = data[0].businessId;
        this.getServiceRel(data[0].businessId)
      // }
    },
    // 验证表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveForm();
        }
      });
    },
    // 提交图片修改
    submitImg(imgPath) {
      if (imgPath != this.productInfo.imgPath) {
        // 初始化表单值
        this.setRuleForm(this.productInfo, this.serviceRel);
        this.ruleForm.imgPath = imgPath;
        this.saveForm();
      }
      this.imgVisible = false;
    },
    // 提交表单
    saveForm() {
      let prices =
        this.ruleForm.priceList.map(item => {
          return {
            price: calculation.accMul(item.price, 100),
            vipPrice: typeof(item.vipPrice) == 'number' ? calculation.accMul(item.vipPrice, 100):"",
            serviceId: item.serviceId,
            isShow: item.isShow
          }
        })
      this.ruleForm.prices = JSON.stringify(prices);
      this.$store
        .dispatch("post", {
          uri: "productInfo/update",
          data: this.ruleForm
        })
        .then(res => {
          this.dialog.visible = false;
          this.initData();
          msg.success();
        });
    },
    //服务项单项修改保存
    submitPriceForm(formName) {
      let data = { ...this.rulePriceForm};
      data.price = calculation.accMul(data.price, 100);
      if (data.vipPrice) {
        data.vipPrice = calculation.accMul(data.vipPrice, 100);
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("post", {
              uri: "productServiceRel/update",
              data
            })
            .then(res => {
              this.dialogPrice.visible = false;
              this.initData();
              msg.success();
            });
        }
      });
    },
    // 校验
    checkAmount(rule, value, callback) {
      validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)
        ? callback()
        : callback(new Error());
    }
  },
  computed: {
    // 修改服务项的金额单位
    unit() {
      let data = this.unitList.filter(item => item.val == this.ruleForm.unit)[0] || {}
      return data.attr1 || '元'
    }
  }
}