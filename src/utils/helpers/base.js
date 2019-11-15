export default {
  name: 'helpers',

  /**
   * 判断是否为空
   * @param {string} value 字符串
   * @return {boolean}
   */
  isEmpty (value) {
    return value === null || value === undefined || value.trim() === ''
  },

  /**
   * key mirror
   * @param {Object} obj 对象
   * @return {Object}
   */
  keyMirror (obj) {
    let ret = {}
    let key

    for (key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue
      }

      ret[key] = key
    }

    return ret
  },

  /**
   * 载入 JS 文件
   * @param {string} url JS URL
   */
  loadScript (url) {
    const httpReq = new XMLHttpRequest()

    httpReq.open('GET', url, true)
    httpReq.send(null)
  },
  /**
   * 格式刷数据
   */
  numFormat({value = 0, fixed = 2}){
    return Number(value).toFixed(fixed)
  },

  /**
   * 数组转JSON
   */
  arrayToJson (o){
     var r = [];
     if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
     if (typeof o == "object") {
       if (!o.sort) {
         for (var i in o)
           r.push(i + ":" + this.arrayToJson(o[i]));
         if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
           r.push("toString:" + o.toString.toString());
         }
         r = "{" + r.join() + "}";
       } else {
         for (var i = 0; i < o.length; i++) {
           r.push(this.arrayToJson(o[i]));
         }
         r = "[" + r.join() + "]";
       }
       return r;
     }
     return o.toString();
  },
  /**
   * json所有属性为空
   * @param jsonObj
   */
  jsonAttIsNull(jsonObj){
    for(var prop in jsonObj){
      jsonObj[prop] = ''
    }
  },

  /**
   * 多选下拉框下格式化数组
   */
  formatArr(Arr, item, toInt){
    if(Arr) {
      if(typeof Arr==='string') {
        if (toInt) {
          item.push(parseInt(Arr));
        } else {
          item.push(Arr);
        }
      } else {
        if (toInt) {
          item=Arr.map(Number);
        } else {
          item = Arr;
        }
      }
      return item;
    }			
  }

}
