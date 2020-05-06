//app.js
App({
  onLaunch: function () {
    console.log('gggg', wx.getSystemInfoSync())
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // traceUser: true,
        env: 'ewstes-wx'
      })
    }
    


    // 加载用户登录状态
    // getSetting获取申请过的权限，判断是否授权过。有授权则展示且不弹框，没有则发起请求
    // wx.getSetting({
    //   success: res => {
    //     console.log('授权列表', res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 属于第二次进入且已授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log('app.js用户信息', res)
    //           // 可以将 res 发送给后台解码出 unionId
    //           // 获取unionId后，查询人员信息表，更新userInfo，畅通码，测温记录等
    //           this.globalData.userInfo = res.userInfo
          

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })

    // this.globalData = {}
  },

  // 全局变量
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    userInfo: null,
    phoneNumber: '',
    code: '', // 登录时获取
    openId: '',
    unionId: '',
    cloudID: '',
    healthCode: '',
    token: 'ggg',
    corpId: '', // 商户专属二维码的传参
    fid: '', // 提交专属表单后，用于生成专属畅通码
  }
})
