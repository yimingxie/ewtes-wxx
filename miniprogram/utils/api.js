import http from './http.js'

export default {
  // 例子
  getDetList(params) {
    return http.post(`http://www.epidemic.com/list`, params)
  },

  getDetList2(id) {
    return http.get(`http://www.epidemic.com/list?id=${id}`)
  },

  // 获取unionId
  getUnionId(params) {
    return http.post(`http://192.168.100.8:8007/ewtes/wx/decrypt/user`, params)
  },

}
