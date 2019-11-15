/*计算*/
export default {
  name: 'validate',
  // 非空判断
  notEmpty:function (val){
    return typeof (val) !== "undefined" && val !== null && String(val).length > 0;
  },
  // 字符串
  string:function(val, min, max, ignoreEmpty, byteLen) {

    let ce = typeof(ignoreEmpty) === 'boolean'?ignoreEmpty:false;
    let blen = byteLen;

    if (!this.notEmpty(val)){
      return ce;
    }

    let isChkOk = true;

    if (!this.notEmpty(val)){
      return false;
    }
    let len = val.length;
    if (blen) {
      len = this.getBLen(val)
    }

    if( !isNaN(min) && len < min) {
      isChkOk = false;
    }

    if(!isNaN(max) && len > max) {
      isChkOk = false
    }
    return isChkOk;
  },
  // 数字
  number:function (val, min, max, ignoreEmpty){

    let ce = typeof(ignoreEmpty) === 'boolean'?ignoreEmpty:false;

    if (!this.notEmpty(val)){
      return ce;
    }

    let isChkOk = true;

    if (!(val%1 === 0)) {
      return false;
    }

    if (isNaN(val)) {
      isChkOk = false;
    } else {

      if (!isNaN(min)) {
        if (Number(val) < Number(min)) {
          isChkOk = false;
        }
      }

      if (!isNaN(max)) {
        if (Number(val) > Number(max)) {
          isChkOk = false;
        }
      }
    }
    return isChkOk;
  },
  // 双字节的替换成两个单字节的然后再获得长度，获取字符串单字节长度
  getBLen : function (str) {
    if (str == null) return 0;
    if (typeof str !== 'string') {
      str += '';
    }
    return str.replace(/[^\x00-\xff]/g,"01").length;
  },
  // 验证坐标
  coordinate: function (val, ignoreEmpty){
    let regex = /^([1-9]\d*\.\d*|0\.\d*[1-9]\d*),([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/;
    return this.pattern(regex, val, ignoreEmpty);
  },
  // 手机号
  tel:function (val, ignoreEmpty){
    let regex = /^1[0-9]{10}$/ || /^\d{3,4}-?\d{7,8}$/ || /^\d{3,4}-?\d{3,4}-(\d{3,4})$/ || /^\d{3,4}-?\d{7,8}-(\d{1,4})$/;
    return this.pattern(regex, val, ignoreEmpty);
  },
  // 身份证
  cardId:function (val, ignoreEmpty){
    let regex=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    return this.pattern(regex, val, ignoreEmpty);
  },

  /**
   * 金额校验
   * @param val 检查的数据
   * @param pos 小数点位数
   * @param min 最小值
   * @param max 最大值
   * @param ignoreEmpty 是否忽略空值
   */
  amount:function (val, pos, min, max, ignoreEmpty){

    let ce = typeof(ignoreEmpty) === 'boolean'?ignoreEmpty:false;

    if (!this.notEmpty(val)){
      return ce;
    }

    let isChkOk = true;
    let _pos = 2;
    let _min = 0;
    let _max = 20000;

    if (min) {
      _min = min;
    }

    if (pos || pos === 0) {
      _pos = pos;
    }

    if (max) {
      _max = max;
    }

    if (isNaN(val) || val < _min) {
      isChkOk = false;
    } else {
      var amtString = String (val);
      var alist = amtString.split(".");
      if (alist.length == 2 && alist[1].length > _pos) {
        isChkOk = false;
      } else if (val > _max) {
        isChkOk = false;
      }
    }

    return isChkOk;
  },
  url:function(val, ignoreEmpty){
    let regex=/^((http|https):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|])?$/;
    return this.pattern(regex, val, ignoreEmpty)
  },
  /**
   * 全部字母
   * @param val
   * @param ignoreEmpty
   * @returns {*}
   */
  letter: function (val, ignoreEmpty) {
    let regex = /^[a-z]+$/;
    return this.pattern(regex, val, ignoreEmpty)
  },
  /**
   * 字母和数字
   * @param val
   * @param ignoreEmpty 是否忽略空值
   * @returns {*}
   */
  letterNum:function (val, ignoreEmpty) {
    let regex = /^[A-Za-z0-9]+$/;
    return this.pattern(regex, val, ignoreEmpty)
  },
  /**
   * 是否为图片
   * @param val
   * @param ignoreEmpty
   */
  image:function (val, ignoreEmpty) {
    const regex = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    return this.pattern(regex, val, ignoreEmpty)
  },
  pattern: function(regex, val, ignoreEmpty) {

    let ce = typeof(ignoreEmpty) === 'boolean'?ignoreEmpty:false;

    if (!this.notEmpty(val)){
      return ce;
    }

    return regex.test(val);
  },
  //邮箱地址
  email: function (val, ignoreEmpty) {
    let regex=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return this.pattern(regex, val, ignoreEmpty)
  }
}