// pages/idcardCheck/idcardCheck.js
import api from '../../utils/api.js'
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkIdcardObj: {}, // 只会存在一个身份证
    idInfoParams: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('check', options)
    this.setData({
      'idInfoParams': JSON.parse(decodeURIComponent(options.idInfoParams))
    })
    

    // 身份证列表
    this.getIdcardList()

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

  // 查询身份证列表
  getIdcardList: function () {
    let params = this.data.idInfoParams
    api.getIdcardList(params).then(res => {
      console.log('身份证列表', res)
      if (res.data.code == 200) {
        this.setData({
          checkIdcardObj: res.data.data ? res.data.data : []
        })
      }
    })
  },

  // 删除身份证
  deleteIdcard: function (e) {
    const that = this
    console.log('删除用户的', this.data.checkIdcardObj.id)
    let params = {
      'id': this.data.checkIdcardObj.id
    }
    api.deleteIdcard(params).then(res => {
      console.log('删除操作', res)
      if (res.data.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        that.getIdcardList()
      }
    })
  },

  // 确认身份证
  confirmIdcard: function (e) {
    // let infoItem = e.currentTarget.dataset['item'];
    console.log('确认用户的', this.data.checkIdcardObj)
    console.log('传的身份证', this.data.idInfoParams)

    api.confirmIdcard(this.data.idInfoParams).then(res => {
      console.log('确认用户成功', res)
      if (res.data.code == 200) {
        wx.showToast({
          title: '确认成功',
          icon: 'success'
        })
        wx.navigateTo({
          url: '../detection/detection?phone=' + app.globalData.phoneNumber
        });
      }
    })

  },


})