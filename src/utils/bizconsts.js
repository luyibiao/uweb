const COMMON = {
  ENABLE : 1,
  DISABLE : 0,
  DELETE : -1,

  ORIGIN_UNKNOWN: 0, //未知
  ORIGIN_WX: 1, //微信
  ORIGIN_ANDROID: 2,  //android
  ORIGIN_IOS: 3, //ios
  ORIGIN_WEB: 4, //后台系统
  ORIGIN_CUPBOARD: 5, //柜子
  ORIGIN_EXTERNAL: 6, //外部系统
  ORIGIN_WX_APP: 7, //微信小程序
  ORIGIN_CASHIER: 8,   //门店设备、收银机
  ORIGIN_FACTORY: 9,//工厂设备、工位机
  ORIGIN_APP_AIDE: 10 //U助手
};

const TOOL = {
  // -优惠券营销活动业务类型-
  COUPON_GIFT_TYPE_CARD: 1,// 会员卡
  COUPON_GIFT_TYPE_RECHARGE: 2,// 会员储值
  COUPON_GIFT_TYPE_NEW_USER: 3,// 新用户券
  COUPON_GIFT_TYPE_ORDER_SHARE: 4,// 订单分享

  // -优惠券获取类型-
  COUPON_OBTAIN_RECEIVE: 1,// 客户自领
  COUPON_OBTAIN_ASSIGN: 2// 主动派发
};

const TRADE = {
  //1.微信 2.现金 3.余额 4.支付宝 5.网银网关 6.优惠券 7.银联卡 8.免单卡 9.充值卡,10.绑卡充值,11.优付卡,12.激活码,14.微信小程序 100其他
  PAY_WX: 1,
  PAY_CASH: 2,
  PAY_BALANCE: 3,
  PAY_ALIPAY: 4,
  PAY_BANK: 5,
  PAY_COUPON: 6,
  PAY_UNION: 7,
  PAY_FREE: 8,
  PAY_CARD: 9,
  PAY_GROUP_CARD: 10,
  PAY_UPAY_CARD: 11,
  PAY_CODE: 12,
  PAY_WX_APP: 14,
  PAY_OTHER: 100,
  CONFIG_KEY:{
    OTHER_PAY: 'OTHER_PAY'
  }
};
export default {
  COMMON,
  TRADE,
  TOOL
}