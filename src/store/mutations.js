import types from './types'
// import i18n from '@/i18n'

export default {
  //   [types.PATCH_LANGUAGE] (state, payload) {
  //     i18n.switchTo(payload.language)
  //     state.language = payload.language
  //   }
  // 设置登录员工信息
  'SETWORKINFO'(state, info) {
    state.workInfo = info;
  }
}
