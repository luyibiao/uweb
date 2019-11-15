import auth from "@/utils/auth";
import validate from "@/utils/helpers/validate";
import calculation from "@/utils/helpers/calculation";
import msg from "@/utils/msg";

import Uploader from "@/components/Uploader";
import wxPreview from "../components/wx_preview.vue";
import time from '@/utils/helpers/timeLite'
export default {
  data() {
    // 校验优惠券数量格式
    const valiCouponCnt = (rule, value, callback) => {
      validate.amount(value, 0, 1, 20) ? callback() : callback(new Error('请输入1 ~ 20的整数'))
    };
    // 校验优惠券积分
    const valiPointGift = (rule, value, callback) => {
      validate.amount(value, 0, 1, 50000) ? callback() : callback(new Error('积分值在1~50000之间'))
    };
    // 校验优惠券积分系数
    const valiPointRatio = (rule, value, callback) => {
      validate.amount(value, 0, 0, 50) ? callback() : callback(new Error('系数为0~50整数'))
    }
    // 校验金额
    const valiPayAmt = (rule, value, callback) => {
      validate.amount(value, 2, 0.01, 99999999) ? callback() : callback(new Error('金额格式错误'))
    }
    // 校验整数
    const valiInteger = (rule, value, callback) => {
      if (value || value === 0) {
        validate.amount(value, 0, 1, 99999999) ? callback() : callback(new Error('请输入0~99999999的整数'))
      } else {
        callback();
      }
    }
    // 折扣
    const valiDiscount = (rule, value, callback) => {
      validate.amount(value, 1, 0, 10) ? callback() : callback(new Error('折扣格式错误'))
    }
    return {
      saving: false, //保存中
      mercInfo: auth.getMercInfo(), //商户信息
      levelList: [], //会员等级列表
      couponList: [], //优惠券列表
      bgColor: "#60be4e", //封面背景色
      bgPath: "", //封面背景图
      levelIndex: null, // 选择的会员等级index
      // 表单
      ruleForm: {
        id: null, //id
        name: "", //name
        status: null, //状态
        coverType: 1, //封面类型  1 颜色 2图片
        imgPath: "#60be4e", //封面
        rights: ['0', '1', '0', '0'], //权限 [运费，折扣，优惠券，积分]
        discountType: 1, //折扣类型
        discount: "", //折扣
        discountDesc: [], //经营大类折扣
        couponList: [], //优惠券
        giftPoint: "", // 赠送积分
        pointRatio: 1, //积分系数
        remark: "", //使用须知
        payAmt: "", //升级条件 消费金额
        payCnt: "",//升级条件 支付笔数
        point: "",//升级条件 累计积分
        level: "" //会员等级
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        coverType: [
          { required: true, message: "请选择封面" },
          {
            validator: (rule, value, callback) => {
              if ((value === 1 && this.bgColor) || (value === 2 && this.bgPath)) {
                callback()
              } else {
                callback(new Error('请选择封面'));
              }
            },
            trigger: "change"
          }
        ],
        remark: [
          { required: true, message: "请填写使用须知", trigger: "blur" },
          { max: 225, message: "长度超过 225 个字符", trigger: "blur" }
        ],
        couponId: {
          validator: (rule, value, callback) => {
            if (this.ruleForm.rights[2] == '1') {
              if (value) {
                let num = 0;
                for (let index = 0; index < this.ruleForm.couponList.length; index++) {
                  if (value == this.ruleForm.couponList[index].couponId) num++
                  if (num > 1) {
                    callback(new Error('重复的优惠券'))
                    return false;
                  };
                }
                callback();
              } else {
                callback(new Error('请选择优惠券'));
              }
            } else {
              callback();
            }
          }
        },
        couponCnt: {
          validator: (rule, value, callback) => {
            if (this.ruleForm.rights[2] == '1') {
              valiCouponCnt(rule, value, callback);
            } else {
              callback();
            }
          }
        },
        giftPoint: {
          validator: (rule, value, callback) => {
            if (this.ruleForm.rights[3] == '1') {
              valiPointGift(rule, value, callback);
            } else {
              callback();
            }
          }
        },
        pointRatio: [
          { validator: valiPointRatio },
          { required: true, message: "请输入积分系数" },
        ],
        payAmt: {
          validator: (rule, value, callback) => {
            if (value || value === 0) {
              valiPayAmt(rule, value, callback)
            } else {
              callback();
            }
          }, trigger: "blur"
        },
        payCnt: { validator: valiInteger, trigger: "blur" },
        point: { validator: valiInteger, trigger: "blur" },
        level: { required: true, message: "请选择会员卡等级" },
        comDiscount: {
          validator: (rule, value, callback) => {
            if (this.ruleForm.discountType === 1) {
              valiDiscount(rule, value, callback)
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        descDiscount: {
          validator: (rule, value, callback) => {
            if (this.ruleForm.discountType === 2) {
              valiDiscount(rule, value, callback)
            } else {
              callback();
            }
          },
          trigger: "blur"
        }
      },
    }
  },
  created() {
    //this.queryCouponList();
  },
  methods: {
    /* 封面 */
    // 表单单独验证封面
    valiImgPath(name) {
      this.$refs[name].validateField('coverType');
    },
    /*  折扣  */
    // 获取经营项目
    getProductList(data) {
      this.$store
        .dispatch("post", {
          uri: "mercBusiness/business/list"
        })
        .then(res => {
          let obj = {};
          res.data.data.forEach(item => {
            obj[item.businessId] = item.name;
          })
          this.getDiscountDesc(obj)
        });
    },
    // 获取经营大类折扣 data 经营项目 （获取经营项目后返回的值）
    getDiscountDesc(data) {
      // 已有经营项目信息则对比项目name并格式化折扣值 没有则新建
      if (this.ruleForm.discountDesc.length) {
        this.ruleForm.discountDesc.forEach(item => {
          item.bizName = data[item.bizId];
          item.discount = calculation.accDiv(item.discount, 10);
        });
      } else {
        let arr = [];
        Object.keys(data).forEach((key, index) => {
          arr.push({ bizId: key, bizName: data[key], discount: "" });
        });
        this.ruleForm.discountDesc = arr;
      }
    },
    // 折扣类型改变，则修改折扣权益
    changeDiscountType(value) {
      this.$set(this.ruleForm.rights, 1, value === 3 ? '0' : '1');
    },
    /*  优惠券  */
    // 添加优惠券
    addCoupon() {
      this.ruleForm.couponList.push({ id: '', cnt: '', key: +new Date() })
    },
    // 删除优惠券
    removeCoupon(index) {
      if (this.ruleForm.couponList.length > 1)
        this.ruleForm.couponList.splice(index, 1)
    },
    // 获取优惠券列表（有效的优惠券）
    queryCouponList() {
      this.$store
        .dispatch("post", {
          uri: "couponInfo/list",
          //data: {type: 1}
          data: {types: [1,5],status:1,timeEnd :time.getDate(new Date()), level: this.ruleForm.level}
        })
        .then(res => {
          this.couponList = res.data.data.list;
        });
    },
    /* 会员等级 */
    // 获取会员等级
    queryLevelList() {
      return this.$store
        .dispatch("post", {
          uri: "userLevel/list"
        })
        .then(res => {
          this.levelList = res.data.data.list;
        });
    },
    // 选择等级
    selectedLevel(item) {
      this.ruleForm.name = this.levelList[item].name;
      this.ruleForm.level = this.levelList[item].level;
      this.queryCouponList();
      this.ruleForm.couponList = [];
    },
    // 获取表单需要提交的数据
    getFormData() {
      let data = {};
      if (this.ruleForm.id) data.id = this.ruleForm.id;
      data.coverType = this.ruleForm.coverType;
      data.imgPath = this.ruleForm.coverType === 1 ? this.bgColor : this.bgPath;
      data.remark = this.ruleForm.remark;
      data.payAmt = this.ruleForm.payAmt ? calculation.accMul(this.ruleForm.payAmt, 100) : "";
      data.payCnt = this.ruleForm.payCnt;
      data.point = this.ruleForm.point;
      data.level = this.ruleForm.level;
      data.name = this.ruleForm.name;
      data.rights = this.ruleForm.rights.join('');
      data.pointRatio = this.ruleForm.pointRatio;
      // 折扣
      if (this.ruleForm.discountType !== 3) data.discountType = this.ruleForm.discountType;
      if (this.ruleForm.discountType === 1) {
        data.discount = calculation.accMul(this.ruleForm.discount, 10)
      } else if (this.ruleForm.discountType === 2) {
        data.discountDesc = [];
        this.ruleForm.discountDesc.forEach(item => {
          data.discountDesc.push({
            bizId: item.bizId,
            bizName: item.bizName,
            discount: calculation.accMul(item.discount, 10)
          })
        })
        data.discountDesc = JSON.stringify(data.discountDesc);
      }
      // 优惠券
      if (this.ruleForm.rights[2] == '1') {
        let couponList = []
        this.ruleForm.couponList.forEach(item => {
          couponList.push({
            couponId: item.couponId,
            cnt: item.cnt
          })
        })
        data.couponList = JSON.stringify(couponList);
      }

      // 赠送积分
      data.giftPoint = this.ruleForm.rights[3] == '1' ? this.ruleForm.giftPoint : "";

      return data;
    },
    // 表单提交
    submit(fn) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          fn && fn(this.getFormData())
        }
      })
    },

    //图片上传模块
    handleSaveSuccess(att) {
      if (att.data) {
        this.bgPath = att.data.path;
        this.valiImgPath('ruleForm');
      }
    },
    beforeAvatarUpload(file) {
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
  },
  computed: {
    // 折扣
    discount() {
      if (this.ruleForm.discountType === 1 && this.ruleForm.discount < 10 && this.ruleForm.discount > 0) {
        return this.ruleForm.discount + '折'
      }
      if (this.ruleForm.discountType === 2) {
        return '多折扣'
      }
      return '无折扣'
    }
  },
  components: {
    Uploader,
    wxPreview
  },
}