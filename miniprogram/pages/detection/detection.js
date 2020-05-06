import api from '../../utils/api.js'
const app = getApp()


Page({

  /**
 * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,    
    detList: [],
    detParams: {
      "limit": 10,
      "offset": 1,
      "search": ""
    },
    currentPage: 1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // TODO分页 直接赋值可能有问题？
    // this.data.detParams.search = wx.getStorageSync('phoneNumber')

    this.setData({
      "detParams.search": wx.getStorageSync('phoneNumber')
    })
    this.getDetList()

    
    
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

  // 获取测温列表
  getDetList() {
    wx.showLoading({
      title: '加载中',
    })
    let limit = this.data.detParams.limit * this.data.currentPage
    this.setData({
      'detParams.limit': limit
    })
    api.getTemperList(this.data.detParams).then(res => {
      console.log('测温列表', res)
      if (res.data.data) {
        this.setData({
          detList: res.data.data.records
        })
        setTimeout(() => {
          wx.hideLoading();
        }, 500)
      }
      

    })
  },

  // 上拉加载
  onReachBottom() {
    console.log('触底')
    // 通过改变limit加载
    let nextPage = this.data.currentPage + 1
    this.setData({
      "currentPage": nextPage
    })
    this.getDetList()
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      'detParams.limit': 10,
      'detParams.offset': 1,
      'currentPage': 1
    })
    setTimeout(() => {
      api.getTemperList(this.data.detParams).then(res => {
        console.log('下拉刷新测温列表', res)
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '加载成功',
          icon: 'success'
        })
        this.setData({
          detList: res.data.records
        })
      })
    }, 500)
    
  },

  // 返回上一页（首页）
  back() {
    // wx.navigateTo({
    //   url: '../index/index'
    // })

    let pages = getCurrentPages()
    console.log('pages', pages.reverse())
    let i = pages.findIndex(item => {
      return item.route == 'pages/index/index'
    })
    wx.navigateBack({
      delta: i
    })

  },
})