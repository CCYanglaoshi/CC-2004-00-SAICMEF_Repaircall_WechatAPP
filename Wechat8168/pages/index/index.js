//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    RepairCallItemList:[],
    motto: '欢迎使用设施管理报修巡检平台',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasPhoneNumber: false,
    phoneNumber: null,
    openid:''
  },

  goToRegist(){
    console.log("hjhahaahahah")
    wx.navigateTo({
      url: '/pages/regist/regist',
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {

    //获取Openid
    // wx.cloud.callFunction({
    //   name:'getOpenid',
    //   complete:res=>{
    //     console.log('openid--',res.result)
    //     var openid = res.result.openid
    //     this.setData({
    //       openid:openid
    //     })
    //     wx.setStorage({
    //       key: 'openid',
    //       data: openid
    //     })
    //   }
    // })


    wx.login({
      success (res) {
        if (res.code) {
          
          console.log('res.code:' + res.code)
          //发起网络请求
          // wx.request({
          //   url: 'https://www.ppaper.com.cn/8168/saic/api/GetOpenID',
          //   data: {
          //     code: res.code
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
    console.log("hasUserInfo:" + this.data.hasUserInfo + "--canIUse:" + this.data.canIUse);

    console.log(options);
    //var app = getApp();
    console.log("app.globalData: " + app.globalData.openid);
    //var url = decodeURIComponent(options);
  
    if (app.globalData.userInfo) {
      this.setData({userInfo: app.globalData.userInfo, hasUserInfo: true})
    } 
    else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("callBackRes:" + res);
        this.setData({userInfo: res.userInfo, hasUserInfo: true})
      }
    } 
    else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log("getUserInfo:" + res);
          app.globalData.userInfo = res.userInfo
          this.setData({userInfo: res.userInfo, hasUserInfo: true})
        }
      })
    }
  },
  
  getUserInfo: function(e) {
    console.log("getUserInfo");
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getPhoneNumber: function(e) {
    console.log("getPhoneNumber");
    console.log(e);
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData);
  },
})

