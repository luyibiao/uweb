// import iView from 'iview'
import elementUI from 'element-ui'
import auth from '../auth'
import consts from '@/utils/consts'

/**
 * REST 辅助函数集合
 * @type {Object}
 */
export default {
  /**
   * 成功处理
   * @param {Object} res 返回数据
   */
  successHandler (res) {},

  /**
   * 失败处理
   * @param {Object} res 返回数据
   */
  errorHandler (res) {
    elementUI.Message.error(res.data?(res.data.msg || consts.ERROR_MSG):consts.ERROR_MSG)
  },

  /**
   * 获取 Headers
   * @return {Object}
   */
  getHeaders () {
    const {manager, token} = auth.get()

    return {
      auth: window.btoa(`${manager.username}\n${token}`)
    }
  }
}
