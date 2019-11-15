import consts from '@/utils/consts'
import axios from 'axios'
import elementUI from 'element-ui'
import router from '../router';
import auth from './auth';
import qs from 'query-string'

/**
 * 基于 axios 的 RESTful HTTP 简单封装
 * @author 赵金添 <729234283@qq.com>
 */
export default class REST {
  /**
   * 构造方法
   */
  constructor () {
    /**
     * 接口基础地址
     * @type {string}
     */
    this.baseURL = ''

    /**
     * 接口版本
     * @type {string}
     */
    this.version = ''

    /**
     * 请求路径
     * @type {string}
     */
    this.path = ''

    /**
     * Headers
     * @type {Object}
     */
    this.headers = {'Content-Type': 'application/x-www-form-urlencoded'}  //跨域调用

    /**
     * 统一错误处理
     * @type {Function}
     */
    this.errorHandler = () => {}

    // 支持的请求方式
    const methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']

    // 注册方法到 this
    methods.forEach((method) => {
      this[method] = options => this._request(method, options)
    })
  }

  /**
   * 请求
   * @param {string} method='GET' 请求方式
   * @param {Object} [options={}] 选项
   * @param {string} [options.uri=''] 资源唯一标示，一般是 ID
   * @param {Object} [options.params=null] GET 参数
   * @param {Object} [options.data=null] POST/PUT/PATCH 数据
   * @return {Object}
   */
  _request (method = 'GET', options = {}) {

    if (options.data) {
        options.data = qs.stringify(options.data);
    }

    const {uri = '', params = null, data = null, forceResolve = false} = options
    let url = this.version ? `${this.version}/${this.path}` : `${this.path}`
    if (consts.ENV === consts.DEV) {
      console.log("url", url)
    }

    if (uri) {
      url = `${url}/${uri}`
    }

    // GET
    if (params) {
      url = url + this._objToUrl(params)
    }
    return new Promise((resolve, reject) => {
      axios({
        baseURL: this.baseURL,
        headers: this.headers,
		    withCredentials:true,
        method,
        url,
        data
      }).then((res) => {
        if (consts.ENV === consts.DEV) {
          console.log(res)
        }
        if(!res || res.data.httpCode != 200) {
          if (res && res.data.httpCode == 401) {
            // 跳转登录页面
            auth.logout();
            router.push('/login')
          } else {
            // 跟根据返回值，自行处理逻辑异常情况
            if (forceResolve) {
                res && resolve(res)
            } else {
              elementUI.Message.error(res.data.msg || consts.ERROR_MSG);
            }
          }
        } else {
          res && resolve(res)
        }
      }).catch(this.errorHandler)
    })
  }

  /**
   * 对象转 URL
   * @param {Object} obj 待转化对象
   * @return {string}
   */
  _objToUrl (obj) {
    if (!obj || !Object.keys(obj).length) {
      return ''
    }

    return '?' + Object.keys(obj).map((key) => {
      return `${key}=${encodeURIComponent(obj[key])}`
    }).join('&')
  }

  /**
   * 附加路径
   * @param {string} [path=''] 路径
   */
  addPath (path = '') {
    this.path = this.path + '/' + path

    return this
  }

  /**
   * 添加 Headers
   * @param {Object} headers Headers
   */
  addHeaders (headers) {
    this.headers = {
      ...this.headers,
      ...headers
    }

    return this
  }

  /**
   * 路径参数替换
   * @param {Object} options={} 路径参数列表
   */
  replace (options = {}) {
    Object.keys(options).forEach((key) => {
      this.path = this.path.replace(new RegExp('{' + key + '}', 'img'), options[key])
    })

    return this
  }
}
