//index.js
//获取应用实例
import api from '../../utils/api.js'
const app = getApp()
const util = require('../../utils/util.js')

import { base64src } from '../../utils/base64src.js'

Page({
  data: {
    userInfo: {}, // 微信查出的详情
    staffInfo: '', // 员工信息库
    healthCode: '',
    statusBarHeight: app.globalData.statusBarHeight,
    screenHeight: wx.getSystemInfoSync()['screenHeight'],
    programShow: false,

    // --按钮控制--
    totalBtnShow: true,
    healthBtnShow: true,


    // --测温记录--
    goOcr: true,
    detList: [],
    temper: '',
    temperTime: '',

    // --验证码--
    second: 60,
    verfBtnDisabled: false,
    verfBtnText: '发送验证码',

  },


  

  // 跳转到ocr
  goIdcard: function() {
    wx.navigateTo({
      url: '../idcard/idcard'
    })
  },

  // 跳转到测温记录
  goDet: function () {
    wx.navigateTo({
      url: '../detection/detection'
    })
  },

  // 跳转到测温记录（测试）
  goDetTest: function () {
    wx.navigateTo({
      url: '../detectionTest/detection'
    })
  },

  // 测试发送验证码
  // sendVerf: function () {
  //   const that = this
  //   console.log('发送验证码', this.data.second)
  //   var timer = null;
  //   timer = setInterval(() => {
  //     let second = this.data.second - 1
  //     if (second > 0) {
  //       this.setData({
  //         verfBtnDisabled: true,
  //         second: second,
  //         verfBtnText: second + '秒后发送验证码'
  //       })
  //     } else {
  //       clearInterval(timer);
  //       this.setData({
  //         verfBtnDisabled: false,
  //         second: 60,
  //         verfBtnText: '发送验证码'
  //       })
  //     }
  //   }, 1000);
  // },

  // 初始化
  onLoad: function(options) {

    // 首次加载，不允许show执行，置为false
    this.data.programShow = false

    this.indexOnload(options)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow展示了')
    if (this.data.programShow) {
      console.log('onshow执行了')
      this.indexOnload()
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onhide隐藏了，show状态要置为true')
    this.data.programShow = true
  },

  // 封装加载首页
  indexOnload(options) {
    const that = this
    console.log('首页onload', app.globalData)

    // 云函数
    this.cloudUserInfo()

    // 监听来自check页面的按钮参数
    if (options && options.check && options.check == 'confirm') {
      this.setData({
        totalBtnShow: false
      })
    }



    // 通过手机号缓存判断
    if (wx.getStorageSync('phoneNumber')) {
      console.log('有缓存', wx.getStorageSync('phoneNumber'))

      wx.getSetting({
        success: authRes => {
          console.log('index授权列表', authRes)
          if (authRes.authSetting['scope.userInfo']) {
            // 属于第二次进入且已授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log('授权判断的用户信息', res)
                // 可以将 res 发送给后台解码出 unionId
                // 获取unionId后，查询人员信息表，更新userInfo，畅通码，测温记录等
                app.globalData.userInfo = res.userInfo
                that.setData({
                  userInfo: res.userInfo
                })

                // 请求授权接口判断是否有身份证
                let accParams = {
                  "openid": wx.getStorageSync('openId')
                }
                api.getAccStatus(accParams).then(accRes => {
                  console.log('后端授权接口', accRes)
                  
                  
                  // ask | 0: 需要请求授权, 1: 手机号码已授权, 2: 身份证号码已授权
                  if (accRes.data.data.ask === 2) {
                    // 获取畅通码
                    this.getHealthCode(accRes.data.data.id)

                    this.setData({ 
                      totalBtnShow: false,
                      goOcr: false,

                    })
                    // 获取测温记录
                    this.getDetList()
                  } 

                  // ask已各种授权，跳转到确认页面
                  else {
                    wx.showLoading({
                      title: '加载中',
                    })
                    
                    // 请求用户确认接口，判断是否需要确认
                    let params = {
                      "openid": wx.getStorageSync('openId'),
                      "phone": wx.getStorageSync('phoneNumber')
                    }
                    api.getUserListV3(params).then(userRes => {
                      wx.hideLoading()
                      console.log('确认用户列表', userRes)
                      // type | 1: 不需确认直接创建并刷新加载首页, 2: 需要跳到确认页面
                      if (userRes.data.code == 200) {
                        if (userRes.data.data.type == 1) {
                          // that.indexOnload()
                          // 获取畅通码
                          this.getHealthCode(userRes.data.data.id)

                          this.setData({ 
                            totalBtnShow: false,
                            healthBtnShow: false,
                            goOcr: true,
                          })
                        }
                        else {
                          this.setData({
                            totalBtnShow: true,
                            healthBtnShow: false,
                            goOcr: true
                          })
                          wx.navigateTo({
                            url: '../check/check?infoRes=' + encodeURIComponent(JSON.stringify(userRes.data.data.info))
                          });
                        }

                      }

                    })


                  }
                })

                // TODO放哪？
                // this.getUserDetailV2()

                setTimeout(() => {
                  wx.hideLoading()
                }, 300)

              }
            })
          }
        }
      })


    }
    else {
      // 无手机号，则重走验证之路
      console.log('无缓存')
      // 登录
      wx.login({
        success: logRes => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log('登录logRes', logRes)
          app.globalData.code = logRes.code
          setTimeout(() => {
            wx.hideLoading()
          }, 300)

        }
      })
    }



  },



  // 通过云函数获取appid,openid,unionid
  cloudUserInfo() {
    var that = this
    wx.cloud.callFunction({
      name: 'userinfo',
      complete: res => {
        console.log('云函数获取userinfo: ', res)
        //设置openid
        app.globalData.openId = res.result.openid ? res.result.openid : ''
        app.globalData.unionId = res.result.unionid ? res.result.unionid : ''
        wx.setStorageSync('openId', res.result.openid)
      }
    })
  },

  // 授权用户信息弹窗
  getUserInfo: function(e) {
    console.log('用户信息', e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.cloudID = e.detail.cloudID
      this.setData({
        userInfo: e.detail.userInfo,
        healthBtnShow: false
      })
      this.cloudUserInfo()


    } else {
      console.log('拒绝', e)
      app.globalData.userInfo = {}
      this.setData({
        userInfo: {},
      })
    }

  },

  // 手机授权弹窗
  getPhoneNumber: function(e) {
    const that = this
    console.log('手机', e)
    if (e.detail.errMsg && e.detail.errMsg == '"getPhoneNumber:fail user deny"') return

    wx.showLoading({
      title: '加载中',
    })

    // 请求后端接口返回手机号，成功则查询人员信息，有多名跳转到列表页，没有则直接跳到首页
    wx.cloud.callFunction({
      name: 'getPhone',
      data: {
        weRunData: wx.cloud.CloudID(e.detail.cloudID)
      }
    }).then(res => {
      console.log('手机号', res)
      app.globalData.phoneNumber = res.result
      // this.setData({
      //   totalBtnShow: false
      // })
      wx.setStorageSync('phoneNumber', res.result)

      // 请求用户确认接口，判断是否需要确认
      let params = {
        "openid": wx.getStorageSync('openId'),
        "phone": app.globalData.phoneNumber
      }
      api.getUserListV3(params).then(userRes => {
        wx.hideLoading()

        console.log('确认用户列表', userRes)
        // type | 1: 不需确认直接创建并刷新加载首页, 2: 需要跳到确认页面
        if (userRes.data.code == 200) {
          if (userRes.data.data.type == 1) {
            that.indexOnload()
          }
          else {
            wx.navigateTo({
              url: '../check/check?infoRes=' + encodeURIComponent(JSON.stringify(userRes.data.data.info))
            });
          }

        }
        else {
          wx.showToast({
            title: userRes.data.message,
            icon: 'none'
          })
        }

      })


      // this.setData({
      //   userInfo: {},
      //   totalBtnShow: true,
      //   healthBtnShow: true,
      // })


    }).catch(err => {
      console.error('获取失败', err);
      wx.hideLoading()
    })
  },


  // 查询用户详情
  getUserDetailV2() {
    let params = {
      "avatarUrl": this.data.userInfo.avatarUrl,
      "city": this.data.userInfo.city,
      "country": this.data.userInfo.country,
      "gender": this.data.userInfo.gender,
      "language": this.data.userInfo.language,
      "nickName": this.data.userInfo.nickName,
      "openId": app.globalData.openId ? app.globalData.openId : '',
      "phone": wx.getStorageSync('phoneNumber'),
      "province": this.data.userInfo.province,
      "unionId": app.globalData.unionId ? app.globalData.unionId : ''
    }

    api.getUserDetailV2(params).then(res => {
      console.log('用户详情', res)
      if (res.data.data && res.data.data.unionid) {
        
        // 获取畅通码
        this.getHealthCode(res.data.data.id)

        // 获取测温记录
        this.getDetList()

        this.setData({
          totalBtnShow: false
        })


        // 根据来源则需要跳转到OCR才能看测温记录，1是小程序，3是网站导入
        let idCard = res.data.data.idCard
        if (idCard && res.data.data.source == 1) {
          this.setData({ goOcr: false })
        } else {
          this.setData({ goOcr: true })
        }
      } else {
        this.setData({
          userInfo: {},
          totalBtnShow: true,
          healthBtnShow: true,
        })

      }

    })
  },

  // 查询用户列表
  getUserList() {
    api.getUserList(wx.getStorageSync('phoneNumber')).then(res => {
      console.log('首页查询用户列表', res)
      if (res.data.code == 200) {
        // 用户记录多条，则跳转到check
        if (res.data.data) {
          wx.navigateTo({
            url: '../check/check?phone=' + wx.getStorageSync('phoneNumber')
          });
        } 
        else {
          
          this.creatUser()

        }

      }

      
    })
  },

  // 创建用户
  creatUser() {
    let params = {
      "avatarUrl": this.data.userInfo.avatarUrl,
      "city": this.data.userInfo.city,
      "country": this.data.userInfo.country,
      "gender": this.data.userInfo.gender,
      "language": this.data.userInfo.language,
      "nickName": this.data.userInfo.nickName,
      "openId": app.globalData.openId ? app.globalData.openId : '',
      "phone": wx.getStorageSync('phoneNumber'),
      "province": this.data.userInfo.province,
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
        this.setData({
          totalBtnShow: false
        })

        // 创建成功后查询用户信息
        this.getUserDetail()

      }

    })

  },



  // 跳转到测温记录
  goDetection: function () {
    // 没有身份证就跳到ocr
    if (this.data.goOcr) {
      wx.navigateTo({
        url: '../idcard/idcard'
      })
    } else {
      wx.navigateTo({
        url: '../detection/detection?phone=' + wx.getStorageSync('phoneNumber')
      })
      // 刷新首页
      const pages = getCurrentPages()
      const perpage = pages[pages.length - 1]
      perpage.indexOnload()  
      
    }
  },

  // 获取测温列表
  getDetList() {
    let detParams = {
      "limit": 10,
      "offset": 1,
      "search": wx.getStorageSync('phoneNumber')
    }
 
    api.getTemperList(detParams).then(res => {
      console.log('测温列表', res)
      if (res.data.code == 200) {
        if (res.data.data.records.length > 0) {
          this.setData({
            detList: res.data.data.records,
            temper: res.data.data.records[0].value,
            temperTime: res.data.data.records[0].time,
          })
        } else {
          this.setData({
            detList: []
          })
        }
      }

    })
  },

  /* pdf base64 转图片 */
  formatImg(bodyData) {
    if (!bodyData) return
    let that = this
    // let flight = this.data.flightDetail
    let fsm = wx.getFileSystemManager();//文件管理器
    let FILE_BASE_NAME = 'delay_certificate_'; //自定义文件名
    let buffer = wx.base64ToArrayBuffer(bodyData);//转为Buffer数据
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`; //文件路径
    fsm.writeFile({ //把图片从本来拿到
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        console.log('图片转化success', filePath)
        that.setData({
          healthCode: filePath,
        })
      },
      fail() {
        console.log('图片转化fail')
        return (new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  },



  // 获取畅通码
  getHealthCode(id) {
    if (!id) return
    const that = this
    let params = {
      'id': id
    }
    api.getQr(params).then(res => {
      if (res.data.code == 200) {
        console.log('畅通码res', res)
        // base64转src图片
        base64src(res.data.data, res => {
          this.setData({
            healthCode: res
          })
        });

      }
    })
  },

  // 更新畅通码
  refreshCode() {
    wx.showLoading({
      title: '更新中',
    })
    this.indexOnload()
  }





})