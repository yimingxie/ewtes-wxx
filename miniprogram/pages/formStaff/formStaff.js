// pages/formVisitor/formVisitor.js
import api from '../../utils/api.js'
const app = getApp()
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    toastParams: {
      success: 'success', context: '弹窗', time: ''
    },

    // --表单--
    radioList: [
      { value: 1, label: "是" },
      { value: 0, label: "否" },
    ],
    selectedRadioValue: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 引用组件
    this.toast = this.selectComponent("#toast")


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


  // 单选改变
  selectRadio(e) {
    let value = e.target.dataset.value
    console.log('单选value', e, value)
    this.setData({
      selectedRadioValue: value
    })
  },



  // 提交表单
  submitForm() {
    // name idcard company selectedRadioValue
    let param = {
      name: '',
      idCard: '',
      corpName: '',
      contactFlag: this.data.selectedRadioValue,
      userType: 1, // 1 - 员工 0-访客
      corpId: app.globalData.corpId
    }

    if (param.contactFlag === '') {
      this.setData({
        toastParams: { success: 'warning', context: '请选择是否有14日重点疫区接触史', time: '' }
      })
      this.toast.showToast()
      return
    }

    api.submitZJForm(param).then(res => {
      if (res.data.code == 200) {
        app.globalData.fid = res.data.data
        wx.navigateTo({
          url: "../index/index"
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })

  },


  // 跳过
  goIndex() {
    wx.navigateTo({
      url: "../index/index"
    })
  }


})