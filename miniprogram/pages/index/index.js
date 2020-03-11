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
    this.indexOnload(options)
  },

  // 封装加载首页
  indexOnload(options) {
    const that = this
    console.log('首页onload', app.globalData)

    // 监听来自check页面的按钮参数
    if (options && options.check && options.check == 'confirm') {
      this.setData({
        totalBtnShow: false
      })
    }


    // 通过手机号缓存判断
    if (wx.getStorageSync('phoneNumber')) {
      // 有手机号则请求人员信息库 this.getUserDetail()
      // 疑惑？头像用wx还是查出的员工表头像
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
                // 获取unionId后，查询人员信息表，更新userInfo，健康码，测温记录等
                app.globalData.userInfo = res.userInfo
                that.setData({
                  userInfo: res.userInfo,
                  totalBtnShow: false
                })

                // 云函数
                this.cloudUserInfo()

                // TODO放哪？
                this.getUserDetail()

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


      // 请求后端接口获取unionid
      // 获得unionid后，去查询人员信息库。有信息则直接首页完整形态，没有则开始走手机授权流程
      let param = {
        'code': app.globalData.code,
        'encryptedData': e.detail.encryptedData,
        'iv': e.detail.iv,
      }
      // api.getUnionId(param).then(unionRes => {
      //   console.log('传code', unionRes)
      //   // TODO 获取到unionId，存全局，并调用请求员工 this.getStaff()

      // })

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
    console.log('手机', e)

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

      // 调用创建用户（TODO 应该是查询用户，如果是存在一条以上就跳转，否则回到首页，按钮消失）
      this.getUserList()

    }).catch(err => {
      console.error('手机号', err);
    })
  },

  // 查询用户详情
  getUserDetail(phone) {
    let phoneNumber = phone ? phone : wx.getStorageSync('phoneNumber')
    api.getUser(phoneNumber).then(res => {
      console.log('用户详情', res)
      if (res.data.data) {
        // 获取健康码
        this.getHealthCode(res.data.data.id)

        // 获取测温记录
        this.getDetList()


        // 没有身份证则需要跳转到OCR才能看测温记录
        let idCard = res.data.data.idCard
        if (idCard) {
          this.setData({goOcr: false})
        } else {
          this.setData({goOcr: true})
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
    api.getUserList(app.globalData.phoneNumber).then(res => {
      console.log('首页查询用户列表', res)
      if (res.data.code == 200) {
        // 用户记录多条，则跳转到check
        if (res.data.data) {
          wx.navigateTo({
            url: '../check/check?phone=' + app.globalData.phoneNumber
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
      "phone": app.globalData.phoneNumber,
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
        url: '../detection/detection?phone=' + app.globalData.phoneNumber
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



  // 获取健康码
  getHealthCode(id) {
    if (!id) return
    const that = this
    let params = {
      'id': id
    }
    api.getQr(params).then(res => {
      if (res.data.code == 200) {
        console.log('健康码res', res)
        // that.formatImg(res.data.data)
        // base64转src图片，真机待测试？
        base64src(res.data.data, res => {
          this.setData({
            healthCode: res
          })
        });

      }
    })
  },

  // 更新健康码
  refreshCode() {
    wx.showLoading({
      title: '更新中',
    })
    this.indexOnload()
  }





})