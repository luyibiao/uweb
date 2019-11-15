import time from '@/utils/helpers/timeLite'
import keyval from '@/utils/dickeyval'
import calculation from '@/utils/helpers/calculation'

export default {
  install(Vue, options) {
    Vue.filter('amtFormat', (val) => {
      let value = '';
      if (val === 0 || val) {
        value = val / 100;
        return Number(value).toFixed(2);
      }
    });
    Vue.filter('kgFormat',(val)=>{
      let value="";
      if(val===0 || val){
        value=val/1000;
        return Number(value).toFixed(3)
      }
    })
    Vue.filter('getDate', (val) => {
      return time.getDate(val);
    });
    Vue.filter('getTime', (val) => {
      return time.getTime(val);
    });
    Vue.filter('getDateTime', (val) => {
      return time.getDateTime(val);
    });
    Vue.filter('getValText', (val, key) => {
      let list = keyval[key];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.val == val) {
          return item.text;
        }
      }
      return val;
    });
    Vue.filter('discountFormat', (val) => {
      val = !val ? '100' : val
      return calculation.accDiv(val, 10);
    });
    // 会员卡折扣
    Vue.filter('cardDiscount', (value, type) => {
      if (type === 2) {
        return '多折扣'
      }
      return value && value < 100 ? calculation.accDiv(value, 10) + '折' : '不打折'
    });
  }
}