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
    currentPage: 1,
    arr: [],
    triggered: false,


  },

  onReady: function () {
    const arr = []
    for (let i = 0; i < 10; i++) arr.push(i)
    this.setData({
      arr
    })

    setTimeout(() => {
      this.setData({
        triggered: true,
      })
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // TODO分页 直接赋值可能有问题？
    // this.data.detParams.search = wx.getStorageSync('phoneNumber')
    // this.setData({
    //   "detParams.search": wx.getStorageSync('phoneNumber')
    // })
    // this.getDetList()


    
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
  // onReachBottom() {
  //   console.log('触底')
  //   // 通过改变limit加载
  //   let nextPage = this.data.currentPage + 1
  //   this.setData({
  //     "currentPage": nextPage
  //   })
  //   this.getDetList()
  // },

  // 下拉刷新
  // onPullDownRefresh: function () {
  //   this.setData({
  //     'detParams.limit': 10,
  //     'detParams.offset': 1,
  //     'currentPage': 1
  //   })
  //   setTimeout(() => {
  //     api.getTemperList(this.data.detParams).then(res => {
  //       console.log('下拉刷新测温列表', res)
  //       wx.stopPullDownRefresh()
  //       wx.showToast({
  //         title: '加载成功',
  //         icon: 'success'
  //       })
  //       this.setData({
  //         detList: res.data.records
  //       })
  //     })
  //   }, 500)
    
  // },

  // 返回上一页
  back() {
    wx.navigateBack({
      delta: 1
    })
  },

  onPulling(e) {
    console.log('onPulling:', e)
  },

  onRefresh() {
    console.log('onRefresh刷新开始')
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      console.log('onRefresh刷新结束')

      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },

  goDet() {
    wx.navigateTo({
      url: '../detection/detection',
    })
  },
})