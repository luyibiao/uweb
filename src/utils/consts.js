// 当前 host
const HOST = window.location.host

// 开发
const DEV = 'DEV'

// 生产
const PROD = 'PROD'

// 当前环境
const ENV = HOST.indexOf('localhost') === 0 ? DEV : PROD

// 获取顶级域名
let parseDomain=function (str) {
  if (!str) return '';
  if (str.indexOf('://') != -1) str = str.substr(str.indexOf('://') + 3);
  let topLevel = ['com', 'net', 'org', 'gov', 'edu', 'mil', 'biz', 'name', 'info', 'mobi', 'pro', 'travel', 'museum', 'int', 'areo', 'post', 'rec'];
  let domains = str.split('.');
  if (domains.length <= 1) return str;
  if (!isNaN(domains[domains.length - 1])) return str;
  let i = 0;
  while (i < topLevel.length && topLevel[i] != domains[domains.length - 1]) i++;
  if (i != topLevel.length) return domains[domains.length - 2] + '.' + domains[domains.length - 1];
  else {
    i = 0;
    while (i < topLevel.length && topLevel[i] != domains[domains.length - 2]) i++;
    if (i == topLevel.length) return domains[domains.length - 2] + '.' + domains[domains.length - 1];
    else return domains[domains.length - 3] + '.' + domains[domains.length - 2] + '.' + domains[domains.length - 1];
  }
};

// 基础地址
const BASE_URL = ENV === DEV ? 'http://api.ukaocloud.cn' : '/uk_api'
// const BASE_URL = ENV === DEV ? 'http://localhost:8081' : '/uk_api'

// 接口地址
const API_URL = BASE_URL + ''

// 分页大小
const PAGE_SIZE = 10
const PAGE_SIZE20 = 20
const PAGE_SIZE30 = 30

// 网站标题
const TITLE = '网站后台'

// 商标名称
const BRAND_NAME = '由 通洗 提供技术支持'

//异常提示
const ERROR_MSG = '加载失败，请稍后再试'
//门户网站地址
const PORTALS_URL = 'http://www.twash.cn/'
// 微信地址
const WX_URL = 'https://w.' + parseDomain(HOST)
// 管理网站地址
const M_URL = 'https://m.' + parseDomain(HOST)
// 合作伙伴地址
const PARTNER_URL = "http://partner." + parseDomain(HOST);
//后台请求前缀
const PLATFORM = 'platform'

export default {
  ENV,
  DEV,
  PROD,
  BASE_URL,
  API_URL,
  PAGE_SIZE,
  PAGE_SIZE20,
  PAGE_SIZE30,
  TITLE,
  BRAND_NAME,
  ERROR_MSG,
  PORTALS_URL,
  WX_URL,
  M_URL,
  PARTNER_URL,
  PLATFORM
}
