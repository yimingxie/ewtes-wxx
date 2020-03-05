// Promise封装wx.request
const app = getApp()

// Token?
const default_header = {
  'content-type': 'application/json' // 默认值
}
 
//封装GET请求
function get(url, data, header) {
  return new Promise((resolved, rejected) => {
    wx.request({
      'url': url,
      'data': data,
      'method': 'GET',
      'header': header ? Object.assign(default_header, header) : default_header,
      'success': (res) => resolved(res),
      'fail': (err) => rejected(err)
    })
  })
}

const post = (url, data, header) => {
  return new Promise((resolved, rejected) => {
    wx.request({
      'url': url,
      'data': data,
      'method': 'POST',
      'header': header ? header : default_header,
      'success': (res) => resolved(res),
      'fail': (err) => rejected(err)
    })
  })
}

const put = (url, data, header) => {
  return new Promise((resolved, rejected) => {
    wx.request({
      'url': url,
      'data': data,
      'method': 'PUT',
      'header': header ? header : default_header,
      'success': (res) => resolved(res),
      'fail': (err) => rejected(err)
    })
  })
}

const del = (url, data, header) => {
  return new Promise((resolved, rejected) => {
    wx.request({
      'url': url,
      'data': data,
      'method': 'DELETE',
      'header': header ? header : default_header,
      'success': (res) => resolved(res),
      'fail': (err) => rejected(err)
    })
  })
}


export default {
  get,
  post,
  put,
  del
}