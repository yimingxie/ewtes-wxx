//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

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
    // 判断是否有全局登录态
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  

  // 授权用户信息弹窗
  getUserInfo: function(e) {
    console.log('用户信息', e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        healthBtnShow: false
      })

      // 请求后端接口获取unionid
      // 获得unionid后，去查询人员信息库。有信息则直接首页完整形态，没有则开始走手机授权流程

    } else {
      console.log('拒绝？', e)
      app.globalData.userInfo = {}
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    }
    
  },

  // 手机授权弹窗
  getPhoneNumber: function(e) {
    console.log('手机', e)

    // 请求后端接口返回手机号，成功则查询人员信息，有多名跳转到列表页，没有则直接跳到首页
  },


})
