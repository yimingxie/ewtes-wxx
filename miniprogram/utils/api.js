import http from './http.js'

// const url1 = 'http://192.168.100.8:8007/ewtes/wx'
// const url1 = 'https://iot.gidomino.com/ewtes/wx'

// 正式版
// const url1 = 'https://www.ewtes.com/ewtes/wx'

// 体验版
const url1 = 'https://pt.ewtes.com/ewtes/wx'

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

  // 查询用户详情v2
  getUserDetailV2(params) {
    return http.post(`${url1}/v2/user/info`, params)
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

  // 删除用户v2
  deleteUserV2(params) {
    return http.del(`${url1}/v2/user/info`, params)
  },

  // 确认用户
  confirmUser(params) {
    return http.put(`${url1}/v2/user/confirm`, params)
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
    return http.post(`${url1}/v3/record`, params)
  },

  // 获取畅通码(返回base64字符串)
  getQr(params) {
    return http.post(`${url1}/v3/health`, params)
  },

  // 身份证识别ocr
  getOcr(params) {
    return http.post(`${url1}/v3/ocr`, params)
  },

  // 确认和否定身份证信息
  confirmIdcardV3(params) {
    return http.put(`${url1}/v3/card`, params)
  },

  // 获取授权
  getAccStatus(params) {
    return http.post(`${url1}/v3/openid`, params)
  },

  // 确认用户列表
  getUserListV3(params) {
    return http.post(`${url1}/v3/phone`, params)
  },

  // 确认用户V3
  confirmUserV3(params) {
    return http.put(`${url1}/v3/phone`, params)
  },






}
