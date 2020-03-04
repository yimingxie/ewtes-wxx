//index.js
//获取应用实例
import api from '../../utils/api.js'
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {}, // 微信查出的详情
    staffInfo: '', // 员工信息库

    // --按钮控制--
    totalBtnShow: true,
    healthBtnShow: true,
  },

  // 跳转
  goTest: function () {
    wx.navigateTo({
      url: '../test/test'
    })
  },

  goDetection: function () {
    wx.navigateTo({
      url: '../detection/detection'
    })
  },

  goIdcard: function () {
    wx.navigateTo({
      url: '../idcard/idcard'
    })
  },

  // 初始化
  onLoad: function () {
    console.log('首页onload')

    /**
     * 1. 存在unionid，请求员工信息；不存在unionid，调用wx.login，进入第二步
     * 2. 重新登录，更新登录态，获取(unionid, session_key check等)，继续请求员工信息
     * 
     */

    if (app.globalData.unionId) {
      
      // this.getStaff()



    } 

    else {
      // 登录
      wx.login({
        success: logRes => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log('登录logRes', logRes)
          app.globalData.code = logRes.code

          // wx.getUserInfo({
          //   success: res => {
          //     console.log('app.js用户信息', res)
          //     // 可以将 res 发送给后台解码出 unionId
          //     // 获取unionId后，查询人员信息表，更新userInfo，健康码，测温记录等
          //     app.globalData.userInfo = res.userInfo
          //     this.setData({
          //       userInfo: res.userInfo
          //     })
          //     let param = {
          //       'code': app.globalData.code,
          //       'encryptedData': res.encryptedData,
          //       'iv': res.iv,
          //     }
          //     api.getUnionId(param).then(unionRes => {
          //       console.log('传code', unionRes)
          //       // TODO 获取到unionId，存全局，并调用请求员工 this.getStaff()

          //     })

             
          //   }
          // })


        }
      })
    }


  },

  // TODO 根据unionId查员工详情
  getStaff() {

  },
  

  // 授权用户信息弹窗
  getUserInfo: function(e) {
    console.log('用户信息', e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        healthBtnShow: false
      })

      // 请求后端接口获取unionid
      // 获得unionid后，去查询人员信息库。有信息则直接首页完整形态，没有则开始走手机授权流程
      let param = {
        'code': app.globalData.code,
        'encryptedData': e.detail.encryptedData,
        'iv': e.detail.iv,
      }
      api.getUnionId(param).then(unionRes => {
        console.log('传code', unionRes)
        // TODO 获取到unionId，存全局，并调用请求员工 this.getStaff()

      })

    } 
    
    else {
      console.log('拒绝', e)
      app.globalData.userInfo = {}
      this.setData({
        userInfo: {},
      })
    }
    
  },

  // 手机授权弹窗
  getPhoneNumber: function(e) {
    console.log('手机', e)

    // 请求后端接口返回手机号，成功则查询人员信息，有多名跳转到列表页，没有则直接跳到首页
  },


})
