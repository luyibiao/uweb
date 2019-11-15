const localStorage = window.localStorage
const session = window.sessionStorage
export default {
  name: 'storage',

  /**
   * 设置 localStorage
   * @param {string} key 键
   * @param {Object} value 值
   */
  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * 获取 localStorage
   * @param {string} key 键
   * @return {Object}
   */
  get (key) {
    let data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * 移除 localStorage
   * @param {string} key 键
   */
  remove (key) {
    localStorage.removeItem(key)
  },

  sessionSet(key,value) {
    session.setItem(key, JSON.stringify(value))
  },
  /**
   * 获取 sessionStorage
   * @param {string} key 键
   * @return {Object}
   */
  sessionGet(key) {
    return JSON.parse(session.getItem(key)) || null
  },
  /**
   * 移除 sessionStorage
   * @param {string} key 键
   */
  sessionRemove(key) {
    session.removeItem(key)
  }
}
