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
    returnFlag: false, // 控制页面不更新
    personalFormShow: false,


    // --定时器--
    timer: null,

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
    console.log('-=-=-=-=-=-scene首页options: ', options)

    

    // 首次加载，不允许show执行，置为false
    this.data.programShow = false

    if (options && options.scene) {
      // 首次加载，有参数的情况下要展示专属表单
      this.data.personalFormShow = true
      // 商户专属二维码
      app.globalData.corpId = options.scene

      // todo 临时处理，要删除
      // app.globalData.corpId = (options.scene).substring(9)
    }


    this.indexOnload(options)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow展示了')
    if (this.data.programShow) {
      wx.showLoading({
        title: '加载中',
      })
      console.log('onshow执行了')
      if (app.globalData.corpId) {
        // 第二次加载，有参数的情况下不展示专属表单
        this.data.personalFormShow = false
      }
      this.indexOnload()
      this.setTimer()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onhide隐藏了，show状态要置为true')
    this.data.programShow = true
    clearInterval(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer)
  },

  // 封装加载首页
  indexOnload(options) {
    const that = this
    console.log('首页onload', app.globalData, options)

    if (this.data.returnFlag) return

    console.log('app.globalData.corpId onload: ', app.globalData.corpId)


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
      wx.showLoading({
        title: '加载中',
      })



      // --开始--
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
                  console.log('后端授权接口-=-=-', accRes)

                  console.log('app.globalData.corpId', app.globalData.corpId, that.data.personalFormShow)

                  // ask | 0: 需要请求授权, 1: 手机号码已授权, 2: 身份证号码已授权
                  if (accRes.data.data.ask === 2) {

                    // 判断是否要，跳转到专属表单页
                    if (app.globalData.corpId && that.data.personalFormShow) {
                      console.log('跳转到专属表单页面。。。')
                      this.setData({
                        personalFormShow: false
                      })
                      this.goPersonalForm()
                      return
                    }



                    // 获取畅通码
                    this.getHealthCode(wx.getStorageSync('phoneNumber'))

                    this.setData({
                      totalBtnShow: false,
                      goOcr: false,
                    })
                    // 获取测温记录
                    this.getDetList()
                    // 开启定时器
                    this.setTimer()

                  }
                  // else if (accRes.data.data.ask === 0) {
                  //   // 重置整个页面
                  //   this.setData({
                  //     userInfo: {},
                  //     totalBtnShow: true,
                  //     healthBtnShow: true,
                  //     goOcr: true,
                  //     healthCode: ''
                  //   })

                  // }

                  // ask已各种授权，跳转到确认页面
                  else {

                    // 请求用户确认接口，判断是否需要确认
                    let params = {
                      "openid": wx.getStorageSync('openId'),
                      "phone": wx.getStorageSync('phoneNumber'),
                      "nickname": app.globalData.userInfo.nickName,
                      "sex": app.globalData.userInfo.gender,
                      "avatar": app.globalData.userInfo.avatarUrl
                    }
                    api.getUserListV3(params).then(userRes => {
                      console.log('确认用户列表', userRes)
                      // type | 1: 不需确认直接创建并刷新加载首页, 2: 需要跳到确认页面
                      if (userRes.data.code == 200) {
                        if (userRes.data.data.type == 1) {
                          // that.indexOnload()

                          // 判断是否要，跳转到专属表单页
                          if (app.globalData.corpId && that.data.personalFormShow) {
                            console.log('跳转到专属表单页面。。。')
                            this.setData({
                              personalFormShow: false
                            })
                            this.goPersonalForm()
                            return
                          }

                          // 获取畅通码
                          this.getHealthCode(wx.getStorageSync('phoneNumber'))
                          // 开启定时器
                          this.setTimer()

                          this.setData({
                            totalBtnShow: false,
                            healthBtnShow: false,
                            goOcr: true,
                          })
                        }
                        else {
                          wx.hideLoading()
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


                // TODO 待清除
                setTimeout(() => {
                  wx.hideLoading()
                }, 3000)

              }
            })
          }
        }
      })
      // --结束--



      


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

  // 开启定时器，更新二维码
  setTimer() {
    const that = this
    let interval = 60 * 1000
    clearInterval(this.data.timer)
    this.data.timer = setInterval(() => {
      console.log('定时器开启')
      that.getHealthCode(wx.getStorageSync('phoneNumber'))
    }, interval)
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




  // 通过openapi获取到unionid
  getUserInfo2(e) {
    console.log(e)
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getOpenData',
        openData: {
          list: [
            e.detail.cloudID,
          ]
        }
      }
    }).then(res => {
      console.log('[onGetUserInfo] 调用成功：', res)

      this.setData({
        userInfoResult: JSON.stringify(res.result),
      })

      wx.showToast({
        title: '敏感数据获取成功',
      })
    })
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
        "phone": app.globalData.phoneNumber,
        "nickname": app.globalData.userInfo.nickName,
        "sex": app.globalData.userInfo.gender,
        "avatar": app.globalData.userInfo.avatarUrl
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
        this.getHealthCode(wx.getStorageSync('phoneNumber'))

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
      // const pages = getCurrentPages()
      // const perpage = pages[pages.length - 1]
      // perpage.indexOnload()  
      
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

  // 获取畅通码
  getHealthCode(phone) {
    if (!phone) return
    const that = this
    let params = {
      'phone': phone
    }
    if (app.globalData.fid) {
      params.fid = app.globalData.fid
    }
    api.getQr(params).then(res => {
      wx.hideLoading()
      if (res.data.code == 200) {
        console.log('畅通码res', res)
        let qrStr = res.data.data ? res.data.data : ''
        
        // base64转src图片
        this.setData({
          healthCode: qrStr.replace(/[\r\n]/g, '')
        })

      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })

      }
    })
  },

  // 更新畅通码
  refreshCode() {
    wx.showLoading({
      title: '更新中',
    })
    this.indexOnload()
  },

  // 跳转到专属表单页面
  goPersonalForm() {
    let param = {
      corpId: app.globalData.corpId
    }
    /**
     * 1. 判断表单状态 启用或停用
     * 2. 启用的话，判断是访客还是员工
     */
    api.getZJFormStatus(param).then(res => {
      console.log('res表单状态', res.data)
      // data: true-需要填表单 false-不需要填表单
      if (res.data.code == 200) {
        if (res.data.data) {
          let paramType = {
            phone: wx.getStorageSync('phoneNumber'),
            unionId: wx.getStorageSync('openId'),
            corpId: app.globalData.corpId
          }

          // 请求，判断表单类型
          api.getZJFormType(paramType).then(res => {
            console.log('res表单类型', res.data)
            wx.hideLoading()
            // data 1 : 员工类型 0 : 访客类型
            if (res.data.data === 1) {
              wx.navigateTo({
                url: '../formStaff/formStaff',
              })
            } else {
              wx.navigateTo({
                url: '../formVisitor/formVisitor',
              })
            }
          })
          .catch(error => {
            wx.hideLoading()
            wx.showToast({
              title: error,
              icon: 'none'
            })
          })



        } 
        else {
          // 更新首页
          this.indexOnload()
        }

      }
      else {
        wx.hideLoading()
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
      

    })
    .catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })

  },





})