import storage from './helpers/storageLite'

const WORKINFO = 'workInfo'; //登录员工信息
const MERCINFO = 'mercInfo'; //商户信息
const MENULIST = 'menuList'; //菜单列表
const ALLMENULIST = 'allMenuList'; //所有菜单列表
const PERMLIST = 'permList'; //权限列表
let cacheMenu = {};

export default {
  name: 'auth',

  getWorkInfo () {
    return storage.get(WORKINFO)
  },
  getMercInfo () {
      return storage.get(MERCINFO)
  },
  getMenuList () {
      return storage.get(MENULIST)
  },
  // getAllMenuList(){
  //   return storage.get(ALLMENULIST)
  // },
  getPermList () {
      return storage.get(PERMLIST)
  },
  getChildMenu(permission) {

    if (cacheMenu[permission]) {
      return cacheMenu[permission];
    }

    let children = [];
    let menuList = this.getMenuList();
    for (let i = 0; i < menuList.length; i ++) {
      if (menuList[i].permission === permission) {
        children = menuList[i].children;
        break;
      }
    }

    cacheMenu[permission] = children;
    return children;
  },
  hasPerm(perm) {
    let permList = this.getPermList();
    let hasRight = false;
    for (let i = 0; i < permList.length; i ++) {
      if (permList[i] == perm) {
        hasRight = true;
        break;
      }
    }
    return hasRight;
  },

  /**
   * 获取 auth，返回：管理员信息和 token
   * @return {Object}
   */
  get () {
    return {
      [WORKINFO]: storage.get(WORKINFO),
      [MERCINFO]: storage.get(MERCINFO),
      [MENULIST]: storage.get(MENULIST),
      // [ALLMENULIST]: storage.get(ALLMENULIST),
      [PERMLIST]: storage.get(PERMLIST)
    }
  },

  /**
   * 登录
   * @param {string} workInfo 登录员工信息
   * @param {string} mercInfo 商户信息
   * @param {string} menuList 菜单列表
   * @param {string} permList 权限列表
   * @param {string} allMenuList 所有菜单列表
   */
  login ({workInfo, mercInfo, menuList, permList, allMenuList}) {
    storage.set(WORKINFO, workInfo)
    storage.set(MERCINFO, mercInfo)
    storage.set(MENULIST, menuList)
    storage.set(PERMLIST, permList)
    // storage.set(ALLMENULIST, allMenuList)
  },

  /**
   * 登出
   */
  logout () {
    storage.remove(WORKINFO)
    storage.remove(MERCINFO)
    storage.remove(MENULIST)
    storage.remove(PERMLIST)
    storage.remove(ALLMENULIST)
    cacheMenu = {}
  },

  /**
   * 是否已登录
   * @return {boolean}
   */
  loggedIn () {
    return !!storage.get(WORKINFO) && !!storage.get(MENULIST);
  }
}
