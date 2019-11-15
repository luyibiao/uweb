import types from './types'
import Model from '../models/common'

export default {
  /**
   * 切换语言
   */
  // patchLanguage ({commit}, {data}) {
  //   commit(types.PATCH_LANGUAGE, {
  //     language: data.language
  //   })
  // },

  /**
   * 获取列表
   */
  getList ({commit}, {uri, params, data, forceResolve}) {
    return new Model().addPath(uri).POST({params, data, forceResolve});
  },
  /**
   * 获取模板列表
   */
  getTemplateList ({commit}, {uri, params, data, forceResolve}){
    return new Model().addPath(uri).POST({params, data, forceResolve});
  },
  /**
   * 获取详情
   */
  getDetail ({commit}, {uri, params, data, forceResolve}) {
    return new Model().addPath(uri).POST({params, data, forceResolve});
  },

  /**
   * 新增
   */
  add ({commit}, {uri, params, data, forceResolve}){
    return new Model().addPath(uri).POST({params, data, forceResolve});
  },

  /**
   * 更新
   */
  update ({commit}, {uri, params, data, forceResolve}){
    return new Model().addPath(uri).POST({params, data, forceResolve});
  },

  /**
   * 删除
   */
  del ({commit}, {uri, params, data, forceResolve}){
    return new Model().addPath(uri).POST({params, data, forceResolve});
  },

  /**
   * 批处理
   */
  batch ({commit}, {uri, params, data, forceResolve}){
    return new Model().addPath(uri).POST({params, data, forceResolve});
  },
  
  /**
   * get请求
   */
  get({commit}, {uri, params, forceResolve}) {
	return new Model().addPath(uri).GET({params, forceResolve});
  },
  
  /**
   * post请求
   */
  post({commit}, {headers, uri, params, data, forceResolve}) {
	return new Model(headers).addPath(uri).POST({params, data, forceResolve});
  },
  
  /**
   * put请求
   */
  put({commit}, {uri, params, data, forceResolve}) {
	return new Model().addPath(uri).PUT({params, data, forceResolve});
  },
  
  /**
   * patch请求
   */
  patch({commit}, {uri, params, data, forceResolve}) {
	return new Model().addPath(uri).PATCH({params, data, forceResolve});
  },
  
  /**
   * delete请求
   */
  delete ({commit}, {uri, params, data, forceResolve}){
    return new Model().addPath(uri).DELETE({params, data, forceResolve});
  }
}
