import api from './utils/api.js'

//app.js
App({
  onLaunch: function () {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录res', res)
        this.globalData.code = res.code
      }
    })


    // 加载用户登录状态
    // getSetting获取申请过的权限，判断是否授权过。有授权则展示且不弹框，没有则发起请求
    wx.getSetting({
      success: res => {
        console.log('授权列表', res)
        if (res.authSetting['scope.userInfo']) {
          // 属于第二次进入且已授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('app.js用户信息', res)
              // 可以将 res 发送给后台解码出 unionId
              // 获取unionId后，查询人员信息表，更新userInfo，健康码，测温记录等
              this.globalData.userInfo = res.userInfo
              let param = {
                'code': this.globalData.code,
                'encryptedData': res.encryptedData,
                'iv': res.iv,
              }
              api.getUnionId(param).then(resdd => {
                console.log('传code', resdd)
              })

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 全局变量
  globalData: {
    userInfo: null,
    code: '', // 登录时获取
    unionId: '',
    healthCode: ''
  }
})