// pages/searchCompany/searchCompany.js
import api from '../../utils/api.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyValue: '',
    resultList: [],

    // 接收传过来的表单信息
    formInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('searchOptions', options)
    // let formInfo = JSON.parse(decodeURIComponent(options.searchParam))
    // console.log('form', formInfo)
    // this.setData({
    //   'formInfo': formInfo
    // })
    let value = options && options.company ? options.company : ''
    this.setData({
      companyValue: value
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

  // 搜索公司
  searchCompany(e) {
    this.setData({
      companyValue: e.detail.value,
      // 'formInfo.corpName': e.detail.value
    })
    let param = {
      keyword: e.detail.value
    }
    api.getZJCompany(param).then(res => {
      console.log('公司列表', res.data)
      this.setData({
        resultList: res.data.data ? res.data.data : []
      })
    })
    
  },

  // 确定
  goForm() {
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 2]
    perpage.setData({
      'company': this.data.companyValue
    })
    wx.navigateBack({//返回
      delta: 1
    })

    // let searchParam = encodeURIComponent(JSON.stringify(this.data.formInfo))
    // wx.navigateTo({
    //   url: '../formVisitor/formVisitor?searchParam=' + searchParam,
    // })
  },

  // 点选搜索结果
  goSearchResult(e) {
    let name = e.currentTarget.dataset['name'];
    this.setData({
      companyValue: name,
      // 'formInfo.corpName': e.detail.value
    })
    // wx.navigateTo({
    //   url: '../formVisitor/formVisitor?company=' + this.data.companyValue,
    // })

    const pages = getCurrentPages()
    const perpage = pages[pages.length - 2]
    perpage.setData({
      'company': this.data.companyValue
    })
    wx.navigateBack({//返回
      delta: 1
    })
  },
})