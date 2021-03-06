// pages/idcard/idcard.js
import api from '../../utils/api.js'
const app = getApp()
const util = require('../../utils/util.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraShow: false,
    imgSrc: '',
    idInfo: '',
    timer: null,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // wx.showModal({
    //   title: '都为',
    //   content: 'wer',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    
    

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
    const that = this
    clearInterval(that.data.timer)

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const that = this
    clearInterval(that.data.timer)

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


  //拍照或从相册选取进行ocr识别
  photo() {
    const that = this
    let fs = wx.getFileSystemManager()
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {

        console.log('图片选择成功', res)
        wx.showLoading({
          title: '请耐心等待',
          mask: true
        })

        // 图片转base64
        let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64')
        let base64Url = 'data:image/jpg;base64,' + base64
        console.log('bbb', base64Url)

        let ocrParams = {
          "openid": app.globalData.openId,
          "phone": wx.getStorageSync('phoneNumber'),
          "data": base64Url
        }

        api.getOcr(ocrParams).then(ocrRes => {
          console.log('身份证ocrRes', ocrRes)
          wx.hideLoading()
          if (ocrRes.data.code == 200) {

            // 判断身份证
            that.checkIdcardV3(ocrRes.data)

          } else {
            wx.showToast({
              title: ocrRes.data.message,
              icon: 'none'
            })

          }
        }).catch(ocrErr => {
          console.log('错误', ocrErr)

        })

        return


        // 云调用（废弃）
        // wx.cloud.callFunction({
        //   name: 'orc', // 迷之名字
        //   data: {
        //     imgType: res.tempFilePaths[0].split('.').pop(),
        //     imgArrayBuffer: fs.readFileSync(res.tempFilePaths[0])
        //   },
        //   success(ocrResult) {
        //     console.log('调用成功', ocrResult)
        //     // result:
        //     // addr: "广东省深圳市福田区**"
        //     // errCode: 0
        //     // errMsg: "openapi.ocr.idcard:ok"
        //     // gender: "男"
        //     // id: "44030619**"
        //     // name: "谢**"
        //     // nationality: "汉"
        //     // type: "Front"
        //     wx.hideLoading()
        //     if (ocrResult.result.errCode === 0) {
        //       that.setData({
        //         idInfo: ocrResult.result
        //       })

        //       // 判断身份证
        //       that.checkIdcard()


        //     } else {
        //       wx.showToast({
        //         title: '识别失败，请重新拍摄',
        //         icon: 'none'
        //       })
        //     }

        //   },
        //   fail(e) {
        //     console.log('调用失败', e)
        //     wx.hideLoading()
        //     wx.showToast({
        //       title: '识别失败，请重新拍摄',
        //       icon: 'none'
        //     })
        //   }
        // })

      }
    })


  },



  // 废弃
  // 请求idcard列表，多条则跳转到确认页，否则直接跳到测温记录页（因为后台已处理成录入了）
  checkIdcard: function () {
    let params = {
      "addr": this.data.idInfo.addr,
      "gender": this.data.idInfo.gender,
      "id": this.data.idInfo.id,
      "name": this.data.idInfo.name,
      "nationality": this.data.idInfo.nationality,
      "phone": wx.getStorageSync('phoneNumber'),
      "unionid": app.globalData.unionId ? app.globalData.unionId : ''
    }
    api.getIdcardList(params).then(res => {
      console.log('请求idcard列表', res)
      let checkParams = encodeURIComponent(JSON.stringify(params))
      if (res.data.data) {
        wx.navigateTo({
          url: '../idcardCheck/idcardCheck?idInfoParams=' + checkParams
        });
      }
      else {
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        })
        this.data.timer = setTimeout(() => {
          wx.navigateTo({
            url: '../detection/detection?phone=' + app.globalData.phoneNumber
          });
          // 刷新首页
          const pages = getCurrentPages()
          const perpage = pages[pages.length - 2]
          perpage.indexOnload()  
        }, 500)
        

      }

    })

  },

  // 判断身份证跳转
  checkIdcardV3(data) {
    let dataInfo = data
    console.log('判断身份证', dataInfo)
    if (dataInfo.data.type == 1) {
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      })
      this.data.timer = setTimeout(() => {
        wx.navigateTo({
          url: '../detection/detection?phone=' + app.globalData.phoneNumber
        });
        // 刷新首页
        // const pages = getCurrentPages()
        // const perpage = pages[pages.length - 2]
        // perpage.indexOnload()
      }, 500)
    }
    // 跳转到身份证确认页
    else {
      let checkParams = encodeURIComponent(JSON.stringify(dataInfo.data.info))
      let ocrParams = encodeURIComponent(JSON.stringify(dataInfo.data.ocr))
      wx.navigateTo({
        url: '../idcardCheck/idcardCheck?idInfoParams=' + checkParams + '&ocrParams=' + ocrParams
      });
    }

  },


  error(e) {
    console.log(e.detail)
  },

  // 跳转到用户服务协议
  goUserAgree() {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },

  // 跳转到隐私协议
  goSecretAgree() {
    wx.navigateTo({
      url: '../agreementSecret/agreementSecret',
    })
  }, 


})