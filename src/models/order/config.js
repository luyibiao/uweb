import keyval from '@/utils/dickeyval'

export default {
  destroy,
  orderPayStatusList,
  orderStatusList,
  orderTakeModeList,
  orderSendModeList,
  orderProList,
}
//订单作废
function destroy (val) {
  var list = keyval['ORDER_STATUS']
  var fl = false
  for (let i = 0, len = list.length; i < len; i ++) {
    let item = list[i];
    if (Number(item.val) == 47 && Number(item.val) > Number(val)) {
      return fl = true;
    }
  }
  return fl
}
//订单支付状态
function orderPayStatusList () {
  return keyval['ORDER_PAY_STATUS']
}
//订单状态
function orderStatusList () {
  return keyval['ORDER_STATUS']
}
//订单取件模式
function orderTakeModeList () {
  return keyval['ORDER_TAKE_MODE']
}
//订单取件模式
function orderSendModeList () {
  return keyval['ORDER_SEND_MODE']
}
//操作人
function operator () {
  return keyval['OPERATOR_TYPE']
}
// 衣物状态列表
function orderProList () {
  return keyval['PRODUCT_STATUS']
}
