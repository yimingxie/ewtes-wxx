// pages/check/check.js
import api from '../../utils/api.js'
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,    
    checkList: [],
    test: {}
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('check', options)

    // 人员列表
    // this.getUserList()
    let tempList = []
    let listObj = JSON.parse(decodeURIComponent(options.infoRes))
    tempList.push(listObj)

    this.setData({
      'checkList': tempList
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 查询用户列表
  getUserList: function () {
    api.getUserList(app.globalData.phoneNumber).then(res => {
      console.log('用户列表', res)
      if (res.data.code == 200) {
        this.setData({
          checkList: res.data.data ? res.data.data : []
        })
      }
    })
  },

  // 创建用户
  creatUser() {
    let params = {
      "avatarUrl": app.globalData.userInfo.avatarUrl,
      "city": app.globalData.userInfo.city,
      "country": app.globalData.userInfo.country,
      "gender": app.globalData.userInfo.gender,
      "language": app.globalData.userInfo.language,
      "nickName": app.globalData.userInfo.nickName,
      "openId": app.globalData.openId ? app.globalData.openId : '',
      "phone": app.globalData.phoneNumber,
      "province": app.globalData.userInfo.province,
      "unionId": app.globalData.unionId ? app.globalData.unionId : ''
    }
    console.log('创建用户参数', params)
    api.creatUser(params).then(res => {
      console.log('创建用户', res)
      if (res.data.code == 200) {
        wx.showToast({
          title: '创建成功',
          icon: 'success'
        })
        // 跳转到首页，并控制按钮消失
        setTimeout(() => {
          wx.navigateTo({
            url: "../index/index?check='confirm'",
          })
        }, 500)
        
  
      }

    })

  },

  // 删除用户（废弃）
  deleteUser: function (e) {
    const that = this
    let id = e.currentTarget.dataset['id'];
    console.log('删除用户的', id)
    let params = {
      'id': id
    }
    api.deleteUser(params).then(res => {
      console.log('删除操作', res)
      if (res.data.code == 200) {
        
        if (that.data.checkList.length == 1) {
          that.getUserList()
          // 删除了最后一条，就直接创建
          that.creatUser()
          
        } else {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          that.getUserList()
        }

      }
    })
    

  },

  // 删除用户V2
  deleteUserV2: function (e) {
    const that = this
    let id = e.currentTarget.dataset['id'];
    console.log('删除用户的', id)
    let params = {
      'id': id
    }
    api.deleteUserV2(params).then(res => {
      console.log('删除操作', res)
      if (res.data.code == 200) {
        this.setData({
          'checkList': []
        })
        // 创建用户
        that.creatUser()

      }
    })


  },

  // 确认用户
  confirmUser: function (e) {
    let id = e.currentTarget.dataset['id'];
    console.log('确认用户的id', id)
    let params = {
      "avatarUrl": app.globalData.userInfo.avatarUrl,
      "city": app.globalData.userInfo.city,
      "country": app.globalData.userInfo.country,
      "gender": app.globalData.userInfo.gender,
      "id": id,
      "language": app.globalData.userInfo.language,
      "nickName": app.globalData.userInfo.nickName,
      "openId": app.globalData.openId,
      "phone": wx.getStorageSync('phoneNumber'),
      "province": app.globalData.userInfo.province,
      "unionId": app.globalData.unionId ? app.globalData.unionId : ''
    }
    api.confirmUser(params).then(res => {
      console.log('确认用户成功', res)
      if (res.data.code == 200) {
        wx.showToast({
          title: '确认成功',
          icon: 'success'
        })
        // 跳转到首页，并控制按钮消失
        wx.navigateTo({
          url: "../index/index?check='confirm'",
        })
      

      }
    })


  },

  // 确认和否定用户信息V3
  confirmUserV3: function (e) {
    let id = e.currentTarget.dataset['id'];
    let type = e.currentTarget.dataset['type'];
    console.log('确认用户的id', id, type)
    let params = {
      "openid": wx.getStorageSync('openId'),
      "id": id,
      "opt": type
    } 
 
    api.confirmUserV3(params).then(res => {
      console.log('确认和否定操作', res)
      if (res.data.code == 200) {
        // type: true为确定，false为删除
        if (type) {
          wx.showToast({
            title: '确认成功',
            icon: 'success'
          })
        }
        // type: false为删除
        else {
          this.setData({
            'checkList': []
          })
          wx.showToast({
            title: '创建成功',
            icon: 'success'
          })
        }

        // 跳转到首页，并控制按钮消失
        setTimeout(() => {
          wx.navigateTo({
            url: "../index/index?check='confirm'",
          })
        }, 500)

      }
    })


  },

  // 返回上一页
  back() {
    wx.navigateBack({
      delta: 1
    })
  },

  
})