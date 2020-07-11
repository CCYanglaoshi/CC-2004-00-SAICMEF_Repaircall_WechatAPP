//app.js
var util = require('/utils/util.js');

App({
  onLaunch: function () {
    console.log("on lunch on lunchon lunchon lunchon lunch")
    this.getAuthKey()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        this.globalData.loginCode = res.code;
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        else {

        }
      }
    })
  },
  getAuthKey: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        // 调用登录接口
      //利用云函数获取openid
    //初始化云函数
      console.log("on lunch on lunchon lunchffffffffffffffffon lunchon lunch")
      if(!wx.cloud){
        console.error("请使用高版本")
      } else{
        wx.cloud.init({
          env: 'repaircall8168-kzizk',
          trace: true,
        })
      }
      //调用云函数，并赋值globedata.openid
      let that= this;
      wx.cloud.callFunction({
        name:'getOpenid',
        complete:res=>{
          console.log('openid--hahahaahah',res.result)
          console.log(res.result.unionid)
          var openid = res.result.openid
          var unionid = res.result.unionid
          console.log("unionid")
          console.log(unionid)
          wx.setStorageSync('unionid', res.result.unionid)//unionid
          wx.setStorageSync('openid', res.result.openid);//存储openid          
        }
      })
    });
  },


  globalData: {
    userInfo: null,
    locationSN: "AT-YF1-3F-001",
    loginCode: null,
    phoneNumber: null,
    facility: null,
    repairItems: [],
    repairCallStatus: [],
    openid: "",
    username: "",
    registPhone: "",
    unionid: ""
  }
})