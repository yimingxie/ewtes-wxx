// pages/check/check.js
import api from '../../utils/api.js'
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkList: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('check', options)

    // 人员列表
    this.getUserList()

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

  // 删除用户
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
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        that.getUserList()

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

  
})