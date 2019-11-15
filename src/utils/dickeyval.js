
export default {
  SEX : [{val:0, text:'未知'}, {val:1, text:'男'}, {val:0, text:'女'}],
  DATE_STATUS:[
    {'val': '1', 'text': '已启用'},
    {'val': '0', 'text': '已停用'},
    {'val': '-1', 'text': '已删除'}
  ],
  ORDER_TYPE: [
    {'val': '1', 'text': '洗衣'},
    {'val': '2', 'text': '商城'},
    {'val': '3', 'text': '家政'}
  ],
  ORIGIN : [
    {'val': '0', 'text': '未知'},
    {'val': '1', 'text': '微信号'},
    {'val': '2', 'text': 'Android'},
    {'val': '3', 'text': 'IOS'},
    {'val': '4', 'text': '后台系统'},
    {'val': '5', 'text': '智柜'},
    {'val': '6', 'text': '外部系统'},
    {'val': '7', 'text': '小程序'},
    {'val': '8', 'text': '智店安卓'},
    {'val': '9', 'text': '工位机'},
    {'val': '10', 'text': '管家安卓'},
    {'val': '11', 'text': '智店PC'}
  ],
  PAY_METHOD : [
    {'val': '1', 'text': '微信'},
    {'val': '2', 'text': '现金'},
    {'val': '3', 'text': '余额支付'},
    {'val': '4', 'text': '支付宝'},
    {'val': '5', 'text': '网银网关'},
    {'val': '6', 'text': '优惠券'},
    {'val': '7', 'text': '银联卡'},
    {'val': '8', 'text': '免单卡'},
    {'val': '9', 'text': '充值卡'},
    {'val': '10', 'text': '绑卡充值'},
    {'val': '11', 'text': '优付卡'},
    {'val': '12', 'text': '激活码'},
    {'val': '100','text': '其他'}
  ],
  PRICING_MODE : [
    {'val': '1', 'text': '门店价格'},
    {'val': '2', 'text': '微信价格'},
    {'val': '3', 'text': '智柜价格'},
    {'val': '4', 'text': '团客价格'},
  ],
  TRADE_PAY_METHOD : [
    {'val': '1', 'text': '微信'},
    {'val': '2', 'text': '现金'},
    {'val': '3', 'text': '余额支付'},
    {'val': '4', 'text': '支付宝'},
    {'val': '7', 'text': '银联卡'},
    {'val': '11', 'text': '优付卡'},
    {'val': '100', 'text': '其它'}
  ],
  TRADE_ORIGIN : [
    {'val': '0', 'text': '未知'},
    {'val': '1', 'text': '微信号'},
    {'val': '5', 'text': '智柜'},
    {'val': '7', 'text': '微信小程序'},
    {'val': '8', 'text': '智店安卓'},
    {'val': '10', 'text': '管家安卓'},
    {'val': '11', 'text': '智店PC'}
  ],
  RECHARGE_PAY_METHOD : [
    {'val': '1', 'text': '微信'},
    {'val': '2', 'text': '现金'},
    {'val': '4', 'text': '支付宝'},
    {'val': '9', 'text': '充值卡'},
    {'val': '10', 'text': '绑卡充值'},
    {'val': '100', 'text': '其它'}
  ],
  RECHARGE_PAY_SCENE : [
    {'val': '0', 'text': '未知'},
    {'val': '1', 'text': '微信号'},
    {'val': '4', 'text': '系统后台'},
    {'val': '5', 'text': '智柜'},
    {'val': '7', 'text': '微信小程序'},
    {'val': '8', 'text': '智店安卓'},
    {'val': '10', 'text': '管家安卓'}
  ],
  PAY_STATUS : [
    {'val': '-1', 'text': '交易失败'},
    {'val': '0', 'text': '待支付'},
    {'val': '1', 'text': '交易成功'}
  ],
  OPERATE_STATUS : [
    {'val': '-1', 'text': '处理失败'},
    {'val': '0', 'text': '处理中'},
    {'val': '1', 'text': '处理成功'}
  ],
  ORDER_PAY_STATUS: [
    {'val': '0', 'text': '未支付'},
    {'val': '1', 'text': '已支付'},
    {'val': '2', 'text': '部分支付'},
  ],
  ORDER_STATUS: [
    {'val': '1', 'text': '已下单，待接单'},
    {'val': '3', 'text': '已接单'},
    {'val': '5', 'text': '已收件'},
    {'val': '7', 'text': '入库中'},
    {'val': '9', 'text': '已入库'},
    {'val': '20', 'text': '送往工厂途中'},
    {'val': '23', 'text': '到工厂'},
    {'val': '26', 'text': '洗涤中'},
    {'val': '29', 'text': '已洗完'},
    {'val': '32', 'text': '已出库'},
    {'val': '35', 'text': '已出厂，派送中'},
    {'val': '38', 'text': '已到店'},
    {'val': '41', 'text': '送件中'},
    {'val': '44', 'text': '已回柜'},
    {'val': '47', 'text': '已签收'},
    {'val': '50', 'text': '已完成'},
    {'val': '53', 'text': '已评价'},
    {'val': '60', 'text': '已取消'},
    {'val': '61', 'text': '已作废'},
    {'val': '62', 'text': '交易关闭'}
  ],
  ORDER_TAKE_MODE: [
    {'val': '1', 'text': '顾客送到店'},
    {'val': '2', 'text': '上门取件'},
    {'val': '3', 'text': '智柜取件'}
  ],
  ORDER_SEND_MODE:[
    {'val': '1', 'text': '顾客到店取'},
    {'val': '2', 'text': '上门送件'},
    {'val': '3', 'text': '投放智柜'}
  ],
  OPERATOR_TYPE:[
    {'val': '-1', 'text': '系统'},
    {'val': '0', 'text': '客户'},
    {'val': '1', 'text': '员工'},
    {'val': '2', 'text': '商户'}
  ],
  COUPON_TYPE:[
    {'val': '1', 'text': '会员自领'},
    {'val': '2', 'text': '主动派发'},
    {'val': '3', 'text': '新会员赠券'},
    {'val': '4', 'text': '分享赠券'}
  ],
  RFID_BATCH_TYPE:[
    {'val': '1', 'text': '会员卡'},
    {'val': '2', 'text': '标签卡'},
  ],
  WRITE_STATUS:[
    {'val': '0', 'text': '未写入'},
    {'val': '1', 'text': '写入成功'},
  ],
  BATCH_FINISH_STATUS:[
    {'val': '1', 'text': '已完成'},
    {'val': '0', 'text': '未完成'},
  ],
  BINDING_TYPE:[
    {'val': '1', 'text': '已绑定'},
    {'val': '0', 'text': '未绑定'}
  ],
  SHELF_MODE:[
    {'val': '1', 'text': '自动上架'},
    {'val': '2', 'text': '手动上架'}
  ],
  OUT_PRINT_TYPE:[
    {'val': '1', 'text': '热敏小票'},
    {'val': '2', 'text': '无纺布小票'}
  ],
  PRODUCT_STATUS:[
    {'val': '1', 'text': '已入库'},
    {'val': '5', 'text': '送往工厂途中'},
    {'val': '10', 'text': '到达工厂，待洗涤'},
    {'val': '13', 'text': '已复检'},
    {'val': '16', 'text': '洗涤中'},
    {'val': '19', 'text': '已洗完'},
    {'val': '22', 'text': '已出厂，配送中'},
    {'val': '25', 'text': '到达门店'},
    {'val': '31', 'text': '配送中'},
    {'val': '36', 'text': '已回柜'},
    {'val': '51', 'text': '已签收'},
    {'val': '34', 'text': '返工'},
    {'val': '50', 'text': '退洗'},
    {'val': '52', 'text': '已作废'}
  ],
  SEND_METHOD:[
    {'val': '1', 'text': '快递发货'},
    {'val': '2', 'text': '上门自提'},
    {'val': '3', 'text': '同城配送'},
  ],
  GOODS_ORDER_STATUS:[
    {'val': '1', 'text': '已下单'},
    {'val': '3', 'text': '待发货'},
    {'val': '5', 'text': '已发货'},
    {'val': '9', 'text': '已签收'},
    {'val': '11', 'text': '已完成'},
    {'val': '13', 'text': '已评价'},
    {'val': '50', 'text': '已取消'},
    {'val': '51', 'text': '已作废'},
    {'val': '52', 'text': '交易关闭'},
  ],
  PAYMENT_PARTNER:[
    {'val': 'Native', 'text': '自有支付'},
    {'val': 'AllInPay', 'text': '通联支付'}
  ],
  TRADE_TYPE:[
    {'val': '0101', 'text': '充值'},
    {'val': '0102', 'text': '提现'},
    {'val': '0201', 'text': '消费'}
  ],
  RECEIVABLE_TRADE_TYPE:[
    {'val': '0101', 'text': '充值'},
    {'val': '0201', 'text': '消费'}
  ],
  CHECK_TRADE_TYPE:[
    {'val': '0101', 'text': '充值'},
    {'val': '0201', 'text': '消费'}
  ],
  BANK: [
    {'val': 'CCB', 'text': '中国建设银行'},
    {'val': 'ICBC', 'text': '中国工商银行'},
    {'val': 'ABC', 'text': '中国农业银行'},
    {'val': 'BOC', 'text': '中国银行'},
    {'val': 'CMBC', 'text': '中国民生银行'},
    {'val': 'CMB', 'text': '招商银行'},
    {'val': 'CIB', 'text': '兴业银行'},
    {'val': 'BCM', 'text': '交通银行'},
    {'val': 'CEB', 'text': '中国光大银行'}
  ],
  MARK_STATUS:[
    {'val': '1', 'text': '使用中'},
    {'val': '0', 'text': '未使用'},
    {'val': '-1', 'text': '已失效'}
  ],
  WK_ROLE_TYPE:[
    {'val': 1, 'text':'品牌员工'},
    {'val': 2, 'text':'门店人员'},
    {'val': 3, 'text':'工厂人员'},
    {'val': 4, 'text':'其它员工'},
    {'val': 5, 'text':'城市员工'},
    {'val': 6, 'text':'中转站员工'}
  ],
  WK_ROLE_TYPE_ADD:[
    {'val': 1, 'text':'品牌员工'},
    {'val': 5, 'text':'城市员工'}
  ],
  DEFINE:[
    {'val':'-3','text':'超级通洗扣除'},
    {'val':'-2','text':'试用期满30天后回收所有通洗币'},
    {'val':'-1','text':'购买软件抵扣'},
    {'val':'1','text':'购买软件奖励'},
    {'val':'2','text':'激活码兑换奖励'},
    {'val':'3','text':'后台任务：'},
    {'val':'4','text':'推广软件奖励'},
    {'val':'5','text':'邀请注册奖励'},
    {'val':'6','text':'超级通洗赠送'},
    {'val':'7','text':'注册奖励'},
    {'val':'8','text':'订单取消退回'}
  ],
  EXPRESS_MODE:[
    {'val':'1','text':'取件'},
    {'val':'2','text':'送件'}
  ],
  EXPRESS_TYPE:[
    {'val': 'SF', 'text':'顺丰'}
  ],
  WX_APP_AUDIT: [
    {'val': '0', 'text':'审核成功'},
    {'val': '1', 'text':'审核失败'},
    {'val': '2', 'text':'审核中'}
  ],
  RELEASE_STATUS:[
    {'val': '0', 'text':'未发布'},
    {'val': '1', 'text':'已发布'}
  ],
  LOGIN_TYPE:[
    {'val': '1', 'text':'平台'},
    {'val': '2', 'text':'合作伙伴'},
    {'val': '3', 'text':'商户'}
  ],
  PROFIT_UNIT:[
    {'val': 1, 'text':'天'},
    {'val': 2, 'text':'月'},
    {'val': 3, 'text':'年'}
  ],
  CREDIT_STATUS:[
    {'val': '0', 'text': '未赊账'},
    {'val': '1', 'text': '赊账'}
  ]

}

