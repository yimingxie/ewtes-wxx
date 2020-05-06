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
    name: '',
    idcard: '',
    company: '',
    radioList: [
      { value: 1, label: "是"},
      { value: 0, label: "否"},
    ],
    selectedRadioValue: '',

    // 
    formInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 引用组件
    this.toast = this.selectComponent("#toast")

    console.log('visitorOptions', options)
    // if (options && options.searchParam) {
    //   let formInfo = JSON.parse(decodeURIComponent(options.searchParam))
    //   console.log('formInfo', formInfo.name)
    //   this.setData({
    //     'formInfo': formInfo,
    //     name: formInfo.name,

    //   })
    // }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // if (JSON.stringify(this.data.formInfo) !== '{}') {
    //   this.setData({
    //     idcard: this.data.formInfo.idcard,
    //     selectedRadioValue: this.data.formInfo.selectedRadioValue,
    //     company: this.data.formInfo.company
    //   })
    // }
    

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
    console.log('单选value', value)
    this.setData({
      selectedRadioValue: value
    })
  },

  // 姓名改变
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 身份证改变
  idcardInput(e) {
    this.setData({
      idcard: e.detail.value
    })
  },

  // 到访公司改变
  companyInput(e) {
    this.setData({
      company: e.detail.value
    })
  },



  // 提交表单
  submitForm() {
    // name idcard company selectedRadioValue
    let param = {
      name: this.data.name,
      idCard: this.data.idcard,
      corpName: this.data.company,
      contactFlag: this.data.selectedRadioValue,
      userType: 0, // 1 - 员工 0-访客
      corpId: app.globalData.corpId
    }

    // TODO 校验
    if (param.name === '') {
      this.setData({
        toastParams: {success: 'warning', context: '请输入姓名', time: ''}
      })
      this.toast.showToast()
      return
    }
    if (param.idCard === '') {
      this.setData({
        toastParams: {success: 'warning', context: '请输入身份证号', time: ''}
      })
      this.toast.showToast()
      return
    }
    if (param.corpName === '') {
      this.setData({
        toastParams: {success: 'warning', context: '请输入到访公司名称', time: ''}
      })
      this.toast.showToast()
      return
    }
    if (param.contactFlag === '') {
      this.setData({
        toastParams: { success: 'warning', context: '请选择是否有14日重点疫区接触史', time: '' }
      })
      this.toast.showToast()
      return
    }

    api.submitZJForm(param).then(res => {
      console.log('提交表单res', res.data)
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

  // 跳转到搜索公司
  goSearch() {
    // let param = {
    //   name: this.data.name,
    //   idCard: this.data.idcard,
    //   corpName: this.data.company,
    //   contactFlag: this.data.selectedRadioValue,
    //   userType: 0, // 1 - 员工 0-访客
    //   corpId: app.globalData.corpId
    // }
    // let searchParam = encodeURIComponent(JSON.stringify(param))

    wx.navigateTo({
      url: "../searchCompany/searchCompany?company=" + this.data.company,
    })
  },

  // 跳过
  goIndex() {
    wx.navigateTo({
      url: "../index/index"
    })
  }




})