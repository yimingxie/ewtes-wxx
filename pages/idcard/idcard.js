// pages/idcard/idcard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraShow: false,
    imgSrc: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  // 打开摄像头
  openTakePhoto() {
    this.setData({
      cameraShow: true
    })
  },

  // 拍照
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('相机', res)
        this.setData({
          imgSrc: res.tempImagePath,
          cameraShow: false
        })

        // 拍张成功，请求OCR接口上传


      }
    })
  },

  error(e) {
    console.log(e.detail)
  },
})