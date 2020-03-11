import http from './http.js'

// const url1 = 'http://192.168.100.8:8007/ewtes/wx'
const url1 = 'https://iot.gidomino.com/ewtes/wx'

export default {
  // 获取unionId
  getUnionId(params) {
    return http.post(`http://192.168.100.8:8007/ewtes/wx/decrypt/user`, params)
  },

  // 查询用户
  getUser(phone) {
    return http.get(`${url1}/user/info/detail?phone=${phone}`)
  },

  // 查询用户列表
  getUserList(phone) {
    return http.get(`${url1}/user/info/list?phone=${phone}`)
  },

  // 创建用户
  creatUser(params) {
    return http.post(`${url1}/user/info`, params)
  },

  // 更新用户
  putUser(params) {
    return http.put(`${url1}/user/info`, params)
  },

  // 删除用户
  deleteUser(params) {
    return http.del(`${url1}/user/info`, params)
  },

  // 确认用户
  confirmUser(params) {
    return http.put(`${url1}/user/confirm`, params)
  },

  // 查询身份证列表
  getIdcardList(params) {
    return http.post(`${url1}/user/card/info`, params)
  },

  // 确认身份证信息
  confirmIdcard(params) {
    return http.put(`${url1}/user/confirm/card`, params)
  },

  // 删除身份证信息
  deleteIdcard(params) {
    return http.del(`${url1}/user/card/info`, params)
  },

  // 查询测温记录列表
  getTemperList(params) {
    return http.post(`${url1}/record/list`, params)
  },

  // 获取健康码(返回base64字符串)
  getQr(params) {
    return http.post(`${url1}/qr/coe`, params)
  },


}
