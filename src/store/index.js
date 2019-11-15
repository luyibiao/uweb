import Vue from 'vue/dist/vue.esm.js'
import Vuex from 'vuex/dist/vuex.esm.js'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录员工信息
    workInfo: auth.getWorkInfo() || {}
    // language: 'zh-CN'
  },
  getters,
  actions,
  mutations,
  modules: {
  }
})
